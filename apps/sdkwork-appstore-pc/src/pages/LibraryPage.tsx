import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Download,
  Heart,
  Grid3X3,
  List,
  MoreHorizontal,
  CloudDownload,
  CheckCircle2,
  ArrowUpDown,
  ShoppingBag,
  ExternalLink,
  Share2,
  Trash2,
  Star,
} from 'lucide-react';
import { useLibrary, useWishlist, formatApiError } from '@/hooks/useApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { RatingStars } from '@/components/listing/RatingStars';

type ItemStatus = 'installed' | 'update-available' | 'not-installed';

interface LibraryItem {
  id: string;
  listingSlug: string;
  displayName: string;
  developer: string;
  category: string;
  status: ItemStatus;
  lastUsed?: string;
  size: string;
  rating?: number;
  iconUrl?: string;
}

function readString(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function readNumber(record: Record<string, unknown>, ...keys: string[]): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
  }
  return 0;
}

function mapLibraryRow(item: unknown, index: number): LibraryItem {
  const row = (item ?? {}) as Record<string, unknown>;
  const id = readString(row, 'id', 'libraryItemId') || String(index);
  const listingSlug = readString(row, 'listingSlug', 'listing_slug', 'listingId', 'listing_id') || id;
  return {
    id,
    listingSlug,
    displayName: readString(row, 'displayName', 'display_name') || listingSlug,
    developer: readString(row, 'developerName', 'publisherId', 'publisher_id') || '未知开发者',
    category: readString(row, 'categoryCode', 'primary_category_id', 'primaryCategoryId') || '应用',
    status:
      readString(row, 'libraryStatus', 'library_status') === 'update_available'
        ? 'update-available'
        : 'installed',
    lastUsed: readString(row, 'updatedAt', 'updated_at') || undefined,
    size: readString(row, 'sizeLabel', 'size_label') || '—',
    rating: readNumber(row, 'rating', 'averageRating', 'average_rating') || undefined,
    iconUrl: readString(row, 'icon_media_resource_id', 'iconMediaResourceId') || undefined,
  };
}

type TabId = 'all' | 'installed' | 'updates' | 'wishlist';
type SortId = 'name' | 'lastUsed' | 'size';

