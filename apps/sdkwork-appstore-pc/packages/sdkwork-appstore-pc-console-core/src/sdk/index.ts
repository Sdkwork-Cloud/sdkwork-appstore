export interface AppstorePcConsoleSdkPort<TAppClients = unknown> {
  readonly app: TAppClients;
}

export type AppstorePcConsoleSdkPortFactory<TAppClients = unknown> = () =>
  AppstorePcConsoleSdkPort<TAppClients>;
