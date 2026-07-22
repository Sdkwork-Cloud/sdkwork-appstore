export interface ModerationDecisionCreateRequest {
  decisionType: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES';
  decisionStatus: string;
  reasonCode?: string;
  reasonDetail?: string;
  policyReference?: string;
}
