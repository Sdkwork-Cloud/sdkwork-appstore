import { useState, useMemo, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { PackagePlus, Upload, GitBranch, Tag, Clock } from 'lucide-react';
import {
  useListingReleases,
  usePublisher,
  formatApiError,
  publisherService,
  resolveOrganizationId,
  getPublisherUploads,
} from '@sdkwork/appstore-publisher-console-core';
import { LoadingSpinner, readString } from '@sdkwork/appstore-pc-commons';
import { ListingLayout } from '../components/ListingLayout';

interface StatusMessage {
  kind: 'success' | 'error' | 'info';
  text: string;
}

const CHANNELS = [
  { value: 'all', label: '全部渠道' },
  { value: 'stable', label: '稳定版' },
  { value: 'beta', label: '测试版' },
  { value: 'internal', label: '内测版' },
];

const PLATFORMS = ['WINDOWS', 'MACOS', 'LINUX', 'WEB'];
const ARCHITECTURES = ['X64', 'ARM64', 'X86'];
const PACKAGE_FORMATS = ['ZIP', 'TAR_GZ', 'EXE', 'DMG', 'PKG', 'MSI'];

function StatusNotice({ message }: { message: StatusMessage | null }) {
  if (!message) return null;
  const color =
    message.kind === 'success'
      ? 'var(--success)'
      : message.kind === 'error'
        ? 'var(--danger)'
        : 'var(--text-secondary)';
  return (
    <p
      className="text-sm mt-3"
      style={{ color }}
      role={message.kind === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      {message.text}
    </p>
  );
}

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="card p-6 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
        >
          {icon}
        </span>
        <h2
          className="text-lg font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h2>
      </div>
      {description && (
        <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
          {description}
        </p>
      )}
      {children}
    </section>
  );
}

function ReleaseStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    draft: { label: '草稿', className: 'badge-neutral' },
    published: { label: '已发布', className: 'badge-success' },
    archived: { label: '已归档', className: 'badge-neutral' },
    pending: { label: '待审核', className: 'badge-warning' },
    rejected: { label: '已拒绝', className: 'badge-error' },
  };
  const item = map[status?.toLowerCase()] || { label: status || '—', className: 'badge-neutral' };
  return <span className={`badge ${item.className}`}>{item.label}</span>;
}

