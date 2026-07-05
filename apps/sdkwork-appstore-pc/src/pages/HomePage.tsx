import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, Sparkles, LayoutGrid, Compass } from 'lucide-react';
import {
  useHomeFeed,
  useCategories,
  useRecommendations,
  formatApiError,
} from '@/hooks/useApi';
import { FeaturedBanner, type FeaturedBannerData } from '@/components/cards/FeaturedBanner';
import { StoryCard } from '@/components/cards/StoryCard';
import { CollectionCard } from '@/components/cards/CollectionCard';
import { AppCard } from '@/components/cards/AppCard';
import { EmptyState } from '@/components/common/EmptyState';
import { AppCardSkeleton, ChartListSkeleton } from '@/components/common/Skeleton';
import {
  mapFeaturedSlotToBanner,
  mapCollectionToCollectionCard,
  mapCollectionToStoryCard,
  mapListingSummaryToAppCard,
  mapCategoryToTile,
  formatDownloadCount,
} from '@/utils/catalogMappers';

interface HomeFeed {
  featuredSlots?: unknown[];
  collections?: unknown[];
  charts?: unknown[];
}

const DEFAULT_BANNERS: FeaturedBannerData[] = [
  {
    id: 'default-welcome',
    title: 'SDKWork App Store',
    subtitle: '发现、安装、管理跨端应用 — 一站式应用分发中心',
    ctaText: '浏览应用',
    ctaHref: '/apps',
    accentColor: 'var(--accent)',
    targetKind: 'url',
  },
];

