import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { ListingCategoryBindRequest, ListingCreateRequest, ListingDetail, ListingLocalization, ListingLocalizationUpsertRequest, ListingMedia, ListingMediaAttachRequest, ListingSubmission, ListingSubmissionCreateRequest, ListingUpdateRequest, PageInfo, RegionalAvailabilityUpdateRequest, Release, SdkWorkPageData } from '../types';


export interface ListingsAppstoreListingsSubmissionsCreateParams {
  idempotencyKey: string;
}

export class ListingsAppstoreListingsSubmissionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Submit listing for review */
  async create(listingId: string, body: ListingSubmissionCreateRequest, params: ListingsAppstoreListingsSubmissionsCreateParams): Promise<ListingSubmission> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<ListingSubmission>(appApiPath(`/listings/${serializePathParameter(listingId, { name: 'listingId', style: 'simple', explode: false })}/submissions`), body, undefined, requestHeaders, 'application/json');
  }
}

export class ListingsAppstoreListingsEditorialApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve listing editorial content */
  async retrieve(listingId: string): Promise<Record<string, unknown>> {
    return this.client.get<Record<string, unknown>>(appApiPath(`/listings/${serializePathParameter(listingId, { name: 'listingId', style: 'simple', explode: false })}/editorial`));
  }
}

export interface ListingsAppstoreListingsDeveloperOtherListParams {
  cursor?: string;
  pageSize?: number;
}

export class ListingsAppstoreListingsDeveloperOtherApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List other listings from the same developer */
  async list(listingId: string, params?: ListingsAppstoreListingsDeveloperOtherListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(appApiPath(`/listings/${serializePathParameter(listingId, { name: 'listingId', style: 'simple', explode: false })}/developer_other`), query));
  }
}

export interface ListingsAppstoreListingsSimilarListParams {
  cursor?: string;
  pageSize?: number;
}

export class ListingsAppstoreListingsSimilarApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List similar listings */
  async list(listingId: string, params?: ListingsAppstoreListingsSimilarListParams): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SdkWorkPageData>(appendQueryString(appApiPath(`/listings/${serializePathParameter(listingId, { name: 'listingId', style: 'simple', explode: false })}/similar`), query));
  }
}

export interface ListingsAppstoreListingsReleasesHistoryListParams {
  cursor?: string;
  pageSize?: number;
}

export class ListingsAppstoreListingsReleasesHistoryApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List release history for listing */
  async list(listingId: string, params?: ListingsAppstoreListingsReleasesHistoryListParams): Promise<{ items: Release[]; pageInfo: PageInfo; }> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<{ items: Release[]; pageInfo: PageInfo; }>(appendQueryString(appApiPath(`/listings/${serializePathParameter(listingId, { name: 'listingId', style: 'simple', explode: false })}/releases/history`), query));
  }
}

export interface ListingsAppstoreListingsReleasesListParams {
  cursor?: string;
  pageSize?: number;
}

export class ListingsAppstoreListingsReleasesApi {
  private client: HttpClient;
  public readonly history: ListingsAppstoreListingsReleasesHistoryApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.history = new ListingsAppstoreListingsReleasesHistoryApi(client);
  }


/** List releases for listing */
  async list(listingId: string, params?: ListingsAppstoreListingsReleasesListParams): Promise<{ items: Release[]; pageInfo: PageInfo; }> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<{ items: Release[]; pageInfo: PageInfo; }>(appendQueryString(appApiPath(`/listings/${serializePathParameter(listingId, { name: 'listingId', style: 'simple', explode: false })}/releases`), query));
  }
}

export class ListingsAppstoreListingsRegionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Update regional availability */
  async update(listingId: string, body: RegionalAvailabilityUpdateRequest): Promise<SdkWorkPageData> {
    return this.client.put<SdkWorkPageData>(appApiPath(`/listings/${serializePathParameter(listingId, { name: 'listingId', style: 'simple', explode: false })}/regions`), body, undefined, undefined, 'application/json');
  }
}

export class ListingsAppstoreListingsCategoriesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Bind listing categories */
  async update(listingId: string, body: ListingCategoryBindRequest): Promise<SdkWorkPageData> {
    return this.client.put<SdkWorkPageData>(appApiPath(`/listings/${serializePathParameter(listingId, { name: 'listingId', style: 'simple', explode: false })}/categories`), body, undefined, undefined, 'application/json');
  }
}

export class ListingsAppstoreListingsMediaApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List listing media */
  async list(listingId: string): Promise<{ items: ListingMedia[]; pageInfo: PageInfo; }> {
    return this.client.get<{ items: ListingMedia[]; pageInfo: PageInfo; }>(appApiPath(`/listings/${serializePathParameter(listingId, { name: 'listingId', style: 'simple', explode: false })}/media`));
  }

/** Attach listing media */
  async create(listingId: string, body: ListingMediaAttachRequest): Promise<ListingMedia> {
    return this.client.post<ListingMedia>(appApiPath(`/listings/${serializePathParameter(listingId, { name: 'listingId', style: 'simple', explode: false })}/media`), body, undefined, undefined, 'application/json');
  }

/** Remove listing media */
  async delete(listingId: string, mediaId: string): Promise<void> {
    return this.client.delete<void>(appApiPath(`/listings/${serializePathParameter(listingId, { name: 'listingId', style: 'simple', explode: false })}/media/${serializePathParameter(mediaId, { name: 'mediaId', style: 'simple', explode: false })}`));
  }
}

export class ListingsAppstoreListingsLocalizationApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Upsert listing localization */
  async update(listingId: string, locale: string, body: ListingLocalizationUpsertRequest): Promise<ListingLocalization> {
    return this.client.put<ListingLocalization>(appApiPath(`/listings/${serializePathParameter(listingId, { name: 'listingId', style: 'simple', explode: false })}/localizations/${serializePathParameter(locale, { name: 'locale', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export interface ListingsAppstoreListingsCreateParams {
  idempotencyKey: string;
}

export class ListingsAppstoreListingsApi {
  private client: HttpClient;
  public readonly localization: ListingsAppstoreListingsLocalizationApi;
  public readonly media: ListingsAppstoreListingsMediaApi;
  public readonly categories: ListingsAppstoreListingsCategoriesApi;
  public readonly regions: ListingsAppstoreListingsRegionsApi;
  public readonly releases: ListingsAppstoreListingsReleasesApi;
  public readonly similar: ListingsAppstoreListingsSimilarApi;
  public readonly developerOther: ListingsAppstoreListingsDeveloperOtherApi;
  public readonly editorial: ListingsAppstoreListingsEditorialApi;
  public readonly submissions: ListingsAppstoreListingsSubmissionsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.localization = new ListingsAppstoreListingsLocalizationApi(client);
    this.media = new ListingsAppstoreListingsMediaApi(client);
    this.categories = new ListingsAppstoreListingsCategoriesApi(client);
    this.regions = new ListingsAppstoreListingsRegionsApi(client);
    this.releases = new ListingsAppstoreListingsReleasesApi(client);
    this.similar = new ListingsAppstoreListingsSimilarApi(client);
    this.developerOther = new ListingsAppstoreListingsDeveloperOtherApi(client);
    this.editorial = new ListingsAppstoreListingsEditorialApi(client);
    this.submissions = new ListingsAppstoreListingsSubmissionsApi(client);
  }


/** Create listing for registered app */
  async create(body: ListingCreateRequest, params: ListingsAppstoreListingsCreateParams): Promise<ListingDetail> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<ListingDetail>(appApiPath(`/listings`), body, undefined, requestHeaders, 'application/json');
  }

/** Retrieve listing detail */
  async retrieve(listingId: string): Promise<ListingDetail> {
    return this.client.get<ListingDetail>(appApiPath(`/listings/${serializePathParameter(listingId, { name: 'listingId', style: 'simple', explode: false })}`));
  }

/** Update listing metadata */
  async update(listingId: string, body: ListingUpdateRequest): Promise<ListingDetail> {
    return this.client.patch<ListingDetail>(appApiPath(`/listings/${serializePathParameter(listingId, { name: 'listingId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export class ListingsAppstoreApi {

  public readonly listings: ListingsAppstoreListingsApi;

  constructor(client: HttpClient) {

    this.listings = new ListingsAppstoreListingsApi(client);
  }

}

export class ListingsApi {

  public readonly appstore: ListingsAppstoreApi;

  constructor(client: HttpClient) {

    this.appstore = new ListingsAppstoreApi(client);
  }

}

export function createListingsApi(client: HttpClient): ListingsApi {
  return new ListingsApi(client);
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
function buildRequestHeaders(
  headers: Record<string, HeaderParameterSpec | undefined>,
  cookies: Record<string, HeaderParameterSpec | undefined> = {},
): Record<string, string> | undefined {
  const requestHeaders: Record<string, string> = {};

  for (const [name, parameter] of Object.entries(headers)) {
    const serialized = serializeParameterValue(parameter);
    if (serialized !== undefined) {
      requestHeaders[name] = serialized;
    }
  }

  const cookieHeader = buildCookieHeader(cookies);
  if (cookieHeader) {
    requestHeaders.Cookie = requestHeaders.Cookie
      ? `${requestHeaders.Cookie}; ${cookieHeader}`
      : cookieHeader;
  }

  return Object.keys(requestHeaders).length > 0 ? requestHeaders : undefined;
}

interface HeaderParameterSpec {
  value: unknown;
  style: string;
  explode: boolean;
  contentType?: string;
}

function buildCookieHeader(cookies: Record<string, HeaderParameterSpec | undefined>): string | undefined {
  const pairs: string[] = [];
  for (const [name, parameter] of Object.entries(cookies)) {
    const serialized = serializeParameterValue(parameter);
    if (serialized !== undefined) {
      pairs.push(`${encodeURIComponent(name)}=${encodeURIComponent(serialized)}`);
    }
  }
  return pairs.length > 0 ? pairs.join('; ') : undefined;
}

function serializeParameterValue(parameter: HeaderParameterSpec | undefined): string | undefined {
  const value = parameter?.value;
  if (value === undefined || value === null) {
    return undefined;
  }
  if (parameter?.contentType) {
    return JSON.stringify(value);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map((item) => serializeHeaderPrimitive(item)).join(',');
  }
  if (typeof value === 'object' && value !== null) {
    return serializeHeaderObject(value as Record<string, unknown>, parameter?.explode === true);
  }
  return serializeHeaderPrimitive(value);
}

function serializeHeaderObject(value: Record<string, unknown>, explode: boolean): string {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (explode) {
    return entries.map(([key, entryValue]) => `${key}=${serializeHeaderPrimitive(entryValue)}`).join(',');
  }
  return entries.flatMap(([key, entryValue]) => [key, serializeHeaderPrimitive(entryValue)]).join(',');
}

function serializeHeaderPrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
}
