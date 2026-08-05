import type { AppItem } from '../types';

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

export type AIHubServicePort = Pick<IAIHubSDK, 'getAIApps' | 'getModels' | 'getPromptPresets'>;

let aiHubPort: AIHubServicePort = createUnconfiguredAIHubPort();

/** Bind the catalog-backed AI apps/models implementation during app bootstrap. */
export function configureAIHubServicePort(port: AIHubServicePort): void {
  aiHubPort = port;
}

export const AIHubService: IAIHubSDK = {
  getAIApps: () => aiHubPort.getAIApps(),
  getModels: () => aiHubPort.getModels(),
  getPromptPresets: () => aiHubPort.getPromptPresets(),
  generateCompletion: (prompt, modelId) =>
    completionPort.generateCompletion(prompt, modelId ?? ''),
};

function createUnconfiguredAIHubPort(): AIHubServicePort {
  const unavailable = (): never => {
    throw new Error('The AI Hub catalog runtime is not configured.');
  };
  return {
    getAIApps: async () => unavailable(),
    getModels: async () => unavailable(),
    getPromptPresets: async () => unavailable(),
  };
}
