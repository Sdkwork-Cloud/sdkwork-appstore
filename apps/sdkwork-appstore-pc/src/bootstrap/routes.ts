import type { RouteObject } from 'react-router-dom';

export interface AppRoute {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
  meta?: {
    title?: string;
    requiresAuth?: boolean;
    capability?: string;
  };
}

export function createAppRoutes(): RouteObject[] {
  return [
    {
      path: '/',
      lazy: () => import('@packages/sdkwork-appstore-pc-catalog/src/pages/HomePage'),
    },
    {
      path: '/category/:categoryId',
      lazy: () => import('@packages/sdkwork-appstore-pc-catalog/src/pages/CategoryPage'),
    },
    {
      path: '/app/:listingSlug',
      lazy: () => import('@packages/sdkwork-appstore-pc-listing/src/pages/ListingDetailPage'),
    },
    {
      path: '/search',
      lazy: () => import('@packages/sdkwork-appstore-pc-search/src/pages/SearchPage'),
    },
    {
      path: '/library',
      lazy: () => import('@packages/sdkwork-appstore-pc-library/src/pages/LibraryPage'),
    },
    {
      path: '/publisher/*',
      lazy: () => import('@packages/sdkwork-appstore-pc-console-publisher/src/pages/PublisherConsolePage'),
    },
  ];
}
