import type { SkillItem } from '../../../../src/types';

export interface SkillSandboxResult {
  agentOutput: string;
  compiledPrompt: string;
  triggerMatched: string[];
}

export interface ISkillsSDK {
  getSkills(category?: string, query?: string): Promise<SkillItem[]>;
  publishSkill(skillData: Partial<SkillItem>): Promise<SkillItem>;
  runSkillSandbox(skillId: string, promptInput: string): Promise<SkillSandboxResult>;
  toggleInstallSkill(id: string): Promise<boolean>;
}

export type SkillsServicePort = ISkillsSDK;

let skillsPort: SkillsServicePort = createUnconfiguredSkillsPort();

export function configureSkillsServicePort(port: SkillsServicePort): void {
  skillsPort = port;
}

export const SkillsService: ISkillsSDK = {
  getSkills: (category = 'All', query = '') => skillsPort.getSkills(category, query),
  publishSkill: (skillData) => skillsPort.publishSkill(skillData),
  runSkillSandbox: (skillId, promptInput) =>
    skillsPort.runSkillSandbox(skillId, promptInput),
  toggleInstallSkill: (id) => skillsPort.toggleInstallSkill(id),
};

function createUnconfiguredSkillsPort(): SkillsServicePort {
  const unavailable = (): never => {
    throw new Error('The Skills app SDK runtime is not configured.');
  };
  return {
    getSkills: async () => unavailable(),
    publishSkill: async () => unavailable(),
    runSkillSandbox: async () => unavailable(),
    toggleInstallSkill: async () => unavailable(),
  };
}
