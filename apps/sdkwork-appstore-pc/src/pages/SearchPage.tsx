import { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import {
  useSearch,
  useTrendingSearchTerms,
  useSearchHistory,
  recordSearchHistory,
  clearSearchHistory,
  formatApiError,
} from '@/hooks/useApi';
import { isAuthenticated } from '@/bootstrap/iamRuntime';
import { AppCard, type AppCardData } from '@/components/cards/AppCard';
import { EmptyState } from '@/components/common/EmptyState';

const FALLBACK_TRENDING = [
  '效率', '社交', '游戏', '图像处理', '音乐',
  '天气', '健身', '笔记', '安全', '计算器',
];

const POPULAR_CATEGORIES = [
  '效率工具', '游戏', '社交', '娱乐',
  '实用工具', '教育', '商务', '健康',
];

function readTerm(item: unknown): string {
  if (!item || typeof item !== 'object') return '';
  const record = item as Record<string, unknown>;
  const value = record.term ?? record.queryText ?? record.query_text;
  return typeof value === 'string' ? value.trim() : '';
}

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

function mapResultToCard(item: unknown, index: number): AppCardData | null {
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
    category: readString(row, 'primary_category_id', 'primaryCategoryId') || undefined,
  };
}

type FilterId = 'all' | 'apps' | 'games' | 'free' | 'paid';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(activeQuery);
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: searchData, loading, error } = useSearch(activeQuery);
  const { data: trendingData } = useTrendingSearchTerms(10);
  const { data: historyData, execute: refreshHistory } = useSearchHistory(10);
  const authed = isAuthenticated();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const allResults: AppCardData[] = useMemo(
    () =>
      (searchData?.items ?? [])
        .map(mapResultToCard)
        .filter((a): a is AppCardData => a !== null),
    [searchData?.items],
  );

  const results = useMemo(() => {
    if (!activeQuery) return [];
    return allResults.filter((item) => {
      const model = (item.pricingModel ?? '').toUpperCase();
      const category = (item.category ?? '').toLowerCase();
      if (activeFilter === 'free') return model === 'FREE' || model === 'FREEMIUM';
      if (activeFilter === 'paid') return model === 'PAID' || model === 'SUBSCRIPTION';
      if (activeFilter === 'games') return category.includes('game') || category.includes('游戏');
      if (activeFilter === 'apps') return !category.includes('game') && !category.includes('游戏');
      return true;
    });
  }, [allResults, activeFilter, activeQuery]);

  const apiTrending = (trendingData?.items ?? [])
    .map(readTerm)
    .filter((term) => term.length > 0);
  const trendingTerms = apiTrending.length > 0 ? apiTrending : FALLBACK_TRENDING;

  const recentSearches = (historyData?.items ?? [])
    .map(readTerm)
    .filter((term) => term.length > 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      if (authed) {
        void recordSearchHistory(query.trim()).then(() => refreshHistory());
      }
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchParams({});
    inputRef.current?.focus();
  };

  const filters: { id: FilterId; label: string }[] = [
    { id: 'all', label: '全部' },
    { id: 'apps', label: '应用' },
    { id: 'games', label: '游戏' },
    { id: 'free', label: '免费' },
    { id: 'paid', label: '付费' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* 搜索头部 */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="relative">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6"
            style={{ color: 'var(--text-tertiary)' }}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="搜索应用、游戏、开发者…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-14 pr-14 py-5 rounded-2xl text-lg transition-all focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-sm)',
            }}
            aria-label="搜索应用、游戏、开发者"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors hover:bg-[var(--bg-muted)]"
              aria-label="清空搜索"
            >
              <X className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
            </button>
          )}
        </form>
      </div>

      {/* 筛选栏 */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors border"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-default)',
            color: 'var(--text-primary)',
          }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          筛选
        </button>
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className="px-4 py-2.5 rounded-full text-sm font-medium transition-colors"
            style={
              activeFilter === filter.id
                ? { backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }
                : {
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                  }
            }
          >
            {filter.label}
          </button>
        ))}
      </div>

      {error ? (
        <div
          className="mb-4 rounded-xl px-4 py-3 text-sm"
          style={{
            backgroundColor: 'var(--warning-subtle)',
            border: '1px solid var(--warning)',
            color: 'var(--warning)',
          }}
          role="alert"
        >
          {formatApiError(error)}
        </div>
      ) : null}

      {/* 内容区 */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-5"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-4">
                <div className="skeleton" style={{ width: 60, height: 60, borderRadius: 'var(--radius-icon)' }} />
                <div className="flex-1 space-y-2">
                  <div className="skeleton" style={{ height: 16, width: '33%' }} />
                  <div className="skeleton" style={{ height: 12, width: '25%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div>
          <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
            找到 {results.length} 个与「
            <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
              {activeQuery}
            </span>
            」相关的结果
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map((app) => (
              <AppCard key={app.id} app={app} size="md" layout="grid" />
            ))}
          </div>
        </div>
      ) : activeQuery ? (
        <EmptyState
          icon={<Search className="w-7 h-7" />}
          title="未找到相关结果"
          description={`没有找到与「${activeQuery}」匹配的应用。请尝试其他关键词或检查拼写。`}
          action={
            <button
              type="button"
              onClick={clearSearch}
              className="btn-primary"
            >
              重新搜索
            </button>
          }
        />
      ) : (
        <div className="space-y-10">
          {/* 热门搜索 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--warning)' }} />
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                热门搜索
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingTerms.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setQuery(term);
                    setSearchParams({ q: term });
                    if (authed) {
                      void recordSearchHistory(term).then(() => refreshHistory());
                    }
                  }}
                  className="px-4 py-2.5 rounded-full text-sm font-medium transition-colors border"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </section>

          {/* 最近搜索 */}
          {recentSearches.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    最近搜索
                  </h3>
                </div>
                {authed ? (
                  <button
                    type="button"
                    className="text-sm font-medium"
                    style={{ color: 'var(--accent)' }}
                    onClick={() => {
                      void clearSearchHistory().then(() => refreshHistory());
                    }}
                  >
                    清空
                  </button>
                ) : null}
              </div>
              <div className="space-y-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      setSearchParams({ q: term });
                    }}
                    className="flex items-center justify-between w-full p-4 rounded-xl transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {term}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* 热门分类 */}
          <section>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              热门分类
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {POPULAR_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setQuery(cat);
                    setSearchParams({ q: cat });
                  }}
                  className="p-4 rounded-xl text-center transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span className="text-sm font-medium">{cat}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
