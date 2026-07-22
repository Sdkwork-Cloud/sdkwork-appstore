import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { CatalogChartSnapshot, CatalogCollection, CatalogFeaturedSlot, Category, HomeFeedData, ListingSummary, PageInfo, SdkWorkPageData, SearchHistoryUpsertRequest } from '../types';


export interface CatalogAppstoreCatalogSearchHistoryListParams {
  cursor?: string;
  pageSize?: number;
}

export class CatalogAppstoreCatalogSearchHistoryApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List search history */
  async list(params?: CatalogAppstoreCatalogSearchHistoryListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(appApiPath(`/appstore/catalog/search/history`), query));
  }

/** Upsert search history entry */
  async update(body: SearchHistoryUpsertRequest): Promise<unknown> {
    return this.client.put<unknown>(appApiPath(`/appstore/catalog/search/history`), body, undefined, undefined, 'application/json');
  }

/** Clear search history */
  async delete(): Promise<void> {
    return this.client.delete<void>(appApiPath(`/appstore/catalog/search/history`));
  }
}

export interface CatalogAppstoreCatalogSearchTrendingListParams {
  locale?: string;
  pageSize?: number;
}

export class CatalogAppstoreCatalogSearchTrendingApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List trending search terms */
  async list(params?: CatalogAppstoreCatalogSearchTrendingListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'locale', value: params?.locale, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(appApiPath(`/appstore/catalog/search/trending`), query));
  }
}

export interface CatalogAppstoreCatalogSearchSuggestionsListParams {
  q: string;
  locale?: string;
}

export class CatalogAppstoreCatalogSearchSuggestionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List search suggestions */
  async list(params: CatalogAppstoreCatalogSearchSuggestionsListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'q', value: params.q, style: 'form', explode: true, allowReserved: false },
      { name: 'locale', value: params.locale, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(appApiPath(`/appstore/catalog/search/suggestions`), query));
  }
}

export class CatalogAppstoreCatalogSearchApi {

  public readonly suggestions: CatalogAppstoreCatalogSearchSuggestionsApi;
  public readonly trending: CatalogAppstoreCatalogSearchTrendingApi;
  public readonly history: CatalogAppstoreCatalogSearchHistoryApi;

  constructor(client: HttpClient) {

    this.suggestions = new CatalogAppstoreCatalogSearchSuggestionsApi(client);
    this.trending = new CatalogAppstoreCatalogSearchTrendingApi(client);
    this.history = new CatalogAppstoreCatalogSearchHistoryApi(client);
  }

}

export interface CatalogAppstoreCatalogEventsListParams {
  cursor?: string;
  pageSize?: number;
  status?: string;
}

export class CatalogAppstoreCatalogEventsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List catalog events */
  async list(params?: CatalogAppstoreCatalogEventsListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(appApiPath(`/appstore/catalog/events`), query));
  }

/** Retrieve catalog event detail */
  async retrieve(eventId: string): Promise<Record<string, unknown>> {
    return this.client.get<Record<string, unknown>>(appApiPath(`/appstore/catalog/events/${serializePathParameter(eventId, { name: 'eventId', style: 'simple', explode: false })}`));
  }
}

export interface CatalogAppstoreCatalogRecentlyUpdatedListParams {
  cursor?: string;
  pageSize?: number;
  locale?: string;
}

export class CatalogAppstoreCatalogRecentlyUpdatedApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List recently updated listings */
  async list(params?: CatalogAppstoreCatalogRecentlyUpdatedListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'locale', value: params?.locale, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(appApiPath(`/appstore/catalog/recently_updated`), query));
  }
}

export interface CatalogAppstoreCatalogRecommendationsListParams {
  locale?: string;
  platform?: string;
  cursor?: string;
  pageSize?: number;
}

export class CatalogAppstoreCatalogRecommendationsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List recommended listings */
  async list(params?: CatalogAppstoreCatalogRecommendationsListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'locale', value: params?.locale, style: 'form', explode: true, allowReserved: false },
      { name: 'platform', value: params?.platform, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(appApiPath(`/appstore/catalog/recommendations`), query));
  }
}

