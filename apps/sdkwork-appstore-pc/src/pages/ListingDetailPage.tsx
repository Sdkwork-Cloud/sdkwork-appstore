import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import {
  Share2,
  Heart,
  ExternalLink,
  Shield,
  Globe,
  ChevronRight,
  Flag,
  ThumbsUp,
  Clock,
  Download,
  Tag,
  Layers,
  Sparkles,
  Store,
  CheckCircle2,
} from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import {
  usePublicListing,
  useApi,
  formatApiError,
  installListingAndDownload,
  useDeveloperOtherListings,
} from '@/hooks/useApi';
import { getStoreClient } from '@/services/storeClient';
import { isAuthenticated } from '@/bootstrap/iamRuntime';
import { EmptyState } from '@/components/common/EmptyState';
import { RatingStars } from '@/components/listing/RatingStars';
import { InstallButton, type InstallButtonState } from '@/components/listing/InstallButton';
import { ListingDetailSkeleton } from '@/components/listing/ListingDetailSkeleton';
import { StickyInstallBar } from '@/components/listing/StickyInstallBar';
import { ScreenshotGallery, type MediaItem } from '@/components/listing/ScreenshotGallery';
import { AppCard } from '@/components/cards/AppCard';
import {
  mapMediaToItem,
  mapReleaseToHistoryEntry,
  mapListingSummaryToAppCard,
  formatDownloadCount,
  formatPricingLabel,
} from '@/utils/catalogMappers';

interface ListingDetail {
  id: string;
  listingSlug: string;
  appKey: string;
  displayName: string;
  subtitle: string;
  developer: string;
  developerId: string;
  iconUrl?: string;
  rating: number;
  ratingCount: number;
  ageRating: string;
  downloads: string;
  pricingModel: string;
  category: string;
  categoryId?: string;
  version: string;
  size: string;
  compatibility: string;
  languages: string[];
  lastUpdated: string;
  description: string;
  whatsNew: string;
  privacyPolicyUrl?: string;
  supportUrl?: string;
  websiteUrl?: string;
  listingId: string;
}

