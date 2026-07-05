import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { RatingStars } from '../listing/RatingStars';

export interface AppCardData {
  id: string;
  listingSlug: string;
  displayName: string;
  subtitle?: string;
  iconUrl?: string;
  averageRating?: number;
  ratingCount?: number;
  downloadCount?: number;
  pricingModel?: string;
  priceLabel?: string;
  category?: string;
}

interface AppCardProps {
  app: AppCardData;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'grid' | 'list';
  className?: string;
}

const ICON_SIZE = { sm: 48, md: 60, lg: 96 };

function formatDownloadCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M+`;
  if (count >= 1_000) return `${Math.round(count / 1_000)}K+`;
  return count > 0 ? String(count) : '';
}

function getPricingLabel(model?: string, priceLabel?: string): string {
  if (priceLabel) return priceLabel;
  if (!model) return '—';
  const normalized = model.toUpperCase();
  if (normalized === 'FREE' || normalized === 'FREEMIUM') return '免费';
  if (normalized === 'PAID' || normalized === 'SUBSCRIPTION') return '付费';
  return '—';
}

function AppIconFallback({ name, size }: { name: string; size: number }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center font-semibold"
      style={{
        fontSize: size * 0.4,
        background: 'linear-gradient(135deg, var(--accent), var(--accent-active))',
        color: 'var(--text-inverse)',
      }}
    >
      {name?.[0]?.toUpperCase() ?? '?'}
    </div>
  );
}

export function AppCard({
  app,
  size = 'md',
  layout = 'grid',
  className = '',
}: AppCardProps) {
  const iconPx = ICON_SIZE[size];
  const to = `/app/${encodeURIComponent(app.listingSlug)}`;

  if (layout === 'list') {
    return (
      <Link to={to} className={`flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-muted)] transition-colors ${className}`}>
        <div className="app-icon" style={{ width: iconPx, height: iconPx }}>
          {app.iconUrl ? (
            <img src={app.iconUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <AppIconFallback name={app.displayName} size={iconPx} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[var(--text-primary)] truncate text-[var(--text-base)]">
            {app.displayName}
          </p>
          {app.subtitle && (
            <p className="text-[var(--text-sm)] text-[var(--text-secondary)] truncate">
              {app.subtitle}
            </p>
          )}
          <div className="flex items-center gap-2 mt-0.5">
            {typeof app.averageRating === 'number' && app.averageRating > 0 && (
              <RatingStars rating={app.averageRating} size="xs" showValue />
            )}
            <span className="text-[var(--text-xs)] text-[var(--text-tertiary)]">
              {getPricingLabel(app.pricingModel, app.priceLabel)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={to} className={`block card-hover p-4 group transition-transform duration-200 hover:-translate-y-0.5 ${className}`}>
      <div
        className="app-icon mb-3 transition-transform duration-200 group-hover:scale-[1.02]"
        style={{ width: iconPx, height: iconPx }}
      >
        {app.iconUrl ? (
          <img
            src={app.iconUrl}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <AppIconFallback name={app.displayName} size={iconPx} />
        )}
      </div>
      <p className="font-semibold text-[var(--text-primary)] truncate text-[var(--text-base)]">
        {app.displayName}
      </p>
      {app.subtitle && (
        <p className="text-[var(--text-sm)] text-[var(--text-secondary)] truncate mt-0.5">
          {app.subtitle}
        </p>
      )}
      <div className="flex items-center justify-between mt-2">
        {typeof app.averageRating === 'number' && app.averageRating > 0 ? (
          <RatingStars rating={app.averageRating} size="xs" />
        ) : (
          <span />
        )}
        <span className="text-[var(--text-xs)] text-[var(--text-tertiary)]">
          {getPricingLabel(app.pricingModel, app.priceLabel)}
        </span>
      </div>
      {typeof app.downloadCount === 'number' && app.downloadCount > 0 && (
        <p className="flex items-center gap-1 mt-1 text-[var(--text-xs)] text-[var(--text-tertiary)]">
          <Download className="w-3 h-3" />
          {formatDownloadCount(app.downloadCount)}
        </p>
      )}
    </Link>
  );
}
