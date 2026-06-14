import { Routes, Route } from 'react-router-dom';
import { AuthGate } from './AuthGate';
import { AppShell } from './components/layout/AppShell';
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(m => ({ default: m.CategoryPage })));
const ListingDetailPage = lazy(() => import('./pages/ListingDetailPage').then(m => ({ default: m.ListingDetailPage })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const LibraryPage = lazy(() => import('./pages/LibraryPage').then(m => ({ default: m.LibraryPage })));
const PublisherConsolePage = lazy(() => import('./pages/PublisherConsolePage').then(m => ({ default: m.PublisherConsolePage })));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const NotificationsPage = lazy(() => import('./pages/notifications/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const UpdatesPage = lazy(() => import('./pages/updates/UpdatesPage').then(m => ({ default: m.UpdatesPage })));

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
        <Route element={<AppShell />}>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/app/:listingSlug" element={<ListingDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/updates" element={<UpdatesPage />} />

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
          <Route
            path="/publisher/*"
            element={
              <AuthGate>
                <PublisherConsolePage />
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
    <div className="flex flex-col items-center justify-center h-96">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="text-xl text-gray-500 mt-4">Page not found</p>
      <a href="/" className="mt-6 px-6 py-2.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600">
        Go Home
      </a>
    </div>
  );
}
