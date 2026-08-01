export interface AppstorePcSessionPort<TSnapshot = unknown> {
  clearSession(): void;
  getSnapshot(): TSnapshot;
}
