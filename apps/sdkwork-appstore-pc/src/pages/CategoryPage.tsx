import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Star, Grid3X3, List } from 'lucide-react';

interface CategoryApp {
  id: string;
  name: string;
  developer: string;
  rating: number;
  ratingCount: number;
  pricingModel: string;
  category: string;
  iconColor: string;
}

const mockApps: CategoryApp[] = [
  { id: '1', name: 'Amazing Productivity', developer: 'SDKWork', rating: 4.8, ratingCount: 15000, pricingModel: 'FREE', category: 'Productivity', iconColor: 'from-blue-500 to-cyan-500' },
  { id: '2', name: 'Task Manager Pro', developer: 'Productivity Inc', rating: 4.6, ratingCount: 8500, pricingModel: 'PAID', category: 'Productivity', iconColor: 'from-purple-500 to-pink-500' },
  { id: '3', name: 'Quick Notes', developer: 'Notes Co', rating: 4.5, ratingCount: 12000, pricingModel: 'FREE', category: 'Productivity', iconColor: 'from-yellow-500 to-orange-500' },
  { id: '4', name: 'Calendar Plus', developer: 'Time Inc', rating: 4.4, ratingCount: 6800, pricingModel: 'FREEMIUM', category: 'Productivity', iconColor: 'from-green-500 to-emerald-500' },
  { id: '5', name: 'File Manager', developer: 'System Tools', rating: 4.3, ratingCount: 9200, pricingModel: 'FREE', category: 'Productivity', iconColor: 'from-red-500 to-orange-500' },
  { id: '6', name: 'Email Client', developer: 'Mail Inc', rating: 4.2, ratingCount: 5600, pricingModel: 'FREE', category: 'Productivity', iconColor: 'from-indigo-500 to-blue-500' },
];

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'rating' | 'downloads' | 'name'>('rating');

  const categoryName = categoryId?.replace(/-/g, ' ') || 'Category';
  const capitalizedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  const sortedApps = [...mockApps].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return b.ratingCount - a.ratingCount;
  });

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">{capitalizedCategory}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{capitalizedCategory}</h1>
        <p className="text-gray-500 mt-2">Browse apps in this category</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortBy('rating')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              sortBy === 'rating' ? 'bg-blue-50 text-blue-600' : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Top Rated
          </button>
          <button
            onClick={() => setSortBy('downloads')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              sortBy === 'downloads' ? 'bg-blue-50 text-blue-600' : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Most Popular
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              sortBy === 'name' ? 'bg-blue-50 text-blue-600' : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            A-Z
          </button>
        </div>
        <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Apps */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sortedApps.map((app) => (
            <Link key={app.id} to={`/app/${app.id}`} className="group">
              <div className="bg-white rounded-2xl p-4 hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className={`aspect-square bg-gradient-to-br ${app.iconColor} rounded-xl mb-3 flex items-center justify-center`}>
                  <span className="text-4xl font-bold text-white">{app.name[0]}</span>
                </div>
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {app.name}
                </h3>
                <p className="text-xs text-gray-500 truncate mt-0.5">{app.developer}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-600">{app.rating}</span>
                    <span className="text-xs text-gray-400">({app.ratingCount.toLocaleString()})</span>
                  </div>
                  <span className="text-xs font-medium text-blue-500">
                    {app.pricingModel === 'FREE' ? 'Free' : app.pricingModel === 'FREEMIUM' ? 'Free' : `$${app.pricingModel}`}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedApps.map((app, index) => (
            <Link
              key={app.id}
              to={`/app/${app.id}`}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl hover:shadow-md transition-all border border-gray-100 group"
            >
              <span className="w-8 text-center font-bold text-gray-400 text-lg">{index + 1}</span>
              <div className={`w-14 h-14 bg-gradient-to-br ${app.iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <span className="text-xl font-bold text-white">{app.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {app.name}
                </h3>
                <p className="text-sm text-gray-500">{app.developer}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">{app.rating}</span>
                </div>
                <span className="text-sm text-gray-500">{app.ratingCount.toLocaleString()} ratings</span>
                <button className="px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600">
                  {app.pricingModel === 'FREE' ? 'Get' : app.pricingModel === 'FREEMIUM' ? 'Get' : 'Buy'}
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
