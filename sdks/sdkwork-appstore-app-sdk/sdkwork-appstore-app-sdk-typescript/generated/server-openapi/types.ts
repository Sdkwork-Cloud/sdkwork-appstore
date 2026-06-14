export interface StoreApiResult<T = unknown> {
  success: boolean;
  code: string;
  message: string;
  data?: T;
}

export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
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

export type PublisherStatus = 'draft' | 'active' | 'suspended' | 'deleted';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'expired';

export type ReleaseStatus = 'draft' | 'submitted' | 'approved' | 'published' | 'retired';

export type ChannelStatus = 'active' | 'deprecated' | 'disabled';

export type SubmissionStatus = 'submitted' | 'under_review' | 'approved' | 'rejected' | 'withdrawn';
