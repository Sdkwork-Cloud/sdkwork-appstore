import { McpServerItem } from '../../../../src/types';
import { mockMcpServers } from '../../../../src/data/aiStoreMock';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getSavedMcpServers = (): McpServerItem[] => {
  try {
    const saved = localStorage.getItem('sdkwork_mcp_servers_store');
    return saved ? JSON.parse(saved) : [...mockMcpServers];
  } catch {
    return [...mockMcpServers];
  }
};

const saveMcpServers = (list: McpServerItem[]) => {
  try {
    localStorage.setItem('sdkwork_mcp_servers_store', JSON.stringify(list));
  } catch {
    // ignore
  }
};

let mcpServersStore: McpServerItem[] = getSavedMcpServers();

export interface IMcpSDK {
  getMcpServers(query?: string): Promise<McpServerItem[]>;
  toggleConnectServer(id: string): Promise<{ connected: boolean; status: McpServerItem['status'] }>;
  addMcpServer(serverData: Partial<McpServerItem>): Promise<McpServerItem>;
  executeMcpTool(serverId: string, toolName: string, argsJson?: string): Promise<{ success: boolean; output: string; latencyMs: number }>;
  getMcpConfigSnippet(serverId: string): Promise<string>;
}

export const McpService: IMcpSDK = {
  getMcpServers: async (query: string = ''): Promise<McpServerItem[]> => {
    await delay(150);
    return mcpServersStore.filter((s) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.publisher.toLowerCase().includes(q)
      );
    });
  },

  toggleConnectServer: async (id: string): Promise<{ connected: boolean; status: McpServerItem['status'] }> => {
    await delay(200);
    const target = mcpServersStore.find((s) => s.id === id);
    if (target) {
      target.connected = !target.connected;
      target.status = target.connected ? 'active' : 'disconnected';
      saveMcpServers(mcpServersStore);
      return { connected: target.connected, status: target.status };
    }
    return { connected: false, status: 'disconnected' };
  },

  addMcpServer: async (serverData: Partial<McpServerItem>): Promise<McpServerItem> => {
    await delay(300);
    const newServer: McpServerItem = {
      id: `mcp-user-${Date.now()}`,
      name: serverData.name || '自定义 MCP 服务端',
      protocolVersion: '2024-11-05',
      transportType: serverData.transportType || 'stdio',
      publisher: serverData.publisher || '本地开发者',
      description: serverData.description || '用户扩展的 Model Context Protocol 服务',
      icon: serverData.icon || 'Server',
      iconColor: serverData.iconColor || 'bg-blue-600',
      connected: true,
      toolsProvided: serverData.toolsProvided && serverData.toolsProvided.length > 0 ? serverData.toolsProvided : ['query_custom_tool'],
      resourcesProvided: serverData.resourcesProvided && serverData.resourcesProvided.length > 0 ? serverData.resourcesProvided : ['mcp://custom/resource'],
      configSnippet: serverData.configSnippet || JSON.stringify({ mcpServers: { custom: { command: 'npx', args: ['-y', 'custom-mcp'] } } }, null, 2),
      status: 'active',
    };
    mcpServersStore.unshift(newServer);
    saveMcpServers(mcpServersStore);
    return newServer;
  },

  executeMcpTool: async (serverId: string, toolName: string, argsJson: string = '{}'): Promise<{ success: boolean; output: string; latencyMs: number }> => {
    await delay(450);
    const server = mcpServersStore.find((s) => s.id === serverId);
    let args = {};
    try {
      args = JSON.parse(argsJson);
    } catch {
      args = { input: argsJson };
    }

    return {
      success: true,
      output: JSON.stringify({
        mcpProtocol: '2024-11-05',
        server: server?.name || serverId,
        toolExecuted: toolName,
        arguments: args,
        result: {
          content: [
            {
              type: 'text',
              text: `[MCP Executed Successfully] Tool '${toolName}' executed with parameters. Transport: ${server?.transportType || 'stdio'}.`,
            },
          ],
        },
      }, null, 2),
      latencyMs: Math.floor(100 + Math.random() * 150),
    };
  },

  getMcpConfigSnippet: async (serverId: string): Promise<string> => {
    await delay(80);
    const server = mcpServersStore.find((s) => s.id === serverId);
    return server?.configSnippet || '{\n  "mcpServers": {}\n}';
  },
};
