import { AppItem, Review, EditorialCollection } from '@/src/types';
import { mockApps, mockReviews, mockCollections } from '@/src/data/mock';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dynamic memory store with localStorage persistence for user-submitted reviews and feedback
const getSavedReviews = (): Review[] => {
  try {
    const saved = localStorage.getItem('sdkwork_app_reviews');
    return saved ? JSON.parse(saved) : [...mockReviews];
  } catch {
    return [...mockReviews];
  }
};

const saveReviews = (reviews: Review[]) => {
  try {
    localStorage.setItem('sdkwork_app_reviews', JSON.stringify(reviews));
  } catch {
    // ignore
  }
};

let dynamicReviews: Review[] = getSavedReviews();

const getSavedFeedback = () => {
  try {
    const saved = localStorage.getItem('sdkwork_user_feedback');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveFeedback = (list: any[]) => {
  try {
    localStorage.setItem('sdkwork_user_feedback', JSON.stringify(list));
  } catch {
    // ignore
  }
};

let userFeedbackStore = getSavedFeedback();

/**
 * AppStore SDK Contract Interface
 * Secondary developers can implement this interface to wire real backend APIs or native desktop SDKs.
 */
export interface IAppStoreSDK {
  getCategories(): Promise<{ id: string; name: string; icon: string }[]>;
  getCollections(): Promise<EditorialCollection[]>;
  getDiscoverApps(): Promise<{ editorial: AppItem[]; newAndNoteworthy: AppItem[]; secondaryEditorial: AppItem[] }>;
  getAllApps(): Promise<AppItem[]>;
  getTopCharts(type: 'free' | 'paid' | 'all'): Promise<AppItem[]>;
  searchApps(query: string, filter?: string): Promise<AppItem[]>;
  getTrendingSearches(): Promise<string[]>;
  getSearchSuggestions(keyword: string): Promise<string[]>;
  getAppById(id: string): Promise<AppItem | undefined>;
  getReviewsByAppId(id: string): Promise<Review[]>;
  submitReview(reviewData: { appId: string; user: string; rating: number; title: string; comment: string }): Promise<Review>;
  likeReview(reviewId: string): Promise<boolean>;
  getMoreByDeveloper(developer: string, excludeAppId: string): Promise<AppItem[]>;
  getSimilarApps(appId: string): Promise<AppItem[]>;
  getBoardGameRecommendations(appId: string): Promise<AppItem[]>;
  getPendingUpdates(): Promise<AppItem[]>;
  updateApp(id: string): Promise<boolean>;
  updateAllApps(ids: string[]): Promise<boolean>;
  submitFeedback(feedbackData: { appId?: string; type: string; content: string; contact?: string }): Promise<boolean>;
}

export const AppStoreService: IAppStoreSDK = {
  // --- Discover ---
  getCategories: async (): Promise<{ id: string; name: string; icon: string }[]> => {
    await delay(150);
    return [
      { id: 'ai-assistants', name: 'AI 助手与对话', icon: 'Sparkles' },
      { id: 'ai-coding', name: 'AI 编程与 Agent', icon: 'Code' },
      { id: 'ai-creative', name: 'AI 创意与音视频', icon: 'Palette' },
      { id: 'ai-productivity', name: 'AI 生产力与知识库', icon: 'Briefcase' },
      { id: 'ai-games', name: 'AI 智能体游戏', icon: 'Gamepad2' }
    ];
  },

  getCollections: async (): Promise<EditorialCollection[]> => {
    await delay(200);
    return mockCollections;
  },
  
  getDiscoverApps: async (): Promise<{ editorial: AppItem[]; newAndNoteworthy: AppItem[]; secondaryEditorial: AppItem[] }> => {
    await delay(200);
    const editorial = mockCollections[0];
    const secondary = mockCollections[1];
    
    const editorialApps = mockApps.filter(app => editorial.apps.includes(app.id));
    const secondaryEditorialApps = mockApps.filter(app => secondary?.apps.includes(app.id));
    const newAndNoteworthy = mockApps.slice(3, 8);
    
    return { editorial: editorialApps, newAndNoteworthy, secondaryEditorial: secondaryEditorialApps };
  },

  getAllApps: async (): Promise<AppItem[]> => {
    await delay(150);
    return mockApps;
  },
  
  // --- Charts ---
  getTopCharts: async (type: 'free' | 'paid' | 'all' = 'all'): Promise<AppItem[]> => {
    await delay(200);
    let list = [...mockApps];
    if (type === 'free') list = list.filter(app => app.price === 0);
    if (type === 'paid') list = list.filter(app => app.price > 0);
    return list.sort((a, b) => (a.chartRank || 99) - (b.chartRank || 99));
  },

  // --- Search ---
  searchApps: async (query: string, filter: string = 'All'): Promise<AppItem[]> => {
    await delay(200);
    let results = mockApps;
    
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(app => 
        app.name.toLowerCase().includes(q) || 
        app.developer.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q)
      );
    }
    
    if (filter && filter !== 'All' && filter !== '全部') {
      results = results.filter(app => {
        if (filter === '应用') return app.category !== '微信小游戏' && app.category !== '精品手游' && app.category !== '棋牌游戏';
        if (filter === '游戏') return app.category.includes('游戏') || app.category === '棋牌游戏';
        if (filter === 'Free') return app.price === 0;
        if (filter === 'Paid') return app.price > 0;
        return app.category.toLowerCase().includes(filter.toLowerCase());
      });
    }
    
    return results;
  },

  getTrendingSearches: async (): Promise<string[]> => {
    await delay(100);
    return ['DeepSeek R1', '千问 AI', 'Cursor AI', 'Kimi 智能助手', 'Midjourney', 'Suno AI', 'Manus Agent'];
  },

  getSearchSuggestions: async (keyword: string): Promise<string[]> => {
    await delay(100);
    if (!keyword.trim()) return [];
    const k = keyword.toLowerCase();
    const suggestions = mockApps
      .filter(a => a.name.toLowerCase().includes(k) || a.category.toLowerCase().includes(k))
      .map(a => a.name)
      .slice(0, 5);
    return suggestions;
  },

  // --- App Details ---
  getAppById: async (id: string): Promise<AppItem | undefined> => {
    await delay(200);
    return mockApps.find(app => app.id === id);
  },

  getReviewsByAppId: async (id: string): Promise<Review[]> => {
    await delay(200);
    return dynamicReviews.filter(r => r.appId === id);
  },

  submitReview: async (reviewData: { appId: string; user: string; rating: number; title: string; comment: string }): Promise<Review> => {
    await delay(300);
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      appId: reviewData.appId,
      user: reviewData.user || '匿名玩家',
      rating: reviewData.rating,
      title: reviewData.title || '好评推荐',
      comment: reviewData.comment,
      date: '刚刚',
      likes: 0,
    };
    dynamicReviews.unshift(newReview);
    saveReviews(dynamicReviews);
    return newReview;
  },

  likeReview: async (reviewId: string): Promise<boolean> => {
    await delay(150);
    const target = dynamicReviews.find(r => r.id === reviewId);
    if (target) {
      target.likes = (target.likes || 0) + 1;
      saveReviews(dynamicReviews);
      return true;
    }
    return false;
  },

  getMoreByDeveloper: async (developer: string, excludeAppId: string): Promise<AppItem[]> => {
    await delay(200);
    return mockApps.filter(a => a.developer === developer && a.id !== excludeAppId);
  },

  getSimilarApps: async (appId: string): Promise<AppItem[]> => {
    await delay(200);
    const target = mockApps.find(a => a.id === appId);
    if (!target) return mockApps.slice(0, 4);
    return mockApps.filter(a => a.id !== appId && (a.category === target.category || a.developer === target.developer)).slice(0, 6);
  },

  getBoardGameRecommendations: async (appId: string): Promise<AppItem[]> => {
    await delay(200);
    const target = mockApps.find(a => a.id === appId);
    const isBoard = target && (target.category === '棋牌游戏' || ['棋', '牌', '麻将', '地主'].some(kw => target.name.includes(kw)));
    
    if (isBoard) {
      return mockApps.filter(a => a.id !== appId && (a.category === '棋牌游戏' || ['棋', '牌', '麻将', '地主'].some(kw => a.name.includes(kw)))).slice(0, 6);
    }
    return mockApps.filter(a => a.id !== appId && a.category === target?.category).slice(0, 6);
  },

  // --- Updates & Management ---
  getPendingUpdates: async (): Promise<AppItem[]> => {
    await delay(200);
    return mockApps.filter(app => app.whatsNew);
  },
  
  updateApp: async (id: string): Promise<boolean> => {
    await delay(1200); 
    return true;
  },

  updateAllApps: async (ids: string[]): Promise<boolean> => {
    await delay(2000); 
    return true;
  },

  submitFeedback: async (feedbackData: { appId?: string; type: string; content: string; contact?: string }): Promise<boolean> => {
    await delay(300);
    userFeedbackStore.push({
      id: `fb-${Date.now()}`,
      appId: feedbackData.appId,
      type: feedbackData.type,
      content: feedbackData.content,
      date: new Date().toISOString()
    });
    saveFeedback(userFeedbackStore);
    return true;
  }
};

