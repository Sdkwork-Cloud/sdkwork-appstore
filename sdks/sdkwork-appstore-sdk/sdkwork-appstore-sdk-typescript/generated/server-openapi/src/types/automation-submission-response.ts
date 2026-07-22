import type { AutomationSubmission } from './automation-submission';

export interface AutomationSubmissionResponse {
  code: 0;
  data: unknown & { item: AutomationSubmission; };
  /** Server-owned request correlation id. */
  traceId: string;
}
