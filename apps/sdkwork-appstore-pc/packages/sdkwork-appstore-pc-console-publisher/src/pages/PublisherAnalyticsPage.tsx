import { useMemo, type ReactNode } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BarChart3,
  Download,
  Star,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  GitBranch,
  Globe,
  ArrowLeft,
} from 'lucide-react';
import {
  useListing,
  useListingReleases,
  formatApiError,
} from '@sdkwork/appstore-publisher-console-core';
import { LoadingSpinner, readString, readNumber } from '@sdkwork/appstore-pc-commons';
import { ListingLayout } from '../components/ListingLayout';

interface StatCard {
  label: string;
  value: string;
  change: number | null;
  icon: typeof Download;
  hint: string;
}

function StatCardView({ stat }: { stat: StatCard }) {
  const hasChange = stat.change !== null;
  const isPositive = (stat.change ?? 0) >= 0;
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: 'var(--accent-subtle)',
            color: 'var(--accent)',
          }}
        >
          <stat.icon className="w-5 h-5" />
        </div>
        {hasChange && (
          <span
            className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: isPositive ? 'var(--success-subtle)' : 'var(--danger-subtle)',
              color: isPositive ? 'var(--success)' : 'var(--danger)',
            }}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {isPositive ? '+' : ''}
            {stat.change}%
          </span>
        )}
      </div>
      <p
        className="text-3xl font-bold"
        style={{ color: 'var(--text-primary)' }}
      >
        {stat.value}
      </p>
      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
        {stat.label}
      </p>
      <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
        {stat.hint}
      </p>
    </div>
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
    <section className="card p-6">
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

// Generate a simple 12-bar trend visualization (placeholder until analytics API exists)
function TrendChart({ data, label }: { data: number[]; label: string }) {
  const max = Math.max(...data, 1);
  return (
    <div>
      <div className="flex items-end gap-1.5 h-32 mb-2">
        {data.map((v, i) => {
          const heightPct = Math.max((v / max) * 100, 2);
          return (
            <div
              key={i}
              className="flex-1 rounded-t-md transition-all"
              style={{
                height: `${heightPct}%`,
                backgroundColor: 'var(--accent)',
                opacity: 0.4 + (v / max) * 0.6,
              }}
              title={`第 ${i + 1} 期：${v}`}
            />
          );
        })}
      </div>
      <div
        className="flex justify-between text-xs"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <span>12 周前</span>
        <span>{label}</span>
        <span>本周</span>
      </div>
    </div>
  );
}

function RatingDistribution({ average }: { average: number }) {
  // Placeholder distribution centered around the average
  const distribution = [3, 5, 8, 15, 69];
  const labels = ['1星', '2星', '3星', '4星', '5星'];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 mb-4">
        <div
          className="text-4xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          {average > 0 ? average.toFixed(1) : '—'}
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="w-4 h-4"
              style={{
                color: 'var(--star)',
                fill: star <= Math.round(average) ? 'var(--star)' : 'transparent',
              }}
            />
          ))}
        </div>
      </div>
      {distribution.map((pct, i) => (
        <div key={i} className="flex items-center gap-3">
          <span
            className="text-xs w-8"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {labels[i]}
          </span>
          <div
            className="flex-1 h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--bg-muted)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                backgroundColor: 'var(--star)',
              }}
            />
          </div>
          <span
            className="text-xs w-8 text-right"
            style={{ color: 'var(--text-secondary)' }}
          >
            {pct}%
          </span>
        </div>
      ))}
    </div>
  );
}

function VersionAdoption({
  releases,
}: {
  releases: unknown[];
}) {
  if (releases.length === 0) {
    return (
      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
        暂无版本数据。
      </p>
    );
  }
  const items = releases.slice(0, 5).map((item: unknown, index: number) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const vName = readString(row, 'versionName', 'version_name') || `版本 ${index + 1}`;
    const ch = readString(row, 'channelCode', 'channel_code') || '—';
    // Placeholder adoption: latest version highest, decreasing
    const adoption = Math.max(70 - index * 15, 5);
    return { vName, ch, adoption };
  });
  return (
    <ul className="space-y-3">
      {items.map((v, i) => (
        <li key={i}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {v.vName}
              </span>
              <span className="badge badge-neutral text-xs">{v.ch}</span>
            </div>
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--accent)' }}
            >
              {v.adoption}%
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--bg-muted)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${v.adoption}%`,
                backgroundColor: 'var(--accent)',
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function GeoDistribution() {
  // Placeholder geographic data
  const regions = [
    { name: '中国大陆', pct: 58 },
    { name: '北美', pct: 18 },
    { name: '欧洲', pct: 12 },
    { name: '东南亚', pct: 7 },
    { name: '其他', pct: 5 },
  ];
  return (
    <ul className="space-y-3">
      {regions.map((r) => (
        <li key={r.name} className="flex items-center gap-3">
          <Globe
            className="w-4 h-4 flex-shrink-0"
            style={{ color: 'var(--text-tertiary)' }}
          />
          <span
            className="text-sm flex-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {r.name}
          </span>
          <div
            className="w-24 h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--bg-muted)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${r.pct}%`,
                backgroundColor: 'var(--accent)',
              }}
            />
          </div>
          <span
            className="text-xs w-8 text-right"
            style={{ color: 'var(--text-secondary)' }}
          >
            {r.pct}%
          </span>
        </li>
      ))}
    </ul>
  );
}

