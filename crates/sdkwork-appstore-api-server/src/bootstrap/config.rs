//! API server configuration placeholder.

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ApiServerConfig {
    pub app_api_bind: String,
    pub backend_api_bind: String,
    pub open_api_bind: String,
}

impl Default for ApiServerConfig {
    fn default() -> Self {
        Self {
            app_api_bind: "127.0.0.1:18090".to_string(),
            backend_api_bind: "127.0.0.1:18091".to_string(),
            open_api_bind: "127.0.0.1:18092".to_string(),
        }
    }
}
