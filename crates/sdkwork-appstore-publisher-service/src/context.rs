#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AppstoreRequestContext {
    pub tenant_id: String,
    pub organization_id: String,
    pub user_id: String,
    pub request_id: String,
    pub trace_id: Option<String>,
    pub permission_scopes: Vec<String>,
}
