import { useState, useEffect, useCallback } from 'react';
import { isAppStoreApiError, type AppStoreApiError } from '@sdkwork/appstore-app-sdk';
import { configurePublisherClient, publisherService } from '../services/publisherService';

export { configurePublisherClient, isAppStoreApiError };

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: AppStoreApiError | Error) => void;
}

function useApi<T>(fetcher: () => Promise<T>, options: UseApiOptions<T> = {}) {
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

export function usePublisher() {
  return useApi(() => publisherService.getMe());
}

export function usePublisherListings() {
  return useApi(() => publisherService.listMyListings());
}

export function usePublisherMembers(publisherId: string) {
  return useApi(() => publisherService.listMembers(publisherId), {
    immediate: !!publisherId,
  });
}

export function useListing(listingId: string) {
  return useApi(() => publisherService.getListing(listingId), { immediate: !!listingId });
}

export function useListingMedia(listingId: string) {
  return useApi(() => publisherService.listListingMedia(listingId), { immediate: !!listingId });
}

export function useListingReleases(listingId: string) {
  return useApi(() => publisherService.listListingReleases(listingId), { immediate: !!listingId });
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
