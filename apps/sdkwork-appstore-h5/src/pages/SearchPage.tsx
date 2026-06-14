import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, ArrowLeft, Star, TrendingUp, Clock } from 'lucide-react';

const trendingSearches = ['Games', 'Social', 'Tools', 'Productivity', 'Photo Editor'];
const recentSearches = ['Productivity App', 'Weather'];

const mockResults = [
  { id: '1', name: 'Amazing Productivity', developer: 'SDKWork', rating: 4.8, iconColor: 'from-blue-500 to-cyan-500' },
  { id: '2', name: 'Photo Editor Pro', developer: 'Creative Labs', rating: 4.6, iconColor: 'from-purple-500 to-pink-500' },
  { id: '3', name: 'Weather Now', developer: 'Weather Inc', rating: 4.5, iconColor: 'from-cyan-500 to-blue-500' },
];

export function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof mockResults>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setResults(mockResults.filter(r => r.name.toLowerCase().includes(query.toLowerCase())));
    }
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    setResults(mockResults.filter(r => r.name.toLowerCase().includes(term.toLowerCase())));
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center flex-shrink-0">
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
              <button type="button" onClick={() => { setQuery(''); setResults([]); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </form>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-4">
        {results.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">{results.length} results</p>
            {results.map(app => (
              <Link key={app.id} to={`/app/${app.id}`} className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div className={`w-12 h-12 bg-gradient-to-br ${app.iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-lg font-bold text-white">{app.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">{app.name}</h3>
                  <p className="text-xs text-gray-500">{app.developer}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-600">{app.rating}</span>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-blue-500 text-white rounded-full text-xs font-medium">Get</button>
              </Link>
            ))}
          </div>
        ) : (
          <div>
            {/* Trending */}
            <section className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-gray-900">Trending</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map(term => (
                  <button key={term} onClick={() => handleQuickSearch(term)} className="px-3 py-2 bg-white rounded-full text-sm border border-gray-200">
                    {term}
                  </button>
                ))}
              </div>
            </section>

            {/* Recent */}
            {recentSearches.length > 0 && (
              <section className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-900">Recent</h3>
                  </div>
                  <button className="text-xs text-blue-500">Clear</button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map(term => (
                    <button key={term} onClick={() => handleQuickSearch(term)} className="flex items-center justify-between w-full p-3 bg-white rounded-xl">
                      <span className="text-sm text-gray-700">{term}</span>
                      <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Categories */}
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Games', 'Social', 'Tools', 'Productivity', 'Entertainment', 'Education'].map(cat => (
                  <button key={cat} onClick={() => handleQuickSearch(cat)} className="p-3 bg-white rounded-xl text-center text-sm font-medium text-gray-700 border border-gray-100">
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
