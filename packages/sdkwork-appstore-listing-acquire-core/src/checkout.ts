import type { SdkworkClawrouterAppDomainsClient } from '@sdkwork/clawrouter-app-sdk/domains';
import { coalesce, trim } from '@sdkwork/utils';

export type PaidCheckoutStatus = 'ready' | 'pending' | 'unavailable' | 'error';

export interface PaidCheckoutResult {
  status: PaidCheckoutStatus;
  message: string;
  checkoutSessionId?: string;
}

export interface PaidListingCheckoutContext {
  listingId: string;
  displayName: string;
  commerceProductId?: string;
}

export async function beginPaidListingCheckout(
  getClient: () => SdkworkClawrouterAppDomainsClient,
  context: PaidListingCheckoutContext,
): Promise<PaidCheckoutResult> {
  const commerceProductId = trim(context.commerceProductId ?? '');
  if (!commerceProductId) {
    return {
      status: 'unavailable',
      message: '该应用尚未配置结算商品，暂无法购买。请联系开发者或稍后再试。',
    };
  }

  try {
    const client = getClient();
    const session = await client.checkout.sessions.create();
    const checkoutSessionId = readCheckoutSessionId(session);
    if (checkoutSessionId) {
      try {
        await client.checkout.sessions.quotes.create(checkoutSessionId);
      } catch {
        // Quote creation is best-effort until cart line binding is available on the wire.
      }
      return {
        status: 'ready',
        message: '正在前往结算…',
        checkoutSessionId,
      };
    }
    return {
      status: 'pending',
      message: '购买请求已提交。结算服务处理中，完成后可在「库」中查看该应用。',
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : '结算服务暂不可用，请稍后重试。',
    };
  }
}

function readCheckoutSessionId(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }
  const record = value as Record<string, unknown>;
  const direct = coalesce(
    readString(record.sessionId),
    readString(record.checkoutSessionId),
    readString(record.id),
  );
  if (direct) {
    return direct;
  }
  const item = record.item;
  if (item && typeof item === 'object') {
    const itemRecord = item as Record<string, unknown>;
    return coalesce(
      readString(itemRecord.sessionId),
      readString(itemRecord.checkoutSessionId),
      readString(itemRecord.id),
    );
  }
  return undefined;
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}
