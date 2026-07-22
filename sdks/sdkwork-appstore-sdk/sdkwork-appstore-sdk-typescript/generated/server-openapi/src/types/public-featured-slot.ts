export interface PublicFeaturedSlot {
  id: string;
  slotCode: string;
  listingId: string;
  status: string;
  platformScope: string;
  regionScope?: string[];
  startsAt: string;
  endsAt: string;
}
