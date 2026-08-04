//! Gateway runtime configuration resolved from the process environment.

#[derive(Debug, Clone)]
pub struct AppstoreGatewayConfig {
    pub port: u16,
}

impl AppstoreGatewayConfig {
    pub fn from_env() -> Self {
        let port = std::env::var("PORT")
            .ok()
            .and_then(|value| value.parse::<u16>().ok())
            .unwrap_or(18090);
        Self { port }
    }

    pub fn addr(&self) -> std::net::SocketAddr {
        std::net::SocketAddr::from(([0, 0, 0, 0], self.port))
    }
}
