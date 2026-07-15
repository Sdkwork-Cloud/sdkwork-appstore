//! Shared HTTP client for outbound SDKWork integration calls.

use std::time::Duration;

use reqwest::Client;
use sdkwork_utils_rust::SdkWorkApiResponse;
use serde::de::DeserializeOwned;
use serde_json::Value;

#[derive(Debug, Clone)]
pub struct IntegrationHttpClient {
    client: Client,
    base_url: String,
    auth_token: Option<String>,
    access_token: Option<String>,
}

impl IntegrationHttpClient {
    pub fn new(
        base_url: impl Into<String>,
        auth_token: Option<String>,
        timeout_seconds: u64,
    ) -> Result<Self, String> {
        Self::with_access_token(base_url, auth_token, None, timeout_seconds)
    }

    pub fn with_access_token(
        base_url: impl Into<String>,
        auth_token: Option<String>,
        access_token: Option<String>,
        timeout_seconds: u64,
    ) -> Result<Self, String> {
        let client = Client::builder()
            .timeout(Duration::from_secs(timeout_seconds.max(1)))
            .build()
            .map_err(|error| format!("integration HTTP client build failed: {error}"))?;
        Ok(Self {
            client,
            base_url: base_url.into().trim_end_matches('/').to_string(),
            auth_token,
            access_token,
        })
    }

    pub fn inner_client(&self) -> &Client {
        &self.client
    }

    pub async fn get_envelope_item<T: DeserializeOwned>(
        &self,
        path: &str,
        query: &[(&str, &str)],
    ) -> Result<T, String> {
        let url = format!("{}{}", self.base_url, path);
        let mut request = self.client.get(&url);
        request = self.apply_auth(request);
        for (key, value) in query {
            request = request.query(&[(key, value)]);
        }

        let response = request
            .send()
            .await
            .map_err(|error| format!("integration GET {path} failed: {error}"))?;

        if !response.status().is_success() {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            return Err(format!("integration GET {path} returned {status}: {body}"));
        }

        let payload: Value = response
            .json()
            .await
            .map_err(|error| format!("integration GET {path} invalid JSON: {error}"))?;

        extract_envelope_item(payload)
    }

    pub async fn post_envelope_item<T: DeserializeOwned, B: serde::Serialize>(
        &self,
        path: &str,
        body: &B,
    ) -> Result<T, String> {
        let url = format!("{}{}", self.base_url, path);
        let mut request = self.client.post(&url).json(body);
        request = self.apply_auth(request);

        let response = request
            .send()
            .await
            .map_err(|error| format!("integration POST {path} failed: {error}"))?;

        if !response.status().is_success() {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            return Err(format!("integration POST {path} returned {status}: {body}"));
        }

        let payload: Value = response
            .json()
            .await
            .map_err(|error| format!("integration POST {path} invalid JSON: {error}"))?;

        extract_envelope_item(payload)
    }

    pub async fn put_envelope_item<T: DeserializeOwned, B: serde::Serialize>(
        &self,
        path: &str,
        body: &B,
    ) -> Result<T, String> {
        let url = format!("{}{}", self.base_url, path);
        let mut request = self.client.put(&url).json(body);
        request = self.apply_auth(request);

        let response = request
            .send()
            .await
            .map_err(|error| format!("integration PUT {path} failed: {error}"))?;

        if !response.status().is_success() {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            return Err(format!("integration PUT {path} returned {status}: {body}"));
        }

        let payload: Value = response
            .json()
            .await
            .map_err(|error| format!("integration PUT {path} invalid JSON: {error}"))?;

        extract_envelope_item(payload)
    }

    pub async fn delete_envelope(&self, path: &str) -> Result<(), String> {
        let url = format!("{}{}", self.base_url, path);
        let mut request = self.client.delete(&url);
        request = self.apply_auth(request);

        let response = request
            .send()
            .await
            .map_err(|error| format!("integration DELETE {path} failed: {error}"))?;

        if !response.status().is_success() {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            return Err(format!(
                "integration DELETE {path} returned {status}: {body}"
            ));
        }

        Ok(())
    }

    fn apply_auth(&self, request: reqwest::RequestBuilder) -> reqwest::RequestBuilder {
        let mut request = request;
        if let Some(token) = self.auth_token.as_ref().filter(|value| !value.is_empty()) {
            request = request.header("Auth-Token", token);
        }
        if let Some(token) = self.access_token.as_ref().filter(|value| !value.is_empty()) {
            request = request.header("Access-Token", token);
        }
        request
    }
}

fn extract_envelope_item<T: DeserializeOwned>(payload: Value) -> Result<T, String> {
    if let Ok(envelope) = serde_json::from_value::<SdkWorkApiResponse<T>>(payload.clone()) {
        if envelope.code != 0 {
            return Err(format!(
                "integration non-zero envelope code {} (traceId={})",
                envelope.code, envelope.trace_id
            ));
        }
        return Ok(envelope.data);
    }

    if let Some(item) = payload.get("data").and_then(|data| data.get("item")) {
        return serde_json::from_value(item.clone())
            .map_err(|error| format!("integration data.item decode failed: {error}"));
    }

    serde_json::from_value(payload)
        .map_err(|error| format!("integration payload decode failed: {error}"))
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde::Deserialize;

    #[derive(Debug, Deserialize, PartialEq)]
    #[serde(rename_all = "camelCase")]
    struct Sample {
        download_url: String,
    }

    #[test]
    fn extracts_envelope_item() {
        let payload = serde_json::json!({
            "code": 0,
            "traceId": "trace-1",
            "data": { "downloadUrl": "https://example.test/file" }
        });
        let item: Sample = extract_envelope_item(payload).expect("decode sample");
        assert_eq!(item.download_url, "https://example.test/file");
    }
}
