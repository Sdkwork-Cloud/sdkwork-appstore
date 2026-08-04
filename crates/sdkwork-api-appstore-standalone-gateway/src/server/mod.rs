//! HTTP server bootstrap for the standalone gateway.

use axum::Router;

/// Serve the assembled router with graceful shutdown handling.
pub async fn serve(addr: std::net::SocketAddr, app: Router) {
    tracing::info!(%addr, "starting sdkwork-api-appstore-standalone-gateway");
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("bind appstore standalone gateway");
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .expect("serve appstore standalone gateway");
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
