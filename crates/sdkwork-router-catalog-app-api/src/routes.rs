//! Route composition for catalog app-api.

use crate::paths::{API_AUTHORITY, CAPABILITY, PREFIX, SDK_FAMILY, SURFACE};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RouteDescriptor {
    pub api_authority: &'static str,
    pub capability: &'static str,
    pub prefix: &'static str,
    pub sdk_family: &'static str,
    pub surface: &'static str,
}

pub fn build_routes() -> RouteDescriptor {
    RouteDescriptor {
        api_authority: API_AUTHORITY,
        capability: CAPABILITY,
        prefix: PREFIX,
        sdk_family: SDK_FAMILY,
        surface: SURFACE,
    }
}
