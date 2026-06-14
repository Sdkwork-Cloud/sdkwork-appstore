import { Link } from 'react-router-dom';
import { Search, Star, ChevronRight } from 'lucide-react';

export function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="page-header px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">App Store</h1>
          <Link
            to="/search"
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </Link>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="px-4 py-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Discover Amazing Apps</h2>
          <p className="text-sm text-white/80 mb-4">
            Find the perfect apps for your device
          </p>
          <Link
            to="/search"
            className="inline-block px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-medium"
          >
            Explore Now
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Categories</h2>
          <Link to="/categories" className="text-sm text-blue-500">
            See All
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {['Games', 'Social', 'Tools', 'Entertainment', 'Productivity', 'Education'].map(
            (category) => (
              <Link
                key={category}
                to={`/category/${category.toLowerCase()}`}
                className="flex-shrink-0 px-4 py-2 bg-white rounded-full text-sm font-medium shadow-sm"
              >
                {category}
              </Link>
            )
          )}
        </div>
      </section>

      {/* Featured */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Featured</h2>
          <Link to="/featured" className="text-sm text-blue-500">
            See All
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-40 bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">A</span>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate">App Name</h3>
                <p className="text-xs text-gray-500 truncate">Category</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-gray-600">4.5</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Charts */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Top Charts</h2>
          <Link to="/charts" className="text-sm text-blue-500">
            See All
          </Link>
        </div>
        <div className="bg-white rounded-2xl overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-0"
            >
              <span className="w-6 text-center font-bold text-gray-400">{i}</span>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">App Name</h3>
                <p className="text-xs text-gray-500">Category</p>
              </div>
              <button className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                Get
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
