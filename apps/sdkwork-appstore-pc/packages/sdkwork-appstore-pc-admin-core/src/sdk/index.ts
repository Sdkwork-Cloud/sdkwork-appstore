export interface AppstorePcAdminSdkPort<TBackendClient = unknown> {
  readonly backend: TBackendClient;
}

export type AppstorePcAdminSdkPortFactory<TBackendClient = unknown> = () =>
  AppstorePcAdminSdkPort<TBackendClient>;

export { createAppstorePcAdminBackendClient } from './backendClient';
