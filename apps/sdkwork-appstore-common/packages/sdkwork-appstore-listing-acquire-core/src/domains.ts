import { createClient, type SdkworkAppClient } from '@sdkwork/cloudrouter-app-sdk';
import type { SdkworkAppConfig } from '@sdkwork/cloudrouter-app-sdk';

/**
 * Typed Catalog and Order domain surfaces used by paid acquisition.
 *
 * The cloudrouter app SDK does not yet expose these domain endpoints, so the
 * contract is owned here (see repository README) and backed by the cloudrouter
 * HTTP client. Endpoints follow the sdkwork app API path convention.
 */

export type DomainsClientConfig = SdkworkAppConfig;

export interface CatalogSku {
  id: string;
  status: string;
  currencyCode: string;
}

export interface CatalogSkuPage {
  items: CatalogSku[];
  pageInfo: {
    hasMore: boolean;
    totalItems: string;
  };
}

export interface CheckoutSessionCreateBody {
  items: { skuId: string; quantity: string }[];
  currencyCode: string;
}

export interface CheckoutSessionResult {
  checkoutSessionId: string;
  currencyCode: string;
}

export interface SdkworkCloudrouterAppDomainsClient {
  readonly catalog: {
    readonly products: {
      readonly skus: {
        readonly list: (
          productId: string,
          params?: { page?: number; pageSize?: number },
        ) => Promise<CatalogSkuPage>;
      };
    };
  };
  readonly order: {
    readonly checkout: {
      readonly sessions: {
        readonly create: (
          body: CheckoutSessionCreateBody,
          options?: { idempotencyKey?: string },
        ) => Promise<CheckoutSessionResult>;
        readonly quotes: {
          readonly create: (
            checkoutSessionId: string,
            options?: { idempotencyKey?: string },
          ) => Promise<CheckoutSessionResult>;
        };
      };
    };
  };
}

interface Envelope<T> {
  code?: number;
  data?: T;
}

function unwrapData<T>(response: unknown): T {
  if (response && typeof response === 'object' && 'data' in response) {
    const envelope = response as Envelope<T>;
    if (envelope.code === 0 || envelope.code === undefined) {
      return envelope.data as T;
    }
  }
  return response as T;
}

export function createDomainsClient(config: DomainsClientConfig): SdkworkCloudrouterAppDomainsClient {
  const client: SdkworkAppClient = createClient(config);

  return {
    catalog: {
      products: {
        skus: {
          async list(productId, params) {
            const page = await client.http.get<unknown>(
              `/catalog/products/${encodeURIComponent(productId)}/skus`,
              {
                page: params?.page ?? 1,
                page_size: params?.pageSize ?? 20,
              },
            );
            return unwrapData<CatalogSkuPage>(page);
          },
        },
      },
    },
    order: {
      checkout: {
        sessions: {
          async create(body, options) {
            const session = await client.http.post<unknown>(
              '/order/checkout/sessions',
              body,
              undefined,
              options?.idempotencyKey ? { 'Idempotency-Key': options.idempotencyKey } : undefined,
            );
            return unwrapData<CheckoutSessionResult>(session);
          },
          quotes: {
            async create(checkoutSessionId, options) {
              const quote = await client.http.post<unknown>(
                `/order/checkout/sessions/${encodeURIComponent(checkoutSessionId)}/quotes`,
                {},
                undefined,
                options?.idempotencyKey ? { 'Idempotency-Key': options.idempotencyKey } : undefined,
              );
              return unwrapData<CheckoutSessionResult>(quote);
            },
          },
        },
      },
    },
  };
}
