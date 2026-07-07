use sdkwork_appstore_publisher_service::domain::commands::{
    CreatePublisherRequest, InvitePublisherMemberRequest, ListPublisherMembersRequest,
    RetrieveCurrentPublisherRequest, SubmitPublisherVerificationRequest, UpdatePublisherRequest,
};

pub fn map_retrieve_current_publisher() -> RetrieveCurrentPublisherRequest {
    RetrieveCurrentPublisherRequest::new()
}

pub fn map_create_publisher(
    display_name: String,
    legal_name: Option<String>,
    support_email: Option<String>,
    website_url: Option<String>,
    publisher_type: Option<String>,
) -> CreatePublisherRequest {
    let mut req = CreatePublisherRequest::new(display_name);
    if let Some(v) = legal_name {
        req = req.with_legal_name(v);
    }
    if let Some(v) = support_email {
        req = req.with_support_email(v);
    }
    if let Some(v) = website_url {
        req = req.with_website_url(v);
    }
    if let Some(v) = publisher_type {
        req = req.with_publisher_type(v);
    }
    req
}

pub fn map_update_publisher(
    publisher_id: String,
    display_name: Option<String>,
    website_url: Option<String>,
    support_email: Option<String>,
) -> UpdatePublisherRequest {
    let mut req = UpdatePublisherRequest::new(publisher_id);
    if let Some(v) = display_name {
        req = req.with_display_name(v);
    }
    if let Some(v) = website_url {
        req = req.with_website_url(v);
    }
    if let Some(v) = support_email {
        req = req.with_support_email(v);
    }
    req
}

pub fn map_list_publisher_members(
    publisher_id: String,
    cursor: Option<String>,
    page_size: Option<i32>,
) -> ListPublisherMembersRequest {
    let mut req = ListPublisherMembersRequest::new(publisher_id);
    if let Some(v) = cursor {
        req = req.with_cursor(v);
    }
    if let Some($1) = page_size {
        req = req.with_page_size(v);
    }
    req
}

pub fn map_invite_publisher_member(
    publisher_id: String,
    user_id: String,
    member_role: String,
) -> InvitePublisherMemberRequest {
    InvitePublisherMemberRequest::new(publisher_id, user_id, member_role)
}

pub fn map_submit_publisher_verification(
    publisher_id: String,
    verification_type: String,
    credential_snapshot: Option<serde_json::Value>,
    evidence_media_resource_id: Option<String>,
) -> SubmitPublisherVerificationRequest {
    let mut req = SubmitPublisherVerificationRequest::new(publisher_id, verification_type);
    if let Some(v) = credential_snapshot {
        req = req.with_credential_snapshot(v);
    }
    if let Some(v) = evidence_media_resource_id {
        req = req.with_evidence_media_resource_id(v);
    }
    req
}
