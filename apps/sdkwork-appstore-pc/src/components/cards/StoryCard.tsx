import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface StoryCardData {
  id: string;
  collectionId?: string;
  title: string;
  subtitle?: string;
  coverUrl?: string;
  ctaText?: string;
  appIcons?: string[];
  href?: string;
}

interface StoryCardProps {
  story: StoryCardData;
  variant?: 'editorial' | 'collection';
  className?: string;
}

export function StoryCard({ story, variant = 'editorial', className = '' }: StoryCardProps) {
  const to = story.href ?? (story.collectionId ? `/collection/${story.collectionId}` : '/');

  return (
    <Link
      to={to}
      className={`block card-hover overflow-hidden group ${className}`}
      style={{ width: 320 }}
    >
      <div className="relative" style={{ aspectRatio: '4 / 3' }}>
        {story.coverUrl ? (
          <img
            src={story.coverUrl}
            alt=""
            className="w-full h-full object-cover transition-transform group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--accent)] to-[var(--bg-muted)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {story.appIcons && story.appIcons.length > 0 && (
          <div className="absolute bottom-3 right-3 flex -space-x-2">
            {story.appIcons.slice(0, 3).map((icon, i) => (
              <img
                key={i}
                src={icon}
                alt=""
                className="app-icon border-2 border-white"
                style={{ width: 32, height: 32 }}
                loading="lazy"
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-[var(--text-xs)] text-[var(--text-tertiary)] uppercase tracking-wide font-medium mb-1">
          {variant === 'editorial' ? '编辑精选' : '合集'}
        </p>
        <h3 className="font-semibold text-[var(--text-md)] text-[var(--text-primary)] line-clamp-1">
          {story.title}
        </h3>
        {story.subtitle && (
          <p className="text-[var(--text-sm)] text-[var(--text-secondary)] mt-1 line-clamp-2">
            {story.subtitle}
          </p>
        )}
        {story.ctaText && (
          <span className="inline-flex items-center gap-1 mt-3 text-[var(--text-sm)] text-[var(--accent)] font-medium">
            {story.ctaText}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </Link>
  );
}
