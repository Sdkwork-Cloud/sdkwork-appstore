import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Heart, Search, CheckCircle2, CloudDownload } from 'lucide-react';
import { useLibrary, useWishlist, formatApiError } from '@/hooks/useApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface LibraryItem {
  id: string;
  slug: string;
  name: string;
  developer: string;
  status: 'installed' | 'update-available';
  size: string;
  iconColor: string;
}

function mapLibraryRow(item: unknown, index: number): LibraryItem {
  const row = item as Record<string, unknown>;
  const slug = String(row.listingSlug ?? row.listingId ?? row.id ?? index);
  return {
    id: String(row.id ?? row.libraryItemId ?? index),
    slug,
    name: String(row.displayName ?? row.listingId ?? 'App'),
    developer: String(row.developerName ?? row.publisherId ?? 'Publisher'),
    status:
      String(row.libraryStatus ?? 'installed') === 'update_available'
        ? 'update-available'
        : 'installed',
    size: String(row.sizeLabel ?? '—'),
    iconColor: 'from-blue-500 to-cyan-500',
  };
}

export function LibraryPage() {
  const { data: libraryData, loading: libraryLoading, error: libraryError } = useLibrary();
  const { data: wishlistData, loading: wishlistLoading, error: wishlistError } = useWishlist();
  const [activeTab, setActiveTab] = useState<'all' | 'installed' | 'updates' | 'wishlist'>('all');

  const libraryItems = (libraryData?.items ?? []).map(mapLibraryRow);
  const wishlistItems = (wishlistData?.items ?? []).map((item, index) => ({
    ...mapLibraryRow(item, index),
    status: 'installed' as const,
  }));

  const loading = activeTab === 'wishlist' ? wishlistLoading : libraryLoading;
  const error = activeTab === 'wishlist' ? wishlistError : libraryError;
  const sourceItems = activeTab === 'wishlist' ? wishlistItems : libraryItems;

  const tabs = [
    { id: 'all' as const, label: 'All', count: libraryItems.length },
    {
      id: 'installed' as const,
      label: 'Installed',
      count: libraryItems.filter((i) => i.status === 'installed').length,
    },
    {
      id: 'updates' as const,
      label: 'Updates',
      count: libraryItems.filter((i) => i.status === 'update-available').length,
    },
    { id: 'wishlist' as const, label: 'Wishlist', count: wishlistItems.length },
  ];

  const filteredItems = sourceItems.filter((item) => {
    if (activeTab === 'installed') return item.status === 'installed';
    if (activeTab === 'updates') return item.status === 'update-available';
    return true;
  });

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">Library</h1>
          <div className="flex items-center gap-2">
            <Link to="/updates" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <CloudDownload className="w-5 h-5 text-gray-600" />
            </Link>
            <Link to="/search" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
        </div>
      </header>

      {error && (
        <div className="mx-4 mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {formatApiError(error)}
        </div>
      )}

      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
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

      {filteredItems.length > 0 ? (
        <div className="px-4 py-2 space-y-3 pb-8">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              to={`/app/${item.slug}`}
              className="flex items-center gap-3 p-3 bg-white rounded-xl"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${item.iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <span className="text-lg font-bold text-white">{item.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.developer}</p>
                <span className="text-xs text-gray-400">{item.size}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.status === 'installed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {item.status === 'update-available' && (
                  <CloudDownload className="w-5 h-5 text-blue-500" />
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
              <p className="text-sm text-gray-500 mt-2">Save apps you are interested in</p>
              <Link to="/" className="inline-block mt-4 px-6 py-2.5 bg-blue-500 text-white rounded-full text-sm font-medium">
                Browse Apps
              </Link>
            </>
          ) : (
            <>
              <Download className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No apps found</h3>
              <p className="text-sm text-gray-500 mt-2">Apps you install will appear here</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
