export interface InstallEvent {
  id: string;
  eventNo: string;
  listingId: string;
  releaseId?: string;
  eventType: string;
  platform: string;
  occurredAt: string;
}
