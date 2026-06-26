use sdkwork_appstore_publisher_service::domain::results::{
    CreatePublisherResult, InvitePublisherMemberResult, ListPublisherMembersResult,
    RetrieveCurrentPublisherResult, SubmitPublisherVerificationResult, UpdatePublisherResult,
};

pub fn map_retrieve_current_publisher_response(
    result: RetrieveCurrentPublisherResult,
) -> RetrieveCurrentPublisherResult {
    result
}

pub fn map_create_publisher_response(result: CreatePublisherResult) -> CreatePublisherResult {
    result
}

pub fn map_update_publisher_response(result: UpdatePublisherResult) -> UpdatePublisherResult {
    result
}

pub fn map_list_publisher_members_response(
    result: ListPublisherMembersResult,
) -> ListPublisherMembersResult {
    result
}

pub fn map_invite_publisher_member_response(
    result: InvitePublisherMemberResult,
) -> InvitePublisherMemberResult {
    result
}

pub fn map_submit_publisher_verification_response(
    result: SubmitPublisherVerificationResult,
) -> SubmitPublisherVerificationResult {
    result
}
