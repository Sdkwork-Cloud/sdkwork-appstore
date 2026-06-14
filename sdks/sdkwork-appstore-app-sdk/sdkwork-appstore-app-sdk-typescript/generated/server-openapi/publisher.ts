import { StoreApiResult, PublisherStatus, VerificationStatus, PaginatedResponse } from './types';

export interface Publisher {
  id: string;
  publisherNo: string;
  publisherType: 'individual' | 'organization';
  displayName: string;
  legalName?: string;
  status: PublisherStatus;
  verificationStatus: VerificationStatus;
  websiteUrl?: string;
  supportEmail?: string;
  logoMediaResourceId?: string;
  ownerUserId: string;
  verifiedAt?: string;
}

export interface PublisherMember {
  id: string;
  userId: string;
  memberRole: 'owner' | 'admin' | 'member';
  memberStatus: 'invited' | 'active' | 'suspended' | 'removed';
  invitedBy?: string;
  joinedAt?: string;
}

export interface PublisherVerification {
  id: string;
  verificationType: string;
  verificationStatus: VerificationStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  expiresAt?: string;
}

export interface PublisherCreateRequest {
  displayName: string;
  legalName?: string;
  supportEmail?: string;
  websiteUrl?: string;
  publisherType?: string;
}

export interface PublisherUpdateRequest {
  displayName?: string;
  websiteUrl?: string;
  supportEmail?: string;
}

export interface PublisherMemberInviteRequest {
  userId: string;
  memberRole: string;
}

export interface PublisherVerificationSubmitRequest {
  verificationType: string;
  credentialSnapshot?: Record<string, unknown>;
  evidenceMediaResourceId?: string;
}

export type PublisherResponse = StoreApiResult<Publisher>;
export type PublisherMemberListResponse = StoreApiResult<PaginatedResponse<PublisherMember>>;
export type PublisherMemberResponse = StoreApiResult<PublisherMember>;
export type PublisherVerificationResponse = StoreApiResult<PublisherVerification>;
