use crate::mapper;
use sdkwork_appstore_publisher_service::context::AppstoreRequestContext;
use sdkwork_appstore_publisher_service::domain::results::{
    CreatePublisherResult, InvitePublisherMemberResult, ListPublisherMembersResult,
    RetrieveCurrentPublisherResult, SubmitPublisherVerificationResult, UpdatePublisherResult,
};
use sdkwork_appstore_publisher_service::error::AppstoreServiceError;
use sdkwork_appstore_publisher_service::PublisherOperations;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RouteHandlerPlan {
    pub operation_id: &'static str,
    pub handler_name: &'static str,
    pub service_method: &'static str,
}

pub const ROUTE_HANDLER_PLANS: &[RouteHandlerPlan] = &[
    RouteHandlerPlan {
        operation_id: "appstore.publishers.me.retrieve",
        handler_name: "publishers_me_retrieve",
        service_method: "retrieve_current_publisher",
    },
    RouteHandlerPlan {
        operation_id: "appstore.publishers.create",
        handler_name: "publishers_create",
        service_method: "create_publisher",
    },
    RouteHandlerPlan {
        operation_id: "appstore.publishers.update",
        handler_name: "publishers_update",
        service_method: "update_publisher",
    },
    RouteHandlerPlan {
        operation_id: "appstore.publishers.members.list",
        handler_name: "publishers_members_list",
        service_method: "list_publisher_members",
    },
    RouteHandlerPlan {
        operation_id: "appstore.publishers.members.create",
        handler_name: "publishers_members_invite",
        service_method: "invite_publisher_member",
    },
    RouteHandlerPlan {
        operation_id: "appstore.publishers.verifications.create",
        handler_name: "publishers_verifications_submit",
        service_method: "submit_publisher_verification",
    },
];

pub fn route_handler_plans() -> &'static [RouteHandlerPlan] {
    ROUTE_HANDLER_PLANS
}

pub async fn publishers_me_retrieve<S: PublisherOperations>(
    service: &S,
    context: &AppstoreRequestContext,
) -> Result<RetrieveCurrentPublisherResult, AppstoreServiceError> {
    let cmd = mapper::request::map_retrieve_current_publisher();
    service.retrieve_current_publisher(context, cmd).await
}

pub async fn publishers_create<S: PublisherOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    display_name: String,
    legal_name: Option<String>,
    support_email: Option<String>,
    website_url: Option<String>,
    publisher_type: Option<String>,
) -> Result<CreatePublisherResult, AppstoreServiceError> {
    let cmd = mapper::request::map_create_publisher(
        display_name,
        legal_name,
        support_email,
        website_url,
        publisher_type,
    );
    service.create_publisher(context, cmd).await
}

pub async fn publishers_update<S: PublisherOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    publisher_id: String,
    display_name: Option<String>,
    website_url: Option<String>,
    support_email: Option<String>,
) -> Result<UpdatePublisherResult, AppstoreServiceError> {
    let cmd = mapper::request::map_update_publisher(
        publisher_id,
        display_name,
        website_url,
        support_email,
    );
    service.update_publisher(context, cmd).await
}

pub async fn publishers_members_list<S: PublisherOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    publisher_id: String,
    cursor: Option<String>,
    page_size: Option<i32>,
) -> Result<ListPublisherMembersResult, AppstoreServiceError> {
    let cmd = mapper::request::map_list_publisher_members(publisher_id, cursor, page_size);
    service.list_members(context, cmd).await
}

pub async fn publishers_members_invite<S: PublisherOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    publisher_id: String,
    user_id: String,
    member_role: String,
) -> Result<InvitePublisherMemberResult, AppstoreServiceError> {
    let cmd = mapper::request::map_invite_publisher_member(publisher_id, user_id, member_role);
    service.invite_member(context, cmd).await
}

pub async fn publishers_verifications_submit<S: PublisherOperations>(
    service: &S,
    context: &AppstoreRequestContext,
    publisher_id: String,
    verification_type: String,
    credential_snapshot: Option<serde_json::Value>,
    evidence_media_resource_id: Option<String>,
) -> Result<SubmitPublisherVerificationResult, AppstoreServiceError> {
    let cmd = mapper::request::map_submit_publisher_verification(
        publisher_id,
        verification_type,
        credential_snapshot,
        evidence_media_resource_id,
    );
    service.submit_verification(context, cmd).await
}
