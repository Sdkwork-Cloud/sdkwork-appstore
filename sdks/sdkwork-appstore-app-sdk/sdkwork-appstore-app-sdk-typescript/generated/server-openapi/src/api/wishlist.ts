import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { PageInfo, WishlistItem, WishlistItemAddRequest } from '../types';


export class WishlistAppstoreWishlistItemsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List wishlist items */
  async list(): Promise<{ items: WishlistItem[]; pageInfo: PageInfo; }> {
    return this.client.get<{ items: WishlistItem[]; pageInfo: PageInfo; }>(appApiPath(`/wishlist/items`));
  }

/** Add wishlist item */
  async create(body: WishlistItemAddRequest): Promise<WishlistItem> {
    return this.client.post<WishlistItem>(appApiPath(`/wishlist/items`), body, undefined, undefined, 'application/json');
  }

/** Remove wishlist item */
  async delete(listingId: string): Promise<void> {
    return this.client.delete<void>(appApiPath(`/wishlist/items/${serializePathParameter(listingId, { name: 'listingId', style: 'simple', explode: false })}`));
  }
}

export class WishlistAppstoreWishlistApi {

  public readonly items: WishlistAppstoreWishlistItemsApi;

  constructor(client: HttpClient) {

    this.items = new WishlistAppstoreWishlistItemsApi(client);
  }

}

export class WishlistAppstoreApi {

  public readonly wishlist: WishlistAppstoreWishlistApi;

  constructor(client: HttpClient) {

    this.wishlist = new WishlistAppstoreWishlistApi(client);
  }

}

export class WishlistApi {

  public readonly appstore: WishlistAppstoreApi;

  constructor(client: HttpClient) {

    this.appstore = new WishlistAppstoreApi(client);
  }

}

export function createWishlistApi(client: HttpClient): WishlistApi {
  return new WishlistApi(client);
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
