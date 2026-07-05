import {
  configurePublisherClient,
  configurePublisherOrganizationResolver,
  configurePublisherUploads,
} from '@sdkwork/appstore-pc-console-publisher';
import { getStoreClient } from '@/services/storeClient';
import { uploadListingMedia, uploadReleaseArtifact } from '@/services/driveUpload';
import { getCurrentUser } from '@/bootstrap/iamRuntime';

/** Wire publisher console package with app-root SDK clients and Drive uploads. */
export function bootstrapPublisherConsole(): void {
  configurePublisherClient(() => getStoreClient());
  configurePublisherUploads({ uploadListingMedia, uploadReleaseArtifact });
  configurePublisherOrganizationResolver(() => getCurrentUser()?.organizationId);
}
