import type { RouteObject } from 'react-router-dom';

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
      path: '/search',
      lazy: () =>
        import('../pages/SearchPage').then((module) => ({
          Component: module.SearchPage,
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
      path: '/library',
      lazy: () =>
        import('../pages/LibraryPage').then((module) => ({
          Component: module.LibraryPage,
        })),
    },
    {
      path: '/publisher/*',
      lazy: () =>
        import('@sdkwork/appstore-h5-console-publisher').then((module) => ({
          Component: module.PublisherRoutes,
        })),
    },
  ];
}
