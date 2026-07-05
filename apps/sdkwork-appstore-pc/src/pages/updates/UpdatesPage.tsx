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
} from 'lucide-react';
import { useLibraryUpdates, formatApiError, resolveArtifactDownload } from '@/hooks/useApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface UpdateItem {
  id: string;
  appName: string;
  currentVersion: string;
  newVersion: string;
  size: string;
  releaseDate: string;
  iconUrl?: string;
  security: boolean;
  releaseId: string;
  artifactId: string;
  appKey: string;
  listingSlug: string;
}

function readString(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  return '';
}

function formatBytes(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)} MB`;
    }
    if (value >= 1_000) {
      return `${Math.round(value / 1_000)} KB`;
    }
    return `${value} B`;
  }
  if (typeof value === 'string' && value.trim()) {
    return value;
  }
  return '—';
}

function mapUpdateRow(
  update: unknown,
  index: number,
  libraryItems: unknown[],
): UpdateItem {
  const row = (update ?? {}) as Record<string, unknown>;
  const appKey = readString(row, 'appKey', 'app_key');
  const libraryMatch = libraryItems.find((entry) => {
    const libraryRow = (entry ?? {}) as Record<string, unknown>;
    return readString(libraryRow, 'appKey', 'app_key') === appKey;
  });
  const libraryRecord = (libraryMatch ?? {}) as Record<string, unknown>;
  const appName =
    readString(libraryRecord, 'displayName', 'display_name') ||
    readString(libraryRecord, 'listingId', 'listing_id') ||
    appKey ||
    `App ${index + 1}`;

  return {
    id: readString(row, 'artifactId', 'artifact_id', 'releaseId', 'release_id') || `${index}`,
    appName,
    currentVersion: readString(row, 'installedVersionCode', 'installed_version_code') || '—',
    newVersion: readString(row, 'latestVersionName', 'latest_version_name') || '—',
    size: formatBytes(row.fileSizeBytes ?? row.file_size_bytes),
    releaseDate: 'Available now',
    iconUrl: readString(libraryRecord, 'icon_media_resource_id', 'iconMediaResourceId') || undefined,
    security: false,
    releaseId: readString(row, 'releaseId', 'release_id'),
    artifactId: readString(row, 'artifactId', 'artifact_id'),
    appKey,
    listingSlug:
      readString(libraryRecord, 'listingSlug', 'listing_slug') ||
      readString(libraryRecord, 'listingId', 'listing_id') ||
      appKey,
  };
}

export function UpdatesPage() {
  const { data, loading, error, execute } = useLibraryUpdates();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const updates = useMemo(() => {
    const libraryItems = data?.libraryItems ?? [];
    return (data?.updates ?? []).map((update, index) =>
      mapUpdateRow(update, index, libraryItems),
    );
  }, [data]);

  async function handleUpdateDownload(update: UpdateItem) {
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

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">应用更新</h1>
          <p className="text-[var(--text-tertiary)] mt-1">
            {updates.length > 0
              ? `有 ${updates.length} 个可用更新`
              : '所有已安装应用均为最新版本'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => execute()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-[var(--text-inverse)] rounded-full text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          检查更新
        </button>
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
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-[var(--danger-subtle)] text-[var(--danger)] rounded-full text-xs">
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
