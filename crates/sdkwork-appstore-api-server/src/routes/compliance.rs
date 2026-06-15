use axum::{extract::State, routing::get, Json, Router};
use serde_json::{json, Value};

use crate::AppState;
use sdkwork_appstore_compliance_service::service::compliance_service::ComplianceOperations;

pub fn routes() -> Router<AppState> {
    Router::new().route(
        "/app/v3/api/compliance/profile/{listingId}",
        get(compliance_profile_retrieve),
    )
}

fn mock_context() -> sdkwork_appstore_compliance_service::context::AppstoreRequestContext {
    sdkwork_appstore_compliance_service::context::AppstoreRequestContext {
        tenant_id: "default".to_string(),
        organization_id: Some("default-org".to_string()),
        user_id: Some("anonymous".to_string()),
        request_id: uuid::Uuid::new_v4().to_string(),
    }
}

async fn compliance_profile_retrieve(
    state: State<AppState>,
    axum::extract::Path(listing_id): axum::extract::Path<String>,
) -> Json<Value> {
    let ctx = mock_context();
    let req =
        sdkwork_appstore_compliance_service::domain::commands::RetrieveComplianceProfileRequest {
            listing_id,
            idempotency_key: None,
        };
    match state
        .compliance_service
        .retrieve_compliance_profile(&ctx, req)
        .await
    {
        Ok(result) => Json(json!({
            "success": true,
            "code": "OK",
            "message": "Compliance profile retrieved",
            "data": serde_json::to_value(&result).unwrap_or_default()
        })),
        Err(e) => Json(json!({
            "success": false,
            "code": "ERROR",
            "message": format!("{}", e)
        })),
    }
}
