import { Routes, Route } from 'react-router-dom';
import { PublisherConsolePage } from './PublisherConsolePage';
import { PublisherAppsPage } from './PublisherAppsPage';
import { PublisherListingManagePage } from './PublisherListingManagePage';
import { PublisherNewAppPage } from './PublisherNewAppPage';
import { PublisherReleasesPage } from './PublisherReleasesPage';
import { PublisherCompliancePage } from './PublisherCompliancePage';
import { PublisherAnalyticsPage } from './PublisherAnalyticsPage';

export function PublisherRoutes() {
  return (
    <Routes>
      <Route index element={<PublisherConsolePage />} />
      <Route path="apps" element={<PublisherAppsPage />} />
      <Route path="apps/new" element={<PublisherNewAppPage />} />
      <Route path="apps/:listingId" element={<PublisherListingManagePage />} />
      <Route path="apps/:listingId/releases" element={<PublisherReleasesPage />} />
      <Route path="apps/:listingId/compliance" element={<PublisherCompliancePage />} />
      <Route path="apps/:listingId/analytics" element={<PublisherAnalyticsPage />} />
    </Routes>
  );
}
