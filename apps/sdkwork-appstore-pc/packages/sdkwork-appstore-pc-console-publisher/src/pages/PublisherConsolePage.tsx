import { useState, useMemo, useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Package,
  Users,
  Settings,
  Plus,
  TrendingUp,
  Download,
  Star,
  Eye,
  Edit,
  MoreHorizontal,
  CheckCircle2,
} from 'lucide-react';
import {
  usePublisher,
  usePublisherListings,
  usePublisherMembers,
  formatApiError,
  publisherService,
} from '@sdkwork/appstore-publisher-console-core';
import { LoadingSpinner } from '@sdkwork/appstore-pc-commons';

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

import { readString, readNumber } from '@sdkwork/appstore-pc-commons';

function mapListingStatus(
  listingStatus: string,
  reviewStatus: string,
): AppItem['status'] {
  if (reviewStatus === 'in_review' || reviewStatus === 'pending' || reviewStatus === 'pending_review') {
    return 'in-review';
  }
  if (reviewStatus === 'rejected') {
    return 'rejected';
  }
  if (reviewStatus === 'approved' && listingStatus === 'active') {
    return 'published';
  }
  if (listingStatus === 'active') {
    return 'published';
  }
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

interface StatItem {
  label: string;
  value: string;
  change: string;
  icon: typeof Package;
}

interface TeamMember {
  id: string;
  userId: string;
  role: string;
  status: string;
}

export function PublisherConsolePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'apps' | 'team' | 'settings'>('overview');
  const { data: publisherData, loading: publisherLoading, error: publisherError, execute } = usePublisher();
  const { data: listingsData, loading: listingsLoading, error: listingsError } = usePublisherListings();

  const apps = useMemo<AppItem[]>(
    () => (listingsData?.items ?? []).map(mapListingRow),
    [listingsData?.items],
  );

  const stats = useMemo<StatItem[]>(() => {
    const totalDownloads = apps.reduce<number>((sum, app) => sum + app.downloads, 0);
    const ratedApps = apps.filter((app) => app.rating > 0);
    const averageRating =
      ratedApps.length > 0
        ? ratedApps.reduce<number>((sum, app) => sum + app.rating, 0) / ratedApps.length
        : 0;
    return [
      {
        label: '应用总数',
        value: String(apps.length),
        change: publisherData ? '发布者资料已加载' : '创建发布者资料后即可发布应用',
        icon: Package,
      },
      {
        label: '总下载量',
        value: totalDownloads >= 1000 ? `${(totalDownloads / 1000).toFixed(1)}K` : String(totalDownloads),
        change: '所有应用合计',
        icon: Download,
      },
      {
        label: '平均评分',
        value: averageRating > 0 ? averageRating.toFixed(1) : '?',
        change: ratedApps.length > 0 ? `基于 ${ratedApps.length} 个应用` : '暂无评分',
        icon: Star,
      },
      {
        label: '发布者',
        value: readString((publisherData ?? {}) as Record<string, unknown>, 'displayName', 'display_name') || '?',
        change: '当前账户',
        icon: TrendingUp,
      },
    ];
  }, [apps, publisherData]);

  const loading = publisherLoading || listingsLoading;
  const error = publisherError ?? listingsError;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          开发者控制台
        </h1>
        <p className="mt-2" style={{ color: 'var(--text-tertiary)' }}>
          管理应用与发布者账户
        </p>
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

      {/* Tabs */}
      <div
        className="flex gap-2 mb-8 rounded-2xl p-2"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {[
          { id: 'overview' as const, label: '概览', icon: BarChart3 },
          { id: 'apps' as const, label: '我的应用', icon: Package },
          { id: 'team' as const, label: '团队', icon: Users },
          { id: 'settings' as const, label: '设置', icon: Settings },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={
                active
                  ? { backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }
                  : { color: 'var(--text-secondary)' }
              }
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = 'var(--bg-muted)';
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'overview' && <OverviewTab stats={stats} hasPublisher={!!publisherData} />}
      {activeTab === 'apps' && <AppsTab apps={apps} />}
      {activeTab === 'team' && (
        <TeamTab publisherId={readString((publisherData ?? {}) as Record<string, unknown>, 'id')} />
      )}
      {activeTab === 'settings' && (
        <SettingsTab
          publisher={publisherData}
          onSaved={() => execute()}
        />
      )}
    </div>
  );
}

