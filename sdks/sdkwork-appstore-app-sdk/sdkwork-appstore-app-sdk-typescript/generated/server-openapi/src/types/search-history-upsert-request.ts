export interface SearchHistoryUpsertRequest {
  queryText: string;
  filters?: Record<string, unknown>;
}
