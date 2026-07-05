import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface CollectionCardData {
  id: string;
  title: string;
  subtitle?: string;
  coverUrl?: string;
  appIcons?: string[];
  appCount?: number;
  href?: string;
}

interface CollectionCardProps {
  collection: CollectionCardData;
  className?: string;
}

export function CollectionCard({ collection, className = '' }: CollectionCardProps) {
  const to = collection.href ?? `/collection/${encodeURIComponent(collection.id)}`;

  return (
    <Link
      to={to}
      className={`block card-hover overflow-hidden group ${className}`}
      style={{ width: 280 }}
    >
      <div className="relative" style={{ aspectRatio: '16 / 9' }}>
        {collection.coverUrl ? (
          <img
            src={collection.coverUrl}
            alt=""
            className="w-full h-full object-cover transition-transform group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-active))',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-[var(--text-lg)] line-clamp-1 drop-shadow">
            {collection.title}
          </h3>
          {collection.subtitle && (
            <p className="text-white/80 text-[var(--text-sm)] mt-0.5 line-clamp-1">
              {collection.subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="p-3 flex items-center justify-between">
        <div className="flex -space-x-2">
          {collection.appIcons && collection.appIcons.length > 0 ? (
            collection.appIcons.slice(0, 4).map((icon, i) => (
              <img
                key={i}
                src={icon}
                alt=""
                className="app-icon border-2 border-[var(--bg-surface)]"
                style={{ width: 28, height: 28 }}
                loading="lazy"
              />
            ))
          ) : (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="app-icon border-2 border-[var(--bg-surface)] bg-[var(--bg-muted)]"
                style={{ width: 28, height: 28 }}
              />
            ))
          )}
        </div>
        <span className="inline-flex items-center gap-1 text-[var(--text-sm)] text-[var(--accent)] font-medium">
          {typeof collection.appCount === 'number'
            ? `${collection.appCount} 个应用`
            : '查看'}
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