function OverviewTab({ stats, hasPublisher }: { stats: StatItem[]; hasPublisher: boolean }) {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent)',
                }}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {stat.label}
              </span>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {stat.value}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h3
          className="font-bold text-lg mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          近期动态
        </h3>
        {hasPublisher ? (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            数据分析与通知连接器接入后，动态将在此处展示。
          </p>
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            创建发布者资料后即可开始追踪应用与版本发布。
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickActionCard
          to="/publisher/apps/new"
          icon={<Plus className="w-6 h-6" />}
          title="创建新应用"
          description="开始构建你的新应用"
        />
        <QuickActionCard
          to="/publisher/apps"
          icon={<Package className="w-6 h-6" />}
          title="管理我的应用"
          description="查看应用列表、版本与合规"
        />
        <QuickActionCard
          to="/publisher"
          icon={<CheckCircle2 className="w-6 h-6" />}
          title="发布者设置"
          description="管理发布者资料与认证状态"
        />
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  to: string;
  icon: ReactNode;
  title: string;
  description: string;
}

function QuickActionCard({ to, icon, title, description }: QuickActionCardProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 p-6 rounded-2xl transition-all card-hover"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: 'var(--accent-subtle)',
          color: 'var(--accent)',
        }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h4>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
      </div>
    </Link>
  );
}

