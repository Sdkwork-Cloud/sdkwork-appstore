import {
  createDriveAppClient,
  type SdkworkDriveAppClient,
} from '@sdkwork/drive-app-sdk';
import { appstoreTokenManager } from '@/bootstrap/iamRuntime';
import { getEnvironment } from '@/bootstrap/environment';

let driveClient: SdkworkDriveAppClient | null = null;

export function getDriveClient(): SdkworkDriveAppClient {
  if (!driveClient) {
    const env = getEnvironment();
    driveClient = createDriveAppClient({
      baseUrl:
        import.meta.env.VITE_SDKWORK_DRIVE_APP_API_BASE_URL || env.driveAppApiBaseUrl,
      tokenManager: appstoreTokenManager,
    });
  }
  return driveClient;
}

export function resetDriveClient(): void {
  driveClient = null;
}
