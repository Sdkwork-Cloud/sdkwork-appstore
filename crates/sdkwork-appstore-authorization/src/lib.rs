//! Shared authorization helpers for App Store domain services.

/// Returns true when `granted` satisfies `required`, including wildcard suffix `.*`.
pub fn scope_granted(scopes: &[String], required: &str) -> bool {
    scopes.iter().any(|granted| {
        granted == required
            || (granted.ends_with(".*") && required.starts_with(granted.trim_end_matches(".*")))
    })
}

/// Returns an error message when the required scope is absent.
pub fn missing_scope_message(required: &str) -> String {
    format!("Missing required scope: {required}")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn exact_scope_matches() {
        let scopes = vec!["appstore.catalog.admin".to_string()];
        assert!(scope_granted(&scopes, "appstore.catalog.admin"));
    }

    #[test]
    fn wildcard_scope_matches() {
        let scopes = vec!["appstore.moderation.*".to_string()];
        assert!(scope_granted(&scopes, "appstore.moderation.read"));
        assert!(!scope_granted(&scopes, "appstore.catalog.admin"));
    }
}
