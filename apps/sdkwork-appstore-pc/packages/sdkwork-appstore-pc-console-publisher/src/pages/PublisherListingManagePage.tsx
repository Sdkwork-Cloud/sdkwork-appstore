import { useEffect, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FileText, ImagePlus, Send, Upload, ArrowRight } from 'lucide-react';
import {
  formatApiError,
  useListing,
  useListingMedia,
  useListingReleases,
  usePublisher,
  publisherService,
  resolveOrganizationId,
  getPublisherUploads,
} from '@sdkwork/appstore-publisher-console-core';
import { readString } from '@sdkwork/appstore-pc-commons';
import { ListingLayout } from '../components/ListingLayout';

const MEDIA_ROLES = [
  { value: 'ICON', label: '应用图标' },
  { value: 'SCREENSHOT', label: '截图' },
  { value: 'FEATURE_GRAPHIC', label: '特色图片' },
] as const;

const SUBMISSION_TYPES = [
  { value: 'INITIAL', label: '首次上架审核' },
  { value: 'METADATA', label: '元数据更新' },
  { value: 'RELEASE', label: '版本发布' },
] as const;

type SubmissionType = (typeof SUBMISSION_TYPES)[number]['value'];

interface StatusMessage {
  kind: 'success' | 'error' | 'info';
  text: string;
}

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

