export interface SdkWorkApiResponse<T = unknown> {
  code: 0;
  data: T;
  traceId: string;
}

export interface SdkWorkResourceData<T = unknown> {
  item: T;
}

export interface SdkWorkPageData<T = unknown> {
  items: T[];
  pageInfo: {
    mode: 'offset' | 'cursor';
    page?: number;
    pageSize?: number;
    totalItems?: string;
    totalPages?: number;
    nextCursor?: string | null;
    hasMore?: boolean;
  };
}

export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  code: number;
  traceId: string;
  detail?: string;
  instance?: string;
}

export interface CursorPagination {
  cursor?: string;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface MediaResource {
  id: string;
  kind: string;
  url?: string;
  driveNodeId?: string;
}

export type PricingModel = 'FREE' | 'PAID' | 'FREEMIUM' | 'SUBSCRIPTION';

export type ListingStatus = 'draft' | 'active' | 'delisted' | 'suspended' | 'deleted';

export type StorefrontVisibility = 'visible' | 'hidden' | 'featured';

export type ReviewStatus = 'not_submitted' | 'pending' | 'in_review' | 'approved' | 'rejected';

export type ReleaseStatus = 'draft' | 'submitted' | 'approved' | 'published' | 'archived';

export type PublisherStatus = 'pending' | 'active' | 'suspended';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type SdkWorkResultCode =
  | 0
  | 40001
  | 40101
  | 40401
  | 50001;

/** @deprecated Use SdkWorkApiResponse — legacy alias removed from wire format. */
export type StoreApiResult<T = unknown> = SdkWorkApiResponse<SdkWorkResourceData<T>>;
