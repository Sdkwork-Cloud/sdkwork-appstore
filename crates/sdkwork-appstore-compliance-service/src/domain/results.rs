use serde::{Deserialize, Serialize};

use super::models::{CompliancePermissionDisclosure, ComplianceProfile};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ComplianceOperationResult {
    pub operation_id: &'static str,
    pub accepted: bool,
}

impl ComplianceOperationResult {
    pub fn accepted(operation_id: &'static str) -> Self {
        Self {
            operation_id,
            accepted: true,
        }
    }

    pub fn rejected(operation_id: &'static str) -> Self {
        Self {
            operation_id,
            accepted: false,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct RetrieveComplianceProfileResult {
    pub operation_id: &'static str,
    pub profile: Option<ComplianceProfile>,
}

impl RetrieveComplianceProfileResult {
    pub fn found(operation_id: &'static str, profile: ComplianceProfile) -> Self {
        Self {
            operation_id,
            profile: Some(profile),
        }
    }

    pub fn not_found(operation_id: &'static str) -> Self {
        Self {
            operation_id,
            profile: None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct UpdateComplianceProfileResult {
    pub operation_id: &'static str,
    pub profile: ComplianceProfile,
}

impl UpdateComplianceProfileResult {
    pub fn updated(operation_id: &'static str, profile: ComplianceProfile) -> Self {
        Self {
            operation_id,
            profile,
        }
    }

    pub fn created(operation_id: &'static str, profile: ComplianceProfile) -> Self {
        Self {
            operation_id,
            profile,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct UpsertPermissionDisclosuresResult {
    pub operation_id: &'static str,
    pub disclosures: Vec<CompliancePermissionDisclosure>,
}

impl UpsertPermissionDisclosuresResult {
    pub fn upserted(
        operation_id: &'static str,
        disclosures: Vec<CompliancePermissionDisclosure>,
    ) -> Self {
        Self {
            operation_id,
            disclosures,
        }
    }
}
