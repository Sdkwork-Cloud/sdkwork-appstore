export interface AppstorePcConsoleSessionPort<TContext = unknown> {
  getContext(): TContext | null;
}
