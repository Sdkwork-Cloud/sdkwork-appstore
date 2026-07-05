import { Routes, Route } from 'react-router-dom';
import { PublisherConsolePage } from './PublisherConsolePage';
import { PublisherListingManagePage } from './PublisherListingManagePage';
import { PublisherNewAppPage } from './PublisherNewAppPage';

export function PublisherRoutes() {
  return (
    <Routes>
      <Route index element={<PublisherConsolePage />} />
      <Route path="apps/new" element={<PublisherNewAppPage />} />
      <Route path="apps/:listingId" element={<PublisherListingManagePage />} />
    </Routes>
  );
}
