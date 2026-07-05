import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import {
  formatApiError,
  usePublisher,
  usePublisherListings,
} from '@sdkwork/appstore-publisher-console-core';
import { LoadingSpinner, readString } from '@sdkwork/appstore-h5-commons';

function mapReviewLabel(reviewStatus: string, listingStatus: string): string {
  if (reviewStatus === 'in_review' || reviewStatus === 'pending' || reviewStatus === 'pending_review') {
    return '审核中';
  }
  if (reviewStatus === 'rejected') {
    return '已拒绝';
  }
  if (reviewStatus === 'approved' && listingStatus === 'active') {
    return '已上架';
  }
  return '草稿';
}

export function PublisherConsolePage() {
  const { data: publisherData, loading: publisherLoading, error: publisherError } = usePublisher();
  const { data: listingsData, loading: listingsLoading, error: listingsError } = usePublisherListings();

  const items = listingsData?.items ?? [];
  const loading = publisherLoading || listingsLoading;
  const error = publisherError ?? listingsError;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  const publisherRow = (publisherData ?? {}) as Record<string, unknown>;
  const publisherName = readString(publisherRow, 'displayName', 'display_name') || '开发者';

  return (
    <div className="animate-fade-in pb-6">
      <header className="page-header">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/settings" className="flex h-10 w-10 items-center justify-center" aria-label="返回设置">
            <ArrowLeft className="h-6 w-6" style={{ color: 'var(--text-primary)' }} />
          </Link>
          <h1 className="text-lg font-bold text-[var(--text-primary)]">开发者中心</h1>
          <Link
            to="/publisher/apps/new"
            className="flex h-10 w-10 items-center justify-center text-[var(--accent)]"
            aria-label="创建应用"
          >
            <Plus className="h-6 w-6" />
          </Link>
        </div>
      </header>

      <div className="px-4 py-4">
        <p className="text-sm text-[var(--text-tertiary)] mb-4">发布者：{publisherName}</p>

        {error && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {formatApiError(error)}
          </div>
        )}

        {!publisherData && (
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            请先在 PC 端开发者控制台创建发布者资料，或联系管理员开通权限。
          </p>
        )}

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--text-tertiary)] mb-4">暂无应用</p>
            <Link
              to="/publisher/apps/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white rounded-full text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              创建应用
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item, index) => {
              const row = (item ?? {}) as Record<string, unknown>;
              const id = readString(row, 'id') || String(index);
              const slug = readString(row, 'listingSlug', 'listing_slug') || id;
              const reviewStatus = readString(row, 'reviewStatus', 'review_status').toLowerCase();
              const listingStatus = readString(row, 'listingStatus', 'listing_status').toLowerCase();
              return (
                <li key={id}>
                  <Link
                    to={`/publisher/apps/${id}`}
                    className="block card card-press px-4 py-3"
                  >
                    <div className="font-semibold text-[var(--text-primary)]">{slug}</div>
                    <div className="text-xs text-[var(--text-tertiary)] mt-1">
                      {listingStatus} · {mapReviewLabel(reviewStatus, listingStatus)}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
