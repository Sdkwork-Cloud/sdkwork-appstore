export interface AppConfig {
  environment: string;
  deploymentProfile: string;
  runtimeTarget: string;
}

export const defaultConfig: AppConfig = {
  environment: 'development',
  deploymentProfile: 'standalone',
  runtimeTarget: 'browser'
};
