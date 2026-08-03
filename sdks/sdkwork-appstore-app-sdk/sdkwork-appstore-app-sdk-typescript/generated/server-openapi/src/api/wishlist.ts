import { appApiPath } from './paths';
import type { ApiRequestOptions, HttpClient } from '../http/client';

import type { PageInfo, WishlistItem, WishlistItemAddRequest } from '../types';


export class WishlistAppstoreWishlistItemsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List wishlist items */
  async list(requestOptions?: ApiRequestOptions): Promise<{ items: WishlistItem[]; pageInfo: PageInfo; }> {
    return this.client.request<{ items: WishlistItem[]; pageInfo: PageInfo; }>(appApiPath(`/wishlist/items`), { signal: requestOptions?.signal, timeout: requestOptions?.timeout, method: 'GET' as any, sdkworkUnwrapKind: 'page' });
  }

/** Add wishlist item */
  async create(body: WishlistItemAddRequest, requestOptions?: ApiRequestOptions): Promise<WishlistItem> {
    return this.client.request<WishlistItem>(appApiPath(`/wishlist/items`), { signal: requestOptions?.signal, timeout: requestOptions?.timeout, method: 'POST' as any, body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
  }

/** Remove wishlist item */
  async delete(listingId: string, requestOptions?: ApiRequestOptions): Promise<void> {
    return this.client.request<void>(appApiPath(`/wishlist/items/${serializePathParameter(listingId, { name: 'listingId', style: 'simple', explode: false })}`), { signal: requestOptions?.signal, timeout: requestOptions?.timeout, method: 'DELETE' as any });
  }
}

export class WishlistAppstoreWishlistApi {
  private client: HttpClient;
  public readonly items: WishlistAppstoreWishlistItemsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.items = new WishlistAppstoreWishlistItemsApi(client);
  }

}

export class WishlistAppstoreApi {
  private client: HttpClient;
  public readonly wishlist: WishlistAppstoreWishlistApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.wishlist = new WishlistAppstoreWishlistApi(client);
  }

}

export class WishlistApi {
  private client: HttpClient;
  public readonly appstore: WishlistAppstoreApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.appstore = new WishlistAppstoreApi(client);
  }

}

export function createWishlistApi(client: HttpClient): WishlistApi {
  return new WishlistApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}

interface PathParameterSpec {
  name: string;
  style: string;
  explode: boolean;
}

function serializePathParameter(value: unknown, spec: PathParameterSpec): string {
  if (value === undefined || value === null) {
    return '';
  }

  const style = spec.style || 'simple';
  if (Array.isArray(value)) {
    return serializePathArray(spec.name, value, style, spec.explode);
  }
  if (typeof value === 'object') {
    return serializePathObject(spec.name, value as Record<string, unknown>, style, spec.explode);
  }
  return pathPrefix(spec.name, style, false) + encodePathValue(serializePathPrimitive(value));
}

function serializePathArray(name: string, values: unknown[], style: string, explode: boolean): string {
  const serialized = values
    .filter((item) => item !== undefined && item !== null)
    .map((item) => encodePathValue(serializePathPrimitive(item)));
  if (serialized.length === 0) {
    return pathPrefix(name, style, false);
  }
  if (style === 'matrix') {
    return explode
      ? serialized.map((item) => `;${name}=${item}`).join('')
      : `;${name}=${serialized.join(',')}`;
  }
  return pathPrefix(name, style, false) + serialized.join(explode ? '.' : ',');
}

function serializePathObject(name: string, value: Record<string, unknown>, style: string, explode: boolean): string {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (entries.length === 0) {
    return pathPrefix(name, style, true);
  }
  if (style === 'matrix') {
    return explode
      ? entries.map(([key, entryValue]) => `;${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join('')
      : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',')}`;
  }
  const serialized = explode
    ? entries.map(([key, entryValue]) => `${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join(style === 'label' ? '.' : ',')
    : entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',');
  return pathPrefix(name, style, true) + serialized;
}

function pathPrefix(name: string, style: string, _objectValue: boolean): string {
  if (style === 'label') return '.';
  if (style === 'matrix') return `;${name}`;
  return '';
}

function encodePathValue(value: string): string {
  return encodeURIComponent(value);
}

function serializePathPrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
