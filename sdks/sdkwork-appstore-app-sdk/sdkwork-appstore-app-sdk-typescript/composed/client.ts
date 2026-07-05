import type { SdkWorkApiResponse } from '../generated/server-openapi/types';

export interface AppStoreClientConfig {
  baseUrl: string;
  /** Base URL for `/store/v3/api` open-api routes; defaults to `baseUrl`. */
  openApiBaseUrl?: string;
  tokenManager: TokenManager;
}

export interface TokenManager {
  getAuthToken(): string | undefined;
  getAccessToken(): string | undefined;
}

export interface AppStoreApiError {
  status: number;
  code?: number;
  traceId?: string;
  title?: string;
  detail?: string;
  type?: string;
}

export function isAppStoreApiError(error: unknown): error is AppStoreApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as AppStoreApiError).status === 'number'
  );
}

export class AppStoreClient {
  private baseUrl: string;
  private openApiBaseUrl: string;
  private tokenManager: TokenManager;

  constructor(config: AppStoreClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.openApiBaseUrl = (config.openApiBaseUrl ?? config.baseUrl).replace(/\/$/, '');
    this.tokenManager = config.tokenManager;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    params?: Record<string, string | number | undefined>,
    baseUrl: string = this.baseUrl,
  ): Promise<T> {
    const url = new URL(`${baseUrl}${path}`);
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

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const problem = payload as Record<string, unknown>;
      const error: AppStoreApiError = {
        status: response.status,
        code: typeof problem.code === 'number' ? problem.code : undefined,
        traceId: typeof problem.traceId === 'string' ? problem.traceId : undefined,
        title: typeof problem.title === 'string' ? problem.title : response.statusText,
        detail: typeof problem.detail === 'string' ? problem.detail : undefined,
        type: typeof problem.type === 'string' ? problem.type : undefined,
      };
      throw error;
    }

    const envelope = payload as SdkWorkApiResponse<T>;
    if (typeof envelope.code === 'number' && envelope.code !== 0) {
      throw {
        status: response.status,
        code: envelope.code,
        traceId: envelope.traceId,
        detail: 'Non-zero success code returned by server',
      } satisfies AppStoreApiError;
    }

