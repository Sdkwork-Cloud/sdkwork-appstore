//! sdkwork-drive uploader integration (`uploader.uploads.prepare` flow).

use std::collections::HashMap;

use sdkwork_utils_rust::sha256_hash;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::http_client::IntegrationHttpClient;

const DEFAULT_CHUNK_SIZE_BYTES: i64 = 8 * 1024 * 1024;
const APPSTORE_DRIVE_SCENE: &str = "appstore";
const APPSTORE_DRIVE_SOURCE: &str = "artifact-upload";

#[derive(Debug, Clone)]
pub struct DriveUploaderClient {
    http: IntegrationHttpClient,
    app_id: String,
    chunk_size_bytes: i64,
    space_id: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DriveUploadedFile {
    pub node_id: String,
    pub asset_id: String,
    pub content_type: String,
    pub file_size_bytes: i64,
    pub checksum_sha256: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
struct UploadPartPlan {
    part_no: i32,
    offset_bytes: i64,
    size_bytes: i64,
}

impl DriveUploaderClient {
    pub fn new(http: IntegrationHttpClient) -> Self {
        let app_id = std::env::var("APPSTORE_DRIVE_APP_ID")
            .unwrap_or_else(|_| "sdkwork-appstore".to_string());
        let chunk_size_bytes = std::env::var("APPSTORE_DRIVE_UPLOAD_CHUNK_SIZE_BYTES")
            .ok()
            .and_then(|value| value.parse::<i64>().ok())
            .filter(|value| *value > 0)
            .unwrap_or(DEFAULT_CHUNK_SIZE_BYTES);
        let space_id = std::env::var("APPSTORE_DRIVE_SPACE_ID")
            .ok()
            .map(|value| value.trim().to_string())
            .filter(|value| !value.is_empty());

        Self {
            http,
            app_id,
            chunk_size_bytes,
            space_id,
        }
    }

    pub async fn upload_bytes(
        &self,
        organization_id: &str,
        app_resource_type: &str,
        app_resource_id: &str,
        upload_profile_code: &str,
        file_name: &str,
        content_type: &str,
        data: &[u8],
    ) -> Result<DriveUploadedFile, String> {
        if data.is_empty() {
            return Err("drive upload requires non-empty payload".to_string());
        }

        let content_length = i64::try_from(data.len())
            .map_err(|_| "drive upload payload exceeds i64 size limit".to_string())?;
        let checksum_sha256_hex = format!("sha256:{}", sha256_hash(data));
        let upload_item_id = format!("appstore-upload-{}", Uuid::new_v4());
        let task_id = format!("appstore-task-{}", Uuid::new_v4());
        let file_fingerprint = format!(
            "name:{}:size:{}:type:{}",
            sanitize_fingerprint_token(file_name),
            content_length,
            sanitize_fingerprint_token(content_type)
        );

        let mut prepare_body = serde_json::json!({
            "id": upload_item_id,
            "taskId": task_id,
            "appId": self.app_id,
            "organizationId": organization_id,
            "appResourceType": app_resource_type,
            "appResourceId": app_resource_id,
            "uploadProfileCode": upload_profile_code,
            "fileFingerprint": file_fingerprint,
            "originalFileName": file_name,
            "contentType": content_type,
            "contentLength": content_length,
            "chunkSizeBytes": self.chunk_size_bytes,
            "scene": APPSTORE_DRIVE_SCENE,
            "source": APPSTORE_DRIVE_SOURCE,
        });
        if let Some(space_id) = self.space_id.as_ref() {
            prepare_body["spaceId"] = serde_json::Value::String(space_id.clone());
        }

        let prepared: PrepareUploaderUploadWire = self
            .http
            .post_envelope_item("/app/v3/api/drive/uploader/uploads", &prepare_body)
            .await
            .map_err(|error| format!("drive uploader.prepare failed: {error}"))?;

        let upload_item = prepared.upload_item;
        let upload_session = prepared.upload_session;
        let upload_session_id = upload_item
            .upload_session_id
            .clone()
            .unwrap_or(upload_session.id.clone());
        let storage_upload_id = upload_item
            .storage_upload_id
            .clone()
            .or(upload_session.storage_upload_id.clone())
            .unwrap_or_else(|| upload_session_id.clone());

        let parts = plan_upload_parts(content_length, self.chunk_size_bytes);
        let mut completed_parts: Vec<CompletedUploadPartWire> = Vec::with_capacity(parts.len());

        for part in parts {
            let presign_body = PresignUploadPartWire {
                upload_id: storage_upload_id.clone(),
                requested_ttl_seconds: Some(300),
            };
            let presigned: PresignedUploadPartWire = self
                .http
                .put_envelope_item(
                    &format!(
                        "/app/v3/api/drive/upload_sessions/{upload_session_id}/parts/{}",
                        part.part_no
                    ),
                    &presign_body,
                )
                .await
                .map_err(|error| {
                    format!(
                        "drive uploadSessions.parts.presign failed for part {}: {error}",
                        part.part_no
                    )
                })?;

            let part_bytes =
                &data[part.offset_bytes as usize..(part.offset_bytes + part.size_bytes) as usize];
            let etag =
                upload_presigned_part(self.http.inner_client(), &presigned, part_bytes).await?;

            let mark_body = MarkUploaderPartUploadedWire {
                upload_session_id: upload_session_id.clone(),
                offset_bytes: part.offset_bytes,
                size_bytes: part.size_bytes,
                etag: etag.clone(),
            };
            self.http
                .put_envelope_item::<(), _>(
                    &format!(
                        "/app/v3/api/drive/uploader/uploads/{}/parts/{}",
                        upload_item.id, part.part_no
                    ),
                    &mark_body,
                )
                .await
                .map_err(|error| {
                    format!(
                        "drive uploader.uploads.parts.markUploaded failed for part {}: {error}",
                        part.part_no
                    )
                })?;

            completed_parts.push(CompletedUploadPartWire {
                part_no: part.part_no,
                etag,
            });
        }

        let complete_body = CompleteUploadSessionWire {
            upload_id: Some(storage_upload_id),
            content_type: content_type.to_string(),
            content_length,
            checksum_sha256_hex: checksum_sha256_hex.clone(),
            parts: completed_parts,
        };
        self.http
            .post_envelope_item::<(), _>(
                &format!("/app/v3/api/drive/upload_sessions/{upload_session_id}/complete"),
                &complete_body,
            )
            .await
            .map_err(|error| format!("drive uploadSessions.complete failed: {error}"))?;

        let node_id = upload_item.node_id.trim().to_string();
        if node_id.is_empty() {
            return Err("drive upload completed without nodeId".to_string());
        }

        Ok(DriveUploadedFile {
            asset_id: node_id.clone(),
            node_id,
            content_type: content_type.to_string(),
            file_size_bytes: content_length,
            checksum_sha256: checksum_sha256_hex,
        })
    }
}

fn sanitize_fingerprint_token(value: &str) -> String {
    value
        .trim()
        .chars()
        .map(|ch| {
            if ch.is_ascii_alphanumeric() || matches!(ch, '.' | '_' | ':' | '@' | '-') {
                ch
            } else {
                '-'
            }
        })
        .collect::<String>()
}

fn plan_upload_parts(content_length: i64, chunk_size_bytes: i64) -> Vec<UploadPartPlan> {
    if content_length <= 0 {
        return vec![UploadPartPlan {
            part_no: 1,
            offset_bytes: 0,
            size_bytes: 0,
        }];
    }

    let chunk_size = chunk_size_bytes.max(1);
    let mut parts = Vec::new();
    let mut part_no = 1_i32;
    let mut offset = 0_i64;
    while offset < content_length {
        let size_bytes = (content_length - offset).min(chunk_size);
        parts.push(UploadPartPlan {
            part_no,
            offset_bytes: offset,
            size_bytes,
        });
        offset += size_bytes;
        part_no += 1;
    }
    parts
}

async fn upload_presigned_part(
    client: &reqwest::Client,
    presigned: &PresignedUploadPartWire,
    body: &[u8],
) -> Result<String, String> {
    let method = presigned.method.as_deref().unwrap_or("PUT");
    if method != "PUT" {
        return Err(format!("unsupported presigned upload method: {method}"));
    }

    let mut request = client
        .put(presigned.upload_url.as_str())
        .body(body.to_vec());
    if let Some(headers) = presigned.headers.as_ref() {
        for (key, value) in headers {
            request = request.header(key, value);
        }
    }

    let response = request
        .send()
        .await
        .map_err(|error| format!("drive presigned upload PUT failed: {error}"))?;
    if !response.status().is_success() {
        let status = response.status();
        let text = response.text().await.unwrap_or_default();
        return Err(format!(
            "drive presigned upload PUT returned {status}: {text}"
        ));
    }

    response
        .headers()
        .get("etag")
        .or_else(|| response.headers().get("ETag"))
        .and_then(|value| value.to_str().ok())
        .map(|value| value.trim_matches('"').to_string())
        .filter(|value| !value.is_empty())
        .ok_or_else(|| "drive presigned upload response missing ETag".to_string())
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct PrepareUploaderUploadWire {
    upload_item: UploaderUploadItemWire,
    upload_session: UploadSessionWire,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UploaderUploadItemWire {
    id: String,
    node_id: String,
    upload_session_id: Option<String>,
    storage_upload_id: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UploadSessionWire {
    id: String,
    storage_upload_id: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct PresignUploadPartWire {
    upload_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    requested_ttl_seconds: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct PresignedUploadPartWire {
    upload_url: String,
    #[serde(default)]
    method: Option<String>,
    #[serde(default)]
    headers: Option<HashMap<String, String>>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct MarkUploaderPartUploadedWire {
    upload_session_id: String,
    offset_bytes: i64,
    size_bytes: i64,
    etag: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct CompleteUploadSessionWire {
    #[serde(skip_serializing_if = "Option::is_none")]
    upload_id: Option<String>,
    content_type: String,
    content_length: i64,
    checksum_sha256_hex: String,
    parts: Vec<CompletedUploadPartWire>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct CompletedUploadPartWire {
    part_no: i32,
    etag: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn plans_multipart_ranges() {
        let parts = plan_upload_parts(10, 4);
        assert_eq!(
            parts,
            vec![
                UploadPartPlan {
                    part_no: 1,
                    offset_bytes: 0,
                    size_bytes: 4
                },
                UploadPartPlan {
                    part_no: 2,
                    offset_bytes: 4,
                    size_bytes: 4
                },
                UploadPartPlan {
                    part_no: 3,
                    offset_bytes: 8,
                    size_bytes: 2
                },
            ]
        );
    }

    #[test]
    fn checksum_uses_sdkwork_utils_sha256_prefix() {
        let digest = format!("sha256:{}", sha256_hash(b"appstore"));
        assert!(digest.starts_with("sha256:"));
        assert_eq!(digest.len(), "sha256:".len() + 64);
    }
}
