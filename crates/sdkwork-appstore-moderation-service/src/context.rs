#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AppstoreRequestContext {
    pub tenant_id: String,
    pub organization_id: Option<String>,
    pub user_id: Option<String>,
    pub request_id: String,
    pub trace_id: Option<String>,
    pub permission_scopes: Vec<String>,
}

impl AppstoreRequestContext {
    pub fn tenant_scoped(tenant_id: impl Into<String>, request_id: impl Into<String>) -> Self {
        Self {
            tenant_id: tenant_id.into(),
            organization_id: None,
            user_id: None,
            request_id: request_id.into(),
            trace_id: None,
            permission_scopes: Vec::new(),
        }
    }
}