function AppsTab({ apps }: { apps: AppItem[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          我的应用
        </h2>
        <Link to="/publisher/apps/new" className="btn-primary text-sm">
          <Plus className="w-4 h-4" />
          新建应用
        </Link>
      </div>

      {apps.length === 0 ? (
        <div
          className="rounded-2xl p-10 text-center card"
          style={{ color: 'var(--text-secondary)' }}
        >
          暂无应用。创建你的第一个应用以开始发布。
        </div>
      ) : (
        <>
        <div className="mb-3 text-right">
          <Link
            to="/publisher/apps"
            className="text-sm transition-colors hover:opacity-80"
            style={{ color: 'var(--accent)' }}
          >
            查看全部应用 →
          </Link>
        </div>
        <div className="space-y-3">
          {apps.map((app) => (
            <div
              key={app.id}
              className="flex items-center gap-4 p-5 rounded-2xl transition-all card-hover"
            >
              <div
                className="w-14 h-14 app-icon flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-active))',
                }}
              >
                <span className="text-xl font-bold" style={{ color: 'var(--text-inverse)' }}>
                  {app.name[0]?.toUpperCase() ?? 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {app.name}
                  </h3>
                  <StatusBadge status={app.status} />
                </div>
                <div className="flex items-center gap-4 mt-1 flex-wrap">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    v{app.version}
                  </span>
                  {app.downloads > 0 && (
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {app.downloads.toLocaleString()} 次下载
                    </span>
                  )}
                  {app.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star
                        className="w-3.5 h-3.5"
                        style={{ color: 'var(--star)', fill: 'var(--star)' }}
                      />
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {app.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    更新于 {app.lastUpdated}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  to={`/app/${app.slug}`}
                  className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-muted)]"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label="查看详情"
                  title="查看详情"
                >
                  <Eye className="w-5 h-5" />
                </Link>
                <Link
                  to={`/publisher/apps/${app.id}`}
                  className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-muted)]"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label="编辑"
                  title="编辑"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <Link
                  to={`/publisher/apps/${app.id}`}
                  className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-muted)]"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label="更多操作"
                  title="更多操作"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
}

function TeamTab({ publisherId }: { publisherId: string }) {
  const { data, loading, error } = usePublisherMembers(publisherId);
  const members: TeamMember[] = (data?.items ?? []).map((item: unknown, index: number) => {
    const row = (item ?? {}) as Record<string, unknown>;
    return {
      id: readString(row, 'id') || String(index),
      userId: readString(row, 'userId', 'user_id') || '?',
      role: readString(row, 'memberRole', 'member_role') || 'member',
      status: readString(row, 'memberStatus', 'member_status') || 'active',
    };
  });

  if (!publisherId) {
    return (
      <div
        className="rounded-2xl p-10 text-center card"
        style={{ color: 'var(--text-secondary)' }}
      >
        请先创建发布者资料，然后管理团队成员。
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          团队成员
        </h2>
      </div>

      {error && (
        <div
          className="mb-4 rounded-xl px-4 py-3 text-sm"
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
        <div className="flex min-h-[20vh] items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : members.length === 0 ? (
        <div
          className="rounded-2xl p-10 text-center card"
          style={{ color: 'var(--text-secondary)' }}
        >
          暂无团队成员。可通过发布者 API 邀请成员加入。
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div
            className="grid grid-cols-12 px-6 py-3 text-sm font-medium"
            style={{
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-secondary)',
            }}
          >
            <div className="col-span-4">用户 ID</div>
            <div className="col-span-3">角色</div>
            <div className="col-span-3">状态</div>
            <div className="col-span-2">成员 ID</div>
          </div>
          {members.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-12 px-6 py-4 items-center"
              style={{ borderTop: '1px solid var(--border-subtle)' }}
            >
              <div className="col-span-4 font-medium" style={{ color: 'var(--text-primary)' }}>
                {member.userId}
              </div>
              <div className="col-span-3">
                <span className="badge badge-neutral">{member.role}</span>
              </div>
              <div className="col-span-3">
                <span
                  className={`badge ${
                    member.status === 'active' ? 'badge-success' : 'badge-warning'
                  }`}
                >
                  {member.status === 'active' ? '活跃' : member.status}
                </span>
              </div>
              <div className="col-span-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {member.id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsTab({
  publisher,
  onSaved,
}: {
  publisher: unknown;
  onSaved: () => void;
}) {
  const row = (publisher ?? {}) as Record<string, unknown>;
  const publisherId = readString(row, 'id');
  const verificationStatus = readString(row, 'verificationStatus', 'verification_status') || 'unverified';
  const isVerified = verificationStatus.toLowerCase() === 'verified';

  const [displayName, setDisplayName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setDisplayName(readString(row, 'displayName', 'display_name'));
    setLegalName(readString(row, 'legalName', 'legal_name'));
    setWebsiteUrl(
      readString(row, 'websiteUrl', 'website_url') ||
        readString(
          ((row.profileSnapshot ?? row.profile_snapshot) ?? {}) as Record<string, unknown>,
          'websiteUrl',
          'website_url',
        ),
    );
    setSupportEmail(
      readString(row, 'supportEmail', 'support_email') ||
        readString(
          ((row.contactSnapshot ?? row.contact_snapshot) ?? {}) as Record<string, unknown>,
          'email',
        ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publisher]);

  async function handleSave() {
    if (!publisherId) {
      setSaveError('请先创建发布者资料再保存设置。');
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      await publisherService.updatePublisher(publisherId, {
        displayName: displayName.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
        supportEmail: supportEmail.trim() || undefined,
      });
      onSaved();
    } catch (err) {
      setSaveError(formatApiError(err as Error));
    } finally {
      setSaving(false);
    }
  }

  if (!publisherId) {
    return (
      <div
        className="rounded-2xl p-10 text-center card"
        style={{ color: 'var(--text-secondary)' }}
      >
        未找到该账户的发布者资料。
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="card p-6">
        <h3
          className="font-bold text-lg mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          发布者资料
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              显示名称
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              法定名称
            </label>
            <input
              type="text"
              value={legalName}
              readOnly
              className="input-field"
              style={{ color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-muted)' }}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              官方网站
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              支持邮箱
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        {saveError && (
          <p className="mt-4 text-sm" style={{ color: 'var(--danger)' }}>
            {saveError}
          </p>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn-primary mt-6 text-sm"
        >
          {saving ? '保存中…' : '保存更改'}
        </button>
      </div>

      <div className="card p-6">
        <h3
          className="font-bold text-lg mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          认证状态
        </h3>
        <div
          className="flex items-center gap-4 p-4 rounded-xl"
          style={{
            backgroundColor: isVerified ? 'var(--success-subtle)' : 'var(--bg-muted)',
            border: `1px solid ${isVerified ? 'var(--success)' : 'var(--border-subtle)'}`,
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: isVerified ? 'var(--success-subtle)' : 'var(--bg-muted)',
              color: isVerified ? 'var(--success)' : 'var(--text-tertiary)',
            }}
          >
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {isVerified ? '已认证发布者' : '需要认证'}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {isVerified
                ? '你的发布者身份已通过认证。'
                : `当前状态：${verificationStatus}`}
            </p>
          </div>
          {isVerified ? (
            <span className="btn-secondary text-sm pointer-events-none opacity-80">
              已认证
            </span>
          ) : (
            <span
              className="btn-primary text-sm pointer-events-none opacity-60"
              title="认证流程将在发布者 API 完善后开放"
            >
              提交认证
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    published: { label: '已发布', className: 'badge-success' },
    draft: { label: '草稿', className: 'badge-neutral' },
    'in-review': { label: '审核中', className: 'badge-warning' },
    rejected: { label: '已拒绝', className: 'badge-error' },
  };
  const configItem = config[status] || { label: status, className: 'badge-neutral' };

  return (
    <span className={`badge ${configItem.className}`}>
      {configItem.label}
    </span>
  );
}
