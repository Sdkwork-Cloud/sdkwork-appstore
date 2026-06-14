use crate::context::AppstoreRequestContext;
use crate::domain::models::{
    ArtifactId, DownloadGrant, DownloadGrantId, Release, ReleaseArtifact, ReleaseChannel,
    ReleaseChannelId, ReleaseId, ReleaseNoteLocalization, ReleaseRollout,
};
use crate::error::AppstoreServiceResult;

#[async_trait::async_trait]
pub trait ReleaseRepositoryPort: Send + Sync {
    async fn find_channel_by_code(
        &self,
        context: &AppstoreRequestContext,
        channel_code: &str,
    ) -> AppstoreServiceResult<Option<ReleaseChannel>>;

    async fn find_release_by_id(
        &self,
        context: &AppstoreRequestContext,
        release_id: &ReleaseId,
    ) -> AppstoreServiceResult<Option<Release>>;

    async fn find_release_by_no(
        &self,
        context: &AppstoreRequestContext,
        release_no: &str,
    ) -> AppstoreServiceResult<Option<Release>>;

    async fn find_latest_published_release(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &str,
        channel_id: &ReleaseChannelId,
    ) -> AppstoreServiceResult<Option<Release>>;

    async fn find_latest_release_by_channel_code(
        &self,
        context: &AppstoreRequestContext,
        listing_id: &str,
        channel_code: &str,
    ) -> AppstoreServiceResult<Option<Release>>;

    async fn insert_release(
        &self,
        context: &AppstoreRequestContext,
        release: &Release,
    ) -> AppstoreServiceResult<()>;

    async fn update_release(
        &self,
        context: &AppstoreRequestContext,
        release: &Release,
    ) -> AppstoreServiceResult<()>;

    async fn find_release_notes(
        &self,
        context: &AppstoreRequestContext,
        release_id: &ReleaseId,
        locale: &str,
    ) -> AppstoreServiceResult<Option<ReleaseNoteLocalization>>;

    async fn insert_release_notes(
        &self,
        context: &AppstoreRequestContext,
        notes: &ReleaseNoteLocalization,
    ) -> AppstoreServiceResult<()>;

    async fn update_release_notes(
        &self,
        context: &AppstoreRequestContext,
        notes: &ReleaseNoteLocalization,
    ) -> AppstoreServiceResult<()>;

    async fn find_artifact_by_id(
        &self,
        context: &AppstoreRequestContext,
        artifact_id: &ArtifactId,
    ) -> AppstoreServiceResult<Option<ReleaseArtifact>>;

    async fn find_artifact_by_composite(
        &self,
        context: &AppstoreRequestContext,
        release_id: &ReleaseId,
        platform: &str,
        architecture: &str,
        package_format: &str,
    ) -> AppstoreServiceResult<Option<ReleaseArtifact>>;

    async fn insert_artifact(
        &self,
        context: &AppstoreRequestContext,
        artifact: &ReleaseArtifact,
    ) -> AppstoreServiceResult<()>;

    async fn find_rollout_by_release(
        &self,
        context: &AppstoreRequestContext,
        release_id: &ReleaseId,
    ) -> AppstoreServiceResult<Option<ReleaseRollout>>;

    async fn insert_rollout(
        &self,
        context: &AppstoreRequestContext,
        rollout: &ReleaseRollout,
    ) -> AppstoreServiceResult<()>;

    async fn update_rollout(
        &self,
        context: &AppstoreRequestContext,
        rollout: &ReleaseRollout,
    ) -> AppstoreServiceResult<()>;

    async fn find_grant_by_id(
        &self,
        context: &AppstoreRequestContext,
        grant_id: &DownloadGrantId,
    ) -> AppstoreServiceResult<Option<DownloadGrant>>;

    async fn insert_grant(
        &self,
        context: &AppstoreRequestContext,
        grant: &DownloadGrant,
    ) -> AppstoreServiceResult<()>;

    async fn update_grant(
        &self,
        context: &AppstoreRequestContext,
        grant: &DownloadGrant,
    ) -> AppstoreServiceResult<()>;

    async fn find_listing_by_plus_app_key(
        &self,
        context: &AppstoreRequestContext,
        plus_app_key: &str,
    ) -> AppstoreServiceResult<Option<String>>;
}
