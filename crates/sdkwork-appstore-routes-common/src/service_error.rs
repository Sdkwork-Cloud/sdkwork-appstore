//! Maps duplicated App Store service error enums to ProblemDetail responses.

use axum::http::StatusCode;
use axum::response::Response;
use sdkwork_utils_rust::SdkWorkResultCode;
use sdkwork_web_core::WebRequestContext;

use crate::api_response::map_service_error_message;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum AppstoreServiceErrorKind {
    NotFound(String),
    AlreadyExists(String),
    InvalidState(String),
    ValidationFailed(String),
    PermissionDenied(String),
    Conflict(String),
    Internal(String),
}

impl AppstoreServiceErrorKind {
    pub fn message(&self) -> &str {
        match self {
            Self::NotFound(message)
            | Self::AlreadyExists(message)
            | Self::InvalidState(message)
            | Self::ValidationFailed(message)
            | Self::PermissionDenied(message)
            | Self::Conflict(message)
            | Self::Internal(message) => message,
        }
    }
}

pub fn classify_service_error_message(message: &str) -> (StatusCode, SdkWorkResultCode) {
    let lower = message.to_ascii_lowercase();
    if lower.contains("not found") {
        (StatusCode::NOT_FOUND, SdkWorkResultCode::NotFound)
    } else if lower.contains("permission denied") || lower.contains("forbidden") {
        (StatusCode::FORBIDDEN, SdkWorkResultCode::PermissionRequired)
    } else if lower.contains("validation failed") || lower.contains("invalid") {
        (StatusCode::BAD_REQUEST, SdkWorkResultCode::ValidationError)
    } else if lower.contains("conflict") || lower.contains("already exists") {
        (StatusCode::CONFLICT, SdkWorkResultCode::Conflict)
    } else if lower.contains("invalid state") {
        (
            StatusCode::UNPROCESSABLE_ENTITY,
            SdkWorkResultCode::UnprocessableEntity,
        )
    } else {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            SdkWorkResultCode::InternalError,
        )
    }
}

pub fn map_appstore_service_error(
    context: Option<&WebRequestContext>,
    error: AppstoreServiceErrorKind,
) -> Response {
    let (status, result_code) = match &error {
        AppstoreServiceErrorKind::NotFound(_) => {
            (StatusCode::NOT_FOUND, SdkWorkResultCode::NotFound)
        }
        AppstoreServiceErrorKind::AlreadyExists(_) => {
            (StatusCode::CONFLICT, SdkWorkResultCode::Conflict)
        }
        AppstoreServiceErrorKind::InvalidState(_) => (
            StatusCode::UNPROCESSABLE_ENTITY,
            SdkWorkResultCode::UnprocessableEntity,
        ),
        AppstoreServiceErrorKind::ValidationFailed(_) => {
            (StatusCode::BAD_REQUEST, SdkWorkResultCode::ValidationError)
        }
        AppstoreServiceErrorKind::PermissionDenied(_) => {
            (StatusCode::FORBIDDEN, SdkWorkResultCode::PermissionRequired)
        }
        AppstoreServiceErrorKind::Conflict(_) => {
            (StatusCode::CONFLICT, SdkWorkResultCode::Conflict)
        }
        AppstoreServiceErrorKind::Internal(_) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            SdkWorkResultCode::InternalError,
        ),
    };
    map_service_error_message(context, status, result_code, error.message())
}

pub fn map_display_error(
    context: Option<&WebRequestContext>,
    error: impl std::fmt::Display,
) -> Response {
    let message = error.to_string();
    let (status, result_code) = classify_service_error_message(&message);
    map_service_error_message(context, status, result_code, message)
}
