import { useState, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  Lock,
  AlertTriangle,
  Save,
  Info,
} from 'lucide-react';
import {
  useListing,
  formatApiError,
  publisherService,
} from '@sdkwork/appstore-publisher-console-core';
import { LoadingSpinner, readString } from '@sdkwork/appstore-pc-commons';
import { ListingLayout } from '../components/ListingLayout';

interface StatusMessage {
  kind: 'success' | 'error' | 'info';
  text: string;
}

const CONTENT_RATINGS = [
  { value: 'everyone', label: '所有人（3+）' },
  { value: 'low_maturity', label: '低成熟度（7+）' },
  { value: 'medium_maturity', label: '中等成熟度（12+）' },
  { value: 'high_maturity', label: '高成熟度（16+）' },
  { value: 'unrated', label: '未分级' },
];

const PERMISSION_PRESETS = [
  { id: 'internet', label: '网络访问', description: '访问互联网以加载在线内容' },
  { id: 'storage', label: '存储访问', description: '读写本地文件与存储' },
  { id: 'location', label: '位置信息', description: '获取设备精确或大致位置' },
  { id: 'camera', label: '摄像头', description: '拍照或录制视频' },
  { id: 'microphone', label: '麦克风', description: '录制音频' },
  { id: 'contacts', label: '通讯录', description: '读取或修改联系人' },
  { id: 'notifications', label: '通知', description: '发送系统通知' },
  { id: 'background', label: '后台运行', description: '在后台持续运行' },
];

const DATA_TYPES = [
  { id: 'personal', label: '个人信息', description: '姓名、邮箱、电话等' },
  { id: 'financial', label: '财务信息', description: '支付卡、账户等' },
  { id: 'health', label: '健康信息', description: '医疗、健身数据' },
  { id: 'messages', label: '消息', description: '邮件、短信、聊天' },
  { id: 'photos', label: '照片', description: '用户照片与视频' },
  { id: 'files', label: '文件', description: '用户文档与文件' },
  { id: 'usage', label: '使用数据', description: '应用使用统计与诊断' },
];

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

