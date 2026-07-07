import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Heart,
  Search,
  CheckCircle2,
  CloudDownload,
  MoreHorizontal,
  Trash2,
  Star,
} from 'lucide-react';
import { useLibrary, useWishlist, formatApiError } from '@/hooks/useApi';
import { getStoreClient } from '@/services/storeClient';
import {
  uninstallLibraryItem,
  removeWishlistListing,
} from '@sdkwork/appstore-library-core';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface LibraryItem {
  id: string;
  listingId: string;
  slug: string;
  name: string;
  developer: string;
  status: 'installed' | 'update-available';
  size: string;
}

function mapLibraryRow(item: unknown, index: number): LibraryItem {
  const row = item as Record<string, unknown>;
  const id = String(row.id ?? row.libraryItemId ?? index);
  const listingId = String(row.listingId ?? row.listing_id ?? id);
  const slug = String(row.listingSlug ?? row.listing_slug ?? listingId);
  return {
    id,
    listingId,
    slug,
    name: String(row.displayName ?? row.display_name ?? listingId ?? '应用'),
    developer: String(row.developerName ?? row.publisherName ?? '开发者'),
    status:
      String(row.libraryStatus ?? row.library_status ?? 'installed') === 'update_available'
        ? 'update-available'
        : 'installed',
    size: String(row.sizeLabel ?? row.size_label ?? '—'),
  };
}

type TabId = 'all' | 'installed' | 'updates' | 'wishlist';

