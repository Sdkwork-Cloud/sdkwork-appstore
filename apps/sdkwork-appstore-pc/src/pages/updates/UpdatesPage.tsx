import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Shield,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';
import { useLibraryUpdates, formatApiError, resolveArtifactDownload } from '@/hooks/useApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { mapLibraryUpdateRow, type LibraryUpdateRow } from '@sdkwork/appstore-library-core';

export function UpdatesPage() {
  const { data, loading, error, execute } = useLibraryUpdates();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number; failed: number } | null>(null);

  const updates = useMemo(() => {
    const libraryItems = data?.libraryItems ?? [];
    return (data?.updates ?? []).map((update, index) =>
      mapLibraryUpdateRow(update, index, libraryItems),
    );
  }, [data]);

  const downloadableUpdates = useMemo(
    () => updates.filter((u) => u.artifactId),
    [updates],
  );

  async function handleUpdateDownload(update: LibraryUpdateRow) {
    if (!update.artifactId) {
      setActionError('该更新暂无可下载的安装包。');
      return;
    }
    setDownloadingId(update.id);
    setActionError(null);
    try {
      const downloadUrl = await resolveArtifactDownload({
        artifactId: update.artifactId,
        appKey: update.appKey || undefined,
      });
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setActionError(formatApiError(err instanceof Error ? err : new Error(String(err))));
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleUpdateAll() {
    if (downloadableUpdates.length === 0) return;
    setBulkUpdating(true);
    setActionError(null);
    setBulkProgress({ done: 0, total: downloadableUpdates.length, failed: 0 });
    let failed = 0;
    for (let i = 0; i < downloadableUpdates.length; i++) {
      const update = downloadableUpdates[i];
      try {
        const downloadUrl = await resolveArtifactDownload({
          artifactId: update.artifactId!,
          appKey: update.appKey || undefined,
        });
        window.open(downloadUrl, '_blank', 'noopener,noreferrer');
      } catch {
        failed += 1;
      }
      setBulkProgress({ done: i + 1, total: downloadableUpdates.length, failed });
    }
    setBulkUpdating(false);
    if (failed > 0) {
      setActionError(`${failed} 个应用更新下载失败，请重试或单独更新。`);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const hasDownloadableUpdates = downloadableUpdates.length > 0;
  const bulkInProgress = bulkUpdating && bulkProgress !== null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">应用更新</h1>
          <p className="text-[var(--text-tertiary)] mt-1">
            {updates.length > 0
              ? `有 ${updates.length} 个可用更新`
              : '所有已安装应用均为最新版本'}
          </p>
          {bulkInProgress && (
            <p className="text-sm mt-2" style={{ color: 'var(--accent)' }}>
              正在批量下载 {bulkProgress.done}/{bulkProgress.total}
              {bulkProgress.failed > 0 ? `（失败 ${bulkProgress.failed}）` : ''}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {hasDownloadableUpdates && (
            <button
              type="button"
              onClick={() => void handleUpdateAll()}
              disabled={bulkUpdating}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-[var(--text-inverse)] rounded-full text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="一键全部更新"
            >
              {bulkUpdating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  更新中…
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  全部更新
                </>
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => execute()}
            disabled={bulkUpdating}
            className="flex items-center gap-2 px-5 py-2.5 border border-[var(--border-default)] rounded-full text-sm font-medium transition-colors hover:bg-[var(--bg-muted)] disabled:opacity-60"
            style={{ color: 'var(--text-primary)' }}
            aria-label="检查更新"
          >
            <RefreshCw className="w-4 h-4" />
            检查更新
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-[var(--warning)] bg-[var(--warning-subtle)] px-4 py-3 text-sm text-[var(--warning)]">
          {formatApiError(error)}
        </div>
      )}

      {actionError && (
        <div className="mb-6 rounded-xl border border-[var(--danger)] bg-[var(--danger-subtle)] px-4 py-3 text-sm text-[var(--danger)]">
          {actionError}
        </div>
      )}

      {updates.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-10 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-[var(--success)] mb-3" />
          <p className="text-[var(--text-secondary)]">库中暂无待更新应用。</p>
          <Link to="/library" className="mt-4 inline-block text-[var(--accent)] hover:underline font-medium">
            打开我的库
          </Link>
        </div>
      ) : (
        <section>
          <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]">可用更新</h2>
          <div className="space-y-3">
            {updates.map((update) => (
              <div key={update.id} className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
                <div className="flex items-center gap-4 p-5">
                  <div
                    className="app-icon flex-shrink-0 flex items-center justify-center"
                    style={{
                      width: 56,
                      height: 56,
                      background: update.iconUrl
                        ? undefined
                        : 'linear-gradient(135deg, var(--accent), var(--accent-active))',
                    }}
                  >
                    {update.iconUrl ? (
                      <img
                        src={update.iconUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span
                        className="font-semibold"
                        style={{
                          color: 'var(--text-inverse)',
                          fontSize: 22,
                        }}
                      >
                        {update.appName[0]?.toUpperCase() ?? 'A'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--text-primary)]">{update.appName}</h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-sm text-[var(--text-tertiary)]">v{update.currentVersion}</span>
                      <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)]" />
                      <span className="text-sm font-medium text-[var(--accent)]">v{update.newVersion}</span>
                      <span className="text-sm text-[var(--text-tertiary)]">({update.size})</span>
                      {update.security && (
                        <span className="badge badge-error">
                          <Shield className="w-3 h-3" />
                          安全更新
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandedId((prev) => (prev === update.id ? null : update.id))}
                    className="p-2 hover:bg-[var(--bg-muted)] rounded-lg transition-colors"
                  >
                    {expandedId === update.id ? (
                      <ChevronUp className="w-5 h-5 text-[var(--text-tertiary)]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[var(--text-tertiary)]" />
                    )}
                  </button>
                </div>
                {expandedId === update.id && (
                  <div className="px-5 pb-5 border-t border-[var(--border-subtle)] pt-4">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] mb-3">
                      <Clock className="w-4 h-4" />
                      {update.releaseDate}
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        disabled={!update.artifactId || downloadingId === update.id}
                        onClick={() => void handleUpdateDownload(update)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-[var(--text-inverse)] rounded-full text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60"
                      >
                        <Download className="w-4 h-4" />
                        {downloadingId === update.id ? '准备中…' : '更新'}
                      </button>
                      {update.listingSlug && (
                        <Link
                          to={`/app/${update.listingSlug}`}
                          className="px-5 py-2.5 border border-[var(--border-default)] rounded-full text-sm font-medium hover:bg-[var(--bg-canvas)] transition-colors"
                        >
                          查看应用
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
