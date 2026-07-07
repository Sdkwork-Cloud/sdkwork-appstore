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
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (banners.length <= 1 || autoPlayMs <= 0) return;
    // 兼容 prefers-reduced-motion：用户设置降低动效时，禁用自动轮播。
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || paused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, autoPlayMs);
    return () => clearInterval(timer);
  }, [banners.length, autoPlayMs, paused]);

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
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          setActiveIndex((prev) => (prev - 1 + banners.length) % banners.length);
        } else if (e.key === 'ArrowRight') {
          setActiveIndex((prev) => (prev + 1) % banners.length);
        }
      }}
      tabIndex={0}
      role="group"
      aria-roledescription="轮播图"
      aria-label="精选应用轮播，使用左右箭头键切换"
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
              width={1200}
              height={360}
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
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2), transparent)' }}
          />
        </div>
      ))}

      <div className="absolute inset-0 flex items-end p-8 md:p-12">
        <div className="max-w-2xl" style={{ color: 'var(--text-inverse)' }}>
          <h2 className="text-[var(--text-5xl)] font-bold tracking-tight mb-3 drop-shadow-lg">
            {current.title}
          </h2>
          {current.subtitle && (
            <p
              className="text-[var(--text-lg)] mb-6 drop-shadow line-clamp-2"
              style={{ color: 'var(--text-inverse)', opacity: 0.85 }}
            >
              {current.subtitle}
            </p>
          )}
          {current.ctaText && (
            <Link
              to={current.ctaHref ?? '/'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors active:scale-95"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
              }}
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
              aria-current={i === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
