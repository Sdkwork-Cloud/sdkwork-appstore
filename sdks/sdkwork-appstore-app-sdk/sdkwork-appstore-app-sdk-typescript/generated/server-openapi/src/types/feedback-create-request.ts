export interface FeedbackCreateRequest {
  type: string;
  content: string;
  contact?: string;
  listingId?: string;
  appKey?: string;
}
