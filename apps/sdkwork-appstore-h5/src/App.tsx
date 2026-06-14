import { Routes, Route } from 'react-router-dom';
import { AuthGate } from './AuthGate';
import { MobileLayout } from './components/layout/MobileLayout';
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const ListingDetailPage = lazy(() => import('./pages/ListingDetailPage').then(m => ({ default: m.ListingDetailPage })));
const LibraryPage = lazy(() => import('./pages/LibraryPage').then(m => ({ default: m.LibraryPage })));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const NotificationsPage = lazy(() => import('./pages/notifications/NotificationsPage').then(m => ({ default: m.NotificationsPage })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MobileLayout />}>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/app/:listingSlug" element={<ListingDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Authenticated routes */}
          <Route
            path="/library"
            element={
              <AuthGate>
                <LibraryPage />
              </AuthGate>
            }
          />
          <Route
            path="/wishlist"
            element={
              <AuthGate>
                <LibraryPage />
              </AuthGate>
            }
          />
          <Route
            path="/notifications"
            element={
              <AuthGate>
                <NotificationsPage />
              </AuthGate>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-96 px-4">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="text-xl text-gray-500 mt-4">Page not found</p>
      <a href="/" className="mt-6 px-6 py-2.5 bg-blue-500 text-white rounded-full text-sm font-medium">
        Go Home
      </a>
    </div>
  );
}
