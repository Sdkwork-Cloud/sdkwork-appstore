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
      lazy: () =>
        import('../pages/HomePage').then((module) => ({
          Component: module.HomePage,
        })),
    },
    {
      path: '/category/:categoryId',
      lazy: () =>
        import('../pages/CategoryPage').then((module) => ({
          Component: module.CategoryPage,
        })),
    },
    {
      path: '/app/:listingSlug',
      lazy: () =>
        import('../pages/ListingDetailPage').then((module) => ({
          Component: module.ListingDetailPage,
        })),
    },
    {
      path: '/search',
      lazy: () =>
        import('../pages/SearchPage').then((module) => ({
          Component: module.SearchPage,
        })),
    },
    {
      path: '/library',
      lazy: () =>
        import('../pages/LibraryPage').then((module) => ({
          Component: module.LibraryPage,
        })),
    },
    {
      path: '/publisher/*',
      lazy: () =>
        import('@sdkwork/appstore-pc-console-publisher').then((module) => ({
          Component: module.PublisherRoutes,
        })),
    },
  ];
}
