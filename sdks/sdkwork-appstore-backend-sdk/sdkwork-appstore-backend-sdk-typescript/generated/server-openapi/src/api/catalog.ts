import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AppstoreCatalogCollectionsItemsUpdateRequest, CategoryCreateRequest, CategoryUpdateRequest, CollectionCreateRequest, CollectionUpdateRequest, FeaturedSlotUpsertRequest } from '../types';


export class CatalogAppstoreCatalogCategoriesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create store category */
  async create(body: CategoryCreateRequest): Promise<Record<string, unknown>> {
    return this.client.post<Record<string, unknown>>(backendApiPath(`/appstore/catalog/categories`), body, undefined, undefined, 'application/json');
  }

/** Update store category */
  async update(categoryId: string, body: CategoryUpdateRequest): Promise<Record<string, unknown>> {
    return this.client.patch<Record<string, unknown>>(backendApiPath(`/appstore/catalog/categories/${serializePathParameter(categoryId, { name: 'categoryId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export class CatalogAppstoreCatalogFeaturedApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Upsert featured slot */
  async update(slotCode: string, body: FeaturedSlotUpsertRequest): Promise<Record<string, unknown>> {
    return this.client.put<Record<string, unknown>>(backendApiPath(`/appstore/catalog/featured/${serializePathParameter(slotCode, { name: 'slotCode', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export class CatalogAppstoreCatalogCollectionsItemsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Upsert collection items */
  async update(collectionId: string, body: AppstoreCatalogCollectionsItemsUpdateRequest): Promise<Record<string, unknown>> {
    return this.client.put<Record<string, unknown>>(backendApiPath(`/appstore/catalog/collections/${serializePathParameter(collectionId, { name: 'collectionId', style: 'simple', explode: false })}/items`), body, undefined, undefined, 'application/json');
  }
}

export class CatalogAppstoreCatalogCollectionsApi {
  private client: HttpClient;
  public readonly items: CatalogAppstoreCatalogCollectionsItemsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.items = new CatalogAppstoreCatalogCollectionsItemsApi(client);
  }


/** Create editorial collection */
  async create(body: CollectionCreateRequest): Promise<Record<string, unknown>> {
    return this.client.post<Record<string, unknown>>(backendApiPath(`/appstore/catalog/collections`), body, undefined, undefined, 'application/json');
  }

/** Update editorial collection */
  async update(collectionId: string, body: CollectionUpdateRequest): Promise<Record<string, unknown>> {
    return this.client.patch<Record<string, unknown>>(backendApiPath(`/appstore/catalog/collections/${serializePathParameter(collectionId, { name: 'collectionId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export class CatalogAppstoreCatalogApi {

  public readonly collections: CatalogAppstoreCatalogCollectionsApi;
  public readonly featured: CatalogAppstoreCatalogFeaturedApi;
  public readonly categories: CatalogAppstoreCatalogCategoriesApi;

  constructor(client: HttpClient) {

    this.collections = new CatalogAppstoreCatalogCollectionsApi(client);
    this.featured = new CatalogAppstoreCatalogFeaturedApi(client);
    this.categories = new CatalogAppstoreCatalogCategoriesApi(client);
  }

}

export class CatalogAppstoreApi {

  public readonly catalog: CatalogAppstoreCatalogApi;

  constructor(client: HttpClient) {

    this.catalog = new CatalogAppstoreCatalogApi(client);
  }

}

export class CatalogApi {

  public readonly appstore: CatalogAppstoreApi;

  constructor(client: HttpClient) {

    this.appstore = new CatalogAppstoreApi(client);
  }

}

export function createCatalogApi(client: HttpClient): CatalogApi {
  return new CatalogApi(client);
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
