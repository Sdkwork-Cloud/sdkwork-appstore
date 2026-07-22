export interface ComplianceProfile {
  id: string;
  listingId: string;
  complianceVersion: number;
  privacyNutrition: unknown;
  contentRatingQuestionnaire: unknown;
  dataSafety: unknown;
  targetAudience: unknown;
  complianceStatus: string;
  reviewedBy?: string;
  reviewedAt?: string;
}
