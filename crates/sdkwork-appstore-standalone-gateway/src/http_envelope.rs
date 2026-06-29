use axum::Json;
use serde::Serialize;
use serde_json::{json, Value};
use sdkwork_utils_rust::http_api::{
    PageInfo, PageMode, SdkWorkApiResponse, SdkWorkPageData, SdkWorkResourceData,
};

pub fn trace_id_from(request_id: &str) -> String {
    request_id.to_string()
}

pub fn success_item<T: Serialize>(trace_id: impl Into<String>, item: T) -> Json<Value> {
    Json(serde_json::to_value(SdkWorkApiResponse::success(
        SdkWorkResourceData { item },
        trace_id,
    ))
    .unwrap_or_else(|_| json!({ "code": 0, "data": { "item": null }, "traceId": "" })))
}

pub fn success_page<T: Serialize>(
    trace_id: impl Into<String>,
    items: Vec<T>,
    next_cursor: Option<String>,
    has_more: bool,
) -> Json<Value> {
    Json(serde_json::to_value(SdkWorkApiResponse::success(
        SdkWorkPageData {
            items,
            page_info: PageInfo {
                mode: PageMode::Cursor,
                page: None,
                page_size: None,
                total_items: None,
                total_pages: None,
                next_cursor,
                has_more: Some(has_more),
            },
        },
        trace_id,
    ))
    .unwrap_or_else(|_| json!({ "code": 0, "data": { "items": [], "pageInfo": { "mode": "cursor" } }, "traceId": "" })))
}

pub fn internal_error(trace_id: impl Into<String>, detail: impl ToString) -> Json<Value> {
    Json(json!({
        "type": "https://sdkwork.dev/problems/internal-error",
        "title": "Internal Server Error",
        "status": 500,
        "code": 50001,
        "traceId": trace_id.into(),
        "detail": detail.to_string(),
    }))
}
