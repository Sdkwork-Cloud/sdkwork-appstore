import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Download,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import { useLibraryUpdates, formatApiError, resolveArtifactDownload } from '@/hooks/useApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface UpdateItem {
  id: string;
  appName: string;
  currentVersion: string;
  newVersion: string;
  size: string;
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
  return '—';
}

function mapUpdateRow(update: unknown, index: number, libraryItems: unknown[]): UpdateItem {
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
    artifactId: readString(row, 'artifactId', 'artifact_id'),
    appKey,
    listingSlug:
      readString(libraryRecord, 'listingSlug', 'listing_slug') ||
      readString(libraryRecord, 'listingId', 'listing_id') ||
      appKey,
  };
}

export function UpdatesPage() {
  const navigate = useNavigate();
  const { data, loading, error, execute } = useLibraryUpdates();
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
      setActionError('This update has no downloadable artifact yet.');
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
    <div className="animate-fade-in pb-8">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-bold">Updates</h1>
              <p className="text-xs text-gray-500">
                {updates.length > 0 ? `${updates.length} available` : 'Up to date'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void execute()}
            className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-full text-xs font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </header>

      <div className="px-4 py-4">
        {error && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {formatApiError(error)}
          </div>
        )}
        {actionError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {actionError}
          </div>
        )}

        {updates.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-500 mb-3" />
            <p className="text-gray-600 text-sm">No pending updates.</p>
            <Link to="/library" className="mt-4 inline-block text-blue-500 text-sm font-medium">
              Open Library
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {updates.map((update) => (
              <div key={update.id} className="bg-white rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-white">{update.appName[0]?.toUpperCase() ?? 'A'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 truncate">{update.appName}</h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                      <span>v{update.currentVersion}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="text-blue-600 font-medium">v{update.newVersion}</span>
                      <span>({update.size})</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    disabled={!update.artifactId || downloadingId === update.id}
                    onClick={() => void handleUpdateDownload(update)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500 text-white rounded-full text-sm font-medium disabled:opacity-60"
                  >
                    <Download className="w-4 h-4" />
                    {downloadingId === update.id ? 'Preparing…' : 'Update'}
                  </button>
                  {update.listingSlug && (
                    <Link
                      to={`/app/${update.listingSlug}`}
                      className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium"
                    >
                      View
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
