export interface PublisherVerificationSubmitRequest {
  verificationType: string;
  credentialSnapshot?: Record<string, unknown>;
  evidenceMediaResourceId?: string;
}
