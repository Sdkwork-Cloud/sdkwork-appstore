import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Heart,
  Grid3X3,
  List,
  Star,
  MoreHorizontal,
  CloudDownload,
  CheckCircle2,
  ArrowUpDown,
} from 'lucide-react';

interface LibraryItem {
  id: string;
  displayName: string;
  developer: string;
  category: string;
  status: 'installed' | 'update-available' | 'not-installed';
  lastUsed?: string;
  size: string;
  rating: number;
  iconColor: string;
}

const mockLibrary: LibraryItem[] = [
  { id: '1', displayName: 'Amazing Productivity', developer: 'SDKWork', category: 'Productivity', status: 'installed', lastUsed: '2 hours ago', size: '45 MB', rating: 4.8, iconColor: 'from-blue-500 to-cyan-500' },
  { id: '2', displayName: 'Photo Editor Pro', developer: 'Creative Labs', category: 'Photo & Video', status: 'update-available', lastUsed: '1 day ago', size: '120 MB', rating: 4.6, iconColor: 'from-purple-500 to-pink-500' },
  { id: '3', displayName: 'Weather Now', developer: 'Weather Inc', category: 'Weather', status: 'installed', lastUsed: '3 hours ago', size: '25 MB', rating: 4.5, iconColor: 'from-cyan-500 to-blue-500' },
  { id: '4', displayName: 'Fitness Tracker', developer: 'Health Tech', category: 'Health & Fitness', status: 'installed', lastUsed: '5 hours ago', size: '67 MB', rating: 4.7, iconColor: 'from-green-500 to-emerald-500' },
  { id: '5', displayName: 'Note Master', developer: 'Productivity Co', category: 'Productivity', status: 'not-installed', size: '32 MB', rating: 4.4, iconColor: 'from-yellow-500 to-orange-500' },
];

export function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'installed' | 'updates' | 'wishlist'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'lastUsed' | 'size'>('lastUsed');

  const tabs = [
    { id: 'all' as const, label: 'All Apps', icon: ShoppingBag, count: mockLibrary.length },
    { id: 'installed' as const, label: 'Installed', icon: Download, count: mockLibrary.filter(i => i.status === 'installed').length },
    { id: 'updates' as const, label: 'Updates', icon: CloudDownload, count: mockLibrary.filter(i => i.status === 'update-available').length },
    { id: 'wishlist' as const, label: 'Wishlist', icon: Heart, count: 0 },
  ];

  const filteredItems = mockLibrary.filter(item => {
    if (activeTab === 'installed') return item.status === 'installed';
    if (activeTab === 'updates') return item.status === 'update-available';
    if (activeTab === 'wishlist') return false;
    return true;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <p className="text-gray-500 mt-2">Apps you've downloaded or purchased</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-sm border border-gray-200 hover:bg-gray-50">
            <ArrowUpDown className="w-4 h-4" />
            Sort
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

      {/* Content */}
      {filteredItems.length > 0 ? (
        viewMode === 'list' ? (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl hover:shadow-md transition-all border border-gray-100"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${item.iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-xl font-bold text-white">{item.displayName[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{item.displayName}</h3>
                  <p className="text-sm text-gray-500">{item.developer}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {item.lastUsed && (
                      <span className="text-xs text-gray-400">Used {item.lastUsed}</span>
                    )}
                    <span className="text-xs text-gray-400">{item.size}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.status === 'installed' && (
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
                      Open
                    </button>
                  )}
                  {item.status === 'update-available' && (
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600">
                      Update
                    </button>
                  )}
                  {item.status === 'not-installed' && (
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600">
                      Install
                    </button>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 hover:shadow-md transition-all border border-gray-100"
              >
                <div className={`aspect-square bg-gradient-to-br ${item.iconColor} rounded-xl mb-3 flex items-center justify-center`}>
                  <span className="text-4xl font-bold text-white">{item.displayName[0]}</span>
                </div>
                <h3 className="font-semibold text-gray-900 truncate">{item.displayName}</h3>
                <p className="text-xs text-gray-500 truncate">{item.developer}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-600">{item.rating}</span>
                  </div>
                  {item.status === 'installed' && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                  {item.status === 'update-available' && (
                    <CloudDownload className="w-4 h-4 text-blue-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-20">
          {activeTab === 'wishlist' ? (
            <>
              <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Your wishlist is empty</h3>
              <p className="text-gray-500 mt-2">Save apps you're interested in</p>
              <Link to="/" className="inline-block mt-4 px-6 py-2.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600">
                Browse Apps
              </Link>
            </>
          ) : (
            <>
              <Download className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">No apps found</h3>
              <p className="text-gray-500 mt-2">Apps you download will appear here</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
