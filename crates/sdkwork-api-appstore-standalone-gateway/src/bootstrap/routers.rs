//! Router assembly for the standalone gateway.

use sdkwork_api_appstore_assembly::ApiAssembly;

/// Assemble the full appstore business router (database + repositories +
/// services + route crates) from environment configuration.
pub async fn assemble_router() -> ApiAssembly {
    sdkwork_api_appstore_assembly::assemble_api_router()
        .await
        .expect("appstore gateway assembly failed")
}
