import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Package,
  Star,
  Download,
  AlertCircle,
} from 'lucide-react';
import {
  usePublisherListings,
  formatApiError,
} from '@sdkwork/appstore-publisher-console-core';
import { LoadingSpinner, readString, readNumber } from '@sdkwork/appstore-pc-commons';

type StatusFilter = 'all' | 'published' | 'draft' | 'in-review' | 'rejected';

interface AppItem {
  id: string;
  slug: string;
  name: string;
  status: 'published' | 'draft' | 'in-review' | 'rejected';
  version: string;
  downloads: number;
  rating: number;
  lastUpdated: string;
}

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'published', label: '已发布' },
  { value: 'draft', label: '草稿' },
  { value: 'in-review', label: '审核中' },
  { value: 'rejected', label: '已拒绝' },
];

function mapListingStatus(
  listingStatus: string,
  reviewStatus: string,
): AppItem['status'] {
  if (
    reviewStatus === 'in_review' ||
    reviewStatus === 'pending' ||
    reviewStatus === 'pending_review'
  ) {
    return 'in-review';
  }
  if (reviewStatus === 'rejected') return 'rejected';
  if (reviewStatus === 'approved' && listingStatus === 'active') return 'published';
  if (listingStatus === 'active') return 'published';
  return 'draft';
}

function mapListingRow(item: unknown, index: number): AppItem {
  const row = (item ?? {}) as Record<string, unknown>;
  const listingStatus = readString(row, 'listingStatus', 'listing_status').toLowerCase();
  const reviewStatus = readString(row, 'reviewStatus', 'review_status').toLowerCase();
  const slug = readString(row, 'listingSlug', 'listing_slug') || String(row.id ?? index);
  return {
    id: String(row.id ?? index),
    slug,
    name: slug,
    status: mapListingStatus(listingStatus, reviewStatus),
    version: readString(row, 'currentReleaseId', 'current_release_id') || '?',
    downloads: readNumber(row, 'downloadCount', 'download_count'),
    rating: readNumber(row, 'averageRating', 'average_rating'),
    lastUpdated: readString(row, 'updatedAt', 'updated_at') || '?',
  };
}

function StatusBadge({ status }: { status: AppItem['status'] }) {
  const config: Record<string, { label: string; className: string }> = {
    published: { label: '已发布', className: 'badge-success' },
    draft: { label: '草稿', className: 'badge-neutral' },
    'in-review': { label: '审核中', className: 'badge-warning' },
    rejected: { label: '已拒绝', className: 'badge-error' },
  };
  const item = config[status] || { label: status, className: 'badge-neutral' };
  return <span className={`badge ${item.className}`}>{item.label}</span>;
}

