import manifest from '../../sdkwork.app.config.json';

export type AppstorePcEnvironment = 'development' | 'test' | 'staging' | 'production';
export type AppstorePcDeploymentProfile = 'cloud' | 'standalone';
export type AppstorePcRuntimeTarget = 'browser' | 'desktop';

export interface AppstorePcRuntimeConfig {
  agentsAppApiBaseUrl: string;
  aiPreviewAgentId?: string;
  appApiBaseUrl: string;
  appDisplayName: string;
  appKey: string;
  backendApiBaseUrl: string;
  deploymentProfile: AppstorePcDeploymentProfile;
  environment: AppstorePcEnvironment;
  iamAppApiBaseUrl: string;
  locale: string;
  mcpAppApiBaseUrl: string;
  runtimeTarget: AppstorePcRuntimeTarget;
  skillsAppApiBaseUrl: string;
}

const environmentAliases: Record<string, AppstorePcEnvironment> = {
  dev: 'development',
  development: 'development',
  prod: 'production',
  production: 'production',
  staging: 'staging',
  test: 'test',
};

function readEnv(key: string): string | undefined {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function resolveEnvironment(mode: string): AppstorePcEnvironment {
  return environmentAliases[mode] ?? 'development';
}

export function resolveAppstorePcRuntimeConfig(
  mode = import.meta.env.MODE,
): AppstorePcRuntimeConfig {
  const environment = resolveEnvironment(readEnv('VITE_SDKWORK_ENVIRONMENT') ?? mode);
  const deploymentProfile =
    readEnv('VITE_SDKWORK_DEPLOYMENT_PROFILE') === 'cloud' ? 'cloud' : 'standalone';
  const runtimeTarget =
    readEnv('VITE_SDKWORK_RUNTIME_TARGET') === 'desktop' ? 'desktop' : 'browser';
  const applicationPublicUrl =
    readEnv('VITE_SDKWORK_APPSTORE_APPLICATION_PUBLIC_HTTP_URL') ??
    readEnv('VITE_SDKWORK_APPSTORE_APP_API_BASE_URL') ??
    resolveBrowserOrigin();
  const platformApiGatewayUrl =
    readEnv('VITE_SDKWORK_APPSTORE_PLATFORM_API_GATEWAY_HTTP_URL') ??
    readEnv('VITE_SDKWORK_IAM_APP_API_BASE_URL') ??
    applicationPublicUrl;

  return {
    agentsAppApiBaseUrl:
      readEnv('VITE_SDKWORK_AGENTS_APP_API_BASE_URL') ?? platformApiGatewayUrl,
    aiPreviewAgentId: readEnv('VITE_SDKWORK_APPSTORE_AI_PREVIEW_AGENT_ID'),
    appApiBaseUrl: applicationPublicUrl,
    appDisplayName: manifest.app.displayName,
    appKey: manifest.app.key,
    backendApiBaseUrl:
      readEnv('VITE_SDKWORK_APPSTORE_BACKEND_API_BASE_URL') ?? applicationPublicUrl,
    deploymentProfile,
    environment,
    iamAppApiBaseUrl: platformApiGatewayUrl,
    locale: readEnv('VITE_SDKWORK_APPSTORE_DEFAULT_LOCALE') ?? 'zh-CN',
    mcpAppApiBaseUrl:
      readEnv('VITE_SDKWORK_MCP_APP_API_BASE_URL') ?? platformApiGatewayUrl,
    runtimeTarget,
    skillsAppApiBaseUrl:
      readEnv('VITE_SDKWORK_SKILLS_APP_API_BASE_URL') ?? platformApiGatewayUrl,
  };
}

function resolveBrowserOrigin(): string {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }
  return '/';
}
