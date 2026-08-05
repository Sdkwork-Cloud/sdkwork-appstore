import type { McpServerItem } from '../types';

export interface McpToolExecutionResult {
  latencyMs: number;
  output: string;
  success: boolean;
}

export interface IMcpSDK {
  addMcpServer(serverData: Partial<McpServerItem>): Promise<McpServerItem>;
  executeMcpTool(
    serverId: string,
    toolName: string,
    argsJson?: string,
  ): Promise<McpToolExecutionResult>;
  getMcpConfigSnippet(serverId: string): Promise<string>;
  getMcpServers(query?: string): Promise<McpServerItem[]>;
  toggleConnectServer(
    id: string,
  ): Promise<{ connected: boolean; status: McpServerItem['status'] }>;
}

export type McpServicePort = IMcpSDK;

let mcpPort: McpServicePort = createUnconfiguredMcpPort();

export function configureMcpServicePort(port: McpServicePort): void {
  mcpPort = port;
}

export const McpService: IMcpSDK = {
  addMcpServer: (serverData) => mcpPort.addMcpServer(serverData),
  executeMcpTool: (serverId, toolName, argsJson = '{}') =>
    mcpPort.executeMcpTool(serverId, toolName, argsJson),
  getMcpConfigSnippet: (serverId) => mcpPort.getMcpConfigSnippet(serverId),
  getMcpServers: (query = '') => mcpPort.getMcpServers(query),
  toggleConnectServer: (id) => mcpPort.toggleConnectServer(id),
};

function createUnconfiguredMcpPort(): McpServicePort {
  const unavailable = (): never => {
    throw new Error('The MCP app SDK runtime is not configured.');
  };
  return {
    addMcpServer: async () => unavailable(),
    executeMcpTool: async () => unavailable(),
    getMcpConfigSnippet: async () => unavailable(),
    getMcpServers: async () => unavailable(),
    toggleConnectServer: async () => unavailable(),
  };
}
