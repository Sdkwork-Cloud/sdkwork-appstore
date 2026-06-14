pub use context::AppstoreRequestContext;
pub use domain::commands::{
    AttachArtifactRequest, AutomationSubmissionCreateRequest, CheckUpdateRequest,
    ConsumeDownloadGrantRequest, CreateDownloadGrantRequest, CreateReleaseRequest,
    ReleaseOperationRequest, ResolveDownloadRequest, RetireReleaseRequest,
    RetrievePublicReleaseRequest, RetrieveReleaseRequest, UpdateReleaseRequest,
    UpdateRolloutRequest, UpsertReleaseNotesRequest,
};
pub use domain::models::{
    ArtifactId, ArtifactStatus, AudienceScope, ChannelStatus, ChannelType, DownloadGrant,
    DownloadGrantId, GrantReason, GrantStatus, Release, ReleaseArtifact, ReleaseChannel,
    ReleaseChannelId, ReleaseId, ReleaseNoteLocalization, ReleaseRollout, ReleaseStatus,
    RolloutStatus, RolloutStrategy, SignatureSnapshot,
};
pub use domain::results::{
    AttachArtifactResult, AutomationSubmissionResult, CheckUpdateResult,
    ConsumeDownloadGrantResult, CreateDownloadGrantResult, CreateReleaseResult,
    ReleaseOperationResult, ResolveDownloadResult, RetireReleaseResult,
    RetrievePublicReleaseResult, RetrieveReleaseResult, UpdateReleaseResult, UpdateRolloutResult,
    UpsertReleaseNotesResult,
};
pub use error::{AppstoreServiceError, AppstoreServiceResult};
pub use ports::repository::ReleaseRepositoryPort;
pub use service::release_service::{ReleaseOperations, ReleaseService};

pub mod context;
pub mod domain;
pub mod error;
pub mod ports;
pub mod service;

pub const CAPABILITY: &str = "release";

pub fn capability_name() -> &'static str {
    CAPABILITY
}
