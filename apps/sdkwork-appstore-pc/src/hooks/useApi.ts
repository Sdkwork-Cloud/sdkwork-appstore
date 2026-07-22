import { useState, useEffect, useCallback } from 'react';
import { getStoreClient } from '@/services/storeClient';
import { getOpenStoreClient } from '@/services/openStoreClient';
import { getCommentsClient } from '@/services/commentsClient';
import { isAppStoreApiError, type AppStoreApiError } from '@sdkwork/appstore-app-sdk';
import type { Comment, CommentsThreadSummary } from '@sdkwork/comments-app-sdk';
import { getNotificationService } from '@/services/notificationClient';
import {
  beginPaidListingCheckout,
} from '@sdkwork/appstore-listing-acquire-core';
import { getCommerceDomainsClient } from '@/services/commerceDomainsClient';

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: AppStoreApiError | Error) => void;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions<T> = {},
) {
  const { immediate = true, onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppStoreApiError | Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const apiError = isAppStoreApiError(err)
        ? err
        : err instanceof Error
          ? err
          : new Error(String(err));
      setError(apiError);
      onError?.(apiError);
    } finally {
      setLoading(false);
    }
  }, [fetcher, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, loading, error, execute, setData };
}

export function useHomeFeed() {
  const client = getStoreClient();
  return useApi(() => client.catalog.getHome());
}

export function useCategories(limit = 8) {
  const client = getStoreClient();
  return useApi(() => client.catalog.listCategories({ limit }));
}

export function useListing(listingId: string) {
  const client = getStoreClient();
  return useApi(() => client.listings.get(listingId), { immediate: !!listingId });
}

export function useListingMedia(listingId: string) {
  const client = getStoreClient();
  return useApi(() => client.listings.listMedia(listingId), { immediate: !!listingId });
}

export function useListingReleases(listingId: string) {
  const client = getStoreClient();
  return useApi(() => client.listings.listReleases(listingId), { immediate: !!listingId });
}

export function usePublicListing(listingSlug: string) {
  const client = getOpenStoreClient();
  return useApi(() => client.getPublicListing(listingSlug), { immediate: !!listingSlug });
}

export interface ListingReviewsResult {
  items: Comment[];
  summary: CommentsThreadSummary | null;
}

export function useListingReviews(commentsThreadId: string | undefined) {
  return useApi<ListingReviewsResult>(
    async () => {
      if (!commentsThreadId) {
        return { items: [], summary: null };
      }
      const client = getCommentsClient();
      const [commentsPage, summaryResponse] = await Promise.all([
        client.comments.comments.list(commentsThreadId, {
          page: 1,
          pageSize: 10,
          status: 'published',
        }),
        client.comments.threads.summary(commentsThreadId),
      ]);
      return {
        items: commentsPage.items ?? [],
        summary: summaryResponse.summary ?? null,
      };
    },
    { immediate: !!commentsThreadId },
  );
}

export function useNotifications(immediate = true) {
  return useApi(
    () => getNotificationService().list({ page: 1, pageSize: 20 }),
    { immediate },
  );
}

export function useListingOwnership(listingId: string, enabled = true) {
  const client = getStoreClient();
  return useApi(
    async () => {
      if (!listingId) {
        return false;
      }
      const result = await client.library.listItems({ limit: 50 });
      return (result.items ?? []).some((item) => item.listingId === listingId);
    },
    { immediate: enabled && !!listingId },
  );
}

export async function purchaseListingViaCommerce(params: {
  commerceProductId?: string;
}) {
  return beginPaidListingCheckout(getCommerceDomainsClient, params);
}

export function useSearch(query: string) {
  const client = getStoreClient();
  return useApi(
    () => client.catalog.searchListings({ q: query, limit: 20 }),
    { immediate: !!query },
  );
}

export function useRecommendations(limit = 12) {
  const client = getStoreClient();
  return useApi(() => client.catalog.listRecommendations({ limit }));
}

export function useRecentlyUpdated(limit = 12) {
  const client = getStoreClient();
  return useApi(() => client.catalog.listRecentlyUpdated({ limit }));
}

export function useTrendingSearchTerms(limit = 10) {
  const client = getStoreClient();
  return useApi(() => client.catalog.listTrendingSearchTerms({ limit }));
}

export function useSearchHistory(limit = 10) {
  const client = getStoreClient();
  return useApi(() => client.catalog.listSearchHistory({ limit }));
}

