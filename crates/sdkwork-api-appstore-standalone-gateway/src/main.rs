use std::sync::Arc;

use sdkwork_api_appstore_assembly::assemble_api_router;
use sdkwork_web_bootstrap::{service_router, ServiceRouterConfig};
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;

mod readiness;

use readiness::AppstoreDatabaseReadinessCheck;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();
    let _ = dotenvy::dotenv();

    let assembly = assemble_api_router()
        .await
        .expect("appstore gateway assembly failed");
    let readiness = Arc::new(AppstoreDatabaseReadinessCheck::new(
        assembly.database_pool.clone(),
    ));
    let business = assembly.router.layer(cors_layer_from_env());
    let app = service_router(
        business,
        ServiceRouterConfig::default().with_readiness_check(readiness),
    );

    let port = std::env::var("PORT").unwrap_or_else(|_| "18090".to_owned());
    let addr = format!("0.0.0.0:{port}");
    tracing::info!(%addr, "starting sdkwork-api-appstore-standalone-gateway");
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("bind appstore standalone gateway");
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .expect("serve appstore standalone gateway");
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
            .expect("install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("install SIGTERM handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        () = ctrl_c => {},
        () = terminate => {},
    }
    tracing::info!("appstore gateway shutdown signal received");
}
