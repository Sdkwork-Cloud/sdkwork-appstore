import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Heart,
  Search,
  Star,
  MoreHorizontal,
  CheckCircle2,
  CloudDownload,
  ArrowUpDown,
} from 'lucide-react';

interface LibraryItem {
  id: string;
  name: string;
  developer: string;
  status: 'installed' | 'update-available' | 'not-installed';
  lastUsed?: string;
  size: string;
  rating: number;
  iconColor: string;
}

const mockLibrary: LibraryItem[] = [
  { id: '1', name: 'Amazing Productivity', developer: 'SDKWork', status: 'installed', lastUsed: '2h ago', size: '45 MB', rating: 4.8, iconColor: 'from-blue-500 to-cyan-500' },
  { id: '2', name: 'Photo Editor Pro', developer: 'Creative Labs', status: 'update-available', lastUsed: '1d ago', size: '120 MB', rating: 4.6, iconColor: 'from-purple-500 to-pink-500' },
  { id: '3', name: 'Weather Now', developer: 'Weather Inc', status: 'installed', lastUsed: '3h ago', size: '25 MB', rating: 4.5, iconColor: 'from-cyan-500 to-blue-500' },
  { id: '4', name: 'Fitness Tracker', developer: 'Health Tech', status: 'installed', lastUsed: '5h ago', size: '67 MB', rating: 4.7, iconColor: 'from-green-500 to-emerald-500' },
];

export function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'installed' | 'updates' | 'wishlist'>('all');

  const tabs = [
    { id: 'all' as const, label: 'All', count: mockLibrary.length },
    { id: 'installed' as const, label: 'Installed', count: mockLibrary.filter(i => i.status === 'installed').length },
    { id: 'updates' as const, label: 'Updates', count: mockLibrary.filter(i => i.status === 'update-available').length },
    { id: 'wishlist' as const, label: 'Wishlist', count: 0 },
  ];

  const filteredItems = mockLibrary.filter(item => {
    if (activeTab === 'installed') return item.status === 'installed';
    if (activeTab === 'updates') return item.status === 'update-available';
    if (activeTab === 'wishlist') return false;
    return true;
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">Library</h1>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <ArrowUpDown className="w-5 h-5 text-gray-600" />
            </button>
            <Link to="/search" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-blue-400' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {filteredItems.length > 0 ? (
        <div className="px-4 py-2 space-y-3">
          {filteredItems.map(item => (
            <Link
              key={item.id}
              to={`/app/${item.id}`}
              className="flex items-center gap-3 p-3 bg-white rounded-xl"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${item.iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <span className="text-lg font-bold text-white">{item.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.developer}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {item.lastUsed && <span className="text-xs text-gray-400">{item.lastUsed}</span>}
                  <span className="text-xs text-gray-400">{item.size}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.status === 'installed' && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                {item.status === 'update-available' && (
                  <button className="px-3 py-1.5 bg-blue-500 text-white rounded-full text-xs font-medium">
                    Update
                  </button>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4">
          {activeTab === 'wishlist' ? (
            <>
              <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Your wishlist is empty</h3>
              <p className="text-sm text-gray-500 mt-2">Save apps you're interested in</p>
              <Link to="/" className="inline-block mt-4 px-6 py-2.5 bg-blue-500 text-white rounded-full text-sm font-medium">
                Browse Apps
              </Link>
            </>
          ) : (
            <>
              <Download className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No apps found</h3>
              <p className="text-sm text-gray-500 mt-2">Apps you download will appear here</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
