import {
  createClient,
  type SdkworkAppClient as CommentsAppClient,
} from '@sdkwork/comments-app-sdk';
import { appstoreTokenManager } from '@/bootstrap/iamRuntime';
import { getEnvironment } from '@/bootstrap/environment';

let commentsClient: CommentsAppClient | null = null;

export function getCommentsClient(): CommentsAppClient {
  if (!commentsClient) {
    const env = getEnvironment();
    commentsClient = createClient({
      baseUrl:
        import.meta.env.VITE_SDKWORK_COMMENTS_APP_API_BASE_URL || env.commentsAppApiBaseUrl,
      tokenManager: appstoreTokenManager,
    });
  }
  return commentsClient;
}

export function resetCommentsClient(): void {
  commentsClient = null;
}