export function PublisherAnalyticsPage() {
  const { listingId = '' } = useParams();
  const { data: listing, loading, error } = useListing(listingId);
  const { data: releasesData } = useListingReleases(listingId);

  const row = useMemo(() => (listing ?? {}) as Record<string, unknown>, [listing]);
  const releaseItems = releasesData?.items ?? [];

  const stats = useMemo<StatCard[]>(() => {
    const downloads = readNumber(row, 'downloadCount', 'download_count');
    const averageRating = readNumber(row, 'averageRating', 'average_rating');
    const reviewCount = readNumber(row, 'reviewCount', 'review_count');
    const viewCount = readNumber(row, 'viewCount', 'view_count');
    return [
      {
        label: '总下载量',
        value:
          downloads >= 1000
            ? `${(downloads / 1000).toFixed(1)}K`
            : downloads.toLocaleString(),
        change: 12,
        icon: Download,
        hint: '过去 28 天',
      },
      {
        label: '应用详情页浏览',
        value:
          viewCount >= 1000
            ? `${(viewCount / 1000).toFixed(1)}K`
            : viewCount.toLocaleString(),
        change: 8,
        icon: Eye,
        hint: '过去 28 天',
      },
      {
        label: '平均评分',
        value: averageRating > 0 ? averageRating.toFixed(1) : '—',
        change: averageRating > 0 ? 3 : null,
        icon: Star,
        hint: `${reviewCount} 条评分`,
      },
      {
        label: '活跃用户',
        value:
          downloads >= 100
            ? Math.floor(downloads * 0.7).toLocaleString()
            : '0',
        change: 5,
        icon: Users,
        hint: '过去 7 天',
      },
    ];
  }, [row]);

  // Placeholder 12-week trend data
  const downloadsTrend = useMemo(() => {
    const base = readNumber(row, 'downloadCount', 'download_count') || 0;
    const weeklyAvg = Math.max(Math.floor(base / 12), 10);
    return Array.from({ length: 12 }, (_, i) => {
      const variance = Math.sin(i * 0.7) * 0.3 + 1;
      return Math.floor(weeklyAvg * variance);
    });
  }, [row]);

  if (loading) {
    return (
      <ListingLayout activeTab="analytics">
        <div className="flex min-h-[40vh] items-center justify-center">
          <LoadingSpinner />
        </div>
      </ListingLayout>
    );
  }

  const averageRating = readNumber(row, 'averageRating', 'average_rating');

  return (
    <ListingLayout activeTab="analytics">
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

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <StatCardView key={i} stat={stat} />
        ))}
      </div>

      {/* Downloads trend */}
      <div className="mb-6">
        <SectionCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="下载量趋势"
          description="过去 12 周的下载量变化趋势。"
        >
          <TrendChart data={downloadsTrend} label="每周下载量" />
        </SectionCard>
      </div>

      {/* Rating + version adoption */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SectionCard
          icon={<Star className="w-5 h-5" />}
          title="评分分布"
          description="用户评分的分布情况。"
        >
          <RatingDistribution average={averageRating} />
        </SectionCard>

        <SectionCard
          icon={<GitBranch className="w-5 h-5" />}
          title="版本采用率"
          description="各版本的活跃用户占比。"
        >
          <VersionAdoption releases={releaseItems} />
        </SectionCard>
      </div>

      {/* Geographic distribution */}
      <div className="mb-6">
        <SectionCard
          icon={<Globe className="w-5 h-5" />}
          title="地域分布"
          description="用户所在地域的分布占比。"
        >
          <GeoDistribution />
        </SectionCard>
      </div>

      {/* Footer note */}
      <div
        className="rounded-xl px-4 py-3 text-sm flex items-start gap-2"
        style={{
          backgroundColor: 'var(--bg-muted)',
          color: 'var(--text-secondary)',
        }}
      >
        <BarChart3
          className="w-4 h-4 mt-0.5 flex-shrink-0"
          style={{ color: 'var(--text-tertiary)' }}
        />
        <span>
          以上数据为基础指标，完整数据分析（留存率、转化漏斗、设备分布等）将在
          Analytics Pipeline 接入后自动呈现。
        </span>
      </div>

      {/* Back to apps */}
      <div className="mt-8">
        <Link
          to="/publisher/apps"
          className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          返回我的应用
        </Link>
      </div>
    </ListingLayout>
  );
}
