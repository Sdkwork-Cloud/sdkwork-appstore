use axum::{routing::get, Json, Router};
use serde_json::{json, Value};
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::Pool;
use sqlx::Sqlite;
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;

use sdkwork_appstore_catalog_service::service::catalog_service::CatalogService;
use sdkwork_appstore_compliance_service::service::compliance_service::ComplianceService;
use sdkwork_appstore_library_service::service::library_service::LibraryService;
use sdkwork_appstore_listing_service::service::listing_service::ListingService;
use sdkwork_appstore_market_service::service::market_service::MarketService;
use sdkwork_appstore_moderation_service::service::moderation_service::ModerationService;
use sdkwork_appstore_publisher_service::service::publisher_service::PublisherService;
use sdkwork_appstore_release_service::service::release_service::ReleaseService;

use sdkwork_appstore_repository_sqlx::repository::catalog_repository::SqlxCatalogRepository;
use sdkwork_appstore_repository_sqlx::repository::compliance_repository::SqlxComplianceRepository;
use sdkwork_appstore_repository_sqlx::repository::library_repository::SqlxLibraryRepository;
use sdkwork_appstore_repository_sqlx::repository::listing_repository::SqlxListingRepository;
use sdkwork_appstore_repository_sqlx::repository::market_repository::SqlxMarketRepository;
use sdkwork_appstore_repository_sqlx::repository::moderation_repository::SqlxModerationRepository;
use sdkwork_appstore_repository_sqlx::repository::publisher_repository::SqlxPublisherRepository;
use sdkwork_appstore_repository_sqlx::repository::release_repository::SqlxReleaseRepository;

mod routes;

#[derive(Clone)]
pub struct AppState {
    pub pool: Pool<Sqlite>,
    pub publisher_service: PublisherService<SqlxPublisherRepository>,
    pub listing_service: ListingService<SqlxListingRepository>,
    pub release_service: ReleaseService<SqlxReleaseRepository>,
    pub catalog_service: CatalogService<SqlxCatalogRepository>,
    pub library_service: LibraryService<SqlxLibraryRepository>,
    pub moderation_service: ModerationService<SqlxModerationRepository>,
    pub compliance_service: ComplianceService<SqlxComplianceRepository>,
    pub market_service: MarketService<SqlxMarketRepository>,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    let database_url =
        std::env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:appstore.db?mode=rwc".to_string());

    let pool: Pool<Sqlite> = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to database");

    tracing::info!("Database connected successfully");

    let publisher_repo = SqlxPublisherRepository::new(pool.clone());
    let listing_repo = SqlxListingRepository::new(pool.clone());
    let release_repo = SqlxReleaseRepository::new(pool.clone());
    let catalog_repo = SqlxCatalogRepository::new(pool.clone());
    let library_repo = SqlxLibraryRepository::new(pool.clone());
    let moderation_repo = SqlxModerationRepository::new(pool.clone());
    let compliance_repo = SqlxComplianceRepository::new(pool.clone());
    let market_repo = SqlxMarketRepository::new(pool.clone());

    let state = AppState {
        pool,
        publisher_service: PublisherService::new(publisher_repo),
        listing_service: ListingService::new(listing_repo),
        release_service: ReleaseService::new(release_repo),
        catalog_service: CatalogService::new(catalog_repo),
        library_service: LibraryService::new(library_repo),
        moderation_service: ModerationService::new(moderation_repo),
        compliance_service: ComplianceService::new(compliance_repo),
        market_service: MarketService::new(market_repo),
    };

    let app = Router::new()
        .route("/health", get(health_check))
        .merge(routes::catalog::routes())
        .merge(routes::listing::routes())
        .merge(routes::publisher::routes())
        .merge(routes::release_routes::routes())
        .merge(routes::library::routes())
        .merge(routes::moderation::routes())
        .merge(routes::compliance::routes())
        .merge(routes::market::routes())
        .layer(CorsLayer::permissive())
        .with_state(state);

    let port = std::env::var("PORT").unwrap_or_else(|_| "18090".to_string());
    let addr = format!("0.0.0.0:{}", port);

    tracing::info!("Starting sdkwork-appstore-api-server on {}", addr);

    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("Failed to bind");

    axum::serve(listener, app).await.expect("Server failed");
}

async fn health_check() -> Json<Value> {
    Json(json!({
        "status": "ok",
        "service": "sdkwork-appstore-api-server",
        "version": "0.1.0"
    }))
}
