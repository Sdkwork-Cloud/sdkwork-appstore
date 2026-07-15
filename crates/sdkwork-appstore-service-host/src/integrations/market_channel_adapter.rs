//! External marketplace channel provider bridge (Apple / Google / enterprise).

use async_trait::async_trait;
use std::sync::Arc;

use sdkwork_appstore_market_service::ports::provider::{
    ExternalReleaseStatus, ExternalSubmissionResult, MarketProviderPort,
};

use super::market_channels::{MarketChannelConnector, MarketSubmission};

#[derive(Clone)]
pub struct MarketChannelIntegrationAdapter {
    connectors: Vec<Arc<dyn MarketChannelConnector>>,
}

impl MarketChannelIntegrationAdapter {
    pub fn from_env() -> Result<Self, String> {
        let enabled = matches!(
            std::env::var("APPSTORE_MARKET_PROVIDER_ENABLED").as_deref(),
            Ok("1") | Ok("true") | Ok("on")
        );
        if !enabled {
            return Err("APPSTORE_MARKET_PROVIDER_ENABLED is not set".to_string());
        }
        Ok(Self {
            connectors: Vec::new(),
        })
    }

    pub fn with_connector(mut self, connector: Arc<dyn MarketChannelConnector>) -> Self {
        self.connectors.push(connector);
        self
    }

    async fn resolve_connector(&self, channel_code: &str) -> Option<&dyn MarketChannelConnector> {
        for connector in &self.connectors {
            if connector.channel_code().await == channel_code {
                return Some(connector.as_ref());
            }
        }
        None
    }
}

#[async_trait]
impl MarketProviderPort for MarketChannelIntegrationAdapter {
    async fn submit_release(
        &self,
        channel_code: &str,
        external_app_id: &str,
        artifact_url: &str,
        metadata: &serde_json::Value,
    ) -> Result<ExternalSubmissionResult, String> {
        let connector = self.resolve_connector(channel_code).await.ok_or_else(|| {
            format!("No external market connector registered for channel_code={channel_code}")
        })?;
        let result = connector
            .submit_release(
                channel_code,
                &MarketSubmission {
                    external_app_id: external_app_id.to_string(),
                    version_name: metadata
                        .get("versionName")
                        .or_else(|| metadata.get("version_name"))
                        .and_then(|value| value.as_str())
                        .unwrap_or_default()
                        .to_string(),
                    version_code: metadata
                        .get("versionCode")
                        .or_else(|| metadata.get("version_code"))
                        .and_then(|value| value.as_str())
                        .unwrap_or_default()
                        .to_string(),
                    artifact_url: artifact_url.to_string(),
                    release_notes: metadata
                        .get("releaseNotes")
                        .or_else(|| metadata.get("release_notes"))
                        .and_then(|value| value.as_str())
                        .unwrap_or_default()
                        .to_string(),
                    metadata: metadata.clone(),
                },
            )
            .await?;
        Ok(ExternalSubmissionResult {
            external_release_id: result.external_release_id,
            external_status: result.external_status,
            submitted_at: result.submitted_at,
        })
    }

    async fn poll_release_status(
        &self,
        channel_code: &str,
        external_release_id: &str,
    ) -> Result<ExternalReleaseStatus, String> {
        let connector = self.resolve_connector(channel_code).await.ok_or_else(|| {
            format!("No external market connector registered for channel_code={channel_code}")
        })?;
        let result = connector
            .poll_status(channel_code, external_release_id)
            .await?;
        Ok(ExternalReleaseStatus {
            external_release_id: result.external_release_id,
            external_status: result.external_status,
            store_url: result.store_url,
            rejection_reason: result.rejection_reason,
            last_synced_at: result.last_synced_at,
        })
    }

    async fn resolve_store_url(
        &self,
        channel_code: &str,
        external_app_id: &str,
    ) -> Result<Option<String>, String> {
        let connector = self.resolve_connector(channel_code).await.ok_or_else(|| {
            format!("No external market connector registered for channel_code={channel_code}")
        })?;
        connector
            .resolve_store_url(channel_code, external_app_id)
            .await
    }
}