function ComplianceToggle({
  id,
  checked,
  onChange,
  label,
  description,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors"
      style={{
        backgroundColor: checked ? 'var(--accent-subtle)' : 'var(--bg-muted)',
        border: `1px solid ${checked ? 'var(--accent)' : 'transparent'}`,
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1"
        style={{ accentColor: 'var(--accent)' }}
      />
      <div className="min-w-0 flex-1">
        <span
          className="block text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {label}
        </span>
        <span
          className="block text-xs mt-0.5"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {description}
        </span>
      </div>
    </label>
  );
}

export function PublisherCompliancePage() {
  const { listingId = '' } = useParams();
  const { data: listing, loading, error } = useListing(listingId);

  // Compliance state (stored as listing metadata when API supports; placeholder save for now)
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState('');
  const [termsOfServiceUrl, setTermsOfServiceUrl] = useState('');
  const [contentRating, setContentRating] = useState('everyone');
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [dataCollected, setDataCollected] = useState<Record<string, boolean>>({});
  const [dataEncrypted, setDataEncrypted] = useState(true);
  const [dataSharedWithThirdParty, setDataSharedWithThirdParty] = useState(false);
  const [exportControlClassified, setExportControlClassified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<StatusMessage | null>(null);

  // Seed from listing metadata when available
  const row = (listing ?? {}) as Record<string, unknown>;
  const complianceMeta =
    (row.complianceMetadata as Record<string, unknown> | undefined) ??
    (row.compliance_metadata as Record<string, unknown> | undefined);
  const seededPrivacy = readString(complianceMeta ?? {}, 'privacyPolicyUrl', 'privacy_policy_url');
  const seededTos = readString(complianceMeta ?? {}, 'termsOfServiceUrl', 'terms_of_service_url');
  const seededRating = readString(complianceMeta ?? {}, 'contentRating', 'content_rating');

  // Initialize state once when listing loads
  const [initialized, setInitialized] = useState(false);
  if (!initialized && listing) {
    setPrivacyPolicyUrl(seededPrivacy);
    setTermsOfServiceUrl(seededTos);
    if (seededRating) setContentRating(seededRating);
    setInitialized(true);
  }

  async function handleSave() {
    if (!privacyPolicyUrl.trim()) {
      setSaveMessage({ kind: 'error', text: '隐私政策链接为必填项。' });
      return;
    }
    setSaving(true);
    setSaveMessage(null);
    try {
      // Persist privacy policy URL and support URL (for terms) via listing update API.
      // Content rating, permissions, and data safety declarations will be persisted
      // through a dedicated compliance endpoint once available.
      await publisherService.updateListing(listingId, {
        privacyPolicyUrl: privacyPolicyUrl.trim(),
        ...(termsOfServiceUrl.trim()
          ? { supportUrl: termsOfServiceUrl.trim() }
          : {}),
      });
      setSaveMessage({
        kind: 'success',
        text: '隐私政策链接已保存。内容分级、权限声明与数据安全信息将在合规 API 接入后持久化。',
      });
    } catch (err) {
      setSaveMessage({ kind: 'error', text: formatApiError(err as Error) });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <ListingLayout activeTab="compliance">
        <div className="flex min-h-[40vh] items-center justify-center">
          <LoadingSpinner />
        </div>
      </ListingLayout>
    );
  }

  return (
    <ListingLayout activeTab="compliance">
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

      {/* Info banner */}
      <div
        className="mb-6 rounded-xl px-4 py-3 text-sm flex items-start gap-2"
        style={{
          backgroundColor: 'var(--accent-subtle)',
          border: '1px solid var(--accent)',
          color: 'var(--text-primary)',
        }}
      >
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
        <span>
          合规信息将展示在应用详情页「数据安全」区块，并影响应用能否通过审核。请如实填写。
        </span>
      </div>

      {/* Privacy policy & terms */}
      <SectionCard
        icon={<FileText className="w-5 h-5" />}
        title="隐私政策与服务条款"
        description="提供外部链接，用户可在详情页查看完整政策文本。"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label
              htmlFor={`privacy-url-${listingId}`}
              className="block text-sm mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              隐私政策链接 <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              id={`privacy-url-${listingId}`}
              type="url"
              value={privacyPolicyUrl}
              onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
              placeholder="https://example.com/privacy"
              className="input-field"
            />
          </div>
          <div>
            <label
              htmlFor={`tos-url-${listingId}`}
              className="block text-sm mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              服务条款链接（可选）
            </label>
            <input
              id={`tos-url-${listingId}`}
              type="url"
              value={termsOfServiceUrl}
              onChange={(e) => setTermsOfServiceUrl(e.target.value)}
              placeholder="https://example.com/terms"
              className="input-field"
            />
          </div>
        </div>
      </SectionCard>

      {/* Content rating */}
      <SectionCard
        icon={<ShieldCheck className="w-5 h-5" />}
        title="内容分级"
        description="根据应用内容选择合适的分级，影响目标用户群体。"
      >
        <label
          htmlFor={`content-rating-${listingId}`}
          className="block text-sm mb-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          分级等级
        </label>
        <select
          id={`content-rating-${listingId}`}
          value={contentRating}
          onChange={(e) => setContentRating(e.target.value)}
          className="input-field md:max-w-sm"
        >
          {CONTENT_RATINGS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </SectionCard>

      {/* Permissions */}
      <SectionCard
        icon={<Lock className="w-5 h-5" />}
        title="权限声明"
        description="声明应用使用的所有权限，审核团队将核实其必要性。"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {PERMISSION_PRESETS.map((p) => (
            <ComplianceToggle
              key={p.id}
              id={`perm-${p.id}-${listingId}`}
              checked={!!permissions[p.id]}
              onChange={(v) => setPermissions((prev) => ({ ...prev, [p.id]: v }))}
              label={p.label}
              description={p.description}
            />
          ))}
        </div>
      </SectionCard>

      {/* Data safety */}
      <SectionCard
        icon={<AlertTriangle className="w-5 h-5" />}
        title="数据安全"
        description="声明应用收集的数据类型与处理方式，遵循数据安全规范。"
      >
        <p
          className="text-sm mb-3 font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          收集的数据类型
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
          {DATA_TYPES.map((d) => (
            <ComplianceToggle
              key={d.id}
              id={`data-${d.id}-${listingId}`}
              checked={!!dataCollected[d.id]}
              onChange={(v) => setDataCollected((prev) => ({ ...prev, [d.id]: v }))}
              label={d.label}
              description={d.description}
            />
          ))}
        </div>

        <div className="space-y-2">
          <ComplianceToggle
            id={`encrypted-${listingId}`}
            checked={dataEncrypted}
            onChange={setDataEncrypted}
            label="数据传输加密"
            description="应用在传输用户数据时使用 TLS/SSL 加密"
          />
          <ComplianceToggle
            id={`shared-${listingId}`}
            checked={dataSharedWithThirdParty}
            onChange={setDataSharedWithThirdParty}
            label="与第三方共享数据"
            description="应用会将用户数据共享给第三方服务或合作伙伴"
          />
          <ComplianceToggle
            id={`export-${listingId}`}
            checked={exportControlClassified}
            onChange={setExportControlClassified}
            label="受出口管制"
            description="应用涉及出口管制分类（EAR/ECCN 等）"
          />
        </div>
      </SectionCard>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="btn-primary text-sm"
        >
          <Save className="w-4 h-4" />
          {saving ? '保存中…' : '保存合规信息'}
        </button>
        <StatusNotice message={saveMessage} />
      </div>
    </ListingLayout>
  );
}
