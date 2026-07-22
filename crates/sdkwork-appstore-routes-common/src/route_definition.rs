use sdkwork_web_core::RouteAuth;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteDefinition {
    pub method: &'static str,
    pub path: &'static str,
    pub operation_id: &'static str,
    pub auth: RouteAuth,
    pub handler: &'static str,
    pub service_method: &'static str,
}
