import { TemplateItem } from '../../../../src/types';
import { mockTemplates } from '../../../../src/data/aiStoreMock';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getSavedTemplates = (): TemplateItem[] => {
  try {
    const saved = localStorage.getItem('sdkwork_templates_store');
    return saved ? JSON.parse(saved) : [...mockTemplates];
  } catch {
    return [...mockTemplates];
  }
};

const saveTemplates = (list: TemplateItem[]) => {
  try {
    localStorage.setItem('sdkwork_templates_store', JSON.stringify(list));
  } catch {
    // ignore
  }
};

const getSavedStarred = (): Set<string> => {
  try {
    const saved = localStorage.getItem('sdkwork_starred_templates');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
};

const saveStarred = (set: Set<string>) => {
  try {
    localStorage.setItem('sdkwork_starred_templates', JSON.stringify(Array.from(set)));
  } catch {
    // ignore
  }
};

let templatesStore: TemplateItem[] = getSavedTemplates();
const starredSet = getSavedStarred();

export interface ITemplatesSDK {
  getTemplates(category?: string, query?: string): Promise<TemplateItem[]>;
  getTemplateById(id: string): Promise<TemplateItem | null>;
  publishTemplate(templateData: Partial<TemplateItem>): Promise<TemplateItem>;
  starTemplate(id: string): Promise<{ stars: number; isStarred: boolean }>;
  forkTemplate(id: string): Promise<{ forks: number }>;
  getTemplateCliCommand(id: string): Promise<string>;
}

export const TemplatesService: ITemplatesSDK = {
  getTemplates: async (category: string = '全部', query: string = ''): Promise<TemplateItem[]> => {
    await delay(150);
    return templatesStore.filter((t) => {
      const matchesCat = category === '全部' || t.category === category;
      const matchesQ =
        !query ||
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));
      return matchesCat && matchesQ;
    });
  },

  getTemplateById: async (id: string): Promise<TemplateItem | null> => {
    await delay(100);
    return templatesStore.find((t) => t.id === id) || null;
  },

  publishTemplate: async (templateData: Partial<TemplateItem>): Promise<TemplateItem> => {
    await delay(300);
    const newTmpl: TemplateItem = {
      id: `tmpl-user-${Date.now()}`,
      title: templateData.title || '自定义 App 快速开发模板',
      author: templateData.author || '社区创作者',
      framework: templateData.framework || 'React 18 + Vite + Tailwind',
      category: templateData.category || 'SaaS 全栈',
      description: templateData.description || '一键生成的现代化 React 脚手架模板。',
      icon: templateData.icon || 'Boxes',
      iconColor: templateData.iconColor || 'bg-indigo-600',
      stars: 1,
      forks: 0,
      tags: templateData.tags && templateData.tags.length > 0 ? templateData.tags : ['React', 'TypeScript'],
      demoUrl: templateData.demoUrl || 'https://ais-dev-demo.run.app',
      githubUrl: templateData.githubUrl,
      publishedAt: new Date().toISOString().split('T')[0],
      isOfficial: false,
    };
    templatesStore.unshift(newTmpl);
    saveTemplates(templatesStore);
    return newTmpl;
  },

  starTemplate: async (id: string): Promise<{ stars: number; isStarred: boolean }> => {
    await delay(100);
    const tmpl = templatesStore.find((t) => t.id === id);
    if (!tmpl) return { stars: 0, isStarred: false };

    const isStarred = starredSet.has(id);
    if (isStarred) {
      starredSet.delete(id);
      tmpl.stars = Math.max(0, tmpl.stars - 1);
    } else {
      starredSet.add(id);
      tmpl.stars += 1;
    }
    saveStarred(starredSet);
    saveTemplates(templatesStore);
    return { stars: tmpl.stars, isStarred: !isStarred };
  },

  forkTemplate: async (id: string): Promise<{ forks: number }> => {
    await delay(150);
    const tmpl = templatesStore.find((t) => t.id === id);
    if (tmpl) {
      tmpl.forks += 1;
      saveTemplates(templatesStore);
      return { forks: tmpl.forks };
    }
    return { forks: 0 };
  },

  getTemplateCliCommand: async (id: string): Promise<string> => {
    await delay(50);
    return `npx create-sdkwork-app my-app --template ${id}`;
  },
};