export function HomePage() {
  const { data: homeFeed, loading: feedLoading, error: feedError } = useHomeFeed();
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useCategories(12);
  const { data: listingsData, loading: listingsLoading, error: listingsError } = useRecommendations(12);

  const isLoading = feedLoading || categoriesLoading || listingsLoading;
  const hasError = feedError || categoriesError || listingsError;

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  const feed = (homeFeed ?? {}) as HomeFeed;
  const featuredSlots = Array.isArray(feed.featuredSlots) ? feed.featuredSlots : [];
  const collections = Array.isArray(feed.collections) ? feed.collections : [];

  const banners: FeaturedBannerData[] = featuredSlots.length
    ? featuredSlots
        .map((slot, idx) => mapFeaturedSlotToBanner(slot, `精选推荐 ${idx + 1}`))
        .filter((b): b is FeaturedBannerData => b !== null)
    : DEFAULT_BANNERS;

  const editorialCollections = collections
    .map((c) => mapCollectionToStoryCard(c))
    .filter((s): s is NonNullable<typeof s> => s !== null)
    .slice(0, 4);

  const thematicCollections = collections
    .map((c) => mapCollectionToCollectionCard(c))
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .slice(0, 6);

  const listingItems = (listingsData?.items ?? []) as unknown[];
  const topFree = listingItems
    .map(mapListingSummaryToAppCard)
    .filter((a): a is NonNullable<typeof a> => a !== null)
    .slice(0, 5);
  const topPaid = listingItems
    .map(mapListingSummaryToAppCard)
    .filter((a): a is NonNullable<typeof a> => a !== null)
    .filter((a) => a.pricingModel && a.pricingModel.toUpperCase() === 'PAID')
    .slice(0, 5);
  const trending = listingItems
    .map(mapListingSummaryToAppCard)
    .filter((a): a is NonNullable<typeof a> => a !== null)
    .sort((a, b) => (b.downloadCount ?? 0) - (a.downloadCount ?? 0))
    .slice(0, 5);

  const categoryTiles = (categoriesData?.items ?? [])
    .map(mapCategoryToTile)
    .filter((t): t is NonNullable<typeof t> => t !== null);

  return (
    <div className="space-y-12">
      {hasError && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{
            backgroundColor: 'var(--warning-subtle)',
            border: '1px solid var(--warning)',
            color: 'var(--warning)',
          }}
          role="alert"
        >
          {formatApiError(feedError ?? categoriesError ?? listingsError ?? null)}
        </div>
      )}

      {/* Hero Banner */}
      <section>
        <FeaturedBanner banners={banners} />
      </section>

      {/* Editorial Stories */}
      {editorialCollections.length > 0 && (
        <section>
          <SectionHeader
            title="编辑精选"
            subtitle="来自编辑团队的深度故事"
            icon={<Sparkles className="w-5 h-5" style={{ color: 'var(--accent)' }} />}
            to="/category/collections"
          />
          <div className="flex gap-5 overflow-x-auto pb-2 scroll-x">
            {editorialCollections.map((story) => (
              <StoryCard key={story.id} story={story} variant="editorial" />
            ))}
          </div>
        </section>
      )}

      {/* Featured Apps Grid */}
      <section>
        <SectionHeader
          title="推荐应用"
          subtitle="本周精选应用，提升你的工作与生活"
          icon={<Sparkles className="w-5 h-5" style={{ color: 'var(--accent)' }} />}
          to="/category/featured"
        />
        {topFree.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="w-7 h-7" />}
            title="暂无推荐应用"
            description="当应用上架并通过审核后，这里将展示精选应用。"
            action={
              <Link to="/apps" className="btn-primary">
                浏览所有应用
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {topFree.map((app) => (
              <AppCard key={app.id} app={app} size="md" layout="grid" />
            ))}
          </div>
        )}
      </section>

      {/* Collections */}
      {thematicCollections.length > 0 && (
        <section>
          <SectionHeader
            title="主题合集"
            subtitle="按场景与兴趣精选的应用合集"
            icon={<Compass className="w-5 h-5" style={{ color: 'var(--accent)' }} />}
            to="/category/collections"
          />
          <div className="flex gap-5 overflow-x-auto pb-2 scroll-x">
            {thematicCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </section>
      )}

      {/* Top Charts */}
      <section>
        <SectionHeader
          title="排行榜"
          subtitle="最受欢迎的应用，实时更新"
          icon={<TrendingUp className="w-5 h-5" style={{ color: 'var(--warning)' }} />}
          to="/charts"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <ChartColumn title="免费榜" entries={topFree} />
          <ChartColumn title="付费榜" entries={topPaid} />
          <ChartColumn title="热门下载" entries={trending} />
        </div>
      </section>

      {/* Categories */}
      <section>
        <SectionHeader
          title="分类"
          subtitle="按类别浏览应用"
          icon={<LayoutGrid className="w-5 h-5" style={{ color: 'var(--accent)' }} />}
        />
        {categoryTiles.length === 0 ? (
          <EmptyState
            icon={<LayoutGrid className="w-7 h-7" />}
            title="暂无分类"
            description="分类将在管理后台配置后出现。"
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {categoryTiles.map((tile) => (
              <Link
                key={tile.id}
                to={tile.to}
                className="card card-hover p-5 flex flex-col items-start gap-3"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-subtle), var(--bg-muted))',
                    color: 'var(--accent)',
                  }}
                >
                  <LayoutGrid className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--text-md)] text-[var(--text-primary)] truncate">
                    {tile.title}
                  </p>
                  <p className="text-[var(--text-sm)] text-[var(--text-secondary)] mt-0.5 line-clamp-2">
                    {tile.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

interface ChartColumnProps {
  title: string;
  entries: ReturnType<typeof mapListingSummaryToAppCard>[];
}

function ChartColumn({ title, entries }: ChartColumnProps) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[var(--text-md)] text-[var(--text-primary)]">
          {title}
        </h3>
        <Link
          to="/charts"
          className="text-[var(--text-sm)] text-[var(--accent)] hover:underline inline-flex items-center gap-0.5"
        >
          查看全部
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      {entries.length === 0 ? (
        <p className="text-[var(--text-sm)] text-[var(--text-tertiary)] py-8 text-center">
          暂无上榜应用
        </p>
      ) : (
        <ol className="space-y-1">
          {entries.map((entry, idx) =>
            entry ? (
              <li key={entry.id} className="flex items-center gap-3">
                <span
                  className="text-[var(--text-md)] font-bold w-6 text-center"
                  style={{ color: idx < 3 ? 'var(--accent)' : 'var(--text-tertiary)' }}
                >
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <AppCard app={entry} size="sm" layout="list" />
                </div>
                {typeof entry.downloadCount === 'number' && entry.downloadCount > 0 && (
                  <span className="text-[var(--text-xs)] text-[var(--text-tertiary)] flex items-center gap-1 flex-shrink-0">
                    <TrendingUp className="w-3 h-3" />
                    {formatDownloadCount(entry.downloadCount)}
                  </span>
                )}
              </li>
            ) : null,
          )}
        </ol>
      )}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  to?: string;
}

function SectionHeader({ title, subtitle, icon, to }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h2 className="text-[var(--text-2xl)] font-bold text-[var(--text-primary)] tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[var(--text-sm)] text-[var(--text-secondary)] mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {to && (
        <Link
          to={to}
          className="inline-flex items-center gap-1 text-[var(--text-sm)] text-[var(--accent)] hover:underline font-medium"
        >
          查看全部
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

function HomePageSkeleton() {
  return (
    <div className="space-y-12">
      <div className="skeleton" style={{ height: 360, borderRadius: 'var(--radius-2xl)' }} />
      <section>
        <div className="flex gap-5 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton flex-shrink-0" style={{ width: 320, height: 280, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      </section>
      <section>
        <div className="skeleton mb-6" style={{ width: 200, height: 28 }} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <AppCardSkeleton key={i} />
          ))}
        </div>
      </section>
      <section>
        <div className="skeleton mb-6" style={{ width: 160, height: 28 }} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5">
              <ChartListSkeleton count={5} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
