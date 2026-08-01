import {
  resolveAppstorePcRuntimeConfig,
  type AppstorePcRuntimeConfig,
} from './environment';
import { createAppstorePcIamRuntime, type AppstorePcIamRuntime } from './iamRuntime';
import {
  createAppstorePcSdkClients,
  type AppstorePcSdkClientInventory,
} from './sdkClients';
import { createAppstorePcSessionStore, type AppstorePcSessionStore } from './sessionStore';
import { createAppstorePcSessionTokenManager } from './sessionTokenManager';
import { configureAppstorePcAIHub } from './aiHub';
import { configureAppstorePcMcp } from './mcp';
import { configureAppstorePcSkills } from './skills';

export interface AppstorePcRuntime {
  config: AppstorePcRuntimeConfig;
  iamRuntime: AppstorePcIamRuntime;
  sdkClients: AppstorePcSdkClientInventory;
  session: AppstorePcSessionStore;
}

export function createAppstorePcRuntime(): AppstorePcRuntime {
  const config = resolveAppstorePcRuntimeConfig();
  const session = createAppstorePcSessionStore(
    typeof window === 'undefined' ? undefined : window.sessionStorage,
  );
  const tokenManager = createAppstorePcSessionTokenManager(session);
  const sdkClients = createAppstorePcSdkClients(config, tokenManager);
  const iamRuntime = createAppstorePcIamRuntime({
    config,
    sdkClients,
    session,
    tokenManager,
  });
  configureAppstorePcAIHub(sdkClients.agents, config.aiPreviewAgentId);
  configureAppstorePcSkills(sdkClients.skills);
  configureAppstorePcMcp(sdkClients.mcp);

  return { config, iamRuntime, sdkClients, session };
}
