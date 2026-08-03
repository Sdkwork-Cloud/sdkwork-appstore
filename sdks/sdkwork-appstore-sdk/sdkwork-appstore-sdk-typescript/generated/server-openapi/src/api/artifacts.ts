import { customApiPath } from './paths';
import type { ApiRequestOptions, HttpClient } from '../http/client';

import type { ArtifactResolveDownloadRequest } from '../types';


export class ArtifactsAppstoreArtifactsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Resolve artifact download location from grant or entitlement */
  async resolveDownload(body: ArtifactResolveDownloadRequest, requestOptions?: ApiRequestOptions): Promise<{ downloadUrl?: string; expiresAt?: string; checksumSha256?: string; fileSizeBytes?: string; }> {
    return this.client.request<{ downloadUrl?: string; expiresAt?: string; checksumSha256?: string; fileSizeBytes?: string; }>(customApiPath(`/artifacts/resolve_download`), { signal: requestOptions?.signal, timeout: requestOptions?.timeout, method: 'POST' as any, body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
  }
}

export class ArtifactsAppstoreApi {
  private client: HttpClient;
  public readonly artifacts: ArtifactsAppstoreArtifactsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.artifacts = new ArtifactsAppstoreArtifactsApi(client);
  }

}

export class ArtifactsApi {
  private client: HttpClient;
  public readonly appstore: ArtifactsAppstoreApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.appstore = new ArtifactsAppstoreApi(client);
  }

}

export function createArtifactsApi(client: HttpClient): ArtifactsApi {
  return new ArtifactsApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}
