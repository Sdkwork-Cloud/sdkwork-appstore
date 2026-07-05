pub struct MountedRouters {
    pub app_api_routes: Vec<String>,
    pub backend_api_routes: Vec<String>,
    pub open_api_routes: Vec<String>,
}

impl MountedRouters {
    pub fn new() -> Self {
        Self {
            app_api_routes: vec![
                "/app/v3/api/catalog".to_string(),
                "/app/v3/api/listings".to_string(),
                "/app/v3/api/publishers".to_string(),
                "/app/v3/api/releases".to_string(),
                "/app/v3/api/compliance".to_string(),
                "/app/v3/api/library".to_string(),
                "/app/v3/api/wishlist".to_string(),
                "/app/v3/api/download_grants".to_string(),
            ],
            backend_api_routes: vec![
                "/backend/v3/api/moderation".to_string(),
                "/backend/v3/api/catalog".to_string(),
                "/backend/v3/api/listings".to_string(),
                "/backend/v3/api/publishers".to_string(),
                "/backend/v3/api/market_channels".to_string(),
                "/backend/v3/api/market_releases".to_string(),
                "/backend/v3/api/metrics".to_string(),
            ],
            open_api_routes: vec![
                "/store/v3/api/releases".to_string(),
                "/store/v3/api/catalog".to_string(),
                "/store/v3/api/listings".to_string(),
                "/store/v3/api/artifacts".to_string(),
                "/store/v3/api/automation".to_string(),
            ],
        }
    }
}
