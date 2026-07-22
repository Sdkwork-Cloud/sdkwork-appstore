export interface Publisher {
  id: string;
  publisherNo: string;
  publisherType: string;
  displayName: string;
  legalName?: string;
  status: string;
  verificationStatus: string;
  websiteUrl?: string;
  supportEmail?: string;
  logoMediaResourceId?: string;
  ownerUserId: string;
  verifiedAt?: string;
}
