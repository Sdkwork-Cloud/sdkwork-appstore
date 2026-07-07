import { createClient, type SdkworkAppClient } from '@sdkwork/clawrouter-app-sdk';
import {
  createAppstoreNotificationService,
  type AppstoreNotificationService,
} from '@sdkwork/appstore-notification-core';
import { appstoreTokenManager } from '@/bootstrap/iamRuntime';
import { getEnvironment } from '@/bootstrap/environment';

const APPSTORE_NOTIFICATION_APP_ID = 'sdkwork-appstore-pc';

let clawRouterClient: SdkworkAppClient | null = null;
let notificationService: AppstoreNotificationService | null = null;

export function getNotificationService(): AppstoreNotificationService {
  if (!notificationService) {
    const env = getEnvironment();
    clawRouterClient = createClient({
      baseUrl: import.meta.env.VITE_APPBASE_API_URL || env.appbaseBaseUrl,
      tokenManager: appstoreTokenManager,
    });
    notificationService = createAppstoreNotificationService({
      getClient: () => clawRouterClient!,
      appId: APPSTORE_NOTIFICATION_APP_ID,
    });
  }
  return notificationService;
}

export function resetNotificationClient(): void {
  clawRouterClient = null;
  notificationService = null;
}
