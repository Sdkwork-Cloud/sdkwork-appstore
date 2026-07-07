import { type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useListing, formatApiError } from '@sdkwork/appstore-publisher-console-core';
import { LoadingSpinner, readString } from '@sdkwork/appstore-pc-commons';

interface ListingLayoutProps {
  children: ReactNode;
  activeTab: 'manage' | 'releases' | 'compliance' | 'analytics';
}

const TABS = [
  { id: 'manage' as const, label: '详情管理', to: '' },
  { id: 'releases' as const, label: '版本管理', to: '/releases' },
  { id: 'compliance' as const, label: '合规', to: '/compliance' },
  { id: 'analytics' as const, label: '数据分析', to: '/analytics' },
];

function getStatusBadgeClass(status: string): string {
  if (status === 'active') return 'badge-success';
  if (status === 'rejected') return 'badge-error';
  if (status === 'in_review' || status === 'in-review') return 'badge-warning';
  return 'badge-neutral';
}

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    active: '已发布',
    draft: '草稿',
    in_review: '审核中',
    'in-review': '审核中',
    rejected: '已拒绝',
    pending_review: '待审核',
  };
  return map[status] || status;
}

export function ListingLayout({ children, activeTab }: ListingLayoutProps) {
  const { listingId = '' } = useParams();
  const { data: listing, loading, error } = useListing(listingId);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const row = (listing ?? {}) as Record<string, unknown>;
  const displayName =
    readString(row, 'displayName', 'display_name') ||
    readString(row, 'listingSlug', 'listing_slug') ||
    listingId;
  const listingStatus =
    readString(row, 'listingStatus', 'listing_status') || 'draft';
  const reviewStatus =
    readString(row, 'reviewStatus', 'review_status') || '—';

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        to="/publisher/apps"
        className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-80"
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        返回我的应用
      </Link>

      <div className="mb-6">
        <h1
          className="text-3xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          {displayName}
        </h1>
        <div
          className="flex items-center gap-3 mt-2 flex-wrap text-sm"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <span>应用 ID：{listingId}</span>
          <span aria-hidden>·</span>
          <span>
            状态：
            <span className={`ml-1 badge ${getStatusBadgeClass(listingStatus)}`}>
              {getStatusLabel(listingStatus)}
            </span>
          </span>
          <span aria-hidden>·</span>
          <span>审核：{reviewStatus}</span>
        </div>
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

      {/* Tab navigation */}
      <div
        className="flex gap-1 mb-8 rounded-2xl p-1.5 overflow-x-auto"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const to = `/publisher/apps/${listingId}${tab.to}`;
          return (
            <Link
              key={tab.id}
              to={to}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
              style={
                active
                  ? {
                      backgroundColor: 'var(--accent-subtle)',
                      color: 'var(--accent)',
                    }
                  : { color: 'var(--text-secondary)' }
              }
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = 'var(--bg-muted)';
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-current={active ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
