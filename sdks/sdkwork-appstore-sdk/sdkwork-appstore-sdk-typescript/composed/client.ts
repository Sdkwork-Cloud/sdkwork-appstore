import { createClient as createGeneratedClient, SdkworkAppstoreOpenClient } from '../generated/server-openapi/src/index';
import type {
  ArtifactResolveDownloadRequest,
  AutomationSubmissionCreateRequest,
  ReleaseCheckUpdateRequest,
} from '../generated/server-openapi/src/types';
import type { SdkworkCustomConfig } from '../generated/server-openapi/src/types/common';

export interface ApiKeyCredentialProvider {
  getApiKey(): string | undefined | Promise<string | undefined>;
}

export interface AppStoreOpenClientConfig extends Omit<SdkworkCustomConfig, 'apiKey'> {
  credentialProvider?: ApiKeyCredentialProvider;
}

export class AppStoreOpenClient {
  readonly generated: SdkworkAppstoreOpenClient;
  private readonly credentialProvider?: ApiKeyCredentialProvider;

  constructor(config: AppStoreOpenClientConfig) {
    this.generated = createGeneratedClient(config);
    this.credentialProvider = config.credentialProvider;
  }

  getPublicListing(listingSlug: string, locale?: string) {
    return this.generated.listings.appstore.listings.public.retrieve(
      listingSlug,
      locale ? { locale } : undefined,
    );
  }

  getPublicRelease(releaseId: string) {
    return this.generated.releases.appstore.releases.public.retrieve(releaseId);
  }

  listPublicFeatured(platform?: string, locale?: string) {
    return this.generated.catalog.appstore.catalog.public.featured.list({ platform, locale });
  }

  async checkUpdate(body: ReleaseCheckUpdateRequest) {
    await this.bindCredential();
    return this.generated.releases.appstore.releases.checkUpdate(body);
  }

  async resolveDownload(body: ArtifactResolveDownloadRequest) {
    await this.bindCredential();
    return this.generated.artifacts.appstore.artifacts.resolveDownload(body);
  }

  async createAutomationSubmission(body: AutomationSubmissionCreateRequest, idempotencyKey: string) {
    await this.bindCredential();
    return this.generated.automation.appstore.publish.automation.submissions.create(body, {
      idempotencyKey,
    });
  }

  private async bindCredential(): Promise<void> {
    const apiKey = (await this.credentialProvider?.getApiKey())?.trim();
    if (!apiKey) {
      throw new Error('Appstore open API credential is not configured');
    }
    this.generated.setApiKey(apiKey);
  }
}

export function createAppStoreOpenClient(config: AppStoreOpenClientConfig): AppStoreOpenClient {
  return new AppStoreOpenClient(config);
}
