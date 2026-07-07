import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Grid3X3, List } from 'lucide-react';
import { useCategoryListings, formatApiError } from '@/hooks/useApi';
import { AppCard, type AppCardData } from '@/components/cards/AppCard';
import { EmptyState } from '@/components/common/EmptyState';
import { AppCardSkeleton } from '@/components/common/Skeleton';

const CATEGORY_LABELS: Record<string, string> = {
  featured: '精选',
  'top-charts': '榜单',
  collections: '合集',
  apps: '应用',
  games: '游戏',
  productivity: '效率',
  social: '社交',
  entertainment: '娱乐',
  education: '教育',
  business: '商务',
  health: '健康',
  tools: '工具',
};

function readString(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function readNumber(record: Record<string, unknown>, ...keys: string[]): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
  }
  return 0;
}

function mapListingToCard(item: unknown, index: number, categoryLabel: string): AppCardData | null {
  if (!item || typeof item !== 'object') return null;
  const row = item as Record<string, unknown>;
  const id = readString(row, 'id') || String(index);
  const listingSlug = readString(row, 'listing_slug', 'listingSlug') || id;
  return {
    id,
    listingSlug,
    displayName: readString(row, 'display_name', 'displayName') || listingSlug,
    subtitle: readString(row, 'subtitle') || undefined,
    iconUrl: readString(row, 'icon_media_resource_id', 'iconMediaResourceId') || undefined,
    averageRating: readNumber(row, 'average_rating', 'averageRating') || undefined,
    ratingCount: readNumber(row, 'rating_count', 'ratingCount') || undefined,
    downloadCount: readNumber(row, 'download_count', 'downloadCount') || undefined,
    pricingModel: readString(row, 'pricing_model', 'pricingModel') || undefined,
    priceLabel: readString(row, 'price_label', 'priceLabel') || undefined,
    category: categoryLabel,
  };
}

type SortId = 'rating' | 'downloads' | 'name';

export function CategoryPage({ categoryId: categoryIdProp }: { categoryId?: string } = {}) {
  const { categoryId: categoryIdParam } = useParams<{ categoryId: string }>();
  const categoryKey = categoryIdProp ?? categoryIdParam ?? '';
  const { data, loading, error } = useCategoryListings(categoryKey);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortId>('rating');

  const categoryLabel = CATEGORY_LABELS[categoryKey]
    ?? (categoryKey.replace(/-/g, ' '));

  const apps = useMemo(() => {
    const items = data?.items ?? [];
    return items
      .map((item, index) => mapListingToCard(item, index, categoryLabel))
      .filter((a): a is AppCardData => a !== null);
  }, [data?.items, categoryLabel]);

  const sortedApps = useMemo(() => {
    return [...apps].sort((a, b) => {
      if (sortBy === 'rating') return (b.averageRating ?? 0) - (a.averageRating ?? 0);
      if (sortBy === 'name') return a.displayName.localeCompare(b.displayName, 'zh-CN');
      // downloads / 最受欢迎 严格按下载量排序
      return (b.downloadCount ?? 0) - (a.downloadCount ?? 0);
    });
  }, [apps, sortBy]);

  if (loading) {
    return <CategoryPageSkeleton />;
  }

  const sortOptions: { id: SortId; label: string }[] = [
    { id: 'rating', label: '评分最高' },
    { id: 'downloads', label: '最受欢迎' },
    { id: 'name', label: '名称' },
  ];

  return (
    <div>
      <nav
        className="flex items-center gap-2 text-sm mb-6"
        style={{ color: 'var(--text-tertiary)' }}
        aria-label="面包屑"
      >
        <Link to="/" className="hover:text-[var(--accent)]">
          首页
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span style={{ color: 'var(--text-primary)' }}>{categoryLabel}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {categoryLabel}
        </h1>
        <p className="mt-2" style={{ color: 'var(--text-tertiary)' }}>
          浏览该分类下的所有应用
        </p>
      </div>

      {error && (
        <div
          className="mb-6 rounded-xl px-4 py-3 text-sm"
          style={{
            backgroundColor: 'var(--warning-subtle)',
            border: '1px solid var(--warning)',
            color: 'var(--warning)',
          }}
          role="alert"
        >
          {formatApiError(error)}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {sortOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSortBy(opt.id)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
              style={
                sortBy === opt.id
                  ? {
                      backgroundColor: 'var(--accent-subtle)',
                      color: 'var(--accent)',
                    }
                  : {
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-primary)',
                    }
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div
          className="flex items-center gap-1 rounded-xl p-1 border"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-default)',
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: viewMode === 'grid' ? 'var(--bg-muted)' : 'transparent',
              color: viewMode === 'grid' ? 'var(--accent)' : 'var(--text-tertiary)',
            }}
            aria-label="网格视图"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: viewMode === 'list' ? 'var(--bg-muted)' : 'transparent',
              color: viewMode === 'list' ? 'var(--accent)' : 'var(--text-tertiary)',
            }}
            aria-label="列表视图"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {sortedApps.length === 0 ? (
        <EmptyState
          icon={<Grid3X3 className="w-7 h-7" />}
          title="该分类暂无应用"
          description="当应用上架并通过审核后，将在此处展示。"
          action={
            <Link to="/" className="btn-primary">
              返回首页
            </Link>
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {sortedApps.map((app) => (
            <AppCard key={app.id} app={app} size="md" layout="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedApps.map((app) => (
            <AppCard key={app.id} app={app} size="md" layout="list" />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryPageSkeleton() {
  return (
    <div>
      {/* 面包屑占位 */}
      <div className="flex items-center gap-2 mb-6">
        <div className="skeleton" style={{ width: 60, height: 14 }} />
        <div className="skeleton" style={{ width: 16, height: 16, borderRadius: '50%' }} />
        <div className="skeleton" style={{ width: 100, height: 14 }} />
      </div>

      {/* 标题占位 */}
      <div className="mb-8">
        <div className="skeleton" style={{ width: 200, height: 36, borderRadius: 'var(--radius-md)' }} />
        <div className="skeleton mt-2" style={{ width: 240, height: 14 }} />
      </div>

      {/* 工具栏占位 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton"
              style={{ width: 88, height: 36, borderRadius: 'var(--radius-full)' }}
            />
          ))}
        </div>
        <div className="skeleton" style={{ width: 72, height: 36, borderRadius: 'var(--radius-md)' }} />
      </div>

      {/* 卡片网格占位 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }, (_, i) => (
          <AppCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
