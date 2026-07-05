import { create } from 'zustand';
import type { ListingSummary, Category, CatalogFeaturedSlot, CatalogCollection } from '@sdkwork/appstore-app-sdk';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  userId: string | null;
  setAuth: (userId: string) => void;
  clearAuth: () => void;

  // Home feed
  featuredSlots: CatalogFeaturedSlot[];
  categories: Category[];
  collections: CatalogCollection[];
  setHomeFeed: (data: {
    featuredSlots: CatalogFeaturedSlot[];
    categories: Category[];
    collections: CatalogCollection[];
  }) => void;

  // Search
  searchResults: ListingSummary[];
  searchQuery: string;
  setSearchResults: (results: ListingSummary[]) => void;
  setSearchQuery: (query: string) => void;

  // Library
  libraryItems: ListingSummary[];
  setLibraryItems: (items: ListingSummary[]) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Error state
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  isAuthenticated: false,
  userId: null,
  setAuth: (userId) => set({ isAuthenticated: true, userId }),
  clearAuth: () => set({ isAuthenticated: false, userId: null }),

  // Home feed
  featuredSlots: [],
  categories: [],
  collections: [],
  setHomeFeed: (data) => set({
    featuredSlots: data.featuredSlots,
    categories: data.categories,
    collections: data.collections,
  }),

  // Search
  searchResults: [],
  searchQuery: '',
  setSearchResults: (results) => set({ searchResults: results }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Library
  libraryItems: [],
  setLibraryItems: (items) => set({ libraryItems: items }),

  // Loading states
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Error state
  error: null,
  setError: (error) => set({ error }),
}));
