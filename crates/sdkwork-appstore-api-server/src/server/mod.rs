pub struct ServerConfig {
    pub app_api_port: u16,
    pub backend_api_port: u16,
    pub open_api_port: u16,
}

impl ServerConfig {
    pub fn new(app_api_port: u16, backend_api_port: u16, open_api_port: u16) -> Self {
        Self {
            app_api_port,
            backend_api_port,
            open_api_port,
        }
    }
}
