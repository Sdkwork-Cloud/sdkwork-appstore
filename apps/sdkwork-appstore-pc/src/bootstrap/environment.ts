export interface EnvironmentConfig {
  environment: string;
  deploymentProfile: string;
  runtimeTarget: string;
}

export function loadEnvironment(): EnvironmentConfig {
  return {
    environment: import.meta.env.VITE_SDKWORK_ENVIRONMENT || 'development',
    deploymentProfile: import.meta.env.VITE_SDKWORK_DEPLOYMENT_PROFILE || 'standalone',
    runtimeTarget: import.meta.env.VITE_SDKWORK_RUNTIME_TARGET || 'browser'
  };
}
