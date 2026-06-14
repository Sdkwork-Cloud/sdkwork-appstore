import type { RouteObject } from 'react-router-dom';

export function createAppRoutes(): RouteObject[] {
  return [
    {
      path: '/',
      lazy: () => import('@sdkwork/appstore-h5-catalog').then(m => ({ default: m.HomePage })),
    },
    {
      path: '/search',
      lazy: () => import('@sdkwork/appstore-h5-search').then(m => ({ default: m.SearchPage })),
    },
    {
      path: '/app/:listingSlug',
      lazy: () => import('@sdkwork/appstore-h5-listing').then(m => ({ default: m.ListingDetailPage })),
    },
    {
      path: '/library',
      lazy: () => import('@sdkwork/appstore-h5-library').then(m => ({ default: m.LibraryPage })),
    },
  ];
}
