use axum::{routing::get, Json, Router};
use serde_json::{json, Value};
use sqlx::sqlite::SqlitePoolOptions;
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    let database_url =
        std::env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:appstore.db?mode=rwc".to_string());

    let _pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to database");

    let app = Router::new()
        .route("/health", get(health_check))
        .route("/app/v3/api/catalog/home", get(catalog_home))
        .layer(CorsLayer::permissive());

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

async fn catalog_home() -> Json<Value> {
    Json(json!({
        "success": true,
        "code": "OK",
        "message": "Home feed retrieved",
        "data": {
            "featuredSlots": [],
            "collections": [],
            "charts": []
        }
    }))
}
