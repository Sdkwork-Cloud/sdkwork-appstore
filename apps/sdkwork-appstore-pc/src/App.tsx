import { Routes, Route } from 'react-router-dom';
import { AuthGate } from './AuthGate';
import { AppShell } from './components/layout/AppShell';
import { lazy, Suspense } from 'react';

const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(m => ({ default: m.CategoryPage })));
const ListingDetailPage = lazy(() => import('./pages/ListingDetailPage').then(m => ({ default: m.ListingDetailPage })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const LibraryPage = lazy(() => import('./pages/LibraryPage').then(m => ({ default: m.LibraryPage })));
const PublisherRoutes = lazy(() =>
  import('@sdkwork/appstore-pc-console-publisher').then((m) => ({ default: m.PublisherRoutes })),
);
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const NotificationsPage = lazy(() => import('./pages/notifications/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const UpdatesPage = lazy(() => import('./pages/updates/UpdatesPage').then(m => ({ default: m.UpdatesPage })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div
        className="animate-spin rounded-full h-8 w-8 border-b-2"
        style={{ borderColor: 'var(--accent)' }}
      />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<AppShell />}>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          {/* PRD §4.1 canonical category entry routes */}
          <Route path="/apps" element={<CategoryPage categoryId="apps" />} />
          <Route path="/games" element={<CategoryPage categoryId="games" />} />
          <Route path="/charts" element={<CategoryPage categoryId="top-charts" />} />
          <Route path="/app/:listingSlug" element={<ListingDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/updates"
            element={
              <AuthGate>
                <UpdatesPage />
              </AuthGate>
            }
          />

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
                <PublisherRoutes />
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
      <h1
        className="text-6xl font-bold"
        style={{ color: 'var(--border-default)' }}
      >
        404
      </h1>
      <p
        className="text-xl mt-4"
        style={{ color: 'var(--text-secondary)' }}
      >
        页面未找到
      </p>
      <a
        href="/"
        className="btn-primary mt-6"
      >
        返回首页
      </a>
    </div>
  );
}