export function useListingSimilar(listingId: string, limit = 6) {
  const client = getStoreClient();
  return useApi(
    () => client.listings.listSimilar(listingId, { limit }),
    { immediate: !!listingId },
  );
}

export function useDeveloperOtherListings(listingId: string, limit = 6) {
  const client = getStoreClient();
  return useApi(
    () => client.listings.listDeveloperOther(listingId, { limit }),
    { immediate: !!listingId },
  );
}

export async function recordSearchHistory(query: string, resultCount = 0) {
  const trimmed = query.trim();
  if (!trimmed) {
    return;
  }
  const client = getStoreClient();
  await client.catalog.upsertSearchHistory({
    queryText: trimmed,
    filters: { resultCount },
  });
}

export async function clearSearchHistory() {
  const client = getStoreClient();
  await client.catalog.clearSearchHistory();
}

export function useLibrary() {
  const client = getStoreClient();
  return useApi(() => client.library.listItems());
}

export function useCategoryListings(categoryId: string) {
  const client = getStoreClient();
  return useApi(
    () => client.catalog.searchListings({ categoryId }),
    { immediate: !!categoryId },
  );
}

export function useWishlist() {
  const client = getStoreClient();
  return useApi(() => client.wishlist.listItems());
}

export function useLibraryUpdates() {
  const client = getStoreClient();
  return useApi(async () => {
    const library = await client.library.listItems();
    const libraryRows = library.items ?? [];
    const checkItems = libraryRows
      .map((row) => {
        const appKey = row.appKey.trim();
        const platform = row.platform.trim();
        const installedVersionCode = (row.installedVersionCode ?? '0').trim();
        if (!appKey || !platform) {
          return null;
        }
        return { appKey, platform, installedVersionCode };
      })
      .filter(
        (item): item is { appKey: string; platform: string; installedVersionCode: string } => item !== null,
      );

    if (checkItems.length === 0) {
      return { updates: [] as unknown[], libraryItems: libraryRows };
    }

    const checkResult = await client.library.checkUpdates({ items: checkItems });
    return {
      updates: checkResult.items ?? [],
      libraryItems: libraryRows,
    };
  });
}

export function formatApiError(error: AppStoreApiError | Error | null): string {
  if (!error) {
    return '';
  }
  if (isAppStoreApiError(error)) {
    const parts = [error.detail || error.title || `HTTP ${error.status}`];
    if (error.code !== undefined) {
      parts.push(`code ${error.code}`);
    }
    if (error.traceId) {
      parts.push(`trace ${error.traceId}`);
    }
    return parts.join(' · ');
  }
  return error.message;
}

/** Creates a download grant and resolves a presigned artifact URL via open-api. */
export async function resolveArtifactDownload(params: {
  artifactId: string;
  appKey?: string;
}): Promise<string> {
  const appClient = getStoreClient();
  const openClient = getOpenStoreClient();
  const grant = await appClient.downloadGrants.create({
    artifactId: params.artifactId,
  });
  const resolved = await openClient.resolveDownload({
    artifactId: params.artifactId,
    grantId: grant.id,
    ...(params.appKey ? { appKey: params.appKey } : {}),
  });
  const downloadUrl = resolved.downloadUrl?.trim();
  if (!downloadUrl) {
    throw new Error('Download URL was not returned by the store API');
  }
  return downloadUrl;
}

/** Records install in library and resolves latest artifact download when available. */
export async function installListingAndDownload(params: {
  listingId: string;
  platform: string;
  appKey?: string;
}): Promise<{ libraryItem: unknown; downloadUrl?: string }> {
  const appClient = getStoreClient();
  const openClient = getOpenStoreClient();
  const installPayload = await appClient.library.install({
    listingId: params.listingId,
    platform: params.platform,
  });

  const libraryItem = installPayload.libraryItem;
  const appKey = params.appKey || libraryItem.appKey;

  if (!appKey) {
    return { libraryItem };
  }

  const update = await openClient.checkUpdate({
    appKey,
    platform: params.platform,
    installedVersionCode: '0',
    channelCode: 'stable',
  });

  const artifactId = update.artifactId?.trim();
  if (!artifactId) {
    return { libraryItem };
  }

  const downloadUrl = await resolveArtifactDownload({ artifactId, appKey });
  return { libraryItem, downloadUrl };
}
