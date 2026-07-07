import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, ArrowLeft, Star, TrendingUp, Clock } from 'lucide-react';
import {
  useSearch,
  useTrendingSearchTerms,
  useSearchHistory,
  recordSearchHistory,
  clearSearchHistory,
  formatApiError,
} from '@/hooks/useApi';
import { isAuthenticated } from '@/bootstrap/iamRuntime';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { readSearchTerm, mapListingSearchHit } from '@sdkwork/appstore-search-core';

const FALLBACK_TRENDING = ['游戏', '社交', '工具', '效率', '摄影'];

const BROWSE_CATEGORIES = ['游戏', '社交', '工具', '效率', '娱乐', '教育'];

export function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(activeQuery);
  const { data: searchData, loading, error } = useSearch(activeQuery);
  const { data: trendingData } = useTrendingSearchTerms(10);
  const { data: historyData, execute: refreshHistory } = useSearchHistory(10);
  const authed = isAuthenticated();

  useEffect(() => {
    setQuery(activeQuery);
  }, [activeQuery]);

  const results = (searchData?.items ?? [])
    .map((item, index) => mapListingSearchHit(item, index))
    .filter((hit): hit is NonNullable<typeof hit> => hit !== null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      if (authed) {
        void recordSearchHistory(query.trim()).then(() => refreshHistory());
      }
    }
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    setSearchParams({ q: term });
    if (authed) {
      void recordSearchHistory(term).then(() => refreshHistory());
    }
  };

  const apiTrending = (trendingData?.items ?? [])
    .map(readSearchTerm)
    .filter((term) => term.length > 0);
  const trendingTerms = apiTrending.length > 0 ? apiTrending : FALLBACK_TRENDING;

  const recentSearches = (historyData?.items ?? [])
    .map(readSearchTerm)
    .filter((term) => term.length > 0);

  return (
    <div className="animate-fade-in">
      <header
        className="page-header sticky top-0 z-50 border-b"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--bg-surface) 92%, transparent)',
          backdropFilter: 'blur(16px)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
            style={{ color: 'var(--text-primary)' }}
            aria-label="返回"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2"
              style={{ color: 'var(--text-tertiary)' }}
            />
            <input
              type="search"
              placeholder="搜索应用、游戏、开发者…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{
                backgroundColor: 'var(--bg-muted)',
                color: 'var(--text-primary)',
              }}
              autoFocus
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSearchParams({});
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label="清除"
              >
                <X className="h-5 w-5" style={{ color: 'var(--text-tertiary)' }} />
              </button>
            ) : null}
          </form>
        </div>
      </header>

      <div className="px-4 py-4">
        {error ? (
          <div
            className="mb-4 rounded-xl px-4 py-3 text-sm"
            style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
          >
            {formatApiError(error)}
          </div>
        ) : null}

        {loading && activeQuery ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : activeQuery && results.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              找到 {results.length} 个与「{activeQuery}」相关的结果
            </p>
            {results.map((app) => (
              <Link
                key={app.listingSlug}
                to={`/app/${app.listingSlug}`}
                className="card card-press flex items-center gap-3 p-3"
              >
                <div
                  className="app-icon flex h-12 w-12 flex-shrink-0 items-center justify-center text-lg font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, var(--accent), #5856d6)' }}
                >
                  {app.displayName[0]?.toUpperCase() ?? 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {app.displayName}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {app.developerName ?? '开发者'}
                  </p>
                  {(app.averageRating ?? 0) > 0 ? (
                    <div className="mt-0.5 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-[var(--star)] text-[var(--star)]" />
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {app.averageRating?.toFixed(1)}
                      </span>
                    </div>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        ) : activeQuery ? (
          <p className="py-12 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
            未找到与「{activeQuery}」相关的结果
          </p>
        ) : (
          <div>
            <section className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  热搜
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTerms.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleQuickSearch(term)}
                    className="rounded-full border px-3 py-2 text-sm"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </section>

            {recentSearches.length > 0 ? (
              <section className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      最近搜索
                    </h3>
                  </div>
                  {authed ? (
                    <button
                      type="button"
                      className="text-xs font-medium"
                      style={{ color: 'var(--accent)' }}
                      onClick={() => {
                        void clearSearchHistory().then(() => refreshHistory());
                      }}
                    >
                      清除
                    </button>
                  ) : null}
                </div>
                <div className="space-y-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleQuickSearch(term)}
                      className="card w-full rounded-xl px-3 py-2 text-left text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <div className="mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  按分类浏览
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BROWSE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleQuickSearch(cat)}
                    className="card card-press p-3 text-center text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