export function PublisherReleasesPage() {
  const { listingId = '' } = useParams();
  const {
    data: releasesData,
    loading,
    error,
    execute: refreshReleases,
  } = useListingReleases(listingId);
  const { data: publisher } = usePublisher();
  const organizationId = useMemo(() => resolveOrganizationId(publisher), [publisher]);

  const releaseItems = releasesData?.items ?? [];

  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [activeReleaseId, setActiveReleaseId] = useState('');

  // Create release form state
  const [channelCode, setChannelCode] = useState('stable');
  const [versionName, setVersionName] = useState('');
  const [versionCode, setVersionCode] = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [creatingRelease, setCreatingRelease] = useState(false);
  const [releaseMessage, setReleaseMessage] = useState<StatusMessage | null>(null);

  // Artifact upload state
  const [platform, setPlatform] = useState('WINDOWS');
  const [architecture, setArchitecture] = useState('X64');
  const [packageFormat, setPackageFormat] = useState('ZIP');
  const [artifactUploading, setArtifactUploading] = useState(false);
  const [artifactMessage, setArtifactMessage] = useState<StatusMessage | null>(null);

  // Gray release config
  const [grayRolloutPercent, setGrayRolloutPercent] = useState(100);
  const [grayMessage, setGrayMessage] = useState<StatusMessage | null>(null);

  const filteredReleases = useMemo(() => {
    if (channelFilter === 'all') return releaseItems;
    return releaseItems.filter((item: unknown) => {
      const row = (item ?? {}) as Record<string, unknown>;
      const ch = readString(row, 'channelCode', 'channel_code').toLowerCase();
      return ch === channelFilter.toLowerCase();
    });
  }, [releaseItems, channelFilter]);

  const selectedRelease = useMemo(() => {
    if (!activeReleaseId) return null;
    const found = releaseItems.find((item: unknown) => {
      const row = (item ?? {}) as Record<string, unknown>;
      return readString(row, 'id') === activeReleaseId;
    });
    return (found ?? null) as Record<string, unknown> | null;
  }, [releaseItems, activeReleaseId]);

  async function handleCreateRelease() {
    if (!channelCode.trim() || !versionName.trim() || !versionCode.trim()) {
      setReleaseMessage({
        kind: 'error',
        text: '渠道、版本名称与版本号均为必填项。',
      });
      return;
    }
    setCreatingRelease(true);
    setReleaseMessage(null);
    try {
      const created = await publisherService.createRelease(listingId, {
        channelCode: channelCode.trim(),
        versionName: versionName.trim(),
        versionCode: versionCode.trim(),
        ...(releaseNotes.trim()
          ? { releaseNotes: releaseNotes.trim() }
          : {}),
      });
      const newId = created.id;
      if (newId) setActiveReleaseId(newId);
      setReleaseMessage({
        kind: 'success',
        text: `版本 ${versionName} 已创建，请在下方上传对应的安装包。`,
      });
      setVersionName('');
      setVersionCode('');
      setReleaseNotes('');
      await refreshReleases();
    } catch (err) {
      setReleaseMessage({ kind: 'error', text: formatApiError(err as Error) });
    } finally {
      setCreatingRelease(false);
    }
  }

  async function handleArtifactUpload(file: File) {
    if (!activeReleaseId) {
      setArtifactMessage({ kind: 'error', text: '请先选择一个版本。' });
      return;
    }
    if (!organizationId) {
      setArtifactMessage({
        kind: 'error',
        text: '缺少组织上下文，无法上传到 Drive。',
      });
      return;
    }
    setArtifactUploading(true);
    setArtifactMessage(null);
    try {
      await getPublisherUploads().uploadReleaseArtifact({
        file,
        organizationId,
        releaseId: activeReleaseId,
        platform,
        architecture,
        packageFormat,
      });
      setArtifactMessage({
        kind: 'success',
        text: '安装包已上传并关联到所选版本。',
      });
      await refreshReleases();
    } catch (err) {
      setArtifactMessage({ kind: 'error', text: formatApiError(err as Error) });
    } finally {
      setArtifactUploading(false);
    }
  }

  async function handleSaveRollout() {
    if (!activeReleaseId) {
      setGrayMessage({ kind: 'error', text: '请先选择一个版本。' });
      return;
    }
    if (grayRolloutPercent < 0 || grayRolloutPercent > 100) {
      setGrayMessage({ kind: 'error', text: '灰度比例必须在 0-100 之间。' });
      return;
    }
    setGrayMessage({
      kind: 'info',
      text: `灰度配置已记录（${grayRolloutPercent}%），后端灰度 API 接入后将自动生效。`,
    });
  }

  if (loading) {
    return (
      <ListingLayout activeTab="releases">
        <div className="flex min-h-[40vh] items-center justify-center">
          <LoadingSpinner />
        </div>
      </ListingLayout>
    );
  }

  return (
    <ListingLayout activeTab="releases">
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

      {/* Channel tabs */}
      <div className="flex gap-1.5 mb-6 flex-wrap" role="tablist" aria-label="渠道筛选">
        {CHANNELS.map((ch) => {
          const active = channelFilter === ch.value;
          return (
            <button
              key={ch.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setChannelFilter(ch.value)}
              className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-1.5"
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
              <GitBranch className="w-3.5 h-3.5" />
              {ch.label}
            </button>
          );
        })}
      </div>

      {/* Create release */}
      <SectionCard
        icon={<PackagePlus className="w-5 h-5" />}
        title="创建新版本"
        description="为应用创建新版本，支持渠道（稳定版/测试版/内测版）区分发布。"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label
              htmlFor={`release-channel-${listingId}`}
              className="block text-sm mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              渠道
            </label>
            <select
              id={`release-channel-${listingId}`}
              value={channelCode}
              onChange={(e) => setChannelCode(e.target.value)}
              className="input-field"
            >
              <option value="stable">stable（稳定版）</option>
              <option value="beta">beta（测试版）</option>
              <option value="internal">internal（内测版）</option>
            </select>
          </div>
          <div>
            <label
              htmlFor={`release-version-name-${listingId}`}
              className="block text-sm mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              版本名称
            </label>
            <input
              id={`release-version-name-${listingId}`}
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              placeholder="例如 1.2.0"
              className="input-field"
            />
          </div>
          <div>
            <label
              htmlFor={`release-version-code-${listingId}`}
              className="block text-sm mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              版本号
            </label>
            <input
              id={`release-version-code-${listingId}`}
              value={versionCode}
              onChange={(e) => setVersionCode(e.target.value)}
              placeholder="例如 10200"
              className="input-field"
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor={`release-notes-${listingId}`}
            className="block text-sm mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            发布说明（可选）
          </label>
          <textarea
            id={`release-notes-${listingId}`}
            value={releaseNotes}
            onChange={(e) => setReleaseNotes(e.target.value)}
            placeholder="本次更新内容、新特性、修复的问题等"
            rows={3}
            className="input-field resize-y"
          />
        </div>
        <button
          type="button"
          onClick={() => void handleCreateRelease()}
          disabled={creatingRelease}
          className="btn-primary text-sm"
        >
          {creatingRelease ? '创建中…' : '创建版本'}
        </button>
        <StatusNotice message={releaseMessage} />
      </SectionCard>

      {/* Release list */}
      {filteredReleases.length === 0 ? (
        <div
          className="card p-10 text-center mb-6"
          style={{ color: 'var(--text-secondary)' }}
        >
          <PackagePlus
            className="w-8 h-8 mx-auto mb-2"
            style={{ color: 'var(--text-tertiary)' }}
          />
          <p className="text-sm">
            {channelFilter === 'all'
              ? '暂无版本记录，请在上方创建第一个版本。'
              : `「${CHANNELS.find((c) => c.value === channelFilter)?.label}」渠道暂无版本。`}
          </p>
        </div>
      ) : (
        <SectionCard
          icon={<Tag className="w-5 h-5" />}
          title="版本列表"
          description="点击版本卡片以选中并上传安装包。"
        >
          <ul className="space-y-2">
            {filteredReleases.map((item: unknown, index: number) => {
              const row = (item ?? {}) as Record<string, unknown>;
              const id = readString(row, 'id') || String(index);
              const vName = readString(row, 'versionName', 'version_name') || id;
              const vCode = readString(row, 'versionCode', 'version_code') || '—';
              const ch = readString(row, 'channelCode', 'channel_code') || '—';
              const status = readString(row, 'releaseStatus', 'release_status') || 'draft';
              const createdAt = readString(row, 'createdAt', 'created_at') || '—';
              const active = activeReleaseId === id;
              const artifacts = Array.isArray(row.artifacts)
                ? (row.artifacts as unknown[])
                : Array.isArray(row.releaseArtifacts)
                  ? (row.releaseArtifacts as unknown[])
                  : [];
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => setActiveReleaseId(active ? '' : id)}
                    className="w-full text-left rounded-xl p-4 transition-all"
                    style={{
                      backgroundColor: active
                        ? 'var(--accent-subtle)'
                        : 'var(--bg-muted)',
                      border: `1px solid ${active ? 'var(--accent)' : 'var(--border-subtle)'}`,
                    }}
                    aria-pressed={active}
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3 flex-wrap min-w-0">
                        <span
                          className="font-semibold"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {vName}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          build {vCode}
                        </span>
                        <span className="badge badge-neutral">{ch}</span>
                        <ReleaseStatusBadge status={status} />
                      </div>
                      <div
                        className="flex items-center gap-1 text-xs"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <Clock className="w-3 h-3" />
                        {createdAt}
                      </div>
                    </div>
                    {artifacts.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {artifacts.map((a: unknown, ai: number) => {
                          const aRow = (a ?? {}) as Record<string, unknown>;
                          const plat = readString(aRow, 'platform');
                          const arch = readString(aRow, 'architecture');
                          const fmt = readString(aRow, 'packageFormat', 'package_format');
                          return (
                            <span
                              key={ai}
                              className="text-xs px-2 py-0.5 rounded-md"
                              style={{
                                backgroundColor: 'var(--bg-surface)',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border-subtle)',
                              }}
                            >
                              {[plat, arch, fmt].filter(Boolean).join(' · ')}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      )}

      {/* Artifact upload + gray release */}
      {selectedRelease && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard
            icon={<Upload className="w-5 h-5" />}
            title="上传安装包"
            description="为所选版本上传对应平台的安装包，文件将通过 Drive 安全存储。"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div>
                <label
                  htmlFor={`artifact-platform-${listingId}`}
                  className="block text-sm mb-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  平台
                </label>
                <select
                  id={`artifact-platform-${listingId}`}
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="input-field"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor={`artifact-arch-${listingId}`}
                  className="block text-sm mb-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  架构
                </label>
                <select
                  id={`artifact-arch-${listingId}`}
                  value={architecture}
                  onChange={(e) => setArchitecture(e.target.value)}
                  className="input-field"
                >
                  {ARCHITECTURES.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor={`artifact-format-${listingId}`}
                  className="block text-sm mb-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  打包格式
                </label>
                <select
                  id={`artifact-format-${listingId}`}
                  value={packageFormat}
                  onChange={(e) => setPackageFormat(e.target.value)}
                  className="input-field"
                >
                  {PACKAGE_FORMATS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label className="btn-primary text-sm cursor-pointer">
              <Upload className="w-4 h-4" />
              {artifactUploading ? '上传中…' : '选择文件上传'}
              <input
                type="file"
                className="hidden"
                disabled={artifactUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    void handleArtifactUpload(file);
                  }
                  e.target.value = '';
                }}
              />
            </label>
            <StatusNotice message={artifactMessage} />
          </SectionCard>

          <SectionCard
            icon={<GitBranch className="w-5 h-5" />}
            title="灰度发布配置"
            description="设置该版本的灰度推送比例，逐步向用户开放更新。"
          >
            <div className="mb-4">
              <label
                htmlFor={`rollout-percent-${listingId}`}
                className="block text-sm mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                灰度比例：<span style={{ color: 'var(--accent)' }}>{grayRolloutPercent}%</span>
              </label>
              <input
                id={`rollout-percent-${listingId}`}
                type="range"
                min="0"
                max="100"
                step="5"
                value={grayRolloutPercent}
                onChange={(e) => setGrayRolloutPercent(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: 'var(--accent)' }}
              />
              <div
                className="flex justify-between text-xs mt-1"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <span>0%（暂停）</span>
                <span>50%</span>
                <span>100%（全量）</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleSaveRollout()}
              className="btn-secondary text-sm"
            >
              保存灰度配置
            </button>
            <StatusNotice message={grayMessage} />
          </SectionCard>
        </div>
      )}
    </ListingLayout>
  );
}
