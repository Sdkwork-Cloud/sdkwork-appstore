import type { PluginItem } from '../types';

export interface IPluginsSDK {
  getPlugins(category?: string, query?: string): Promise<PluginItem[]>;
  togglePlugin(id: string): Promise<boolean>;
  registerPlugin(pluginData: Partial<PluginItem>): Promise<PluginItem>;
  executePluginApi(pluginId: string, capability: string, paramsJson?: string): Promise<{ success: boolean; result: string; latencyMs: number }>;
  getPluginSchema(pluginId: string): Promise<string>;
}

export type PluginsServicePort = IPluginsSDK;

let pluginsPort: PluginsServicePort = createUnconfiguredPluginsPort();

/** Bind the real SDK-backed implementation during app bootstrap. */
export function configurePluginsServicePort(port: PluginsServicePort): void {
  pluginsPort = port;
}

export const PluginsService: IPluginsSDK = {
  getPlugins: (category = '全部', query = '') => pluginsPort.getPlugins(category, query),
  togglePlugin: (id) => pluginsPort.togglePlugin(id),
  registerPlugin: (pluginData) => pluginsPort.registerPlugin(pluginData),
  executePluginApi: (pluginId, capability, paramsJson = '{}') =>
    pluginsPort.executePluginApi(pluginId, capability, paramsJson),
  getPluginSchema: (pluginId) => pluginsPort.getPluginSchema(pluginId),
};

function createUnconfiguredPluginsPort(): PluginsServicePort {
  const unavailable = (): never => {
    throw new Error('The App Store plugins runtime is not configured.');
  };
  return {
    getPlugins: async () => unavailable(),
    togglePlugin: async () => unavailable(),
    registerPlugin: async () => unavailable(),
    executePluginApi: async () => unavailable(),
    getPluginSchema: async () => unavailable(),
  };
}
