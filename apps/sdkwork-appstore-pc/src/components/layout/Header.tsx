import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Bell, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">App Store</span>
          </Link>

          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search apps, games, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-96 pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </form>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/updates"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden xl:inline">Updates</span>
          </Link>
          <Link
            to="/library"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden xl:inline">Library</span>
          </Link>
          <Link
            to="/publisher"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <User className="w-4 h-4" />
            <span className="hidden xl:inline">Developer</span>
          </Link>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <Link
            to="/notifications"
            className="relative w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Link>
          <Link
            to="/settings"
            className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
