import type { SdkworkClawrouterAppDomainsClient } from '@sdkwork/clawrouter-app-sdk/domains';
import { isCurrencyCode, trim, uuid } from '@sdkwork/utils';

type CatalogProductSkuList =
  SdkworkClawrouterAppDomainsClient['catalog']['products']['skus']['list'];
type CheckoutSessionCreate =
  SdkworkClawrouterAppDomainsClient['order']['checkout']['sessions']['create'];
type CheckoutQuoteCreate =
  SdkworkClawrouterAppDomainsClient['order']['checkout']['sessions']['quotes']['create'];

export interface PaidCheckoutClient {
  readonly catalog: {
    readonly products: {
      readonly skus: {
        readonly list: CatalogProductSkuList;
      };
    };
  };
  readonly order: {
    readonly checkout: {
      readonly sessions: {
        readonly create: CheckoutSessionCreate;
        readonly quotes: {
          readonly create: CheckoutQuoteCreate;
        };
      };
    };
  };
}

export type PaidCheckoutStatus = 'ready' | 'unavailable' | 'error';

export interface PaidCheckoutResult {
  status: PaidCheckoutStatus;
  message: string;
  checkoutSessionId?: string;
}

export interface PaidListingCheckoutContext {
  commerceProductId?: string;
}

export async function beginPaidListingCheckout(
  getClient: () => PaidCheckoutClient,
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
    const skuPage = await client.catalog.products.skus.list(commerceProductId, {
      page: 1,
      pageSize: 2,
    });
    const sku = requireSinglePurchasableSku(skuPage);
    const currencyCode = trim(sku.currencyCode);
    const session = await client.order.checkout.sessions.create(
      {
        items: [{ skuId: sku.id, quantity: '1' }],
        currencyCode,
      },
      { idempotencyKey: uuid() },
    );
    const checkoutSessionId = trim(session.checkoutSessionId);
    if (!checkoutSessionId) {
      throw new Error('结算服务返回了无效的结算会话。');
    }
    requireMatchingCurrency(session.currencyCode, currencyCode, '结算会话');

    const quote = await client.order.checkout.sessions.quotes.create(
      checkoutSessionId,
      { idempotencyKey: uuid() },
    );
    if (trim(quote.checkoutSessionId) !== checkoutSessionId) {
      throw new Error('结算报价与结算会话不一致。');
    }
    requireMatchingCurrency(quote.currencyCode, currencyCode, '结算报价');

    return {
      status: 'ready',
      message: '结算报价已生成，正在前往结算。',
      checkoutSessionId,
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : '结算服务暂不可用，请稍后重试。',
    };
  }
}

type CatalogSkuPage = Awaited<ReturnType<CatalogProductSkuList>>;
type CatalogSku = CatalogSkuPage['items'][number];

function requireSinglePurchasableSku(page: CatalogSkuPage): CatalogSku {
  if (page.items.length === 0) {
    throw new Error('该商品没有可购买的 SKU。');
  }
  if (page.items.length !== 1 || page.pageInfo.hasMore || page.pageInfo.totalItems !== '1') {
    throw new Error('该商品包含多个 SKU，请先选择具体规格。');
  }

  const sku = page.items[0];
  if (trim(sku.status).toLowerCase() !== 'active') {
    throw new Error('该商品 SKU 当前不可购买。');
  }
  if (!trim(sku.id)) {
    throw new Error('该商品 SKU 缺少有效标识。');
  }

  const currencyCode = trim(sku.currencyCode);
  if (!isCurrencyCode(currencyCode)) {
    throw new Error('该商品 SKU 的币种配置无效。');
  }
  return sku;
}

function requireMatchingCurrency(actual: string, expected: string, source: string): void {
  if (trim(actual) !== expected) {
    throw new Error(`${source}币种与商品 SKU 不一致。`);
  }
}
