use sdkwork_appstore_publisher_service::domain::models::{
    Publisher, PublisherMember, PublisherVerification,
};

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct PublisherResponse {
    id: String,
    publisher_no: String,
    publisher_type: String,
    display_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    legal_name: Option<String>,
    status: String,
    verification_status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    website_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    support_email: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    logo_media_resource_id: Option<String>,
    owner_user_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    verified_at: Option<String>,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct PublisherMemberResponse {
    id: String,
    user_id: String,
    member_role: String,
    member_status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    invited_by: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    joined_at: Option<String>,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct PublisherVerificationResponse {
    id: String,
    verification_type: String,
    verification_status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    reviewed_by: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    reviewed_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    expires_at: Option<String>,
}

pub(crate) fn map_publisher(publisher: Publisher) -> PublisherResponse {
    PublisherResponse {
        id: publisher.id.0,
        publisher_no: publisher.publisher_no,
        publisher_type: publisher.publisher_type.as_str().to_string(),
        display_name: publisher.display_name,
        legal_name: publisher.legal_name,
        status: publisher.status.as_str().to_string(),
        verification_status: publisher.verification_status.as_str().to_string(),
        website_url: publisher.website_url,
        support_email: publisher.support_email,
        logo_media_resource_id: publisher.logo_media_resource_id,
        owner_user_id: publisher.owner_user_id,
        verified_at: publisher.verified_at.map(|value| value.to_rfc3339()),
    }
}

pub(crate) fn map_publisher_member(member: PublisherMember) -> PublisherMemberResponse {
    PublisherMemberResponse {
        id: member.id,
        user_id: member.user_id,
        member_role: member.member_role.as_str().to_string(),
        member_status: member.member_status.as_str().to_string(),
        invited_by: member.invited_by,
        joined_at: member.joined_at.map(|value| value.to_rfc3339()),
    }
}

pub(crate) fn map_publisher_verification(
    verification: PublisherVerification,
) -> PublisherVerificationResponse {
    PublisherVerificationResponse {
        id: verification.id,
        verification_type: verification.verification_type.as_str().to_string(),
        verification_status: verification.verification_status.as_str().to_string(),
        reviewed_by: verification.reviewed_by,
        reviewed_at: verification.reviewed_at.map(|value| value.to_rfc3339()),
        expires_at: verification.expires_at.map(|value| value.to_rfc3339()),
    }
}
