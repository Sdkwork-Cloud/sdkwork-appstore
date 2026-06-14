pub mod context;
pub mod domain;
pub mod error;
pub mod ports;
pub mod service;

pub use context::AppstoreRequestContext;
pub use domain::commands::{
    ComplianceOperationRequest, PermissionDisclosureItem, RetrieveComplianceProfileRequest,
    UpdateComplianceProfileRequest, UpsertPermissionDisclosuresRequest,
};
pub use domain::models::{
    CompliancePermissionDisclosure, ComplianceProfile, ComplianceProfileId, ComplianceStatus,
    DisclosureStatus,
};
pub use domain::results::{
    ComplianceOperationResult, RetrieveComplianceProfileResult, UpdateComplianceProfileResult,
    UpsertPermissionDisclosuresResult,
};
pub use error::{AppstoreServiceError, AppstoreServiceResult};
pub use ports::repository::ComplianceRepositoryPort;
pub use service::compliance_service::{ComplianceOperations, ComplianceService};

pub const CAPABILITY: &str = "compliance";

pub fn capability_name() -> &'static str {
    CAPABILITY
}
