import type { AppStoreClient } from '@sdkwork/appstore-app-sdk';
import {
  configureConsoleServicePort,
  type ConsoleServicePort,
  type ManagedApp,
} from '@sdkwork/appstore-pc-core';

export function configureAppstorePcConsole(client: AppStoreClient): void {
  configureConsoleServicePort(createConsoleServicePort(client));
}

export function createConsoleServicePort(client: AppStoreClient): ConsoleServicePort {
  return {
    async getManagedApps(): Promise<ManagedApp[]> {
      const me = await client.publishers.getMe();
      const publisherId = readString(me as unknown as Record<string, unknown>, 'id');
      const response = await client.publishers.listMyListings({ limit: 200 });
      const listings = readPageItems<Record<string, unknown>>(response as unknown);
      const results = await Promise.all(
        listings.map(async (listing) => {
          const listingId = readString(listing, 'id');
          const releases = await client.listings
            .listReleases(listingId)
            .catch(() => undefined);
          const latest = releases ? readPageItems<Record<string, unknown>>(releases)[0] : undefined;
          return {
            id: listingId,
            name: readString(listing, 'displayName', 'display_name'),
            version: readString(latest, 'versionName', 'version_name') || '1.0.0',
            status: mapListingStatus(readString(listing, 'listingStatus', 'listing_status')),
            downloads: formatCount(readNumber(listing, 'downloadCount', 'download_count') ?? 0),
            updatedAt: formatDate(readString(listing, 'updatedAt', 'updated_at')),
          } satisfies ManagedApp;
        }),
      );
      return results.filter((app) => app.id);
    },

    async publishApp(appData: {
      name: string;
      category: string;
      version: string;
      description: string;
    }): Promise<ManagedApp> {
      const result = await client.publishers.bootstrapApp({
        appKey: `dev-${slugify(appData.name)}-${Date.now().toString(36)}`,
        displayName: appData.name,
        defaultLocale: 'zh-CN',
        appType: 'APP',
        listingSlug: `dev-${slugify(appData.name)}-${Date.now().toString(36)}`,
      });
      const listing = readObject(result as unknown as Record<string, unknown>, 'listing');
      return {
        id: readString(listing, 'id') || Date.now().toString(),
        name: readString(listing, 'displayName', 'display_name') || appData.name,
        version: appData.version || '1.0.0',
        status: '已提交上架',
        downloads: '0',
        updatedAt: new Date().toISOString().slice(0, 10),
      };
    },

    async getApiCredentials() {
      throw new Error('Store API credential management is not exposed by the App Store app API.');
    },

    async generateApiKey() {
      throw new Error('Store API credential management is not exposed by the App Store app API.');
    },

    async revokeApiKey() {
      throw new Error('Store API credential management is not exposed by the App Store app API.');
    },

    async getSecurityPolicy() {
      throw new Error('Security policy management is not exposed by the App Store app API.');
    },

    async updateSecurityPolicy() {
      throw new Error('Security policy management is not exposed by the App Store app API.');
    },

    async getConsoleAuditLogs() {
      throw new Error('Console audit logs are not exposed by the App Store app API.');
    },
  };
}

function mapListingStatus(status: string): ManagedApp['status'] {
  switch (status.toLocaleUpperCase()) {
    case 'PUBLISHED':
      return '已上架';
    case 'SUBMITTED':
    case 'IN_REVIEW':
      return '审核中';
    case 'DRAFT':
      return '已提交上架';
    case 'DELISTED':
    case 'REJECTED':
      return '已下架';
    default:
      return '已提交上架';
  }
}

function readPageItems<T>(value: unknown): T[] {
  if (!value || typeof value !== 'object' || !Array.isArray((value as Record<string, unknown>).items)) {
    return [];
  }
  return (value as Record<string, unknown>).items as T[];
}

function readObject(record: Record<string, unknown> | undefined, ...keys: string[]): Record<string, unknown> {
  if (!record) {
    return {};
  }
  for (const key of keys) {
    const value = record[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
  }
  return {};
}

function readString(record: Record<string, unknown> | undefined, ...keys: string[]): string {
  if (!record) {
    return '';
  }
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

function readNumber(record: Record<string, unknown> | undefined, ...keys: string[]): number | undefined {
  if (!record) {
    return undefined;
  }
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number.parseFloat(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
}

function slugify(value: string): string {
  return value
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'app';
}

function formatCount(value: number): string {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`;
  }
  return String(value);
}

function formatDate(value: string): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toISOString().slice(0, 10);
}