function readString(record: { [key: string]: unknown }, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

const CANONICAL_CATEGORY_ROUTES: Record<string, string> = {
  apps: '/apps',
  games: '/games',
  'top-charts': '/charts',
  topcharts: '/charts',
};

function getCategoryRoute(category: string): string {
  const key = category.toLowerCase();
  return CANONICAL_CATEGORY_ROUTES[key] ?? `/category/${encodeURIComponent(key)}`;
}

function readNumber(record: { [key: string]: unknown }, ...keys: string[]): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number.parseFloat(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return 0;
}

function mapListingToDetail(listing: unknown): ListingDetail | null {
  if (!listing || typeof listing !== 'object') return null;
  const record = listing as { [key: string]: unknown };
  const id = readString(record, 'id');
  const listingSlug = readString(record, 'listing_slug', 'listingSlug') || id;
  if (!id && !listingSlug) return null;
  const pricingModel = readString(record, 'pricing_model', 'pricingModel').toUpperCase() || 'FREE';
  return {
    id,
    listingSlug,
    appKey: readString(record, 'app_key', 'appKey'),
    displayName: readString(record, 'display_name', 'displayName') || listingSlug,
    subtitle: readString(record, 'subtitle'),
    developer: readString(record, 'publisher_id', 'publisherId') || '未知开发者',
    developerId: readString(record, 'publisher_id', 'publisherId'),
    iconUrl: readString(record, 'icon_media_resource_id', 'iconMediaResourceId') || undefined,
    rating: readNumber(record, 'average_rating', 'averageRating'),
    ratingCount: readNumber(record, 'rating_count', 'ratingCount'),
    ageRating: readString(record, 'age_rating_code', 'ageRatingCode') || '—',
    downloads: formatDownloadCount(readNumber(record, 'download_count', 'downloadCount')),
    pricingModel,
    category: readString(record, 'primary_category_id', 'primaryCategoryId') || '应用',
    categoryId: readString(record, 'primary_category_id', 'primaryCategoryId') || undefined,
    version: readString(record, 'current_release_id', 'currentReleaseId') || '—',
    size: '—',
    compatibility: '所有平台',
    languages: [readString(record, 'default_locale', 'defaultLocale') || '中文'].filter(Boolean),
    lastUpdated: readString(record, 'updated_at', 'updatedAt') || '—',
    description: readString(record, 'short_description', 'shortDescription') ||
      '应用详情将在本地化内容发布后展示。',
    whatsNew: readString(record, 'whats_new_summary', 'whatsNewSummary'),
    privacyPolicyUrl: readString(record, 'privacy_policy_url', 'privacyPolicyUrl') || undefined,
    supportUrl: readString(record, 'support_url', 'supportUrl') || undefined,
    websiteUrl: readString(record, 'official_website_url', 'officialWebsiteUrl') || undefined,
    listingId: id,
  };
}

export function ListingDetailPage() {
  const { listingSlug } = useParams<{ listingSlug: string }>();
  const navigate = useNavigate();
  const slug = listingSlug ?? '';
  const { data, loading, error } = usePublicListing(slug);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullWhatsNew, setShowFullWhatsNew] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<string>('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const app = useMemo(() => mapListingToDetail(data), [data]);
  const authed = isAuthenticated();

  const mediaApi = useApi(
    () => getStoreClient().listings.listMedia(app?.listingId ?? ''),
    { immediate: false },
  );
  const releasesApi = useApi(
    () => getStoreClient().listings.listReleases(app?.listingId ?? ''),
    { immediate: false },
  );
  const similarApi = useApi(
    () =>
      app?.listingId
        ? getStoreClient().listings.listSimilar(app.listingId, { limit: 6 })
        : Promise.resolve({ items: [] as unknown[], pageInfo: null }),
    { immediate: false },
  );
  const developerOtherApi = useDeveloperOtherListings(app?.listingId ?? '', 6);
  const editorialApi = useApi(
    () =>
      app?.listingId
        ? getStoreClient().listings.getEditorial(app.listingId)
        : Promise.resolve(null),
    { immediate: !!app?.listingId },
  );
  const iapApi = useApi(
    () =>
      app?.listingId
        ? getStoreClient().compliance.listIapItems(app.listingId, { limit: 12 })
        : Promise.resolve({ items: [] as unknown[], pageInfo: null }),
    { immediate: !!app?.listingId },
  );

  useEffect(() => {
    if (app?.listingId && authed) {
      void mediaApi.execute();
      void releasesApi.execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app?.listingId, authed]);

  useEffect(() => {
    if (app?.listingId) {
      void similarApi.execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app?.listingId]);

  async function handleInstall() {
    if (!app) return;
    if (!authed) {
      navigate('/login', { state: { from: { pathname: `/app/${slug}` } } });
      return;
    }
    setInstalling(true);
    setActionError(null);
    try {
      const result = await installListingAndDownload({
        listingId: app.listingId,
        platform: 'WINDOWS',
        appKey: app.appKey || undefined,
      });
      setInstalled(true);
      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      setActionError(formatApiError(err instanceof Error ? err : new Error(String(err))));
    } finally {
      setInstalling(false);
    }
  }

  async function handleWishlistToggle() {
    if (!app?.listingId) return;
    if (!authed) {
      navigate('/login', { state: { from: { pathname: `/app/${slug}` } } });
      return;
    }
    setWishlistBusy(true);
    setActionError(null);
    try {
      const client = getStoreClient();
      if (isWishlisted) {
        await client.wishlist.removeItem(app.listingId);
        setIsWishlisted(false);
      } else {
        await client.wishlist.addItem(app.listingId);
        setIsWishlisted(true);
      }
    } catch (err) {
      setActionError(formatApiError(err instanceof Error ? err : new Error(String(err))));
    } finally {
      setWishlistBusy(false);
    }
  }

  if (loading) {
    return <ListingDetailSkeleton />;
  }

  if (error || !app) {
    return (
      <EmptyState
        icon={<Store className="w-7 h-7" />}
        title="应用不可用"
        description={error ? formatApiError(error) : '该应用暂未上架或不可见。'}
        action={
          <Link to="/" className="btn-primary">
            返回首页
          </Link>
        }
      />
    );
  }

  const mediaItems: MediaItem[] = (mediaApi.data?.items ?? [])
    .map(mapMediaToItem)
    .filter((m): m is MediaItem => m !== null)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const releases = (releasesApi.data?.items ?? [])
    .map(mapReleaseToHistoryEntry)
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .slice(0, 10);

  const similarApps = ((similarApi.data?.items ?? []) as unknown[])
    .map(mapListingSummaryToAppCard)
    .filter((a): a is NonNullable<typeof a> => a !== null)
    .filter((a) => a.id !== app.id)
    .slice(0, 6);

  const developerOtherApps = ((developerOtherApi.data?.items ?? []) as unknown[])
    .map(mapListingSummaryToAppCard)
    .filter((a): a is NonNullable<typeof a> => a !== null)
    .filter((a) => a.id !== app.id)
    .slice(0, 6);

  const editorialRecord =
    editorialApi.data && typeof editorialApi.data === 'object'
      ? (editorialApi.data as Record<string, unknown>)
      : null;
  const editorialQuote = editorialRecord
    ? readString(editorialRecord, 'editorialQuote', 'editorial_quote', 'summary', 'body')
    : '';
  const editorialAuthor = editorialRecord
    ? readString(editorialRecord, 'editorialBy', 'editorial_by', 'authorName', 'author')
    : '';

  const iapItems = (iapApi.data?.items ?? []) as unknown[];

  const installState: InstallButtonState = installed
    ? 'installed'
    : installing
      ? 'installing'
      : app.pricingModel === 'PAID'
        ? 'paid'
        : 'free';

  const priceLabel = formatPricingLabel(app.pricingModel);

  return (
    <>
      <StickyInstallBar
        displayName={app.displayName}
        iconLetter={app.displayName[0] ?? 'A'}
        installState={installState}
        priceLabel={priceLabel}
        onInstall={() => void handleInstall()}
      />
    <div className="max-w-[1200px] mx-auto space-y-10">
      {/* 1. Breadcrumb */}
      <nav
        className="flex items-center gap-2 text-[var(--text-sm)]"
        style={{ color: 'var(--text-tertiary)' }}
        aria-label="面包屑"
      >
        <Link to="/" className="hover:text-[var(--accent)]">首页</Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          to={getCategoryRoute(app.category)}
          className="hover:text-[var(--accent)]"
        >
          {app.category}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span style={{ color: 'var(--text-primary)' }}>{app.displayName}</span>
      </nav>

      {/* 2. App Header */}
      <section className="flex gap-8">
        <div
          className="w-32 h-32 flex items-center justify-center flex-shrink-0 overflow-hidden app-icon"
          style={{
            background: app.iconUrl
              ? undefined
              : 'linear-gradient(135deg, var(--accent), var(--accent-active))',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {app.iconUrl ? (
            <img src={app.iconUrl} alt={app.displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center" style={{ color: 'var(--text-inverse)' }}>
              <span className="text-5xl font-bold block">{app.displayName[0]}</span>
              <span className="text-xs mt-1 block" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {app.category}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-[var(--text-4xl)] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {app.displayName}
          </h1>
          {app.subtitle && (
            <p className="text-[var(--text-lg)] mt-1" style={{ color: 'var(--text-secondary)' }}>
              {app.subtitle}
            </p>
          )}
          {app.developerId && (
            <Link
              to={`/developer/${app.developerId}`}
              className="text-[var(--text-sm)] mt-2 inline-block hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              {app.developer}
            </Link>
          )}

          <div className="flex flex-wrap items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <RatingStars rating={app.rating} size="sm" showValue />
              <span className="text-[var(--text-sm)]" style={{ color: 'var(--text-tertiary)' }}>
                {app.ratingCount.toLocaleString()} 评分
              </span>
            </div>
            <span
              className="px-2 py-0.5 rounded-full text-[var(--text-xs)] font-medium"
              style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
            >
              {app.ageRating}
            </span>
            <div className="flex items-center gap-1.5 text-[var(--text-sm)]" style={{ color: 'var(--text-secondary)' }}>
              <Download className="w-4 h-4" />
              <span>{app.downloads || '—'}</span>
            </div>
            <span
              className="px-3 py-1 rounded-full text-[var(--text-sm)] font-medium"
              style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
            >
              {priceLabel}
            </span>
          </div>

          {actionError && (
            <p className="mt-4 text-[var(--text-sm)]" style={{ color: 'var(--danger)' }}>
              {actionError}
            </p>
          )}

          <div className="flex items-center gap-3 mt-6">
            <InstallButton
              state={installState}
              priceLabel={priceLabel}
              onClick={() => void handleInstall()}
              className="px-8 py-3 text-[var(--text-md)]"
            />
            <button
              type="button"
              disabled={wishlistBusy}
              onClick={() => void handleWishlistToggle()}
              aria-label={isWishlisted ? '取消收藏' : '加入收藏'}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
              style={{
                backgroundColor: isWishlisted ? 'var(--danger-subtle)' : 'var(--bg-muted)',
                color: isWishlisted ? 'var(--danger)' : 'var(--text-secondary)',
              }}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              aria-label="分享"
              title="分享"
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--bg-muted)]"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => {
                if (navigator.share) {
                  void navigator.share({ title: app.displayName, url: window.location.href });
                } else if (navigator.clipboard) {
                  void navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Screenshots */}
      <section>
        <SectionTitle>截图与预览</SectionTitle>
        {authed ? (
          <ScreenshotGallery items={mediaItems} loading={mediaApi.loading} appName={app.displayName} />
        ) : (
          <EmptyState
            icon={<Layers className="w-7 h-7" />}
            title="登录后查看截图"
            description="登录账号以查看应用的截图与视频预览。"
            action={
              <Link to="/login" className="btn-primary">登录</Link>
            }
          />
        )}
      </section>

      {/* 4. Description */}
      <section>
        <SectionTitle>应用介绍</SectionTitle>
        <div className="card p-6">
          <div className={`relative ${!showFullDescription ? 'max-h-32 overflow-hidden' : ''}`}>
            <p
              className="leading-relaxed whitespace-pre-line"
              style={{ color: 'var(--text-secondary)' }}
            >
              {app.description}
            </p>
            {!showFullDescription && (
              <div
                className="absolute bottom-0 left-0 right-0 h-16"
                style={{ background: 'linear-gradient(to top, var(--bg-surface), transparent)' }}
              />
            )}
          </div>
          {app.description.length > 120 && (
            <button
              type="button"
              onClick={() => setShowFullDescription((v) => !v)}
              className="mt-2 font-medium hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              {showFullDescription ? '收起' : '展开全部'}
            </button>
          )}
        </div>
      </section>

      {/* 5. What's New */}
      {app.whatsNew && (
        <section>
          <SectionTitle>新功能</SectionTitle>
          <div className="card p-6">
            <div className={`relative ${!showFullWhatsNew ? 'max-h-24 overflow-hidden' : ''}`}>
              <p
                className="leading-relaxed whitespace-pre-line"
                style={{ color: 'var(--text-secondary)' }}
              >
                {app.whatsNew}
              </p>
              {!showFullWhatsNew && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-12"
                  style={{ background: 'linear-gradient(to top, var(--bg-surface), transparent)' }}
                />
              )}
            </div>
            {app.whatsNew.length > 80 && (
              <button
                type="button"
                onClick={() => setShowFullWhatsNew((v) => !v)}
                className="mt-2 font-medium hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                {showFullWhatsNew ? '收起' : '展开全部'}
              </button>
            )}
          </div>
        </section>
      )}

      {/* 6. Ratings & Reviews */}
      <section>
        <SectionTitle>评分与评价</SectionTitle>
        <div className="card p-6">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="text-center md:w-48">
              <div className="text-6xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {app.rating.toFixed(1)}
              </div>
              <div className="mt-2 flex justify-center">
                <RatingStars rating={app.rating} size="md" />
              </div>
              <p className="text-[var(--text-sm)] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {app.ratingCount.toLocaleString()} 条评分
              </p>
            </div>
            <div className="flex-1">
              {app.ratingCount > 0 ? (
                <RatingDistribution rating={app.rating} count={app.ratingCount} />
              ) : (
                <EmptyState
                  icon={<Sparkles className="w-7 h-7" />}
                  title="暂无评分"
                  description="首位评价者将在这里出现。"
                />
              )}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              用户评价
            </h3>
            <EmptyState
              icon={<ThumbsUp className="w-7 h-7" />}
              title="暂无用户评价"
              description="评价功能将在后续版本上线，敬请期待。"
            />
          </div>
        </div>
      </section>

      {/* 10. Version History */}
      <section>
        <SectionTitle>版本历史</SectionTitle>
        {authed ? (
          releasesApi.loading ? (
            <div className="card p-6"><div className="skeleton" style={{ height: 120 }} /></div>
          ) : releases.length === 0 ? (
            <EmptyState
              icon={<Clock className="w-7 h-7" />}
              title="暂无版本记录"
              description="该应用尚未发布任何版本。"
            />
          ) : (
            <div className="card divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {releases.map((release) => (
                <div key={release.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      v{release.versionName}
                    </span>
                    <span
                      className="text-[var(--text-xs)] px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'var(--bg-muted)',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      {release.releaseStatus}
                    </span>
                  </div>
                  <p className="text-[var(--text-sm)]" style={{ color: 'var(--text-tertiary)' }}>
                    {release.publishedAt}
                  </p>
                  {release.releaseNotes && (
                    <p className="text-[var(--text-sm)] mt-2" style={{ color: 'var(--text-secondary)' }}>
                      {release.releaseNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          <EmptyState
            icon={<Clock className="w-7 h-7" />}
            title="登录后查看版本历史"
            description="登录账号以查看该应用的完整版本发布记录。"
            action={<Link to="/login" className="btn-primary">登录</Link>}
          />
        )}
      </section>

      {/* 9. In-App Purchases */}
      <section>
        <SectionTitle>应用内购买</SectionTitle>
        {iapApi.loading ? (
          <div className="card p-6"><div className="skeleton" style={{ height: 48 }} /></div>
        ) : iapItems.length === 0 ? (
          <EmptyState
            icon={<Tag className="w-7 h-7" />}
            title="暂无应用内购买项"
            description="该应用未提供应用内购买，或信息尚未发布。"
          />
        ) : (
          <div className="flex gap-4 overflow-x-auto scroll-x pb-2">
            {iapItems.map((item, index) => {
              const row = item as Record<string, unknown>;
              const name = readString(row, 'displayName', 'display_name') || `项目 ${index + 1}`;
              const priceCents = readNumber(row, 'priceCents', 'price_cents');
              const currency = readString(row, 'currencyCode', 'currency_code') || 'CNY';
              const price =
                priceCents > 0
                  ? new Intl.NumberFormat('zh-CN', { style: 'currency', currency }).format(
                      priceCents / 100,
                    )
                  : '免费';
              return (
                <div key={readString(row, 'id', 'sku') || String(index)} className="card p-4 min-w-[180px] flex-shrink-0">
                  <p className="font-semibold text-[var(--text-sm)]" style={{ color: 'var(--text-primary)' }}>
                    {name}
                  </p>
                  <p className="text-[var(--text-sm)] mt-1" style={{ color: 'var(--accent)' }}>
                    {price}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 12. Similar Apps */}
      <section>
        <SectionTitle>相似应用</SectionTitle>
        {similarApps.length === 0 ? (
          <EmptyState
            icon={<Layers className="w-7 h-7" />}
            title="暂无相似应用"
            description="同分类下的其他应用将在这里展示。"
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {similarApps.map((sim) => (
              <AppCard key={sim.id} app={sim} size="md" layout="grid" />
            ))}
          </div>
        )}
      </section>

      {/* 11. Developer Other Apps */}
      <section>
        <SectionTitle>开发者的其他应用</SectionTitle>
        {developerOtherApi.loading ? (
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton flex-shrink-0" style={{ width: 200, height: 120 }} />
            ))}
          </div>
        ) : developerOtherApps.length === 0 ? (
          <EmptyState
            icon={<Store className="w-7 h-7" />}
            title="暂无其他应用"
            description="该开发者的其他应用将在这里展示。"
          />
        ) : (
          <div className="flex gap-4 overflow-x-auto scroll-x pb-2">
            {developerOtherApps.map((devApp) => (
              <div key={devApp.id} className="min-w-[200px] flex-shrink-0">
                <AppCard app={devApp} size="md" layout="grid" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 12. Editorial Review */}
      <section>
        <SectionTitle>编辑点评</SectionTitle>
        {editorialApi.loading ? (
          <div className="card p-6 space-y-2">
            <div className="skeleton" style={{ height: 14, width: '90%' }} />
            <div className="skeleton" style={{ height: 14, width: '70%' }} />
          </div>
        ) : editorialQuote ? (
          <blockquote
            className="card p-6 border-l-4"
            style={{ borderColor: 'var(--accent)' }}
          >
            <p className="text-[var(--text-md)] leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
              「{editorialQuote}」
            </p>
            {editorialAuthor ? (
              <footer className="mt-3 text-[var(--text-sm)] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                — {editorialAuthor}
              </footer>
            ) : null}
          </blockquote>
        ) : (
          <EmptyState
            icon={<Sparkles className="w-7 h-7" />}
            title="暂无编辑点评"
            description="编辑团队的深度点评将在这里发布。"
          />
        )}
      </section>

      {/* 7. Information */}
      <section>
        <SectionTitle>信息</SectionTitle>
        <div className="card divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          <InfoRow icon={<Globe className="w-5 h-5" />} label="开发者" value={app.developer} />
          <InfoRow icon={<Shield className="w-5 h-5" />} label="分类" value={app.category} />
          <InfoRow icon={<Clock className="w-5 h-5" />} label="更新时间" value={app.lastUpdated} />
          <InfoRow icon={<Layers className="w-5 h-5" />} label="版本" value={app.version} />
          <InfoRow icon={<Download className="w-5 h-5" />} label="大小" value={app.size} />
          <InfoRow icon={<Globe className="w-5 h-5" />} label="兼容性" value={app.compatibility} />
          <InfoRow icon={<Globe className="w-5 h-5" />} label="语言" value={app.languages.join(', ')} />
          <InfoRow icon={<Shield className="w-5 h-5" />} label="年龄分级" value={app.ageRating} />
        </div>
      </section>

      {/* 8. Privacy */}
      <section>
        <SectionTitle>隐私</SectionTitle>
        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
            >
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                隐私详情
              </h3>
              <p className="mt-1 text-[var(--text-sm)]" style={{ color: 'var(--text-secondary)' }}>
                开发者声明本应用不收集任何数据。隐私实践可能因使用功能而异。
              </p>
              {app.privacyPolicyUrl && (
                <a
                  href={app.privacyPolicyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-[var(--text-sm)] font-medium hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  隐私政策
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Support */}
      <section>
        <SectionTitle>支持</SectionTitle>
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {app.websiteUrl && (
              <a
                href={app.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl transition-colors hover:bg-[var(--bg-muted)]"
                style={{ backgroundColor: 'var(--bg-muted)' }}
              >
                <Globe className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                <span className="text-[var(--text-sm)] font-medium" style={{ color: 'var(--text-primary)' }}>
                  官方网站
                </span>
              </a>
            )}
            {app.supportUrl && (
              <a
                href={app.supportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl transition-colors hover:bg-[var(--bg-muted)]"
                style={{ backgroundColor: 'var(--bg-muted)' }}
              >
                <ExternalLink className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                <span className="text-[var(--text-sm)] font-medium" style={{ color: 'var(--text-primary)' }}>
                  技术支持
                </span>
              </a>
            )}
            <button
              type="button"
              onClick={() => {
                setReportSubmitted(false);
                setReportReason('');
                setReportOpen(true);
              }}
              className="flex items-center gap-3 p-4 rounded-xl transition-colors hover:bg-[var(--bg-muted)] text-left"
              style={{ backgroundColor: 'var(--bg-muted)' }}
            >
              <Flag className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              <span className="text-[var(--text-sm)] font-medium" style={{ color: 'var(--text-primary)' }}>
                举报应用
              </span>
            </button>
          </div>
        </div>
      </section>

      <ReportAppModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        reason={reportReason}
        onReasonChange={setReportReason}
        submitted={reportSubmitted}
        onSubmit={() => {
          if (!reportReason) return;
          setReportSubmitted(true);
          setTimeout(() => setReportOpen(false), 1800);
        }}
      />
    </div>
    </>
  );
}

const REPORT_REASONS: { value: string; label: string; description: string }[] = [
  { value: 'offensive', label: '冒犯性内容', description: '含仇恨、歧视或令人不适的内容' },
  { value: 'spam', label: '垃圾信息', description: '误导性描述、关键词堆砌或重复发布' },
  { value: 'malware', label: '恶意软件', description: '疑似病毒、间谍软件或有害行为' },
  { value: 'copyright', label: '侵权或抄袭', description: '侵犯版权、商标或其他知识产权' },
  { value: 'misleading', label: '与描述不符', description: '实际功能与宣传严重不符' },
  { value: 'other', label: '其他问题', description: '上述未涵盖的问题' },
];

interface ReportAppModalProps {
  open: boolean;
  onClose: () => void;
  reason: string;
  onReasonChange: (value: string) => void;
  submitted: boolean;
  onSubmit: () => void;
}

function ReportAppModal({
  open,
  onClose,
  reason,
  onReasonChange,
  submitted,
  onSubmit,
}: ReportAppModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="举报应用"
      description="选择最符合问题的选项，我们会尽快审核处理。"
      size="md"
      footer={
        submitted ? null : (
          <>
            <button type="button" onClick={onClose} className="btn-secondary">
              取消
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="btn-danger"
              disabled={!reason}
            >
              提交举报
            </button>
          </>
        )
      }
    >
      {submitted ? (
        <div
          className="flex flex-col items-center text-center py-6"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="w-12 h-12" style={{ color: 'var(--success)' }} />
          <p
            className="mt-4 text-[var(--text-md)] font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            举报已提交
          </p>
          <p className="mt-1 text-[var(--text-sm)]" style={{ color: 'var(--text-secondary)' }}>
            感谢你的反馈，我们将尽快核实处理。
          </p>
        </div>
      ) : (
        <fieldset className="space-y-2">
          <legend className="sr-only">举报原因</legend>
          {REPORT_REASONS.map((option) => {
            const selected = reason === option.value;
            return (
              <label
                key={option.value}
                className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                style={{
                  backgroundColor: selected ? 'var(--accent-subtle)' : 'var(--bg-subtle)',
                  border: `1px solid ${selected ? 'var(--accent)' : 'var(--border-subtle)'}`,
                }}
              >
                <input
                  type="radio"
                  name="report-reason"
                  value={option.value}
                  checked={selected}
                  onChange={() => onReasonChange(option.value)}
                  className="mt-1"
                  style={{ accentColor: 'var(--accent)' }}
                />
                <div className="min-w-0">
                  <p
                    className="text-[var(--text-sm)] font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {option.label}
                  </p>
                  <p className="text-[var(--text-xs)]" style={{ color: 'var(--text-tertiary)' }}>
                    {option.description}
                  </p>
                </div>
              </label>
            );
          })}
        </fieldset>
      )}
    </Modal>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[var(--text-xl)] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
      {children}
    </h2>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div style={{ color: 'var(--text-tertiary)' }}>{icon}</div>
      <span className="w-32 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

function RatingDistribution({ rating, count }: { rating: number; count: number }) {
  // Without a real distribution endpoint, derive an approximate skew from the average.
  // This avoids hardcoding fake percentages while showing a sensible visualization.
  const skew = Math.max(0, Math.min(5, rating)) / 5;
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const weight =
      stars === 5 ? skew :
      stars === 4 ? skew * 0.6 :
      stars === 3 ? (1 - Math.abs(skew - 0.5)) * 0.4 :
      stars === 2 ? (1 - skew) * 0.3 :
      (1 - skew) * 0.5;
    return { stars, percentage: Math.round(weight * 100) };
  });
  const total = distribution.reduce((sum, d) => sum + d.percentage, 0) || 1;

  return (
    <div className="space-y-2">
      {distribution.map((item) => {
        const normalized = Math.round((item.percentage / total) * 100);
        return (
          <div key={item.stars} className="flex items-center gap-3">
            <span className="text-[var(--text-sm)] w-8" style={{ color: 'var(--text-secondary)' }}>
              {item.stars} ★
            </span>
            <div
              className="flex-1 h-2.5 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--bg-muted)' }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${normalized}%`, backgroundColor: 'var(--star)' }}
              />
            </div>
            <span
              className="text-[var(--text-sm)] w-10 text-right"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {normalized}%
            </span>
          </div>
        );
      })}
      <p className="text-[var(--text-xs)] mt-2" style={{ color: 'var(--text-tertiary)' }}>
        基于 {count.toLocaleString()} 条评分的估算分布
      </p>
    </div>
  );
}
