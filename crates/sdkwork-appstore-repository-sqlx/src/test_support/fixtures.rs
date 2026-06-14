use chrono::Utc;

pub fn test_tenant_id() -> String {
    "test-tenant".to_string()
}

pub fn test_organization_id() -> String {
    "test-org".to_string()
}

pub fn test_user_id() -> String {
    "test-user".to_string()
}

pub fn test_request_id() -> String {
    "test-request".to_string()
}

pub fn test_publisher_id() -> String {
    "pub-test-001".to_string()
}

pub fn test_listing_id() -> String {
    "list-test-001".to_string()
}

pub fn test_release_id() -> String {
    "rel-test-001".to_string()
}

pub fn now_iso8601() -> String {
    Utc::now().to_rfc3339()
}
