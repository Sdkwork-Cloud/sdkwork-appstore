import { useState, useEffect, useCallback } from 'react';
import { getStoreClient } from '@/services/storeClient';
import type { StoreApiResult } from '@sdk/generated/server-openapi';

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(
  fetcher: () => Promise<StoreApiResult<T>>,
  options: UseApiOptions<T> = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (result.success && result.data) {
        setData(result.data);
        onSuccess?.(result.data);
      } else {
        throw new Error(result.message || 'Request failed');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
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
  return useApi(() => client.catalog.getHome() as Promise<StoreApiResult<unknown>>);
}

export function useCategories() {
  const client = getStoreClient();
  return useApi(() => client.catalog.listCategories() as Promise<StoreApiResult<unknown>>);
}

export function useListing(listingId: string) {
  const client = getStoreClient();
  return useApi(
    () => client.listings.get(listingId) as Promise<StoreApiResult<unknown>>,
    { immediate: !!listingId }
  );
}

export function useSearch(query: string) {
  const client = getStoreClient();
  return useApi(
    () => client.catalog.searchListings({ query }) as Promise<StoreApiResult<unknown>>,
    { immediate: !!query }
  );
}

export function useLibrary() {
  const client = getStoreClient();
  return useApi(() => client.library.listItems() as Promise<StoreApiResult<unknown>>);
}

export function usePublisher() {
  const client = getStoreClient();
  return useApi(() => client.publishers.getMe() as Promise<StoreApiResult<unknown>>);
}
