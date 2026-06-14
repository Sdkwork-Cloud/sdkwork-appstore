//! App Store publisher service boundary.

pub mod context;
pub mod domain;
pub mod error;
pub mod ports;
pub mod service;

pub use context::AppstoreRequestContext;
pub use domain::commands::{
    AdminVerifyPublisherRequest, CreatePublisherRequest, InvitePublisherMemberRequest,
    ListPublisherMembersRequest, PublisherOperationRequest, RetrieveCurrentPublisherRequest,
    SubmitPublisherVerificationRequest, UpdatePublisherRequest,
};
pub use domain::models::{
    ContactSnapshot, MemberRole, MemberStatus, ProfileSnapshot, Publisher, PublisherId,
    PublisherMember, PublisherStatus, PublisherType, PublisherVerification, VerificationStatus,
    VerificationType,
};
pub use domain::results::{
    AdminVerifyPublisherResult, CreatePublisherResult, InvitePublisherMemberResult,
    ListPublisherMembersResult, PublisherOperationResult, RetrieveCurrentPublisherResult,
    SubmitPublisherVerificationResult, UpdatePublisherResult,
};
pub use error::{AppstoreServiceError, AppstoreServiceResult};
pub use ports::repository::PublisherRepositoryPort;
pub use service::publisher_service::{PublisherOperations, PublisherService};

pub const CAPABILITY: &str = "publisher";

pub fn capability_name() -> &'static str {
    CAPABILITY
}
