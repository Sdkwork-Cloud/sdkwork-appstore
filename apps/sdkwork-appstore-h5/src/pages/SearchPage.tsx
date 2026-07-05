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

const trendingSearches = ['Games', 'Social', 'Tools', 'Productivity', 'Photo Editor'];

function readTerm(item: unknown): string {
  if (!item || typeof item !== 'object') return '';
  const record = item as Record<string, unknown>;
  const value = record.term ?? record.queryText ?? record.query_text;
  return typeof value === 'string' ? value.trim() : '';
}

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

  const results = (searchData?.items ?? []).map((item, index) => {
    const listing = item as Record<string, unknown>;
    const slug = String(listing.listingSlug ?? listing.slug ?? listing.id ?? index);
    return {
      id: slug,
      name: String(listing.displayName ?? listing.title ?? 'Listing'),
      developer: String(listing.developerName ?? listing.publisherId ?? '开发者'),
      rating: Number(listing.rating ?? 0),
      iconColor: 'from-blue-500 to-cyan-500',
    };
  });

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
    .map(readTerm)
    .filter((term) => term.length > 0);
  const trendingTerms = apiTrending.length > 0 ? apiTrending : trendingSearches;

  const recentSearches = (historyData?.items ?? [])
    .map(readTerm)
    .filter((term) => term.length > 0);

  return (
    <div className="animate-fade-in">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search apps..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSearchParams({});
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </form>
        </div>
      </header>

      <div className="px-4 py-4">
        {error && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {formatApiError(error)}
          </div>
        )}

        {loading && activeQuery ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : activeQuery && results.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">{results.length} results for “{activeQuery}”</p>
            {results.map((app) => (
              <Link key={app.id} to={`/app/${app.id}`} className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div className={`w-12 h-12 bg-gradient-to-br ${app.iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-lg font-bold text-white">{app.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">{app.name}</h3>
                  <p className="text-xs text-gray-500">{app.developer}</p>
                  {app.rating > 0 && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-gray-600">{app.rating}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : activeQuery ? (
          <p className="text-sm text-gray-500 text-center py-12">No results for “{activeQuery}”.</p>
        ) : (
          <div>
            <section className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-gray-900">Trending</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTerms.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleQuickSearch(term)}
                    className="px-3 py-2 bg-white rounded-full text-sm border border-gray-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </section>

            {recentSearches.length > 0 ? (
              <section className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-900">Recent</h3>
                  </div>
                  {authed ? (
                    <button
                      type="button"
                      className="text-xs text-blue-500"
                      onClick={() => {
                        void clearSearchHistory().then(() => refreshHistory());
                      }}
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
                <div className="space-y-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleQuickSearch(term)}
                      className="w-full text-left px-3 py-2 bg-white rounded-xl text-sm text-gray-700 border border-gray-100"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-900">Browse by category</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['Games', 'Social', 'Tools', 'Productivity', 'Entertainment', 'Education'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleQuickSearch(cat)}
                    className="p-3 bg-white rounded-xl text-center text-sm font-medium text-gray-700 border border-gray-100"
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