export function LibraryPage() {
  const {
    data: libraryData,
    loading: libraryLoading,
    error: libraryError,
    execute: refetchLibrary,
  } = useLibrary();
  const {
    data: wishlistData,
    loading: wishlistLoading,
    error: wishlistError,
    execute: refetchWishlist,
  } = useWishlist();
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [toast, setToast] = useState<string | null>(null);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const libraryItems = (libraryData?.items ?? []).map(mapLibraryRow);
  const wishlistItems = (wishlistData?.items ?? []).map(mapLibraryRow);

  const loading = activeTab === 'wishlist' ? wishlistLoading : libraryLoading;
  const error = activeTab === 'wishlist' ? wishlistError : libraryError;
  const sourceItems = activeTab === 'wishlist' ? wishlistItems : libraryItems;
  const isWishlistTab = activeTab === 'wishlist';

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: 'all', label: '全部', count: libraryItems.length },
    {
      id: 'installed',
      label: '已安装',
      count: libraryItems.filter((i) => i.status === 'installed').length,
    },
    {
      id: 'updates',
      label: '待更新',
      count: libraryItems.filter((i) => i.status === 'update-available').length,
    },
    { id: 'wishlist', label: '收藏', count: wishlistItems.length },
  ];

  const filteredItems = sourceItems.filter((item) => {
    if (activeTab === 'installed') return item.status === 'installed';
    if (activeTab === 'updates') return item.status === 'update-available';
    return true;
  });

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const handleUninstall = useCallback(
    async (item: LibraryItem) => {
      setActionBusyId(item.id);
      setOpenMenuId(null);
      try {
        await uninstallLibraryItem(getStoreClient(), item.id);
        await refetchLibrary();
        showToast(`「${item.name}」已卸载`);
      } catch (err) {
        showToast(formatApiError(err instanceof Error ? err : new Error(String(err))));
      } finally {
        setActionBusyId(null);
      }
    },
    [refetchLibrary, showToast],
  );

  const handleRemoveWishlist = useCallback(
    async (item: LibraryItem) => {
      setActionBusyId(item.id);
      setOpenMenuId(null);
      try {
        await removeWishlistListing(getStoreClient(), item.listingId);
        await refetchWishlist();
        showToast(`「${item.name}」已从收藏移除`);
      } catch (err) {
        showToast(formatApiError(err instanceof Error ? err : new Error(String(err))));
      } finally {
        setActionBusyId(null);
      }
    },
    [refetchWishlist, showToast],
  );

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-24">
      <header className="page-header sticky top-0 z-40 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">我的库</h1>
          <div className="flex items-center gap-2">
            <Link
              to="/updates"
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--bg-muted)' }}
              aria-label="更新"
            >
              <CloudDownload className="h-5 w-5 text-[var(--text-secondary)]" />
            </Link>
            <Link
              to="/search"
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--bg-muted)' }}
              aria-label="搜索"
            >
              <Search className="h-5 w-5 text-[var(--text-secondary)]" />
            </Link>
          </div>
        </div>
      </header>

      {error ? (
        <div
          className="mx-4 mt-3 rounded-xl px-4 py-3 text-sm"
          style={{
            backgroundColor: 'var(--warning-subtle)',
            border: '1px solid var(--warning)',
            color: 'var(--warning)',
          }}
          role="alert"
        >
          {formatApiError(error)}
        </div>
      ) : null}

      <div className="scroll-x flex gap-2 px-4 py-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors"
            style={
              activeTab === tab.id
                ? { backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }
                : {
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                  }
            }
          >
            {tab.label}
            {tab.count > 0 ? (
              <span
                className="rounded-full px-1.5 py-0.5 text-xs"
                style={{
                  backgroundColor:
                    activeTab === tab.id ? 'color-mix(in srgb, white 25%, transparent)' : 'var(--bg-muted)',
                }}
              >
                {tab.count}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {filteredItems.length > 0 ? (
        <div className="space-y-2 px-4 py-2">
          {filteredItems.map((item) => (
            <div key={item.id} className="card relative flex items-center gap-3 p-3">
              <Link to={`/app/${item.slug}`} className="flex min-w-0 flex-1 items-center gap-3">
                <div
                  className="app-icon flex h-14 w-14 flex-shrink-0 items-center justify-center text-lg font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, var(--accent), #5856d6)' }}
                >
                  {item.name[0]?.toUpperCase() ?? 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-[var(--text-primary)]">{item.name}</h3>
                  <p className="truncate text-xs text-[var(--text-tertiary)]">{item.developer}</p>
                  <span className="text-xs text-[var(--text-tertiary)]">{item.size}</span>
                </div>
                {!isWishlistTab && item.status === 'installed' ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[var(--success)]" />
                ) : null}
                {!isWishlistTab && item.status === 'update-available' ? (
                  <CloudDownload className="h-5 w-5 flex-shrink-0 text-[var(--accent)]" />
                ) : null}
              </Link>
              <button
                type="button"
                disabled={actionBusyId === item.id}
                onClick={() => setOpenMenuId((current) => (current === item.id ? null : item.id))}
                className="flex-shrink-0 rounded-full p-2 disabled:opacity-50"
                aria-label="更多操作"
              >
                <MoreHorizontal className="h-5 w-5 text-[var(--text-tertiary)]" />
              </button>
              {openMenuId === item.id ? (
                <div
                  className="absolute right-3 top-full z-10 mt-1 w-40 overflow-hidden rounded-xl shadow-lg"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {isWishlistTab ? (
                    <button
                      type="button"
                      onClick={() => void handleRemoveWishlist(item)}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm"
                      style={{ color: 'var(--danger)' }}
                    >
                      <Star className="h-4 w-4" />
                      移除收藏
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handleUninstall(item)}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm"
                      style={{ color: 'var(--danger)' }}
                    >
                      <Trash2 className="h-4 w-4" />
                      卸载
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-16 text-center">
          {isWishlistTab ? (
            <>
              <Heart className="mx-auto mb-4 h-14 w-14 text-[var(--text-tertiary)]" />
              <h3 className="text-base font-semibold text-[var(--text-primary)]">收藏夹为空</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">收藏感兴趣的应用，方便稍后安装</p>
              <Link to="/" className="btn-primary mt-4 inline-flex text-sm">
                去发现
              </Link>
            </>
          ) : (
            <>
              <Download className="mx-auto mb-4 h-14 w-14 text-[var(--text-tertiary)]" />
              <h3 className="text-base font-semibold text-[var(--text-primary)]">暂无应用</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">下载的应用将显示在这里</p>
              <Link to="/search" className="btn-primary mt-4 inline-flex text-sm">
                去搜索
              </Link>
            </>
          )}
        </div>
      )}

      {toast ? (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-full px-5 py-3 text-sm font-medium shadow-lg"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