    return envelope.data as T;
  }

  readonly catalog = {
    getHome: () =>
      this.request<{ item: unknown }>('GET', '/app/v3/api/catalog/home').then((data) => data.item),

    listCategories: (params?: { cursor?: string; limit?: number; locale?: string }) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        '/app/v3/api/catalog/categories',
        undefined,
        params,
      ),

    getCategory: (categoryId: string) =>
      this.request<{ item: unknown }>('GET', `/app/v3/api/catalog/categories/${categoryId}`).then(
        (data) => data.item,
      ),

    listCollections: (params?: { cursor?: string; limit?: number }) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        '/app/v3/api/catalog/collections',
        undefined,
        params,
      ),

    getCollection: (collectionId: string) =>
      this.request<{ item: unknown }>(
        'GET',
        `/app/v3/api/catalog/collections/${collectionId}`,
      ).then((data) => data.item),

    listFeatured: () =>
      this.request<{ items: unknown[]; pageInfo: unknown }>('GET', '/app/v3/api/catalog/featured'),

    getChart: (
      chartCode: string,
      params?: { snapshotDate?: string; locale?: string; platformScope?: string },
    ) =>
      this.request<{ item: unknown }>(
        'GET',
        `/app/v3/api/catalog/charts/${chartCode}`,
        undefined,
        params,
      ).then((data) => data.item),

    searchListings: (params?: { q?: string; categoryId?: string; cursor?: string; limit?: number }) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        '/app/v3/api/catalog/listings/search',
        undefined,
        params,
      ),

    listRecommendations: (params?: {
      locale?: string;
      platform?: string;
      cursor?: string;
      limit?: number;
    }) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        '/app/v3/api/catalog/recommendations',
        undefined,
        params,
      ),

    listRecentlyUpdated: (params?: { locale?: string; cursor?: string; limit?: number }) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        '/app/v3/api/catalog/recently_updated',
        undefined,
        params,
      ),

    listEvents: (params?: { status?: string; cursor?: string; limit?: number }) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        '/app/v3/api/catalog/events',
        undefined,
        params,
      ),

    getEvent: (eventId: string) =>
      this.request<{ item: unknown }>('GET', `/app/v3/api/catalog/events/${eventId}`).then(
        (data) => data.item,
      ),

    listSearchSuggestions: (params: { q: string; locale?: string }) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        '/app/v3/api/catalog/search/suggestions',
        undefined,
        params,
      ),

    listTrendingSearchTerms: (params?: { locale?: string; limit?: number }) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        '/app/v3/api/catalog/search/trending',
        undefined,
        params,
      ),

    listSearchHistory: (params?: { cursor?: string; limit?: number }) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        '/app/v3/api/catalog/search/history',
        undefined,
        params,
      ),

    upsertSearchHistory: (data: {
      queryText: string;
      filters?: Record<string, unknown>;
      resultCount?: number;
    }) =>
      this.request<{ accepted: boolean }>('PUT', '/app/v3/api/catalog/search/history', data),

    clearSearchHistory: () =>
      this.request<void>('DELETE', '/app/v3/api/catalog/search/history'),
  };

  readonly listings = {
    get: (listingId: string) =>
      this.request<{ item: unknown }>('GET', `/app/v3/api/listings/${listingId}`).then(
        (data) => data.item,
      ),

    create: (data: import('../generated/server-openapi').ListingCreateRequest) =>
      this.request<{ item: unknown }>('POST', '/app/v3/api/listings', data).then(
        (payload) => payload.item,
      ),

    update: (listingId: string, data: import('../generated/server-openapi').ListingUpdateRequest) =>
      this.request<{ item: unknown }>('PATCH', `/app/v3/api/listings/${listingId}`, data).then(
        (payload) => payload.item,
      ),

    upsertLocalization: (
      listingId: string,
      locale: string,
      data: import('../generated/server-openapi').ListingLocalizationUpsertRequest,
    ) =>
      this.request<{ item: unknown }>(
        'PUT',
        `/app/v3/api/listings/${listingId}/localizations/${locale}`,
        data,
      ).then((payload) => payload.item),

    listMedia: (listingId: string) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        `/app/v3/api/listings/${listingId}/media`,
      ),

    attachMedia: (
      listingId: string,
      data: import('../generated/server-openapi').ListingMediaAttachRequest,
    ) =>
      this.request<{ item: unknown }>('POST', `/app/v3/api/listings/${listingId}/media`, data).then(
        (payload) => payload.item,
      ),

    removeMedia: (listingId: string, mediaId: string) =>
      this.request<{ accepted: boolean }>(
        'DELETE',
        `/app/v3/api/listings/${listingId}/media/${mediaId}`,
      ),

    bindCategories: (
      listingId: string,
      data: import('../generated/server-openapi').ListingCategoriesBindRequest,
    ) =>
      this.request<{ item: unknown }>(
        'PUT',
        `/app/v3/api/listings/${listingId}/categories`,
        data,
      ).then((payload) => payload.item),

    createSubmission: (
      listingId: string,
      data: import('../generated/server-openapi').ListingSubmissionCreateRequest,
    ) =>
      this.request<{ accepted: boolean; operationId?: string; status?: string }>(
        'POST',
        `/app/v3/api/listings/${listingId}/submissions`,
        data,
      ),

    listReleases: (listingId: string) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        `/app/v3/api/listings/${listingId}/releases`,
      ),

    listReleaseHistory: (listingId: string, params?: { cursor?: string; limit?: number }) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        `/app/v3/api/listings/${listingId}/releases/history`,
        undefined,
        params,
      ),

    listSimilar: (listingId: string, params?: { cursor?: string; limit?: number }) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        `/app/v3/api/listings/${listingId}/similar`,
        undefined,
        params,
      ),

    listDeveloperOther: (listingId: string, params?: { cursor?: string; limit?: number }) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        `/app/v3/api/listings/${listingId}/developer_other`,
        undefined,
        params,
      ),

    getEditorial: (listingId: string) =>
      this.request<{ item: unknown }>('GET', `/app/v3/api/listings/${listingId}/editorial`).then(
        (data) => data.item,
      ),
  };

  readonly publishers = {
    getMe: () =>
      this.request<{ item: unknown }>('GET', '/app/v3/api/publishers/me').then((data) => data.item),

    listMyListings: (params?: { cursor?: string; limit?: number }) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        '/app/v3/api/publishers/me/listings',
        undefined,
        params,
      ),

    bootstrapApp: (data: {
      appKey: string;
      displayName: string;
      defaultLocale: string;
      appType?: string;
      listingSlug?: string;
      pricingModel?: string;
    }) =>
      this.request<{ item: { app: unknown; listing: unknown } }>(
        'POST',
        '/app/v3/api/publishers/me/apps',
        data,
      ).then((payload) => payload.item),

    create: (data: import('../generated/server-openapi').PublisherCreateRequest) =>
      this.request<{ item: unknown }>('POST', '/app/v3/api/publishers', data).then(
        (payload) => payload.item,
      ),

    update: (
      publisherId: string,
      data: import('../generated/server-openapi').PublisherUpdateRequest,
    ) =>
      this.request<{ item: unknown }>('PATCH', `/app/v3/api/publishers/${publisherId}`, data).then(
        (payload) => payload.item,
      ),

    listMembers: (publisherId: string, params?: { cursor?: string; limit?: number }) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        `/app/v3/api/publishers/${publisherId}/members`,
        undefined,
        params,
      ),

    inviteMember: (
      publisherId: string,
      data: import('../generated/server-openapi').PublisherMemberInviteRequest,
    ) =>
      this.request<{ item: unknown }>(
        'POST',
        `/app/v3/api/publishers/${publisherId}/members`,
        data,
      ).then((payload) => payload.item),

    submitVerification: (
      publisherId: string,
      data: import('../generated/server-openapi').PublisherVerificationSubmitRequest,
    ) =>
      this.request<{ accepted: boolean; operationId?: string; status?: string }>(
        'POST',
        `/app/v3/api/publishers/${publisherId}/verifications`,
        data,
      ),
  };

  readonly releases = {
    get: (releaseId: string) =>
      this.request<{ item: unknown }>('GET', `/app/v3/api/releases/${releaseId}`).then(
        (data) => data.item,
      ),

    create: (
      listingId: string,
      data: import('../generated/server-openapi').ReleaseCreateRequest,
    ) =>
      this.request<{ item: unknown }>(
        'POST',
        `/app/v3/api/listings/${listingId}/releases`,
        data,
      ).then((payload) => payload.item),

    update: (releaseId: string, data: import('../generated/server-openapi').ReleaseUpdateRequest) =>
      this.request<{ item: unknown }>('PATCH', `/app/v3/api/releases/${releaseId}`, data).then(
        (payload) => payload.item,
      ),

    upsertNotes: (
      releaseId: string,
      locale: string,
      data: import('../generated/server-openapi').ReleaseNotesUpsertRequest,
    ) =>
      this.request<{ item: unknown }>(
        'PUT',
        `/app/v3/api/releases/${releaseId}/notes/${locale}`,
        data,
      ).then((payload) => payload.item),

    attachArtifact: (
      releaseId: string,
      data: import('../generated/server-openapi').ArtifactAttachRequest,
    ) =>
      this.request<{ item: unknown }>(
        'POST',
        `/app/v3/api/releases/${releaseId}/artifacts`,
        data,
      ).then((payload) => payload.item),

    updateRollout: (
      releaseId: string,
      data: import('../generated/server-openapi').RolloutUpdateRequest,
    ) =>
      this.request<{ item: unknown }>(
        'PUT',
        `/app/v3/api/releases/${releaseId}/rollout`,
        data,
      ).then((payload) => payload.item),

    retire: (releaseId: string) =>
      this.request<{ accepted: boolean }>('POST', `/app/v3/api/releases/${releaseId}/retire`),
  };

  readonly library = {
    listItems: (params?: { cursor?: string; limit?: number }) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        '/app/v3/api/library/items',
        undefined,
        params,
      ),

    getItem: (libraryItemId: string) =>
      this.request<{ item: unknown }>('GET', `/app/v3/api/library/items/${libraryItemId}`).then(
        (data) => data.item,
      ),

    install: (data: import('../generated/server-openapi').LibraryInstallRequest) =>
      this.request<{ item: unknown }>('POST', '/app/v3/api/library/install', data).then(
        (payload) => payload.item,
      ),

    uninstall: (data: import('../generated/server-openapi').LibraryUninstallRequest) =>
      this.request<{ accepted: boolean }>('POST', '/app/v3/api/library/uninstall', data),

    checkUpdates: (data: import('../generated/server-openapi').LibraryUpdatesCheckRequest) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'POST',
        '/app/v3/api/library/updates/check',
        data,
      ),
  };

  readonly wishlist = {
    listItems: (params?: { cursor?: string; limit?: number }) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        '/app/v3/api/wishlist/items',
        undefined,
        params,
      ),

    addItem: (listingId: string) =>
      this.request<{ item: unknown }>('POST', '/app/v3/api/wishlist/items', { listingId }).then(
        (payload) => payload.item,
      ),

    removeItem: (listingId: string) =>
      this.request<{ accepted: boolean }>('DELETE', `/app/v3/api/wishlist/items/${listingId}`),
  };

  readonly downloadGrants = {
    create: (data: {
      artifactId: string;
      listingId?: string;
      releaseId?: string;
      grantReason?: string;
    }) =>
      this.request<{ item: unknown }>('POST', '/app/v3/api/download_grants', data).then(
        (payload) => payload.item,
      ),

    consume: (grantId: string) =>
      this.request<{ item: unknown }>(
        'POST',
        `/app/v3/api/download_grants/${grantId}/consume`,
      ).then((payload) => payload.item),
  };

  /** Open-api surface (`/store/v3/api/*`) for public storefront and update clients. */
  readonly store = {
    listPublicFeatured: (params?: { locale?: string; platform?: string; limit?: number }) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        '/store/v3/api/catalog/featured',
        undefined,
        params,
        this.openApiBaseUrl,
      ),

    getPublicListing: (listingSlug: string) =>
      this.request<{ item: unknown }>(
        'GET',
        `/store/v3/api/listings/${listingSlug}`,
        undefined,
        undefined,
        this.openApiBaseUrl,
      ).then((data) => data.item),

    getPublicRelease: (releaseId: string) =>
      this.request<{ item: unknown }>(
        'GET',
        `/store/v3/api/releases/${releaseId}`,
        undefined,
        undefined,
        this.openApiBaseUrl,
      ).then((data) => data.item),

    checkUpdate: (data: import('../generated/server-openapi').CheckUpdateRequest) =>
      this.request<{ item: unknown }>(
        'POST',
        '/store/v3/api/releases/check_update',
        data,
        undefined,
        this.openApiBaseUrl,
      ).then((payload) => payload.item),

    resolveDownload: (data: {
      artifactId: string;
      grantId?: string;
      appKey?: string;
    }) =>
      this.request<{ item: unknown }>(
        'POST',
        '/store/v3/api/artifacts/resolve_download',
        data,
        undefined,
        this.openApiBaseUrl,
      ).then((payload) => payload.item),
  };

  readonly compliance = {
    listIapItems: (listingId: string, params?: { cursor?: string; limit?: number }) =>
      this.request<{ items: unknown[]; pageInfo: unknown }>(
        'GET',
        `/app/v3/api/listings/${listingId}/compliance/iap_items`,
        undefined,
        params,
      ),
  };
}

export function createAppStoreClient(config: AppStoreClientConfig): AppStoreClient {
  return new AppStoreClient(config);
}
