export interface ListingMedia {
  id: string;
  mediaRole: string;
  mediaResourceId: string;
  driveNodeId?: string;
  platformScope: string;
  sortOrder: number;
  locale?: string;
}
