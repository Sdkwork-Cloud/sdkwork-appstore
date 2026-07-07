//! HTTP relay connectors for external app store providers (Apple / Google / enterprise).

use std::sync::Arc;

use async_trait::async_trait;
use chrono::Utc;
use serde::{Deserialize, Serialize};

use super::http_client::IntegrationHttpClient;
use super::market_channels::{
    MarketChannelConnector, MarketStatusResult, MarketSubmission, MarketSubmissionResult,
};

#[derive(Debug, Clone)]
pub struct HttpMarketChannelConnector {
    channel_code: String,
    http: IntegrationHttpClient,
    submit_path: String,
    status_path_template: String,
    store_url_path_template: Option<String>,
}

impl HttpMarketChannelConnector {
    pub fn from_env(channel_code: impl Into<String>, env_prefix: &str) -> Result<Option<Self>, String> {
        let submit_url = match std::env::var(format!("{env_prefix}_SUBMIT_URL")) {
            Ok(value) if !value.trim().is_empty() => value,
            _ => return Ok(None),
        };
        let status_path = std::env::var(format!("{env_prefix}_STATUS_PATH"))
            .unwrap_or_else(|_| "/releases/{externalReleaseId}/status".to_string());
        let store_url_path = std::env::var(format!("{env_prefix}_STORE_URL_PATH")).ok();
        let auth_token = std::env::var(format!("{env_prefix}_AUTH_TOKEN")).ok();
        let access_token = std::env::var(format!("{env_prefix}_ACCESS_TOKEN")).ok();
        let http = IntegrationHttpClient::with_access_token(submit_url, auth_token, access_token, 60)?;
        Ok(Some(Self {
            channel_code: channel_code.into(),
            http,
            submit_path: std::env::var(format!("{env_prefix}_SUBMIT_PATH"))
                .unwrap_or_else(|_| "/releases".to_string()),
            status_path_template: status_path,
            store_url_path_template: store_url_path,
        }))
    }

    fn interpolate(template: &str, external_release_id: &str, external_app_id: &str) -> String {
        template
            .replace("{externalReleaseId}", external_release_id)
            .replace("{externalAppId}", external_app_id)
    }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RelaySubmissionWire {
    external_release_id: Option<String>,
    external_status: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RelayStatusWire {
    external_release_id: Option<String>,
    external_status: Option<String>,
    store_url: Option<String>,
    rejection_reason: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct RelaySubmissionBody<'a> {
    channel_code: &'a str,
    external_app_id: &'a str,
    version_name: &'a str,
    version_code: &'a str,
    artifact_url: &'a str,
    release_notes: &'a str,
    metadata: &'a serde_json::Value,
}

#[async_trait]
impl MarketChannelConnector for HttpMarketChannelConnector {
    async fn submit_release(
        &self,
        channel_code: &str,
        submission: &MarketSubmission,
    ) -> Result<MarketSubmissionResult, String> {
        if channel_code != self.channel_code {
            return Err(format!(
                "connector channel mismatch: expected {}, got {channel_code}",
                self.channel_code
            ));
        }
        let body = RelaySubmissionBody {
            channel_code,
            external_app_id: &submission.external_app_id,
            version_name: &submission.version_name,
            version_code: &submission.version_code,
            artifact_url: &submission.artifact_url,
            release_notes: &submission.release_notes,
            metadata: &submission.metadata,
        };
        let response: RelaySubmissionWire = self
            .http
            .post_envelope_item(&self.submit_path, &body)
            .await?;
        let external_release_id = response
            .external_release_id
            .filter(|value| !value.trim().is_empty())
            .ok_or_else(|| "provider submit response missing externalReleaseId".to_string())?;
        Ok(MarketSubmissionResult {
            external_release_id,
            external_status: response
                .external_status
                .unwrap_or_else(|| "SUBMITTED".to_string()),
            submitted_at: Utc::now(),
        })
    }

    async fn poll_status(
        &self,
        channel_code: &str,
        external_release_id: &str,
    ) -> Result<MarketStatusResult, String> {
        if channel_code != self.channel_code {
            return Err(format!(
                "connector channel mismatch: expected {}, got {channel_code}",
                self.channel_code
            ));
        }
        let path = Self::interpolate(&self.status_path_template, external_release_id, "");
        let response: RelayStatusWire = self.http.get_envelope_item(&path, &[]).await?;
        Ok(MarketStatusResult {
            external_release_id: response
                .external_release_id
                .unwrap_or_else(|| external_release_id.to_string()),
            external_status: response
                .external_status
                .unwrap_or_else(|| "UNKNOWN".to_string()),
            store_url: response.store_url,
            rejection_reason: response.rejection_reason,
            last_synced_at: Utc::now(),
        })
    }

    async fn resolve_store_url(
        &self,
        channel_code: &str,
        external_app_id: &str,
    ) -> Result<Option<String>, String> {
        if channel_code != self.channel_code {
            return Err(format!(
                "connector channel mismatch: expected {}, got {channel_code}",
                self.channel_code
            ));
        }
        let Some(template) = &self.store_url_path_template else {
            return Ok(None);
        };
        let path = Self::interpolate(template, "", external_app_id);
        let response: RelayStatusWire = self.http.get_envelope_item(&path, &[]).await?;
        Ok(response.store_url)
    }

    async fn channel_code(&self) -> &str {
        &self.channel_code
    }
}

pub fn register_http_market_connectors(
    adapter: super::market_channel_adapter::MarketChannelIntegrationAdapter,
) -> Result<Option<super::market_channel_adapter::MarketChannelIntegrationAdapter>, String> {
    let mut adapter = adapter;
    let mut count = 0usize;
    for (channel_code, env_prefix) in [
        ("APPLE_APP_STORE", "APPSTORE_MARKET_APPLE"),
        ("GOOGLE_PLAY", "APPSTORE_MARKET_GOOGLE"),
        ("ENTERPRISE", "APPSTORE_MARKET_ENTERPRISE"),
    ] {
        if let Some(connector) = HttpMarketChannelConnector::from_env(channel_code, env_prefix)? {
            adapter = adapter.with_connector(Arc::new(connector));
            count += 1;
        }
    }
    if count == 0 {
        return Ok(None);
    }
    Ok(Some(adapter))
}
