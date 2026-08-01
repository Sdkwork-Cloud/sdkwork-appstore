import type { AgentRuntimeExecutionRecord, SdkworkAppClient } from '@sdkwork/agents-app-sdk';
import { configureAICompletionPort, type AICompletionResult } from '@sdkwork/appstore-pc-core';

export function configureAppstorePcAIHub(
  agentsClient: SdkworkAppClient,
  agentId: string | undefined,
): void {
  configureAICompletionPort({
    async generateCompletion(prompt, modelId): Promise<AICompletionResult> {
      if (!agentId) {
        throw new Error('The App Store AI preview agent is not configured.');
      }

      const result = await agentsClient.ai.agents.previewResponses.create(agentId, {
        content: prompt,
        executionId: crypto.randomUUID(),
        inputPayload: { source: 'sdkwork-appstore-pc' },
        model: modelId,
        requestedAt: new Date().toISOString(),
      });
      return mapAgentPreviewResult(result, modelId);
    },
  });
}

function mapAgentPreviewResult(
  result: AgentRuntimeExecutionRecord,
  requestedModel: string,
): AICompletionResult {
  const output = result.outputPayload;
  const response = readString(output, 'response', 'content', 'text');
  if (!response) {
    throw new Error('The Agents preview completed without response content.');
  }

  const startedAt = Date.parse(result.requestedAt);
  const completedAt = Date.parse(result.completedAt);
  return {
    latencyMs:
      Number.isFinite(startedAt) && Number.isFinite(completedAt)
        ? Math.max(0, completedAt - startedAt)
        : 0,
    modelUsed: readString(output, 'model', 'modelId') || requestedModel,
    response,
    tokenCount: readNumber(output, 'tokenCount', 'totalTokens') ?? 0,
  };
}

function readString(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

function readNumber(record: Record<string, unknown>, ...keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }
  return undefined;
}
