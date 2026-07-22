import { describe, expect, it, vi } from 'vitest';

import {
  beginPaidListingCheckout,
  type PaidCheckoutClient,
} from './checkout';

type SkuPage = Awaited<
  ReturnType<PaidCheckoutClient['catalog']['products']['skus']['list']>
>;
type SkuList = PaidCheckoutClient['catalog']['products']['skus']['list'];
type CheckoutSessionCreate = PaidCheckoutClient['order']['checkout']['sessions']['create'];
type CheckoutQuoteCreate =
  PaidCheckoutClient['order']['checkout']['sessions']['quotes']['create'];
type CheckoutSession = Awaited<
  ReturnType<PaidCheckoutClient['order']['checkout']['sessions']['create']>
>;
type CheckoutQuote = Awaited<
  ReturnType<PaidCheckoutClient['order']['checkout']['sessions']['quotes']['create']>
>;

const activeSku: SkuPage['items'][number] = {
  id: 'sku-1',
  spuId: 'product-1',
  skuNo: 'APP-PRO',
  name: 'Professional',
  title: 'Professional',
  priceAmount: '19.99',
  currencyCode: 'USD',
  fulfillmentType: 'digital',
  inventoryTracking: 'none',
  status: 'active',
  createdAt: '2026-07-22T00:00:00Z',
  updatedAt: '2026-07-22T00:00:00Z',
};

const checkoutSession: CheckoutSession = {
  checkoutSessionId: 'checkout-session-1',
  status: 'draft',
  currencyCode: 'USD',
  originalAmount: '19.99',
  discountAmount: '0.00',
  payableAmount: '19.99',
};

const checkoutQuote: CheckoutQuote = {
  checkoutSessionId: checkoutSession.checkoutSessionId,
  quoteId: 'quote-1',
  currencyCode: 'USD',
  originalAmount: '19.99',
  discountAmount: '0.00',
  payableAmount: '19.99',
};

function skuPage(items: SkuPage['items'], totalItems = String(items.length)): SkuPage {
  return {
    items,
    pageInfo: {
      mode: 'offset',
      page: 1,
      pageSize: 2,
      totalItems,
      totalPages: items.length === 0 ? 0 : 1,
      hasMore: false,
    },
  };
}

function createClient(overrides?: {
  page?: SkuPage;
  session?: CheckoutSession;
  quote?: CheckoutQuote;
  quoteError?: Error;
}) {
  const list = vi.fn<SkuList>(async () => overrides?.page ?? skuPage([activeSku]));
  const createSession = vi.fn<CheckoutSessionCreate>(
    async () => overrides?.session ?? checkoutSession,
  );
  const createQuote = vi.fn<CheckoutQuoteCreate>(async () => {
    if (overrides?.quoteError) {
      throw overrides.quoteError;
    }
    return overrides?.quote ?? checkoutQuote;
  });
  const client: PaidCheckoutClient = {
    catalog: {
      products: {
        skus: { list },
      },
    },
    order: {
      checkout: {
        sessions: {
          create: createSession,
          quotes: { create: createQuote },
        },
      },
    },
  };
  return { client, list, createSession, createQuote };
}

describe('beginPaidListingCheckout', () => {
  it('returns unavailable without constructing a client when no product is configured', async () => {
    const getClient = vi.fn();

    const result = await beginPaidListingCheckout(getClient, {});

    expect(result.status).toBe('unavailable');
    expect(getClient).not.toHaveBeenCalled();
  });

  it('resolves the only active SKU and creates a typed session and quote', async () => {
    const { client, list, createSession, createQuote } = createClient();

    const result = await beginPaidListingCheckout(() => client, {
      commerceProductId: ' product-1 ',
    });

    expect(result).toMatchObject({
      status: 'ready',
      checkoutSessionId: checkoutSession.checkoutSessionId,
    });
    expect(list).toHaveBeenCalledWith('product-1', { page: 1, pageSize: 2 });
    expect(createSession).toHaveBeenCalledWith(
      {
        items: [{ skuId: activeSku.id, quantity: '1' }],
        currencyCode: activeSku.currencyCode,
      },
      { idempotencyKey: expect.stringMatching(/^[0-9a-f-]{36}$/i) },
    );
    expect(createQuote).toHaveBeenCalledWith(
      checkoutSession.checkoutSessionId,
      { idempotencyKey: expect.stringMatching(/^[0-9a-f-]{36}$/i) },
    );
    const sessionKey = createSession.mock.calls[0][1].idempotencyKey;
    const quoteKey = createQuote.mock.calls[0][1].idempotencyKey;
    expect(sessionKey).not.toBe(quoteKey);
  });

  it('rejects a product without a SKU', async () => {
    const { client, createSession } = createClient({ page: skuPage([]) });

    const result = await beginPaidListingCheckout(() => client, {
      commerceProductId: 'product-1',
    });

    expect(result).toMatchObject({ status: 'error', message: '该商品没有可购买的 SKU。' });
    expect(createSession).not.toHaveBeenCalled();
  });

  it('rejects a product with multiple SKUs until a variant is selected', async () => {
    const secondSku = { ...activeSku, id: 'sku-2', skuNo: 'APP-TEAM' };
    const { client, createSession } = createClient({
      page: skuPage([activeSku, secondSku]),
    });

    const result = await beginPaidListingCheckout(() => client, {
      commerceProductId: 'product-1',
    });

    expect(result.status).toBe('error');
    expect(createSession).not.toHaveBeenCalled();
  });

  it.each([
    [{ ...activeSku, status: 'archived' }, '该商品 SKU 当前不可购买。'],
    [{ ...activeSku, currencyCode: 'ZZZ' }, '该商品 SKU 的币种配置无效。'],
  ])('rejects a non-purchasable SKU', async (sku, message) => {
    const { client, createSession } = createClient({ page: skuPage([sku]) });

    const result = await beginPaidListingCheckout(() => client, {
      commerceProductId: 'product-1',
    });

    expect(result).toMatchObject({ status: 'error', message });
    expect(createSession).not.toHaveBeenCalled();
  });

  it('rejects a session whose currency differs from the SKU', async () => {
    const { client, createQuote } = createClient({
      session: { ...checkoutSession, currencyCode: 'CNY' },
    });

    const result = await beginPaidListingCheckout(() => client, {
      commerceProductId: 'product-1',
    });

    expect(result.status).toBe('error');
    expect(createQuote).not.toHaveBeenCalled();
  });

  it('does not report readiness when quote creation fails', async () => {
    const { client } = createClient({ quoteError: new Error('quote failed') });

    const result = await beginPaidListingCheckout(() => client, {
      commerceProductId: 'product-1',
    });

    expect(result).toEqual({ status: 'error', message: 'quote failed' });
  });
});
