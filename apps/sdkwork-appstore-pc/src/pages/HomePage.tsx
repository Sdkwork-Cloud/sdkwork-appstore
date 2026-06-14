import { Link } from 'react-router-dom';
import { ChevronRight, Star, TrendingUp } from 'lucide-react';
import { useHomeFeed, useCategories } from '@/hooks/useApi';

export function HomePage() {
  const { data: homeFeed, loading: feedLoading } = useHomeFeed();
  const { data: categories, loading: categoriesLoading } = useCategories();

  if (feedLoading || categoriesLoading) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Welcome to App Store</h1>
            <p className="text-lg text-white/80 mb-6">
              Discover amazing apps, games, and more for your devices
            </p>
            <div className="flex gap-3">
              <Link
                to="/search"
                className="px-6 py-2.5 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Explore Apps
              </Link>
              <Link
                to="/category/featured"
                className="px-6 py-2.5 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-colors"
              >
                View Featured
              </Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mb-20" />
        </div>
      </section>

      {/* Featured Apps */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Featured Apps</h2>
            <p className="text-gray-500 mt-1">Handpicked by our editors</p>
          </div>
          <Link
            to="/category/featured"
            className="flex items-center gap-1 text-blue-500 hover:text-blue-600 font-medium"
          >
            See All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* Featured apps will be rendered here */}
          <div className="col-span-full text-center py-12 text-gray-400">
            Featured apps will appear here once the backend is running
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories?.items?.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group p-6 bg-white rounded-2xl hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <span className="text-xl">📱</span>
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {category.localizations?.[0]?.displayName || category.categoryCode}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {category.localizations?.[0]?.description || 'Explore apps'}
              </p>
            </Link>
          )) || (
            <>
              {['Productivity', 'Games', 'Social', 'Entertainment', 'Tools', 'Education', 'Business', 'Health'].map((name) => (
                <Link key={name} to={`/category/${name.toLowerCase()}`} className="group p-6 bg-white rounded-2xl hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-xl">📱</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Explore apps</p>
                </Link>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Top Charts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold">Top Charts</h2>
          </div>
          <Link
            to="/category/top-charts"
            className="flex items-center gap-1 text-blue-500 hover:text-blue-600 font-medium"
          >
            See All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              Top Free
            </h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-6 text-center font-bold text-gray-400">{i}</span>
                  <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              Top Paid
            </h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-6 text-center font-bold text-gray-400">{i}</span>
                  <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Trending
            </h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-6 text-center font-bold text-gray-400">{i}</span>
                  <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HomePageSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="h-64 bg-gray-200 rounded-3xl" />
      <div>
        <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
        <div className="grid grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4">
              <div className="aspect-square bg-gray-200 rounded-xl mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
