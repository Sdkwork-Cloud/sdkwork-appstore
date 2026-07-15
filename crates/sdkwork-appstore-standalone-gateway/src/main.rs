use axum::Router;
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;

use sdkwork_appstore_repository_sqlx::AppstoreSqlxDb;
use sdkwork_appstore_repository_sqlx::repository::catalog_repository::SqlxCatalogRepository;
use sdkwork_appstore_repository_sqlx::repository::compliance_repository::SqlxComplianceRepository;
use sdkwork_appstore_repository_sqlx::repository::library_repository::SqlxLibraryRepository;
use sdkwork_appstore_repository_sqlx::repository::listing_repository::SqlxListingRepository;
use sdkwork_appstore_repository_sqlx::repository::market_repository::SqlxMarketRepository;
use sdkwork_appstore_repository_sqlx::repository::moderation_repository::SqlxModerationRepository;
use sdkwork_appstore_repository_sqlx::repository::publisher_repository::SqlxPublisherRepository;
use sdkwork_appstore_repository_sqlx::repository::release_repository::SqlxReleaseRepository;

use sdkwork_appstore_catalog_service::service::catalog_service::CatalogService;
use sdkwork_appstore_compliance_service::service::compliance_service::ComplianceService;
use sdkwork_appstore_library_service::service::library_service::LibraryService;
use sdkwork_appstore_listing_service::service::listing_service::ListingService;
use sdkwork_appstore_market_service::service::market_service::MarketService;
use sdkwork_appstore_moderation_service::service::moderation_service::ModerationService;
use sdkwork_appstore_publisher_service::service::publisher_service::PublisherService;
use sdkwork_appstore_release_service::service::release_service::ReleaseService;

mod readiness;

