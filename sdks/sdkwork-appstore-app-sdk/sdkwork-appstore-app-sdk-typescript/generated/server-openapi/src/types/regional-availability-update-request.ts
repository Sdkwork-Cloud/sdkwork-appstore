export interface RegionalAvailabilityUpdateRequest {
  regions: { regionCode: string; availabilityStatus: string; }[];
}
