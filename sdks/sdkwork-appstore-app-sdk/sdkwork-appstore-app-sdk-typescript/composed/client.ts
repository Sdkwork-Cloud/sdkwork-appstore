export interface AppStoreClientConfig {
  baseUrl: string;
  tokenManager: TokenManager;
}

export interface TokenManager {
  getAuthToken(): string | undefined;
  getAccessToken(): string | undefined;
}

export class AppStoreClient {
  private baseUrl: string;
  private tokenManager: TokenManager;

  constructor(config: AppStoreClientConfig) {
    this.baseUrl = config.baseUrl;
    this.tokenManager = config.tokenManager;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const authToken = this.tokenManager.getAuthToken();
    if (authToken) {
      headers['Auth-Token'] = authToken;
    }

    const accessToken = this.tokenManager.getAccessToken();
    if (accessToken) {
      headers['Access-Token'] = accessToken;
    }

    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        title: error.title || response.statusText,
        detail: error.detail,
        type: error.type,
      };
    }

    return response.json();
  }

  readonly catalog = {
    getHome: () => this.request('GET', '/app/v3/api/catalog/home'),

    listCategories: (params?: { cursor?: string; limit?: number; locale?: string }) =>
      this.request('GET', '/app/v3/api/catalog/categories', undefined, params),

    getCategory: (categoryId: string) =>
      this.request('GET', `/app/v3/api/catalog/categories/${categoryId}`),

    listCollections: (params?: { cursor?: string; limit?: number }) =>
      this.request('GET', '/app/v3/api/catalog/collections', undefined, params),

    getCollection: (collectionId: string) =>
      this.request('GET', `/app/v3/api/catalog/collections/${collectionId}`),

    listFeatured: () =>
      this.request('GET', '/app/v3/api/catalog/featured'),

    getChart: (chartCode: string, params?: { snapshotDate?: string; locale?: string; platformScope?: string }) =>
      this.request('GET', `/app/v3/api/catalog/charts/${chartCode}`, undefined, params),

    searchListings: (params?: { query?: string; categoryId?: string; cursor?: string; limit?: number }) =>
      this.request('GET', '/app/v3/api/catalog/listings/search', undefined, params),

    getPublicFeatured: (params?: { locale?: string; platform?: string; limit?: number }) =>
      this.request('GET', '/app/v3/api/catalog/public/featured', undefined, params),
  };

  readonly listings = {
    get: (listingId: string) =>
      this.request('GET', `/app/v3/api/listings/${listingId}`),

    create: (data: import('../generated/server-openapi').ListingCreateRequest) =>
      this.request('POST', '/app/v3/api/listings', data),

    update: (listingId: string, data: import('../generated/server-openapi').ListingUpdateRequest) =>
      this.request('PATCH', `/app/v3/api/listings/${listingId}`, data),

    upsertLocalization: (listingId: string, data: import('../generated/server-openapi').ListingLocalizationUpsertRequest) =>
      this.request('PUT', `/app/v3/api/listings/${listingId}/localizations`, data),

    listMedia: (listingId: string) =>
      this.request('GET', `/app/v3/api/listings/${listingId}/media`),

    attachMedia: (listingId: string, data: import('../generated/server-openapi').ListingMediaAttachRequest) =>
      this.request('POST', `/app/v3/api/listings/${listingId}/media`, data),

    removeMedia: (listingId: string, mediaId: string) =>
      this.request('DELETE', `/app/v3/api/listings/${listingId}/media/${mediaId}`),

    bindCategories: (listingId: string, data: import('../generated/server-openapi').ListingCategoriesBindRequest) =>
      this.request('PUT', `/app/v3/api/listings/${listingId}/categories`, data),

    createSubmission: (listingId: string, data: import('../generated/server-openapi').ListingSubmissionCreateRequest) =>
      this.request('POST', `/app/v3/api/listings/${listingId}/submissions`, data),

    getPublic: (listingSlug: string) =>
      this.request('GET', `/app/v3/api/listings/public/${listingSlug}`),
  };

  readonly publishers = {
    getMe: () =>
      this.request('GET', '/app/v3/api/publishers/me'),

    create: (data: import('../generated/server-openapi').PublisherCreateRequest) =>
      this.request('POST', '/app/v3/api/publishers', data),

    update: (publisherId: string, data: import('../generated/server-openapi').PublisherUpdateRequest) =>
      this.request('PATCH', `/app/v3/api/publishers/${publisherId}`, data),

    listMembers: (publisherId: string, params?: { cursor?: string; limit?: number }) =>
      this.request('GET', `/app/v3/api/publishers/${publisherId}/members`, undefined, params),

    inviteMember: (publisherId: string, data: import('../generated/server-openapi').PublisherMemberInviteRequest) =>
      this.request('POST', `/app/v3/api/publishers/${publisherId}/members`, data),

    submitVerification: (publisherId: string, data: import('../generated/server-openapi').PublisherVerificationSubmitRequest) =>
      this.request('POST', `/app/v3/api/publishers/${publisherId}/verifications`, data),
  };

  readonly releases = {
    get: (releaseId: string) =>
      this.request('GET', `/app/v3/api/releases/${releaseId}`),

    create: (data: import('../generated/server-openapi').ReleaseCreateRequest) =>
      this.request('POST', '/app/v3/api/releases', data),

    update: (releaseId: string, data: import('../generated/server-openapi').ReleaseUpdateRequest) =>
      this.request('PATCH', `/app/v3/api/releases/${releaseId}`, data),

    upsertNotes: (releaseId: string, data: import('../generated/server-openapi').ReleaseNotesUpsertRequest) =>
      this.request('PUT', `/app/v3/api/releases/${releaseId}/notes`, data),

    attachArtifact: (releaseId: string, data: import('../generated/server-openapi').ArtifactAttachRequest) =>
      this.request('POST', `/app/v3/api/releases/${releaseId}/artifacts`, data),

    updateRollout: (releaseId: string, data: import('../generated/server-openapi').RolloutUpdateRequest) =>
      this.request('PUT', `/app/v3/api/releases/${releaseId}/rollout`, data),

    retire: (releaseId: string) =>
      this.request('POST', `/app/v3/api/releases/${releaseId}/retire`),

    checkUpdate: (data: import('../generated/server-openapi').CheckUpdateRequest) =>
      this.request('POST', '/app/v3/api/releases/check-update', data),

    resolveDownload: (artifactId: string, grantId?: string) =>
      this.request('GET', `/app/v3/api/releases/artifacts/${artifactId}/download`, undefined, { grantId }),

    getPublic: (releaseId: string) =>
      this.request('GET', `/app/v3/api/releases/public/${releaseId}`),
  };

  readonly library = {
    listItems: (params?: { cursor?: string; limit?: number }) =>
      this.request('GET', '/app/v3/api/library/items', undefined, params),

    getItem: (libraryItemId: string) =>
      this.request('GET', `/app/v3/api/library/items/${libraryItemId}`),

    install: (data: import('../generated/server-openapi').LibraryInstallRequest) =>
      this.request('POST', '/app/v3/api/library/install', data),

    uninstall: (libraryItemId: string) =>
      this.request('POST', `/app/v3/api/library/items/${libraryItemId}/uninstall`),

    checkUpdates: (data: import('../generated/server-openapi').LibraryUpdatesCheckRequest) =>
      this.request('POST', '/app/v3/api/library/updates/check', data),
  };

  readonly wishlist = {
    listItems: (params?: { cursor?: string; limit?: number }) =>
      this.request('GET', '/app/v3/api/wishlist/items', undefined, params),

    addItem: (listingId: string) =>
      this.request('POST', '/app/v3/api/wishlist/items', { listingId }),

    removeItem: (listingId: string) =>
      this.request('DELETE', `/app/v3/api/wishlist/items/${listingId}`),
  };

  readonly downloadGrants = {
    create: (data: { listingId: string; releaseId: string; artifactId: string; grantReason?: string }) =>
      this.request('POST', '/app/v3/api/download-grants', data),

    consume: (grantId: string) =>
      this.request('POST', `/app/v3/api/download-grants/${grantId}/consume`),
  };
}

export function createAppStoreClient(config: AppStoreClientConfig): AppStoreClient {
  return new AppStoreClient(config);
}