use sdkwork_appstore_standalone_gateway::bootstrap::decision_listing_projection::decision_listing_projection_port;
use sdkwork_appstore_standalone_gateway::bootstrap::submission_moderation::submission_moderation_port;
use sdkwork_appstore_standalone_gateway::routes;
use sdkwork_appstore_standalone_gateway::web_bootstrap::wrap_router_with_web_framework_from_env;
use sdkwork_appstore_standalone_gateway::AppState;
use readiness::AppstoreDatabaseReadinessCheck;
use sdkwork_appstore_database_host::bootstrap_appstore_database_from_env;
use sdkwork_appstore_service_host::integrations::{
    DriveIntegrationAdapter, MarketChannelIntegrationAdapter, PlatformIntegrationAdapter,
    SearchFederationAdapter, SearchProjectionAdapter,
};
use sdkwork_appstore_service_host::integrations::http_market_channel_connector::register_http_market_connectors;
use sdkwork_web_bootstrap::{service_router, ServiceRouterConfig};
use std::sync::Arc;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    let _ = dotenvy::dotenv();

    let database_host = bootstrap_appstore_database_from_env()
        .await
        .expect("Failed to bootstrap appstore database");

    let pool = database_host.pool().clone();
    let db = AppstoreSqlxDb::from_database_pool(&pool).expect(
        "Standalone gateway repositories require SQLite or PostgreSQL; set APPSTORE_DATABASE_URL",
    );

    tracing::info!("Database connected and migrated successfully");

    let publisher_repo = SqlxPublisherRepository::new(db.clone());
    let listing_repo = SqlxListingRepository::new(db.clone());
    let release_repo = SqlxReleaseRepository::new(db.clone());
    let catalog_repo = SqlxCatalogRepository::new(db.clone());
    let library_repo = SqlxLibraryRepository::new(db.clone());
    let moderation_repo = SqlxModerationRepository::new(db.clone());
    let compliance_repo = SqlxComplianceRepository::new(db.clone());
    let market_repo = SqlxMarketRepository::new(db.clone());

    let listing_service = {
        let mut service = ListingService::new(listing_repo);
        match PlatformIntegrationAdapter::from_env() {
            Ok(adapter) => {
                tracing::info!("Platform integration enabled for listing create validation");
                service = service.with_platform_provider(Arc::new(adapter));
            }
            Err(error) => tracing::warn!("Platform integration disabled: {error}"),
        }
        match DriveIntegrationAdapter::from_env() {
            Ok(adapter) => {
                tracing::info!("Drive integration enabled for listing media validation");
                service = service.with_media_provider(Arc::new(adapter));
            }
            Err(error) => tracing::warn!("Drive media validation disabled: {error}"),
        }
        match SearchProjectionAdapter::from_env() {
            Ok(adapter) => {
                tracing::info!("Search index projection enabled for published listings");
                service = service.with_search_projection(Arc::new(adapter));
            }
            Err(error) => tracing::warn!("Search index projection disabled: {error}"),
        }
        service
    };

    let moderation_service = ModerationService::new(moderation_repo.clone())
        .with_listing_projection(decision_listing_projection_port(listing_service.clone()));

    let listing_service = listing_service
        .with_moderation_port(submission_moderation_port(moderation_service.clone()));

    let release_service = {
        let service = ReleaseService::new(release_repo);
        match DriveIntegrationAdapter::from_env() {
            Ok(adapter) => {
                tracing::info!("Drive integration adapter enabled");
                service.with_provider(Arc::new(adapter))
            }
            Err(error) => {
                tracing::warn!("Drive integration disabled: {error}");
                service
            }
        }
    };

    let catalog_service = {
        let mut service = CatalogService::new(catalog_repo);
        match SearchFederationAdapter::from_env() {
            Ok(adapter) => {
                tracing::info!("sdkwork-search federation enabled for catalog listings search");
                service = service.with_search_federation(Arc::new(adapter));
            }
            Err(error) => tracing::warn!("Search federation disabled: {error}"),
        }
        service
    };

    let market_service = {
        let mut service = MarketService::new(market_repo);
        match MarketChannelIntegrationAdapter::from_env() {
            Ok(adapter) => match register_http_market_connectors(adapter) {
                Ok(Some(adapter)) => {
                    tracing::info!("External market channel HTTP connectors enabled");
                    service = service.with_market_provider(Arc::new(adapter));
                }
                Ok(None) => tracing::warn!(
                    "Market provider bridge enabled but no APPSTORE_MARKET_*_SUBMIT_URL connectors configured"
                ),
                Err(error) => tracing::warn!("Market provider bridge registration failed: {error}"),
            },
            Err(error) => tracing::warn!("Market provider bridge disabled: {error}"),
        }
        service
    };

    let state = AppState {
        publisher_service: PublisherService::new(publisher_repo),
        listing_service,
        release_service,
        catalog_service,
        library_service: LibraryService::new(library_repo),
        moderation_service: moderation_service,
        compliance_service: ComplianceService::new(compliance_repo),
        market_service,
    };

    let cors = cors_layer_from_env();
    let business = wrap_router_with_web_framework_from_env(
        Router::new()
            .merge(routes::catalog::routes())
            .merge(routes::catalog_backend::routes())
            .merge(routes::listing::routes())
            .merge(routes::listing_backend::routes())
            .merge(routes::publisher::routes())
            .merge(routes::publisher_backend::routes())
            .merge(routes::release_routes::routes())
            .merge(routes::library::routes())
            .merge(routes::moderation::routes())
            .merge(routes::compliance::routes())
            .merge(routes::market::routes())
            .merge(routes::metrics_backend::routes())
            .merge(routes::open_api::routes())
            .layer(cors)
            .with_state(state),
    )
    .await;

    let app = service_router(
        business,
        ServiceRouterConfig::default()
            .with_readiness_check(Arc::new(AppstoreDatabaseReadinessCheck::new(pool.clone()))),
    );

    let port = std::env::var("PORT").unwrap_or_else(|_| "18090".to_string());
    let addr = format!("0.0.0.0:{port}");

    tracing::info!("Starting sdkwork-appstore-standalone-gateway on {addr}");

    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("Failed to bind");

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .expect("Server failed");
}

fn cors_layer_from_env() -> CorsLayer {
    let environment = match std::env::var("SDKWORK_APPSTORE_ENVIRONMENT")
        .unwrap_or_else(|_| "development".to_owned())
        .trim()
        .to_ascii_lowercase()
        .as_str()
    {
        "dev" | "development" | "test" | "testing" | "local" => {
            sdkwork_web_core::WebEnvironment::Dev
        }
        _ => sdkwork_web_core::WebEnvironment::Prod,
    };
    let origins = std::env::var("APPSTORE_CORS_ALLOWED_ORIGINS")
        .unwrap_or_default()
        .split(',')
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(ToOwned::to_owned)
        .collect::<Vec<_>>();
    let policy = sdkwork_web_bootstrap::security_policy_for_environment(&environment, origins);
    sdkwork_web_axum::cors_layer_from_policy(policy.cors)
}

async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("Failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("Failed to install SIGTERM handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        () = ctrl_c => {},
        () = terminate => {},
    }

    tracing::info!("Shutdown signal received, draining connections");
}