export interface CatalogAppstoreCatalogListingsListParams {
  q?: string;
  categoryId?: string;
  cursor?: string;
  pageSize?: number;
}

export class CatalogAppstoreCatalogListingsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Search public listings */
  async list(params?: CatalogAppstoreCatalogListingsListParams): Promise<{ items: ListingSummary[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; }> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'categoryId', value: params?.categoryId, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<{ items: ListingSummary[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; }>(appendQueryString(appApiPath(`/appstore/catalog/listings/search`), query));
  }
}

export class CatalogAppstoreCatalogChartsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve chart rankings */
  async retrieve(chartCode: string): Promise<CatalogChartSnapshot> {
    return this.client.get<CatalogChartSnapshot>(appApiPath(`/appstore/catalog/charts/${serializePathParameter(chartCode, { name: 'chartCode', style: 'simple', explode: false })}`));
  }
}

export class CatalogAppstoreCatalogFeaturedApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List featured placements */
  async list(): Promise<{ items: CatalogFeaturedSlot[]; pageInfo: PageInfo; }> {
    return this.client.get<{ items: CatalogFeaturedSlot[]; pageInfo: PageInfo; }>(appApiPath(`/appstore/catalog/featured`));
  }
}

export interface CatalogAppstoreCatalogCollectionsListParams {
  cursor?: string;
  pageSize?: number;
}

export class CatalogAppstoreCatalogCollectionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List editorial collections */
  async list(params?: CatalogAppstoreCatalogCollectionsListParams): Promise<{ items: CatalogCollection[]; pageInfo: PageInfo; }> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<{ items: CatalogCollection[]; pageInfo: PageInfo; }>(appendQueryString(appApiPath(`/appstore/catalog/collections`), query));
  }

/** Retrieve collection detail */
  async retrieve(collectionId: string): Promise<CatalogCollection> {
    return this.client.get<CatalogCollection>(appApiPath(`/appstore/catalog/collections/${serializePathParameter(collectionId, { name: 'collectionId', style: 'simple', explode: false })}`));
  }
}

export interface CatalogAppstoreCatalogCategoriesListParams {
  cursor?: string;
  pageSize?: number;
  locale?: string;
}

export class CatalogAppstoreCatalogCategoriesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List store categories */
  async list(params?: CatalogAppstoreCatalogCategoriesListParams): Promise<{ items: Category[]; pageInfo: PageInfo; }> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'locale', value: params?.locale, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<{ items: Category[]; pageInfo: PageInfo; }>(appendQueryString(appApiPath(`/appstore/catalog/categories`), query));
  }

/** Retrieve category detail */
  async retrieve(categoryId: string): Promise<Category> {
    return this.client.get<Category>(appApiPath(`/appstore/catalog/categories/${serializePathParameter(categoryId, { name: 'categoryId', style: 'simple', explode: false })}`));
  }
}

export class CatalogAppstoreCatalogHomeApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve storefront home feed */
  async retrieve(): Promise<HomeFeedData> {
    return this.client.get<HomeFeedData>(appApiPath(`/appstore/catalog/home`));
  }
}

export class CatalogAppstoreCatalogApi {

  public readonly home: CatalogAppstoreCatalogHomeApi;
  public readonly categories: CatalogAppstoreCatalogCategoriesApi;
  public readonly collections: CatalogAppstoreCatalogCollectionsApi;
  public readonly featured: CatalogAppstoreCatalogFeaturedApi;
  public readonly charts: CatalogAppstoreCatalogChartsApi;
  public readonly listings: CatalogAppstoreCatalogListingsApi;
  public readonly recommendations: CatalogAppstoreCatalogRecommendationsApi;
  public readonly recentlyUpdated: CatalogAppstoreCatalogRecentlyUpdatedApi;
  public readonly events: CatalogAppstoreCatalogEventsApi;
  public readonly search: CatalogAppstoreCatalogSearchApi;

