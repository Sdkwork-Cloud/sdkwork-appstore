import { appApiPath, type SdkworkAppClient } from '@sdkwork/clawrouter-app-sdk';
import { coalesce } from '@sdkwork/utils';

export type AppstoreNotificationType = 'alert' | 'info' | 'system' | 'warning';

export interface AppstoreNotificationItem {
  id: string;
  appId: string;
  title: string;
  desc: string;
  content: string;
  time: string;
  type: AppstoreNotificationType;
  read: boolean;
  archived: boolean;
  actionUrl?: string | null;
}

export interface ListNotificationsOptions {
  page?: number;
  pageSize?: number;
  includeArchived?: boolean;
}

export interface ListNotificationsResult {
  items: AppstoreNotificationItem[];
  page: number;
  pageSize: number;
  total?: number;
}

export interface AppstoreNotificationService {
  list(options?: ListNotificationsOptions): Promise<ListNotificationsResult>;
  acknowledge(notificationId: string): Promise<void>;
  acknowledgeAll(notificationIds: string[]): Promise<void>;
}

interface NotificationPageResponse {
  items?: unknown[];
  pageInfo?: {
    total?: number;
  };
}

export interface CreateAppstoreNotificationServiceOptions {
  getClient: () => SdkworkAppClient;
  appId: string;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

export function createAppstoreNotificationService(
  options: CreateAppstoreNotificationServiceOptions,
): AppstoreNotificationService {
  const appId = options.appId.trim();
  if (!appId) {
    throw new Error('Notification app id is required');
  }

  return {
    async list(listOptions = {}) {
      const client = options.getClient();
      const page = listOptions.page ?? DEFAULT_PAGE;
      const pageSize = listOptions.pageSize ?? DEFAULT_PAGE_SIZE;
      const response = await client.http.get<NotificationPageResponse>(
        appApiPath('/notification/notifications'),
        {
          page,
          page_size: pageSize,
          app_id: appId,
          include_archived: listOptions.includeArchived ?? false,
        },
      );
      const rawItems = Array.isArray(response.items) ? response.items : [];
      return {
        items: rawItems.map((item) => mapNotificationItem(item)),
        page,
        pageSize,
        total: response.pageInfo?.total,
      };
    },
    async acknowledge(notificationId: string) {
      const client = options.getClient();
      await client.http.post(
        appApiPath(`/notification/notifications/${encodeURIComponent(notificationId)}/acknowledge`),
        {},
        { app_id: appId },
      );
    },
    async acknowledgeAll(notificationIds: string[]) {
      const uniqueIds = [...new Set(notificationIds.filter((id) => id.trim()))];
      if (uniqueIds.length === 0) {
        return;
      }
      await Promise.all(uniqueIds.map((id) => this.acknowledge(id)));
    },
  };
}

function mapNotificationItem(value: unknown): AppstoreNotificationItem {
  const record = asRecord(value);
  return {
    id: readRecordString(record, 'id'),
    appId: readRecordString(record, 'appId', 'app_id'),
    title: readRecordString(record, 'title'),
    desc: readRecordString(record, 'desc'),
    content: readRecordString(record, 'content'),
    time: readRecordString(record, 'time', 'createdAt', 'created_at'),
    type: readNotificationType(record),
    read: readRecordBoolean(record, 'read'),
    archived: readRecordBoolean(record, 'archived'),
    actionUrl: readRecordString(record, 'actionUrl', 'action_url') || null,
  };
}

function readNotificationType(record: Record<string, unknown>): AppstoreNotificationType {
  const value = readRecordString(record, 'type');
  if (value === 'alert' || value === 'info' || value === 'system' || value === 'warning') {
    return value;
  }
  return 'info';
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function readRecordString(record: Record<string, unknown>, ...keys: string[]): string {
  const values = keys.map((key) => {
    const value = record[key];
    return typeof value === 'string' ? value : undefined;
  });
  return coalesce(...values) ?? '';
}

function readRecordBoolean(record: Record<string, unknown>, ...keys: string[]): boolean {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'boolean') {
      return value;
    }
  }
  return false;
}
