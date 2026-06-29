import { useState, useEffect, useCallback } from 'react';
import { getStoreClient } from '@/services/storeClient';

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
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
      setData(result);
      onSuccess?.(result);
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
  return useApi(() => client.catalog.getHome());
}

export function useCategories() {
  const client = getStoreClient();
  return useApi(() => client.catalog.listCategories());
}

export function useListing(listingId: string) {
  const client = getStoreClient();
  return useApi(
    () => client.listings.get(listingId),
    { immediate: !!listingId }
  );
}

export function useSearch(query: string) {
  const client = getStoreClient();
  return useApi(
    () => client.catalog.searchListings({ query }),
    { immediate: !!query }
  );
}

export function useLibrary() {
  const client = getStoreClient();
  return useApi(() => client.library.listItems());
}

export function usePublisher() {
  const client = getStoreClient();
  return useApi(() => client.publishers.getMe());
}