  constructor(client: HttpClient) {

    this.home = new CatalogAppstoreCatalogHomeApi(client);
    this.categories = new CatalogAppstoreCatalogCategoriesApi(client);
    this.collections = new CatalogAppstoreCatalogCollectionsApi(client);
    this.featured = new CatalogAppstoreCatalogFeaturedApi(client);
    this.charts = new CatalogAppstoreCatalogChartsApi(client);
    this.listings = new CatalogAppstoreCatalogListingsApi(client);
    this.recommendations = new CatalogAppstoreCatalogRecommendationsApi(client);
    this.recentlyUpdated = new CatalogAppstoreCatalogRecentlyUpdatedApi(client);
    this.events = new CatalogAppstoreCatalogEventsApi(client);
    this.search = new CatalogAppstoreCatalogSearchApi(client);
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
interface QueryParameterSpec {
  name: string;
  value: unknown;
  style: string;
  explode: boolean;
  allowReserved: boolean;
  contentType?: string;
}

function buildQueryString(parameters: QueryParameterSpec[]): string {
  const pairs: string[] = [];
  for (const parameter of parameters) {
    appendSerializedParameter(pairs, parameter);
  }
  return pairs.join('&');
}

function appendSerializedParameter(pairs: string[], parameter: QueryParameterSpec): void {
  if (parameter.value === undefined || parameter.value === null) {
    return;
  }

  if (parameter.contentType) {
    pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(JSON.stringify(parameter.value), parameter.allowReserved)}`);
    return;
  }

  const style = parameter.style || 'form';
  if (style === 'deepObject') {
    appendDeepObjectParameter(pairs, parameter.name, parameter.value, parameter.allowReserved);
    return;
  }

  if (Array.isArray(parameter.value)) {
    appendArrayParameter(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }

  if (typeof parameter.value === 'object') {
    appendObjectParameter(pairs, parameter.name, parameter.value as Record<string, unknown>, style, parameter.explode, parameter.allowReserved);
    return;
  }

  pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(serializePrimitive(parameter.value), parameter.allowReserved)}`);
}

function appendArrayParameter(
  pairs: string[],
  name: string,
  value: unknown[],
  style: string,
  explode: boolean,
  allowReserved: boolean,
): void {
  const values = value
    .filter((item) => item !== undefined && item !== null)
    .map((item) => serializePrimitive(item));
  if (values.length === 0) {
    return;
  }

  if (style === 'form' && explode) {
    for (const item of values) {
      pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(item, allowReserved)}`);
    }
    return;
  }

  pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(values.join(','), allowReserved)}`);
}

function appendObjectParameter(
  pairs: string[],
  name: string,
  value: Record<string, unknown>,
  style: string,
  explode: boolean,
  allowReserved: boolean,
): void {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (entries.length === 0) {
    return;
  }

  if (style === 'form' && explode) {
    for (const [key, entryValue] of entries) {
      pairs.push(`${encodeQueryComponent(key)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
    }
    return;
  }

  const serialized = entries.flatMap(([key, entryValue]) => [key, serializePrimitive(entryValue)]).join(',');
  pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serialized, allowReserved)}`);
}

function appendDeepObjectParameter(
  pairs: string[],
  name: string,
  value: unknown,
  allowReserved: boolean,
): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serializePrimitive(value), allowReserved)}`);
    return;
  }

  for (const [key, entryValue] of Object.entries(value as Record<string, unknown>)) {
    if (entryValue === undefined || entryValue === null) {
      continue;
    }
    pairs.push(`${encodeQueryComponent(`${name}[${key}]`)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
  }
}

function serializePrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

function encodeQueryComponent(value: string): string {
  return encodeURIComponent(value);
}

function encodeQueryValue(value: string, allowReserved: boolean): string {
  const encoded = encodeURIComponent(value);
  if (!allowReserved) {
    return encoded;
  }
  return encoded.replace(/%3A/gi, ':')
    .replace(/%2F/gi, '/')
    .replace(/%3F/gi, '?')
    .replace(/%23/gi, '#')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
    .replace(/%40/gi, '@')
    .replace(/%21/gi, '!')
    .replace(/%24/gi, '$')
    .replace(/%26/gi, '&')
    .replace(/%27/gi, "'")
    .replace(/%28/gi, '(')
    .replace(/%29/gi, ')')
    .replace(/%2A/gi, '*')
    .replace(/%2B/gi, '+')
    .replace(/%2C/gi, ',')
    .replace(/%3B/gi, ';')
    .replace(/%3D/gi, '=');
}