export function PublisherAppsPage() {
  const { data, loading, error } = usePublisherListings();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [keyword, setKeyword] = useState('');

  const apps = useMemo<AppItem[]>(
    () => (data?.items ?? []).map(mapListingRow),
    [data?.items],
  );

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      if (statusFilter !== 'all' && app.status !== statusFilter) return false;
      if (keyword.trim()) {
        const kw = keyword.trim().toLowerCase();
        if (
          !app.name.toLowerCase().includes(kw) &&
          !app.id.toLowerCase().includes(kw) &&
          !app.slug.toLowerCase().includes(kw)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [apps, statusFilter, keyword]);

  const counts = useMemo(() => {
    const map: Record<StatusFilter, number> = {
      all: apps.length,
      published: 0,
      draft: 0,
      'in-review': 0,
      rejected: 0,
    };
    apps.forEach((app) => {
      map[app.status] += 1;
    });
    return map;
  }, [apps]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            我的应用
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            管理你发布的所有应用，包括版本、合规与数据分析
          </p>
        </div>
        <Link to="/publisher/apps/new" className="btn-primary text-sm">
          <Plus className="w-4 h-4" />
          新建应用
        </Link>
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

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Filter pills + search */}
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div
              className="flex gap-1.5 flex-wrap"
              role="tablist"
              aria-label="应用状态筛选"
            >
              {STATUS_FILTERS.map((f) => {
                const active = statusFilter === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setStatusFilter(f.value)}
                    className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors"
                    style={
                      active
                        ? {
                            backgroundColor: 'var(--accent)',
                            color: 'var(--text-inverse)',
                          }
                        : {
                            backgroundColor: 'var(--bg-muted)',
                            color: 'var(--text-secondary)',
                          }
                    }
                  >
                    {f.label}
                    <span
                      className="ml-1.5 text-xs"
                      style={{ opacity: 0.8 }}
                    >
                      {counts[f.value]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--text-tertiary)' }}
              />
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索应用名称"
                className="input-field pl-9 py-2 text-sm"
                aria-label="搜索应用"
              />
            </div>
          </div>

          {/* Table */}
          {filteredApps.length === 0 ? (
            <div
              className="rounded-2xl p-12 text-center card"
              style={{ color: 'var(--text-secondary)' }}
            >
              {apps.length === 0 ? (
                <>
                  <Package
                    className="w-10 h-10 mx-auto mb-3"
                    style={{ color: 'var(--text-tertiary)' }}
                  />
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    暂无应用
                  </p>
                  <p className="text-sm mt-1">
                    创建你的第一个应用以开始发布。
                  </p>
                  <Link
                    to="/publisher/apps/new"
                    className="btn-primary text-sm mt-4"
                  >
                    <Plus className="w-4 h-4" />
                    新建应用
                  </Link>
                </>
              ) : (
                <>
                  <AlertCircle
                    className="w-8 h-8 mx-auto mb-2"
                    style={{ color: 'var(--text-tertiary)' }}
                  />
                  <p className="text-sm">没有匹配的应用。</p>
                </>
              )}
            </div>
          ) : (
            <div className="card overflow-hidden">
              {/* Table header */}
              <div
                className="hidden md:grid grid-cols-12 px-6 py-3 text-xs font-medium uppercase tracking-wider"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  color: 'var(--text-secondary)',
                }}
              >
                <div className="col-span-4">应用</div>
                <div className="col-span-2">状态</div>
                <div className="col-span-1">版本</div>
                <div className="col-span-2">下载量</div>
                <div className="col-span-1">评分</div>
                <div className="col-span-2 text-right">操作</div>
              </div>

              {/* Table rows */}
              <ul className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                {filteredApps.map((app) => (
                  <li
                    key={app.id}
                    className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center gap-3 md:gap-0 transition-colors hover:bg-[var(--bg-muted)]"
                  >
                    {/* App name + icon */}
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 app-icon flex items-center justify-center flex-shrink-0"
                        style={{
                          background:
                            'linear-gradient(135deg, var(--accent), var(--accent-active))',
                        }}
                      >
                        <span
                          className="text-base font-bold"
                          style={{ color: 'var(--text-inverse)' }}
                        >
                          {app.name[0]?.toUpperCase() ?? 'A'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <Link
                          to={`/publisher/apps/${app.id}`}
                          className="font-medium truncate block transition-colors hover:opacity-80"
                          style={{ color: 'var(--text-primary)' }}
                          title={app.name}
                        >
                          {app.name}
                        </Link>
                        <span
                          className="text-xs truncate block"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          {app.slug}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 md:block flex items-center gap-2">
                      <span
                        className="md:hidden text-xs"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        状态
                      </span>
                      <StatusBadge status={app.status} />
                    </div>

                    {/* Version */}
                    <div
                      className="col-span-1 text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span
                        className="md:hidden text-xs mr-1"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        版本
                      </span>
                      {app.version}
                    </div>

                    {/* Downloads */}
                    <div
                      className="col-span-2 text-sm flex items-center gap-1"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <Download className="w-3.5 h-3.5 hidden md:inline" />
                      {app.downloads >= 1000
                        ? `${(app.downloads / 1000).toFixed(1)}K`
                        : app.downloads.toLocaleString()}
                    </div>

                    {/* Rating */}
                    <div
                      className="col-span-1 text-sm flex items-center gap-1"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {app.rating > 0 ? (
                        <>
                          <Star
                            className="w-3.5 h-3.5"
                            style={{ color: 'var(--star)', fill: 'var(--star)' }}
                          />
                          {app.rating.toFixed(1)}
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-tertiary)' }}>—</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center gap-1 md:justify-end">
                      <Link
                        to={`/app/${app.slug}`}
                        className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-muted)]"
                        style={{ color: 'var(--text-secondary)' }}
                        aria-label="查看详情"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/publisher/apps/${app.id}`}
                        className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-muted)]"
                        style={{ color: 'var(--text-secondary)' }}
                        aria-label="管理应用"
                        title="管理应用"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
