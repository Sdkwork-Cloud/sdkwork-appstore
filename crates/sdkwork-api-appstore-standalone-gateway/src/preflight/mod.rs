pub mod dependency_surfaces;

use crate::bootstrap::adapters::AppstoreAdapters;
use dependency_surfaces::PreflightStatus;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PreflightResult {
    Ready,
    Degraded { warnings: Vec<String> },
    Failed { errors: Vec<String> },
}

pub fn run_preflight(adapters: &AppstoreAdapters) -> PreflightResult {
    let mut all_errors = Vec::new();
    let mut all_warnings = Vec::new();

    match adapters.validate_required() {
        Ok(_) => {}
        Err(errors) => all_errors.extend(errors),
    }

    match dependency_surfaces::validate_dependency_surfaces(adapters) {
        PreflightStatus::Ready => {}
        PreflightStatus::Degraded { warnings } => all_warnings.extend(warnings),
        PreflightStatus::Failed { errors } => all_errors.extend(errors),
    }

    if !all_errors.is_empty() {
        PreflightResult::Failed { errors: all_errors }
    } else if !all_warnings.is_empty() {
        PreflightResult::Degraded {
            warnings: all_warnings,
        }
    } else {
        PreflightResult::Ready
    }
}
