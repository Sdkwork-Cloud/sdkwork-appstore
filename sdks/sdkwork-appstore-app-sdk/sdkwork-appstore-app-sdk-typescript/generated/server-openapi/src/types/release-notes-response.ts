import type { ReleaseNoteLocalization } from './release-note-localization';

export interface ReleaseNotesResponse {
  code: 0;
  data: unknown & { item: ReleaseNoteLocalization; };
  /** Server-owned request correlation id. */
  traceId: string;
}
