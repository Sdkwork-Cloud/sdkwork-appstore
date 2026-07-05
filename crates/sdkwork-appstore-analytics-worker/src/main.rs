use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env().add_directive("info".parse().unwrap()))
        .init();

    let config = sdkwork_appstore_analytics_worker::bootstrap::WorkerConfig::from_env();
    if let Err(error) = sdkwork_appstore_analytics_worker::run_worker(config).await {
        tracing::error!(%error, "analytics worker exited");
        std::process::exit(1);
    }
}
