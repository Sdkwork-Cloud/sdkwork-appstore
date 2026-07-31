import { PluginItem } from '../../../../src/types';
import { mockPlugins } from '../../../../src/data/aiStoreMock';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getSavedPlugins = (): PluginItem[] => {
  try {
    const saved = localStorage.getItem('sdkwork_plugins_store');
    return saved ? JSON.parse(saved) : [...mockPlugins];
  } catch {
    return [...mockPlugins];
  }
};

const savePlugins = (list: PluginItem[]) => {
  try {
    localStorage.setItem('sdkwork_plugins_store', JSON.stringify(list));
  } catch {
    // ignore
  }
};

let pluginsStore: PluginItem[] = getSavedPlugins();

export interface IPluginsSDK {
  getPlugins(category?: string, query?: string): Promise<PluginItem[]>;
  togglePlugin(id: string): Promise<boolean>;
  registerPlugin(pluginData: Partial<PluginItem>): Promise<PluginItem>;
  executePluginApi(pluginId: string, capability: string, paramsJson?: string): Promise<{ success: boolean; result: string; latencyMs: number }>;
  getPluginSchema(pluginId: string): Promise<string>;
}

export const PluginsService: IPluginsSDK = {
  getPlugins: async (category: string = '全部', query: string = ''): Promise<PluginItem[]> => {
    await delay(150);
    return pluginsStore.filter((p) => {
      const matchesCat = category === '全部' || p.category === category;
      const matchesQ =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.developer.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQ;
    });
  },

  togglePlugin: async (id: string): Promise<boolean> => {
    await delay(100);
    const target = pluginsStore.find((p) => p.id === id);
    if (target) {
      target.enabled = !target.enabled;
      savePlugins(pluginsStore);
      return target.enabled;
    }
    return false;
  },

  registerPlugin: async (pluginData: Partial<PluginItem>): Promise<PluginItem> => {
    await delay(300);
    const newPlugin: PluginItem = {
      id: `plug-user-${Date.now()}`,
      name: pluginData.name || '自定义扩展插件',
      version: pluginData.version || '1.0.0',
      developer: pluginData.developer || '独立开发者',
      category: pluginData.category || '代码与开发',
      description: pluginData.description || '用户自主上传与配置的 OpenAPI Schema 插件。',
      icon: pluginData.icon || 'Plug',
      iconColor: pluginData.iconColor || 'bg-blue-600',
      downloadsCount: 1,
      rating: 5.0,
      enabled: true,
      apiSchemaType: pluginData.apiSchemaType || 'OpenAPI',
      capabilities: pluginData.capabilities || ['自定义 API 调用', '数据加工'],
      docUrl: pluginData.docUrl,
    };
    pluginsStore.unshift(newPlugin);
    savePlugins(pluginsStore);
    return newPlugin;
  },

  executePluginApi: async (pluginId: string, capability: string, paramsJson: string = '{}'): Promise<{ success: boolean; result: string; latencyMs: number }> => {
    await delay(400);
    const target = pluginsStore.find((p) => p.id === pluginId);
    let parsedParams = {};
    try {
      parsedParams = JSON.parse(paramsJson);
    } catch {
      parsedParams = { rawInput: paramsJson };
    }

    return {
      success: true,
      result: JSON.stringify({
        status: 200,
        plugin: target?.name || pluginId,
        executedAction: capability,
        paramsReceived: parsedParams,
        timestamp: new Date().toISOString(),
        payload: {
          data: '沙盒模式模拟执行成功',
          details: `已完成功能能力【${capability}】的协议解析与代理转发。`,
        },
      }, null, 2),
      latencyMs: Math.floor(80 + Math.random() * 120),
    };
  },

  getPluginSchema: async (pluginId: string): Promise<string> => {
    await delay(100);
    const target = pluginsStore.find((p) => p.id === pluginId);
    return JSON.stringify({
      openapi: '3.0.0',
      info: {
        title: target?.name || 'Plugin API',
        version: target?.version || '1.0.0',
        description: target?.description,
      },
      servers: [{ url: 'https://api.sdkwork.com/v1/plugins' }],
      paths: {
        '/execute': {
          post: {
            summary: `执行 ${target?.name} 常用能力`,
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      capability: { type: 'string', example: target?.capabilities[0] || 'run' },
                      query: { type: 'string' }
                    }
                  }
                }
              }
            },
            responses: {
              200: { description: 'Successful execution' }
            }
          }
        }
      }
    }, null, 2);
  },
};