export function LibraryPage() {
  const navigate = useNavigate();
  const { data: libraryData, loading: libraryLoading, error: libraryError } = useLibrary();
  const { data: wishlistData, loading: wishlistLoading, error: wishlistError } = useWishlist();
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<SortId>('lastUsed');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const libraryItems = (libraryData?.items ?? []).map(mapLibraryRow);
  const wishlistItems = (wishlistData?.items ?? []).map((item, index) => ({
    ...mapLibraryRow(item, index),
    status: 'not-installed' as const,
  }));

  const sourceLibrary = activeTab === 'wishlist' ? wishlistItems : libraryItems;
  const loading = activeTab === 'wishlist' ? wishlistLoading : libraryLoading;
  const error = activeTab === 'wishlist' ? wishlistError : libraryError;

  const tabs: { id: TabId; label: string; icon: typeof ShoppingBag; count: number }[] = [
    { id: 'all', label: '全部', icon: ShoppingBag, count: libraryItems.length },
    {
      id: 'installed',
      label: '已安装',
      icon: Download,
      count: libraryItems.filter((item) => item.status === 'installed').length,
    },
    {
      id: 'updates',
      label: '待更新',
      icon: CloudDownload,
      count: libraryItems.filter((item) => item.status === 'update-available').length,
    },
    { id: 'wishlist', label: '收藏夹', icon: Heart, count: wishlistItems.length },
  ];

  const filteredItems = sourceLibrary.filter((item) => {
    if (activeTab === 'installed') return item.status === 'installed';
    if (activeTab === 'updates') return item.status === 'update-available';
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'name') return a.displayName.localeCompare(b.displayName, 'zh-CN');
    if (sortBy === 'size') return a.size.localeCompare(b.size, 'zh-CN');
    return (b.lastUsed ?? '').localeCompare(a.lastUsed ?? '');
  });

  const sortLabels: Record<SortId, string> = {
    name: '名称',
    lastUsed: '最近使用',
    size: '大小',
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const cycleSort = () =>
    setSortBy((prev) => (prev === 'lastUsed' ? 'name' : prev === 'name' ? 'size' : 'lastUsed'));

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const handleShare = useCallback(
    (item: LibraryItem) => {
      const url = `${window.location.origin}/app/${encodeURIComponent(item.listingSlug)}`;
      if (navigator.share) {
        void navigator.share({ title: item.displayName, url });
      } else if (navigator.clipboard) {
        void navigator.clipboard.writeText(url).then(() => showToast('链接已复制到剪贴板'));
      }
    },
    [showToast],
  );

  const handleUninstall = useCallback(
    (item: LibraryItem) => {
      showToast(`已请求卸载「${item.displayName}」`);
    },
    [showToast],
  );

  const handleRemoveFromWishlist = useCallback(
    (item: LibraryItem) => {
      showToast(`已从收藏夹移除「${item.displayName}」`);
    },
    [showToast],
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          我的库
        </h1>
        <p className="mt-2" style={{ color: 'var(--text-tertiary)' }}>
          已下载、已购买与收藏的应用
        </p>
      </div>

      {error && (
        <div
          className="mb-6 rounded-xl px-4 py-3 text-sm"
          style={{
            backgroundColor: 'var(--warning-subtle)',
            border: '1px solid var(--warning)',
            color: 'var(--warning)',
          }}
          role="alert"
        >
          {formatApiError(error)}
        </div>
      )}

      {/* 标签栏 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors"
            style={
              activeTab === tab.id
                ? {
                    backgroundColor: 'var(--accent-subtle)',
                    color: 'var(--accent)',
                  }
                : {
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                  }
            }
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-xs"
                style={
                  activeTab === tab.id
                    ? { backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }
                    : { backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }
                }
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 工具栏 */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={cycleSort}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
          }}
        >
          <ArrowUpDown className="w-4 h-4" />
          排序：{sortLabels[sortBy]}
        </button>
        <div
          className="flex items-center gap-1 rounded-lg p-1 border"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-default)',
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className="p-1.5 rounded transition-colors"
            style={{
              backgroundColor: viewMode === 'grid' ? 'var(--bg-muted)' : 'transparent',
              color: viewMode === 'grid' ? 'var(--accent)' : 'var(--text-tertiary)',
            }}
            aria-label="网格视图"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="p-1.5 rounded transition-colors"
            style={{
              backgroundColor: viewMode === 'list' ? 'var(--bg-muted)' : 'transparent',
              color: viewMode === 'list' ? 'var(--accent)' : 'var(--text-tertiary)',
            }}
            aria-label="列表视图"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 内容区 */}
      {sortedItems.length > 0 ? (
        viewMode === 'list' ? (
          <div className="space-y-2">
            {sortedItems.map((item) => (
              <LibraryRow
                key={item.id}
                item={item}
                isWishlistItem={activeTab === 'wishlist'}
                menuOpen={openMenuId === item.id}
                onToggleMenu={() =>
                  setOpenMenuId((current) => (current === item.id ? null : item.id))
                }
                onCloseMenu={() => setOpenMenuId(null)}
                onOpen={() => navigate(`/app/${encodeURIComponent(item.listingSlug)}`)}
                onGet={() => navigate(`/app/${encodeURIComponent(item.listingSlug)}`)}
                onUpdate={() => navigate('/updates')}
                onShare={() => handleShare(item)}
                onUninstall={() => handleUninstall(item)}
                onRemoveFromWishlist={() => handleRemoveFromWishlist(item)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedItems.map((item) => (
              <LibraryGridCard
                key={item.id}
                item={item}
                onClick={() => navigate(`/app/${encodeURIComponent(item.listingSlug)}`)}
              />
            ))}
          </div>
        )
      ) : (
        <EmptyState
          icon={
            activeTab === 'wishlist' ? (
              <Heart className="w-7 h-7" />
            ) : (
              <Download className="w-7 h-7" />
            )
          }
          title={activeTab === 'wishlist' ? '收藏夹为空' : '暂无应用'}
          description={
            activeTab === 'wishlist'
              ? '收藏感兴趣的应用，方便稍后安装。'
              : '下载的应用将显示在这里。'
          }
          action={
            activeTab === 'wishlist' ? (
              <Link to="/" className="btn-primary">
                去发现
              </Link>
            ) : undefined
          }
        />
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[var(--z-toast)] px-5 py-3 rounded-full shadow-lg animate-slide-up"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <span className="text-[var(--text-sm)] font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
}

interface LibraryRowProps {
  item: LibraryItem;
  isWishlistItem: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onOpen: () => void;
  onGet: () => void;
  onUpdate: () => void;
  onShare: () => void;
  onUninstall: () => void;
  onRemoveFromWishlist: () => void;
}

function LibraryRow({
  item,
  isWishlistItem,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onOpen,
  onGet,
  onUpdate,
  onShare,
  onUninstall,
  onRemoveFromWishlist,
}: LibraryRowProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onCloseMenu();
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseMenu();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen, onCloseMenu]);

  const handleMenuAction = (action: () => void) => () => {
    onCloseMenu();
    action();
  };

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl transition-all"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <AppIcon iconUrl={item.iconUrl} name={item.displayName} size={56} />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
          {item.displayName}
        </h3>
        <p className="text-sm truncate" style={{ color: 'var(--text-tertiary)' }}>
          {item.developer}
        </p>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {typeof item.rating === 'number' && item.rating > 0 && (
            <RatingStars rating={item.rating} size="xs" showValue />
          )}
          {item.lastUsed && (
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              最近使用 {item.lastUsed}
            </span>
          )}
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            {item.size}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {item.status === 'installed' && (
          <button type="button" onClick={onOpen} className="btn-secondary text-sm">
            打开
          </button>
        )}
        {item.status === 'update-available' && (
          <button
            type="button"
            onClick={onUpdate}
            className="btn-primary text-sm"
          >
            更新
          </button>
        )}
        {item.status === 'not-installed' && (
          <button type="button" onClick={onGet} className="btn-primary text-sm">
            获取
          </button>
        )}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={onToggleMenu}
            className="p-2 rounded-full transition-colors hover:bg-[var(--bg-muted)]"
            aria-label="更多操作"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <MoreHorizontal className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-1 w-44 rounded-xl shadow-lg overflow-hidden animate-scale-in origin-top-right"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                zIndex: 'var(--z-dropdown)',
              }}
            >
              <MenuButton
                icon={<ExternalLink className="w-4 h-4" />}
                label="查看详情"
                onClick={handleMenuAction(onGet)}
              />
              <MenuButton
                icon={<Share2 className="w-4 h-4" />}
                label="分享链接"
                onClick={handleMenuAction(onShare)}
              />
              {isWishlistItem ? (
                <MenuButton
                  icon={<Star className="w-4 h-4" />}
                  label="移除收藏"
                  onClick={handleMenuAction(onRemoveFromWishlist)}
                  danger
                />
              ) : item.status === 'installed' ? (
                <MenuButton
                  icon={<Trash2 className="w-4 h-4" />}
                  label="卸载"
                  onClick={handleMenuAction(onUninstall)}
                  danger
                />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MenuButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

function MenuButton({ icon, label, onClick, danger }: MenuButtonProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[var(--text-sm)] transition-colors hover:bg-[var(--bg-muted)]"
      style={{
        color: danger ? 'var(--danger)' : 'var(--text-primary)',
      }}
    >
      <span style={{ color: danger ? 'var(--danger)' : 'var(--text-secondary)' }}>{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

interface LibraryGridCardProps {
  item: LibraryItem;
  onClick: () => void;
}

function LibraryGridCard({ item, onClick }: LibraryGridCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-2xl p-4 transition-all card-hover"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <AppIcon iconUrl={item.iconUrl} name={item.displayName} size={80} className="mb-3" />
      <h3 className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
        {item.displayName}
      </h3>
      <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
        {item.developer}
      </p>
      <div className="flex items-center justify-between mt-2">
        {typeof item.rating === 'number' && item.rating > 0 ? (
          <RatingStars rating={item.rating} size="xs" />
        ) : (
          <span />
        )}
        {item.status === 'installed' && (
          <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--success)' }} />
        )}
        {item.status === 'update-available' && (
          <CloudDownload className="w-4 h-4" style={{ color: 'var(--accent)' }} />
        )}
      </div>
    </button>
  );
}

interface AppIconProps {
  iconUrl?: string;
  name: string;
  size: number;
  className?: string;
}

function AppIcon({ iconUrl, name, size, className = '' }: AppIconProps) {
  return (
    <div
      className={`app-icon ${className}`}
      style={{
        width: size,
        height: size,
        background: iconUrl
          ? undefined
          : 'linear-gradient(135deg, var(--accent), var(--accent-active))',
      }}
    >
      {iconUrl ? (
        <img
          src={iconUrl}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-semibold"
          style={{
            color: 'var(--text-inverse)',
            fontSize: size * 0.4,
          }}
        >
          {name?.[0]?.toUpperCase() ?? '?'}
        </div>
      )}
    </div>
  );
}
