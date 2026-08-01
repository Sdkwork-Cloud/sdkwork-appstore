import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppStoreService } from '../services/api';
import { AppItem } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { DiscoverHeader } from '../components/discover/DiscoverHeader';
import { EssentialAppsGrid } from '../components/discover/EssentialAppsGrid';
import { FeaturedTodayCard } from '../components/discover/FeaturedTodayCard';
import { CollectionGridSection } from '../components/discover/CollectionGridSection';
import { MiniGamesCarousel } from '../components/discover/MiniGamesCarousel';
import { HandheldGamesGrid } from '../components/discover/HandheldGamesGrid';

export default function Discover() {
  const { t } = useTranslation();
  const [allApps, setAllApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const apps = await AppStoreService.getAllApps();
        setAllApps(apps);
      } catch (error) {
        console.error("Failed to load discover data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Filter AI app groups
  const essentialApps = allApps.filter(a => 
    ["app-qwen", "app-deepseek", "app-kimi", "app-cursor", "app-doubao", "app-midjourney", "app-perplexity", "app-suno"].includes(a.id)
  );

  const featuredTodayApp = allApps.find(a => a.id === "app-tencent-ima") || allApps[0];

  const codingApps = allApps.filter(a => 
    ["app-cursor", "app-v0", "app-bolt", "app-manus", "app-coze", "app-code-playground"].includes(a.id)
  );

  const creativeApps = allApps.filter(a => 
    ["app-midjourney", "app-suno", "app-runway", "app-elevenlabs", "app-comfyui", "app-flux"].includes(a.id)
  );

  const aiGames = allApps.filter(a => a.category.includes("AI") && (a.category.includes("游戏") || a.id.startsWith("game-")));

  const productivityApps = allApps.filter(a => 
    ["app-tencent-ima", "app-notion-ai", "app-rag-knowledge", "app-saas-starter", "app-agent-workspace", "app-claude"].includes(a.id)
  );

  return (
    <div className="p-5 md:p-6 space-y-7 w-full max-w-full transition-colors duration-200 select-none">
      {/* Subcomponent: Page Title Header */}
      <DiscoverHeader />

      {/* Top Hero Section: 热门 AI 必装应用 + 今日 AI 焦点 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <EssentialAppsGrid apps={essentialApps.length > 0 ? essentialApps : allApps.slice(0, 8)} />
        </div>
        <div className="xl:col-span-1">
          <FeaturedTodayCard app={featuredTodayApp} />
        </div>
      </div>

      {/* Middle Collections: AI 编程与 Agent 神器 + AI 创意与多媒体重构 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <CollectionGridSection 
          title={t('discover.sections.codingApps')} 
          categoryQuery="AI 编程与 Agent"
          apps={codingApps.length > 0 ? codingApps : allApps.slice(0, 6)} 
        />
        <CollectionGridSection 
          title={t('discover.sections.creativeApps')} 
          categoryQuery="AI 创意与音视频"
          apps={creativeApps.length > 0 ? creativeApps : allApps.slice(2, 8)} 
        />
      </div>

      {/* 热门 AI 智能体互动游戏 */}
      {aiGames.length > 0 && (
        <MiniGamesCarousel apps={aiGames} />
      )}

      {/* AI 生产力与知识库精选 */}
      {productivityApps.length > 0 && (
        <HandheldGamesGrid apps={productivityApps} />
      )}
    </div>
  );
}
