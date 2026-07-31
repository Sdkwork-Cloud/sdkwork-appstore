import { SkillItem } from '../../../../src/types';
import { mockSkills } from '../../../../src/data/aiStoreMock';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getSavedSkills = (): SkillItem[] => {
  try {
    const saved = localStorage.getItem('sdkwork_skills_store');
    return saved ? JSON.parse(saved) : [...mockSkills];
  } catch {
    return [...mockSkills];
  }
};

const saveSkills = (list: SkillItem[]) => {
  try {
    localStorage.setItem('sdkwork_skills_store', JSON.stringify(list));
  } catch {
    // ignore
  }
};

let skillsStore: SkillItem[] = getSavedSkills();

export interface ISkillsSDK {
  getSkills(category?: string, query?: string): Promise<SkillItem[]>;
  toggleInstallSkill(id: string): Promise<boolean>;
  publishSkill(skillData: Partial<SkillItem>): Promise<SkillItem>;
  runSkillSandbox(skillId: string, promptInput: string): Promise<{ triggerMatched: string[]; compiledPrompt: string; agentOutput: string }>;
}

export const SkillsService: ISkillsSDK = {
  getSkills: async (category: string = '全部', query: string = ''): Promise<SkillItem[]> => {
    await delay(150);
    return skillsStore.filter((s) => {
      const matchesCat = category === '全部' || s.category === category;
      const matchesQ =
        !query ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase()) ||
        s.triggers.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchesCat && matchesQ;
    });
  },

  toggleInstallSkill: async (id: string): Promise<boolean> => {
    await delay(100);
    const target = skillsStore.find((s) => s.id === id);
    if (target) {
      target.isInstalled = !target.isInstalled;
      if (target.isInstalled) {
        target.activeCount += 1;
      } else if (target.activeCount > 0) {
        target.activeCount -= 1;
      }
      saveSkills(skillsStore);
      return target.isInstalled;
    }
    return false;
  },

  publishSkill: async (skillData: Partial<SkillItem>): Promise<SkillItem> => {
    await delay(300);
    const newSkill: SkillItem = {
      id: `skill-user-${Date.now()}`,
      name: skillData.name || '自定义 Agent Skill',
      author: skillData.author || '社区开发者',
      category: skillData.category || '通用智能',
      description: skillData.description || '自定义创作的 Agent 专项指令集。',
      icon: skillData.icon || 'Zap',
      iconColor: skillData.iconColor || 'bg-indigo-600',
      triggers: skillData.triggers && skillData.triggers.length > 0 ? skillData.triggers : ['@custom-skill'],
      promptTemplate: skillData.promptTemplate || '你是一名专业的 AI 助手，请遵循以下指令。',
      skillMarkdown: skillData.skillMarkdown || '# Custom Skill Instructions\n\n1. Strictly analyze input context.\n2. Output structured result.',
      version: skillData.version || '1.0.0',
      activeCount: 1,
      isInstalled: true,
    };
    skillsStore.unshift(newSkill);
    saveSkills(skillsStore);
    return newSkill;
  },

  runSkillSandbox: async (skillId: string, promptInput: string): Promise<{ triggerMatched: string[]; compiledPrompt: string; agentOutput: string }> => {
    await delay(500);
    const skill = skillsStore.find((s) => s.id === skillId);
    const matched = skill?.triggers.filter((t) => promptInput.toLowerCase().includes(t.toLowerCase())) || [skill?.triggers[0] || '@skill'];
    
    const compiled = `${skill?.promptTemplate || '系统 Prompt'}\n\n[USER CONTEXT]: ${promptInput}`;
    const output = `【Agent 执行结果】已命中 Skill【${skill?.name}】触发词 [${matched.join(', ')}]：\n根据 Skill Markdown 指令规范处理完毕，成功输出结构化推理响应。`;

    return {
      triggerMatched: matched,
      compiledPrompt: compiled,
      agentOutput: output,
    };
  },
};
