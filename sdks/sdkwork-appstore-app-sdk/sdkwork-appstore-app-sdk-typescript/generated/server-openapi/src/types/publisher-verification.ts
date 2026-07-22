export interface PublisherVerification {
  id: string;
  verificationType: string;
  verificationStatus: string;
  reviewedBy?: string;
  reviewedAt?: string;
  expiresAt?: string;
}
