export interface ListingSubmissionCreateRequest {
  submissionType: 'INITIAL' | 'METADATA' | 'RELEASE';
  releaseId?: string;
}
