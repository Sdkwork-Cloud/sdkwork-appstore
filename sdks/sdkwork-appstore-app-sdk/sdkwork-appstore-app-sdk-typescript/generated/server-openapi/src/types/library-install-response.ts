import type { LibraryInstallResult } from './library-install-result';

export interface LibraryInstallResponse {
  code: 0;
  data: unknown & { item: LibraryInstallResult; };
  /** Server-owned request correlation id. */
  traceId: string;
}
