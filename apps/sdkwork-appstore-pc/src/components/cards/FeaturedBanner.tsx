import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export interface FeaturedBannerData {
  id: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  coverUrl?: string;
  accentColor?: string;
  targetKind?: 'listing' | 'collection' | 'url' | 'event';
  targetId?: string;
}

interface FeaturedBannerProps {
  banners: FeaturedBannerData[];
  autoPlayMs?: number;
  className?: string;
}

export function FeaturedBanner({
  banners,
  autoPlayMs = 5000,
  className = '',
}: FeaturedBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1 || autoPlayMs <= 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, autoPlayMs);
    return () => clearInterval(timer);
  }, [banners.length, autoPlayMs]);

  if (banners.length === 0) {
    return (
      <div
        className={`relative overflow-hidden rounded-[var(--radius-2xl)] ${className}`}
        style={{
          height: 360,
          background: 'linear-gradient(135deg, var(--accent), var(--accent-active))',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-center p-8" style={{ color: 'var(--text-inverse)' }}>
          <div>
            <h1 className="text-[var(--text-5xl)] font-bold tracking-tight mb-3">
              SDKWork App Store
            </h1>
            <p className="text-[var(--text-lg)]" style={{ color: 'rgba(255,255,255,0.85)' }}>
              发现、安装、管理跨端应用
            </p>
          </div>
        </div>
      </div>
    );
  }

  const current = banners[activeIndex];

  return (
    <div
      className={`relative overflow-hidden rounded-[var(--radius-2xl)] group ${className}`}
      style={{ height: 360 }}
    >
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
          aria-hidden={i !== activeIndex}
        >
          {banner.coverUrl ? (
            <img
              src={banner.coverUrl}
              alt=""
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(135deg, ${banner.accentColor ?? 'var(--accent)'}, var(--accent-active))`,
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 flex items-end p-8 md:p-12">
        <div className="text-white max-w-2xl">
          <h2 className="text-[var(--text-5xl)] font-bold tracking-tight mb-3 drop-shadow-lg">
            {current.title}
          </h2>
          {current.subtitle && (
            <p className="text-[var(--text-lg)] text-white/85 mb-6 drop-shadow line-clamp-2">
              {current.subtitle}
            </p>
          )}
          {current.ctaText && (
            <Link
              to={current.ctaHref ?? '/'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors active:scale-95"
            >
              {current.ctaText}
            </Link>
          )}
        </div>
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-4 right-6 flex gap-2 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className="transition-all rounded-full"
              style={{
                width: i === activeIndex ? 24 : 8,
                height: 8,
                backgroundColor:
                  i === activeIndex ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
              }}
              aria-label={`切换到 Banner ${i + 1}`}
              aria-current={i === activeIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
}
