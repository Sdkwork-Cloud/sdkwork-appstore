import { useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, SlidersHorizontal, Star, TrendingUp, Clock, ArrowRight } from 'lucide-react';

interface SearchResult {
  id: string;
  displayName: string;
  subtitle?: string;
  developer: string;
  rating: number;
  ratingCount: number;
  pricingModel: string;
  category: string;
  iconColor: string;
}

const trendingSearches = [
  'Productivity', 'Social Media', 'Games', 'Photo Editor', 'Music Player',
  'Weather', 'Fitness', 'Note Taking', 'VPN', 'Calculator'
];

const recentSearches = ['Productivity App', 'Photo Editor', 'Weather'];

const mockResults: SearchResult[] = [
  { id: '1', displayName: 'Amazing Productivity', subtitle: 'Get things done', developer: 'SDKWork', rating: 4.8, ratingCount: 15000, pricingModel: 'FREE', category: 'Productivity', iconColor: 'from-blue-500 to-cyan-500' },
  { id: '2', displayName: 'Photo Editor Pro', subtitle: 'Professional photo editing', developer: 'Creative Labs', rating: 4.6, ratingCount: 8500, pricingModel: 'PAID', category: 'Photo & Video', iconColor: 'from-purple-500 to-pink-500' },
  { id: '3', displayName: 'Weather Now', subtitle: 'Accurate forecasts', developer: 'Weather Inc', rating: 4.5, ratingCount: 25000, pricingModel: 'FREE', category: 'Weather', iconColor: 'from-cyan-500 to-blue-500' },
  { id: '4', displayName: 'Fitness Tracker', subtitle: 'Stay healthy', developer: 'Health Tech', rating: 4.7, ratingCount: 12000, pricingModel: 'FREEMIUM', category: 'Health & Fitness', iconColor: 'from-green-500 to-emerald-500' },
  { id: '5', displayName: 'Note Master', subtitle: 'Smart note taking', developer: 'Productivity Co', rating: 4.4, ratingCount: 6800, pricingModel: 'FREE', category: 'Productivity', iconColor: 'from-yellow-500 to-orange-500' },
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
    inputRef.current?.focus();
  }, [initialQuery]);

  const performSearch = (q: string) => {
    setLoading(true);
    setTimeout(() => {
      setResults(mockResults.filter(r =>
        r.displayName.toLowerCase().includes(q.toLowerCase()) ||
        r.developer.toLowerCase().includes(q.toLowerCase()) ||
        r.category.toLowerCase().includes(q.toLowerCase())
      ));
      setLoading(false);
    }, 500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      performSearch(query.trim());
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSearchParams({});
    inputRef.current?.focus();
  };

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'apps', label: 'Apps' },
    { id: 'games', label: 'Games' },
    { id: 'free', label: 'Free' },
    { id: 'paid', label: 'Paid' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Header */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search apps, games, and more..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-14 pr-14 py-5 bg-white rounded-2xl text-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </form>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === filter.id
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded w-1/4 mt-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/5 mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            {results.length} result{results.length !== 1 ? 's' : ''} for "<span className="font-medium text-gray-700">{initialQuery}</span>"
          </p>
          <div className="space-y-3">
            {results.map((app) => (
              <Link
                key={app.id}
                to={`/app/${app.id}`}
                className="flex items-center gap-4 p-5 bg-white rounded-2xl hover:shadow-md transition-all duration-300 group border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${app.iconColor} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-2xl font-bold text-white">{app.displayName[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {app.displayName}
                  </h3>
                  {app.subtitle && (
                    <p className="text-sm text-gray-500 truncate">{app.subtitle}</p>
                  )}
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="text-xs text-gray-400">{app.developer}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-gray-600">{app.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">{app.category}</span>
                  </div>
                </div>
                <button className="px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors">
                  {app.pricingModel === 'FREE' ? 'Get' : app.pricingModel === 'FREEMIUM' ? 'Get' : 'Buy'}
                </button>
              </Link>
            ))}
          </div>
        </div>
      ) : initialQuery ? (
        <div className="text-center py-20">
          <Search className="w-20 h-20 text-gray-200 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900">No results found</h3>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            We couldn't find anything matching "{initialQuery}". Try different keywords or check your spelling.
          </p>
        </div>
      ) : (
        <div>
          {/* Trending Searches */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">Trending Searches</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    setSearchParams({ q: term });
                    performSearch(term);
                  }}
                  className="px-4 py-2.5 bg-white rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </section>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">Recent Searches</h3>
                </div>
                <button className="text-sm text-blue-500 hover:text-blue-600">Clear All</button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      setSearchParams({ q: term });
                      performSearch(term);
                    }}
                    className="flex items-center justify-between w-full p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{term}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Popular Categories */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Productivity', 'Games', 'Social', 'Entertainment', 'Tools', 'Education', 'Business', 'Health'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setQuery(cat);
                    setSearchParams({ q: cat });
                    performSearch(cat);
                  }}
                  className="p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors text-center"
                >
                  <span className="text-sm font-medium text-gray-700">{cat}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
