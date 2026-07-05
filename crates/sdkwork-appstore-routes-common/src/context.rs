//! Maps sdkwork-web-framework request context into App Store service context.

use axum::http::StatusCode;
use axum::response::Response;
use sdkwork_utils_rust::SdkWorkResultCode;
use sdkwork_web_core::WebRequestContext;

use crate::api_response::map_service_error_message;

/// Canonical request context passed into App Store domain services.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AppstoreRequestContext {
    pub tenant_id: String,
    pub organization_id: Option<String>,
    pub user_id: Option<String>,
    pub request_id: String,
}

impl AppstoreRequestContext {
    pub fn tenant_scoped(tenant_id: impl Into<String>, request_id: impl Into<String>) -> Self {
        Self {
            tenant_id: tenant_id.into(),
            organization_id: None,
            user_id: None,
            request_id: request_id.into(),
        }
    }

    pub fn has_authenticated_user(&self) -> bool {
        self.user_id
            .as_ref()
            .is_some_and(|value| !value.trim().is_empty())
    }
}

fn resolve_request_id(web: Option<&WebRequestContext>) -> String {
    web.map(|ctx| ctx.request_id.0.clone())
        .filter(|value| !value.is_empty())
        .unwrap_or_else(sdkwork_utils_rust::uuid)
}

/// Tenant id used for unauthenticated public/open-api routes (override via env).
pub fn public_tenant_id() -> String {
    std::env::var("APPSTORE_PUBLIC_TENANT_ID").unwrap_or_else(|_| "100001".to_string())
}

/// Builds context for public routes where IAM principal may be absent.
pub fn request_context_from_web(web: Option<&WebRequestContext>) -> AppstoreRequestContext {
    let request_id = resolve_request_id(web);

    if let Some(ctx) = web {
        if let Some(principal) = ctx.principal.as_ref() {
            return AppstoreRequestContext {
                tenant_id: principal.tenant_id().to_owned(),
                organization_id: principal.organization_id().map(str::to_owned),
                user_id: Some(principal.user_id().to_owned()),
                request_id,
            };
        }
    }

    AppstoreRequestContext::tenant_scoped(public_tenant_id(), request_id)
}

/// Builds context for protected routes; fails closed when principal is missing.
pub fn authenticated_context_from_web(
    web: Option<&WebRequestContext>,
) -> Result<AppstoreRequestContext, Response> {
    let request_id = resolve_request_id(web);
    let ctx = web.ok_or_else(|| unauthorized_response(None, "Authentication required"))?;
    let principal = ctx
        .principal
        .as_ref()
        .ok_or_else(|| unauthorized_response(Some(ctx), "Authentication required"))?;

    Ok(AppstoreRequestContext {
        tenant_id: principal.tenant_id().to_owned(),
        organization_id: principal.organization_id().map(str::to_owned),
        user_id: Some(principal.user_id().to_owned()),
        request_id,
    })
}

pub fn unauthorized_response(
    context: Option<&WebRequestContext>,
    detail: impl Into<String>,
) -> Response {
    map_service_error_message(
        context,
        StatusCode::UNAUTHORIZED,
        SdkWorkResultCode::AuthenticationRequired,
        detail,
    )
}
