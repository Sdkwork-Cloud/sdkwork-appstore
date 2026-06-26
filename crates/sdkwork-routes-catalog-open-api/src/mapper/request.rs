use sdkwork_appstore_catalog_service::domain::commands::PublicFeaturedListRequest;

pub fn map_public_featured_list(
    locale: Option<String>,
    platform: Option<String>,
    limit: Option<i32>,
) -> PublicFeaturedListRequest {
    let mut req = PublicFeaturedListRequest::new();
    if let Some(v) = locale {
        req = req.with_locale(v);
    }
    if let Some(v) = platform {
        req = req.with_platform(v);
    }
    if let Some(v) = limit {
        req = req.with_limit(v);
    }
    req
}
