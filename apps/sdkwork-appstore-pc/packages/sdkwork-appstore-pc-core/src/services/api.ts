import type { AppItem, Review, EditorialCollection } from '../types';

/**
 * AppStore SDK Contract Interface
 * Implemented by the bootstrap-configured service port backed by the
 * `@sdkwork/appstore-app-sdk` and `@sdkwork/comments-app-sdk` clients.
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

export type AppStoreServicePort = IAppStoreSDK;

let appStorePort: AppStoreServicePort = createUnconfiguredAppStorePort();

/** Bind the real SDK-backed implementation during app bootstrap. */
export function configureAppStoreServicePort(port: AppStoreServicePort): void {
  appStorePort = port;
}

export const AppStoreService: IAppStoreSDK = {
  getCategories: () => appStorePort.getCategories(),
  getCollections: () => appStorePort.getCollections(),
  getDiscoverApps: () => appStorePort.getDiscoverApps(),
  getAllApps: () => appStorePort.getAllApps(),
  getTopCharts: (type = 'all') => appStorePort.getTopCharts(type),
  searchApps: (query, filter = 'All') => appStorePort.searchApps(query, filter),
  getTrendingSearches: () => appStorePort.getTrendingSearches(),
  getSearchSuggestions: (keyword) => appStorePort.getSearchSuggestions(keyword),
  getAppById: (id) => appStorePort.getAppById(id),
  getReviewsByAppId: (id) => appStorePort.getReviewsByAppId(id),
  submitReview: (reviewData) => appStorePort.submitReview(reviewData),
  likeReview: (reviewId) => appStorePort.likeReview(reviewId),
  getMoreByDeveloper: (developer, excludeAppId) =>
    appStorePort.getMoreByDeveloper(developer, excludeAppId),
  getSimilarApps: (appId) => appStorePort.getSimilarApps(appId),
  getBoardGameRecommendations: (appId) => appStorePort.getBoardGameRecommendations(appId),
  getPendingUpdates: () => appStorePort.getPendingUpdates(),
  updateApp: (id) => appStorePort.updateApp(id),
  updateAllApps: (ids) => appStorePort.updateAllApps(ids),
  submitFeedback: (feedbackData) => appStorePort.submitFeedback(feedbackData),
};

function createUnconfiguredAppStorePort(): AppStoreServicePort {
  const unavailable = (): never => {
    throw new Error('The App Store app SDK runtime is not configured.');
  };
  return {
    getCategories: async () => unavailable(),
    getCollections: async () => unavailable(),
    getDiscoverApps: async () => unavailable(),
    getAllApps: async () => unavailable(),
    getTopCharts: async () => unavailable(),
    searchApps: async () => unavailable(),
    getTrendingSearches: async () => unavailable(),
    getSearchSuggestions: async () => unavailable(),
    getAppById: async () => unavailable(),
    getReviewsByAppId: async () => unavailable(),
    submitReview: async () => unavailable(),
    likeReview: async () => unavailable(),
    getMoreByDeveloper: async () => unavailable(),
    getSimilarApps: async () => unavailable(),
    getBoardGameRecommendations: async () => unavailable(),
    getPendingUpdates: async () => unavailable(),
    updateApp: async () => unavailable(),
    updateAllApps: async () => unavailable(),
    submitFeedback: async () => unavailable(),
  };
}
