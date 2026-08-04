use std::sync::Arc;

use sdkwork_web_bootstrap::{service_router, ServiceRouterConfig};
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;

mod bootstrap;
mod health;
mod preflight;
mod readiness;
mod server;

use bootstrap::config::AppstoreGatewayConfig;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();
    let _ = dotenvy::dotenv();

    let config = AppstoreGatewayConfig::from_env();
    let adapters = bootstrap::adapters::DependencyAdapters::from_env();
    tracing::info!(
        active_dependency_surfaces = ?preflight::dependency_surfaces::active_dependency_surfaces()
            .iter()
            .map(|surface| surface.code())
            .collect::<Vec<_>>(),
        drive_enabled = adapters.drive_enabled(),
        platform_enabled = adapters.platform_enabled(),
        search_enabled = adapters.search_enabled(),
        "appstore gateway dependency surfaces"
    );

    let assembly = bootstrap::routers::assemble_router().await;
    let readiness = Arc::new(health::AppstoreDatabaseReadinessCheck::new(
        assembly.database_pool.clone(),
    ));
    let business = assembly.router.layer(cors_layer_from_env());
    let app = service_router(
        business,
        ServiceRouterConfig::default().with_readiness_check(readiness),
    );

    server::serve(config.addr(), app).await;
}

fn cors_layer_from_env() -> CorsLayer {
    let environment = match config_environment().as_str() {
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

fn config_environment() -> String {
    std::env::var("SDKWORK_APPSTORE_ENVIRONMENT")
        .unwrap_or_else(|_| "development".to_owned())
        .trim()
        .to_ascii_lowercase()
}
