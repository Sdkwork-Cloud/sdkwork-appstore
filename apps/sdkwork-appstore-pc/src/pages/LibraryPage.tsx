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
  Check,
  X,
} from 'lucide-react';
import { useLibrary, useWishlist, formatApiError } from '@/hooks/useApi';
import { getStoreClient } from '@/services/storeClient';
import {
  uninstallLibraryItem,
  removeWishlistListing,
} from '@sdkwork/appstore-library-core';
import { EmptyState } from '@/components/common/EmptyState';
import { RatingStars } from '@/components/listing/RatingStars';

type ItemStatus = 'installed' | 'update-available' | 'not-installed';

interface LibraryItem {
  id: string;
  listingId: string;
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

// 将形如 "1.2 GB" / "850 MB" / "—" 的体积标签解析为字节数，便于正确排序。
const SIZE_UNITS: Record<string, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
};

function parseSizeToBytes(label: string): number {
  if (!label) return 0;
  const match = label.trim().match(/^([\d.]+)\s*([A-Z]+)$/i);
  if (!match) return 0;
  const value = Number.parseFloat(match[1]);
  if (!Number.isFinite(value)) return 0;
  const unit = match[2].toUpperCase();
  const multiplier = SIZE_UNITS[unit] ?? 0;
  return value * multiplier;
}

function mapLibraryRow(item: unknown, index: number): LibraryItem {
  const row = (item ?? {}) as Record<string, unknown>;
  const id = readString(row, 'id', 'libraryItemId') || String(index);
  const listingId = readString(row, 'listingId', 'listing_id') || id;
  const listingSlug = readString(row, 'listingSlug', 'listing_slug') || listingId;
  return {
    id,
    listingId,
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<SortId>('lastUsed');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

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
    if (sortBy === 'size') return parseSizeToBytes(b.size) - parseSizeToBytes(a.size);
    return (b.lastUsed ?? '').localeCompare(a.lastUsed ?? '');
  });

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast(message);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast(null);
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
    async (item: LibraryItem) => {
      setActionBusyId(item.id);
      try {
        await uninstallLibraryItem(getStoreClient(), item.id);
        await refetchLibrary();
        showToast(`「${item.displayName}」已卸载`);
      } catch (err) {
        showToast(formatApiError(err instanceof Error ? err : new Error(String(err))));
      } finally {
        setActionBusyId(null);
      }
    },
    [refetchLibrary, showToast],
  );

  const handleRemoveFromWishlist = useCallback(
    async (item: LibraryItem) => {
      setActionBusyId(item.id);
      try {
        await removeWishlistListing(getStoreClient(), item.listingId);
        await refetchWishlist();
        showToast(`「${item.displayName}」已从收藏夹移除`);
      } catch (err) {
        showToast(formatApiError(err instanceof Error ? err : new Error(String(err))));
      } finally {
        setActionBusyId(null);
      }
    },
    [refetchWishlist, showToast],
  );

  if (loading) {
    return <LibraryPageSkeleton />;
  }

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
                className={`badge ${activeTab === tab.id ? 'badge-info' : 'badge-neutral'}`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 工具栏 */}
      <div className="flex items-center justify-between mb-6">
        <SortDropdown
          current={sortBy}
          open={sortMenuOpen}
          onToggle={() => setSortMenuOpen((v) => !v)}
          onClose={() => setSortMenuOpen(false)}
          onSelect={(id) => {
            setSortBy(id);
            setSortMenuOpen(false);
          }}
        />
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
                onUninstall={() => void handleUninstall(item)}
                onRemoveFromWishlist={() => void handleRemoveFromWishlist(item)}
                actionBusy={actionBusyId === item.id}
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
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[var(--z-toast)] pl-5 pr-3 py-3 rounded-full shadow-lg animate-slide-up flex items-center gap-3"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <span className="text-[var(--text-sm)] font-medium">{toast}</span>
          <button
            type="button"
            onClick={dismissToast}
            className="p-1 rounded-full transition-colors hover:bg-[var(--bg-muted)] flex-shrink-0"
            aria-label="关闭提示"
          >
            <X className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          </button>
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
  actionBusy?: boolean;
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
  actionBusy = false,
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
            disabled={actionBusy}
            className="p-2 rounded-full transition-colors hover:bg-[var(--bg-muted)] disabled:opacity-50"
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

interface SortDropdownProps {
  current: SortId;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelect: (id: SortId) => void;
}

const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: 'lastUsed', label: '最近使用' },
  { id: 'name', label: '名称' },
  { id: 'size', label: '大小' },
];

function SortDropdown({ current, open, onToggle, onClose, onSelect }: SortDropdownProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  const currentLabel = SORT_OPTIONS.find((o) => o.id === current)?.label ?? '排序';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-primary)',
        }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <ArrowUpDown className="w-4 h-4" />
        排序：{currentLabel}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full mt-1 w-44 rounded-xl shadow-lg overflow-hidden animate-scale-in origin-top-left"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            zIndex: 'var(--z-dropdown)',
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="menuitemradio"
              aria-checked={current === opt.id}
              onClick={() => onSelect(opt.id)}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-[var(--text-sm)] transition-colors hover:bg-[var(--bg-muted)]"
              style={{
                color: current === opt.id ? 'var(--accent)' : 'var(--text-primary)',
                fontWeight: current === opt.id ? 600 : 500,
              }}
            >
              <span>{opt.label}</span>
              {current === opt.id && <Check className="w-4 h-4" style={{ color: 'var(--accent)' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LibraryPageSkeleton() {
  return (
    <div>
      {/* 标题占位 */}
      <div className="mb-8">
        <div className="skeleton" style={{ width: 160, height: 36, borderRadius: 'var(--radius-md)' }} />
        <div className="skeleton mt-2" style={{ width: 220, height: 14 }} />
      </div>

      {/* 标签栏占位 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="skeleton"
            style={{ width: 96, height: 40, borderRadius: 'var(--radius-full)' }}
          />
        ))}
      </div>

      {/* 工具栏占位 */}
      <div className="flex items-center justify-between mb-6">
        <div className="skeleton" style={{ width: 132, height: 36, borderRadius: 'var(--radius-md)' }} />
        <div className="skeleton" style={{ width: 72, height: 36, borderRadius: 'var(--radius-md)' }} />
      </div>

      {/* 列表项占位 */}
      <div className="space-y-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="skeleton flex-shrink-0" style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)' }} />
            <div className="flex-1 space-y-2">
              <div className="skeleton" style={{ width: '40%', height: 16 }} />
              <div className="skeleton" style={{ width: '28%', height: 12 }} />
              <div className="skeleton" style={{ width: '32%', height: 12 }} />
            </div>
            <div className="skeleton flex-shrink-0" style={{ width: 64, height: 32, borderRadius: 'var(--radius-full)' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