export function PublisherListingManagePage() {
  const { listingId = '' } = useParams();
  const {
    data: listing,
    loading: listingLoading,
    error: listingError,
    execute: refreshListing,
  } = useListing(listingId);
  const {
    data: mediaData,
    loading: mediaLoading,
    error: mediaError,
    execute: refreshMedia,
  } = useListingMedia(listingId);
  const {
    data: releasesData,
    loading: releasesLoading,
    error: releasesError,
  } = useListingReleases(listingId);
  const { data: publisher } = usePublisher();

  const organizationId = (() => {
    try {
      return resolveOrganizationId(publisher);
    } catch {
      return '';
    }
  })();

  const mediaItems = mediaData?.items ?? [];
  const releaseItems = releasesData?.items ?? [];

  const [mediaRole, setMediaRole] = useState<(typeof MEDIA_ROLES)[number]['value']>('ICON');
  const [mediaUploading, setMediaUploading] = useState(false);
  const [mediaMessage, setMediaMessage] = useState<StatusMessage | null>(null);

  const [locale, setLocale] = useState('zh-CN');
  const [localizationDisplayName, setLocalizationDisplayName] = useState('');
  const [localizationSubtitle, setLocalizationSubtitle] = useState('');
  const [localizationShortDescription, setLocalizationShortDescription] = useState('');
  const [localizationFullDescription, setLocalizationFullDescription] = useState('');
  const [savingLocalization, setSavingLocalization] = useState(false);
  const [localizationMessage, setLocalizationMessage] = useState<StatusMessage | null>(null);
  const [localizationSeeded, setLocalizationSeeded] = useState(false);

  const [selectedReleaseId, setSelectedReleaseId] = useState('');
  const [submissionType, setSubmissionType] = useState<SubmissionType>('INITIAL');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<StatusMessage | null>(null);

  useEffect(() => {
    if (!listing || localizationSeeded) {
      return;
    }
    const row = listing as Record<string, unknown>;
    const defaultLocale = readString(row, 'defaultLocale', 'default_locale');
    if (defaultLocale) {
      setLocale(defaultLocale);
    }
    const name = readString(row, 'displayName', 'display_name');
    if (name) {
      setLocalizationDisplayName(name);
    }
    setLocalizationSeeded(true);
  }, [listing, localizationSeeded]);

  const loading = listingLoading || mediaLoading || releasesLoading;
  const error = listingError ?? mediaError ?? releasesError;

  async function handleMediaUpload(file: File) {
    if (!organizationId) {
      setMediaMessage({
        kind: 'error',
        text: '缺少组织上下文，请先通过 IAM 登录或创建发布者资料。',
      });
      return;
    }
    setMediaUploading(true);
    setMediaMessage(null);
    try {
      await getPublisherUploads().uploadListingMedia({
        file,
        organizationId,
        listingId,
        mediaRole,
      });
      const roleLabel = MEDIA_ROLES.find((r) => r.value === mediaRole)?.label ?? mediaRole;
      setMediaMessage({
        kind: 'success',
        text: `${roleLabel}已上传并关联到当前应用。`,
      });
      await refreshMedia();
    } catch (err) {
      setMediaMessage({ kind: 'error', text: formatApiError(err as Error) });
    } finally {
      setMediaUploading(false);
    }
  }

  async function handleSaveLocalization() {
    if (
      !localizationDisplayName.trim() ||
      !localizationShortDescription.trim() ||
      !localizationFullDescription.trim()
    ) {
      setLocalizationMessage({
        kind: 'error',
        text: '应用名称、简短描述与完整描述均为必填项。',
      });
      return;
    }
    setSavingLocalization(true);
    setLocalizationMessage(null);
    try {
      await publisherService.upsertLocalization(listingId, locale.trim(), {
        displayName: localizationDisplayName.trim(),
        shortDescription: localizationShortDescription.trim(),
        fullDescription: localizationFullDescription.trim(),
        ...(localizationSubtitle.trim() ? { subtitle: localizationSubtitle.trim() } : {}),
      });
      setLocalizationMessage({
        kind: 'success',
        text: '应用商店文案已保存。',
      });
      await refreshListing();
    } catch (err) {
      setLocalizationMessage({ kind: 'error', text: formatApiError(err as Error) });
    } finally {
      setSavingLocalization(false);
    }
  }

  async function handleSubmitForReview() {
    if (submissionType === 'RELEASE' && !selectedReleaseId) {
      setSubmissionMessage({
        kind: 'error',
        text: '提交版本审核前请先选择一个版本。',
      });
      return;
    }
    setSubmittingReview(true);
    setSubmissionMessage(null);
    try {
      const result = await publisherService.createSubmission(listingId, {
        submissionType,
        ...(submissionType === 'RELEASE' ? { releaseId: selectedReleaseId } : {}),
      });
      const status = result.submissionStatus ?? 'submitted';
      setSubmissionMessage({
        kind: 'success',
        text: `提交已受理（状态：${status}），审核团队将尽快处理。`,
      });
      await refreshListing();
    } catch (err) {
      setSubmissionMessage({ kind: 'error', text: formatApiError(err as Error) });
    } finally {
      setSubmittingReview(false);
    }
  }

  if (loading) {
    return (
      <ListingLayout activeTab="manage">
        <div className="flex min-h-[40vh] items-center justify-center">
          <p style={{ color: 'var(--text-tertiary)' }}>加载中…</p>
        </div>
      </ListingLayout>
    );
  }

  return (
    <ListingLayout activeTab="manage">
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

      <SectionCard
        icon={<FileText className="w-5 h-5" />}
        title="应用商店文案"
        description="面向用户展示的本地化名称与描述，将直接出现在应用详情页。"
      >
        <div className="grid gap-3 mb-4">
          <div>
            <label
              htmlFor={`locale-${listingId}`}
              className="block text-sm mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              语言区域
            </label>
            <input
              id={`locale-${listingId}`}
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              placeholder="例如 zh-CN、en-US"
              className="input-field"
            />
          </div>
          <div>
            <label
              htmlFor={`display-name-${listingId}`}
              className="block text-sm mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              应用名称
            </label>
            <input
              id={`display-name-${listingId}`}
              value={localizationDisplayName}
              onChange={(e) => setLocalizationDisplayName(e.target.value)}
              placeholder="例如 SDKWork 应用商店"
              className="input-field"
            />
          </div>
          <div>
            <label
              htmlFor={`subtitle-${listingId}`}
              className="block text-sm mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              副标题（可选）
            </label>
            <input
              id={`subtitle-${listingId}`}
              value={localizationSubtitle}
              onChange={(e) => setLocalizationSubtitle(e.target.value)}
              placeholder="一句话亮点"
              className="input-field"
            />
          </div>
          <div>
            <label
              htmlFor={`short-desc-${listingId}`}
              className="block text-sm mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              简短描述
            </label>
            <textarea
              id={`short-desc-${listingId}`}
              value={localizationShortDescription}
              onChange={(e) => setLocalizationShortDescription(e.target.value)}
              placeholder="80 字以内的简介"
              rows={2}
              className="input-field resize-y"
            />
          </div>
          <div>
            <label
              htmlFor={`full-desc-${listingId}`}
              className="block text-sm mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              完整描述
            </label>
            <textarea
              id={`full-desc-${listingId}`}
              value={localizationFullDescription}
              onChange={(e) => setLocalizationFullDescription(e.target.value)}
              placeholder="详细介绍应用的功能、特性与适用场景"
              rows={5}
              className="input-field resize-y"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => void handleSaveLocalization()}
          disabled={savingLocalization}
          className="btn-primary text-sm"
        >
          {savingLocalization ? '保存中…' : '保存文案'}
        </button>
        <StatusNotice message={localizationMessage} />
      </SectionCard>

      <SectionCard
        icon={<ImagePlus className="w-5 h-5" />}
        title="应用素材"
        description="通过 sdkwork-drive 上传素材后，将引用关联到当前应用。"
      >
        <div className="flex flex-wrap items-end gap-4 mb-4">
          <label className="text-sm">
            <span
              className="block mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              素材类型
            </span>
            <select
              value={mediaRole}
              onChange={(e) => setMediaRole(e.target.value as (typeof MEDIA_ROLES)[number]['value'])}
              className="input-field"
            >
              {MEDIA_ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </label>
          <label className="btn-primary text-sm cursor-pointer">
            <Upload className="w-4 h-4" />
            {mediaUploading ? '上传中…' : '上传文件'}
            <input
              type="file"
              className="hidden"
              accept="image/*,video/*"
              disabled={mediaUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  void handleMediaUpload(file);
                }
                e.target.value = '';
              }}
            />
          </label>
        </div>

        <StatusNotice message={mediaMessage} />

        {mediaItems.length === 0 ? (
          <p
            className="text-sm mt-4"
            style={{ color: 'var(--text-tertiary)' }}
          >
            暂未关联任何素材。
          </p>
        ) : (
          <ul className="space-y-2 mt-4">
            {mediaItems.map((item: unknown, index: number) => {
              const row = (item ?? {}) as Record<string, unknown>;
              const roleValue = readString(row, 'mediaRole', 'media_role');
              const roleLabel =
                MEDIA_ROLES.find((r) => r.value === roleValue)?.label ?? roleValue ?? '素材';
              return (
                <li
                  key={readString(row, 'id') || String(index)}
                  className="flex justify-between items-center text-sm rounded-lg px-3 py-2"
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <span className="font-medium">{roleLabel}</span>
                  <span
                    className="truncate max-w-xs ml-3"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {readString(row, 'mediaResourceId', 'media_resource_id') || '—'}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      {/* Link to releases page */}
      <Link
        to={`/publisher/apps/${listingId}/releases`}
        className="card p-5 mb-6 flex items-center gap-4 transition-all card-hover group"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
        >
          <ArrowRight className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            版本管理
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            创建版本、上传安装包、配置灰度发布
          </p>
        </div>
        <ArrowRight
          className="w-5 h-5 transition-transform group-hover:translate-x-1"
          style={{ color: 'var(--text-tertiary)' }}
        />
      </Link>

      <SectionCard
        icon={<Send className="w-5 h-5" />}
        title="提交审核"
        description="将应用提交至审核团队。首次上架选「首次上架审核」；文案更新选「元数据更新」；新版本发布选「版本发布」。"
      >
        <div className="flex flex-wrap items-end gap-4 mb-4">
          <label className="text-sm">
            <span
              className="block mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              提交类型
            </span>
            <select
              value={submissionType}
              onChange={(e) => setSubmissionType(e.target.value as SubmissionType)}
              className="input-field"
            >
              {SUBMISSION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          {submissionType === 'RELEASE' && releaseItems.length > 0 && (
            <label className="text-sm flex-1 min-w-[12rem]">
              <span
                className="block mb-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                版本
              </span>
              <select
                value={selectedReleaseId}
                onChange={(e) => setSelectedReleaseId(e.target.value)}
                className="input-field"
              >
                <option value="">请选择版本…</option>
                {releaseItems.map((item: unknown, index: number) => {
                  const row = (item ?? {}) as Record<string, unknown>;
                  const id = readString(row, 'id') || String(index);
                  const label = `${readString(row, 'versionName', 'version_name') || id}（${readString(row, 'channelCode', 'channel_code') || '渠道'}）`;
                  return (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </label>
          )}
        </div>

        {submissionType === 'RELEASE' && releaseItems.length === 0 && (
          <p className="text-sm mb-3" style={{ color: 'var(--warning)' }}>
            尚无可用版本，请先前往
            <Link
              to={`/publisher/apps/${listingId}/releases`}
              className="underline ml-1"
              style={{ color: 'var(--accent)' }}
            >
              版本管理
            </Link>
            创建版本。
          </p>
        )}

        <button
          type="button"
          onClick={() => void handleSubmitForReview()}
          disabled={submittingReview}
          className="btn-primary text-sm"
        >
          {submittingReview ? '提交中…' : '提交审核'}
        </button>
        <StatusNotice message={submissionMessage} />
      </SectionCard>
    </ListingLayout>
  );
}
