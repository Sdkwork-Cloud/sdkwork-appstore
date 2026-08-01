import { AppItem } from '../../../../src/types';
import { mockApps } from '../../../../src/data/mock';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface AIModelInfo {
  id: string;
  name: string;
  provider: string;
  badge: string;
  description: string;
  isPopular?: boolean;
}

export interface AICompletionResult {
  response: string;
  modelUsed: string;
  tokenCount: number;
  latencyMs: number;
}

export interface IAIHubSDK {
  getAIApps(): Promise<AppItem[]>;
  getModels(): Promise<AIModelInfo[]>;
  getPromptPresets(): Promise<string[]>;
  generateCompletion(prompt: string, modelId?: string): Promise<AICompletionResult>;
}

export interface AICompletionPort {
  generateCompletion(prompt: string, modelId: string): Promise<AICompletionResult>;
}

let completionPort: AICompletionPort = {
  async generateCompletion(): Promise<AICompletionResult> {
    throw new Error('AI Hub completion runtime is not configured.');
  },
};

export function configureAICompletionPort(port: AICompletionPort): void {
  completionPort = port;
}

export const mockAIModels: AIModelInfo[] = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google AI Studio',
    badge: '官方推荐',
    description: '极速响应、多模态智能与卓越全能语言推理引擎',
    isPopular: true,
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google AI Studio',
    badge: '高阶推理',
    description: '200 万超长 Context Window 与复杂架构重构分析',
    isPopular: true,
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1',
    provider: 'DeepSeek AI',
    badge: '开源强推',
    description: '高算力推理与强算术代码生成引擎',
    isPopular: true,
  },
  {
    id: 'qwen-max-2026',
    name: '通义千问 Qwen-Max',
    provider: 'Alibaba Cloud',
    badge: '中文精选',
    description: '擅长中文长文理解与企业级知识问答',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    badge: '代码严谨',
    description: '前端设计与复杂架构重构首选模型',
  },
];

export const mockPromptPresets: string[] = [
  '推荐一款适合写代码和整理 PDF 论文的 AI 工具',
  '比较通义千问与 ima.copilot 的多端同步与知识库能力',
  '如何在本地沙盒环境高安全地运行 Python 分析脚本？',
  '总结 Model Context Protocol (MCP) 在智能体连接中的价值',
];

export const AIHubService: IAIHubSDK = {
  getAIApps: async (): Promise<AppItem[]> => {
    await delay(150);
    return mockApps.filter(
      (a) =>
        a.category === 'AI' ||
        a.category === 'AI 智能' ||
        a.id.includes('qwen') ||
        a.id.includes('ima') ||
        a.name.toLowerCase().includes('ai') ||
        a.description.toLowerCase().includes('ai')
    );
  },

  getModels: async (): Promise<AIModelInfo[]> => {
    await delay(100);
    return mockAIModels;
  },

  getPromptPresets: async (): Promise<string[]> => {
    await delay(80);
    return mockPromptPresets;
  },

  generateCompletion: (prompt, modelId = 'gemini-2.5-flash') =>
    completionPort.generateCompletion(prompt, modelId),
};
