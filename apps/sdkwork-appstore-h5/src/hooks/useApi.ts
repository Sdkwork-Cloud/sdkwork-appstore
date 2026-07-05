import { useState, useEffect, useCallback } from 'react';
import { getStoreClient } from '@/services/storeClient';
import { isAppStoreApiError, type AppStoreApiError } from '@sdkwork/appstore-app-sdk';

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

export function usePublicListing(listingSlug: string) {
  const client = getStoreClient();
  return useApi(() => client.store.getPublicListing(listingSlug), { immediate: !!listingSlug });
}

export function useSearch(query: string) {
  const client = getStoreClient();
  return useApi(() => client.catalog.searchListings({ q: query }), { immediate: !!query });
}

export function useRecommendations(limit = 12) {
  const client = getStoreClient();
  return useApi(() => client.catalog.listRecommendations({ limit }));
}

export function useTrendingSearchTerms(limit = 10) {
  const client = getStoreClient();
  return useApi(() => client.catalog.listTrendingSearchTerms({ limit }));
}

export function useSearchHistory(limit = 10) {
  const client = getStoreClient();
  return useApi(() => client.catalog.listSearchHistory({ limit }));
}

export async function recordSearchHistory(query: string, resultCount = 0) {
  const trimmed = query.trim();
  if (!trimmed) {
    return;
  }
  const client = getStoreClient();
  await client.catalog.upsertSearchHistory({
    queryText: trimmed,
    resultCount,
  });
}

export async function clearSearchHistory() {
  const client = getStoreClient();
  await client.catalog.clearSearchHistory();
}

export function useListingSimilar(listingId: string, limit = 6) {
  const client = getStoreClient();
  return useApi(
    () => client.listings.listSimilar(listingId, { limit }),
    { immediate: !!listingId },
  );
}

export function useLibrary() {
  const client = getStoreClient();
  return useApi(() => client.library.listItems());
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
        const item = row as Record<string, unknown>;
        const appKey = String(item.appKey ?? item.app_key ?? '').trim();
        const platform = String(item.platform ?? item.platformScope ?? 'ANDROID').trim();
        const installedVersionCode = String(
          item.installedVersionCode ?? item.installed_version_code ?? '0',
        ).trim();
        if (!appKey) {
          return null;
        }
        return { appKey, platform, installedVersionCode };
      })
      .filter((item): item is { appKey: string; platform: string; installedVersionCode: string } =>
        item !== null,
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

function readRecordString(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

export async function resolveArtifactDownload(params: {
  artifactId: string;
  appKey?: string;
}): Promise<string> {
  const client = getStoreClient();
  const grantRow = (await client.downloadGrants.create({
    artifactId: params.artifactId,
  })) as Record<string, unknown>;
  const grantId = readRecordString(grantRow, 'id', 'grantId', 'grant_id');
  const resolved = (await client.store.resolveDownload({
    artifactId: params.artifactId,
    ...(grantId ? { grantId } : {}),
    ...(params.appKey ? { appKey: params.appKey } : {}),
  })) as Record<string, unknown>;
  const downloadUrl = readRecordString(resolved, 'downloadUrl', 'download_url');
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
  const client = getStoreClient();
  const installPayload = (await client.library.install({
    listingId: params.listingId,
    platform: params.platform,
  })) as Record<string, unknown>;

  const libraryItemRaw = installPayload.libraryItem ?? installPayload;
  const libraryItem = libraryItemRaw as Record<string, unknown>;
  const appKey =
    params.appKey || readRecordString(libraryItem, 'appKey', 'app_key');

  if (!appKey) {
    return { libraryItem: libraryItemRaw };
  }

  const updateRow = (await client.store.checkUpdate({
    appKey,
    platform: params.platform,
    installedVersionCode: '0',
    channelCode: 'stable',
  })) as Record<string, unknown>;

  const artifactId = readRecordString(updateRow, 'artifactId', 'artifact_id');
  if (!artifactId) {
    return { libraryItem: libraryItemRaw };
  }

  const downloadUrl = await resolveArtifactDownload({ artifactId, appKey });
  return { libraryItem: libraryItemRaw, downloadUrl };
}
