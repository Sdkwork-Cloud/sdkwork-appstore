import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, X, ChevronLeft, ChevronRight, Smartphone } from 'lucide-react';

export interface MediaItem {
  id: string;
  kind: 'screenshot' | 'video_preview' | 'promo';
  url?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  width?: number;
  height?: number;
  durationMs?: number;
  locale?: string;
  platform?: string;
  sortOrder?: number;
}

interface ScreenshotGalleryProps {
  items: MediaItem[];
  loading?: boolean;
  className?: string;
  appName?: string;
}

export function ScreenshotGallery({
  items,
  loading = false,
  className = '',
  appName = '应用',
}: ScreenshotGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [items, updateScrollState]);

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const openLightbox = (index: number) => setActiveIndex(index);
  const closeLightbox = () => setActiveIndex(null);

  const navigateLightbox = (dir: 1 | -1) => {
    if (activeIndex === null) return;
    const next = activeIndex + dir;
    if (next < 0 || next >= items.length) return;
    setActiveIndex(next);
  };

  if (loading) {
    return (
      <div className={`flex gap-4 overflow-hidden ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="skeleton flex-shrink-0"
            style={{ width: 256, height: 384 }}
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className={`flex items-center justify-center text-[var(--text-tertiary)] ${className}`}
        style={{ height: 240 }}
      >
        <div className="text-center">
          <Smartphone style={{ width: 40, height: 40, margin: '0 auto 8px' }} />
          <p style={{ fontSize: 'var(--text-sm)' }}>暂无截图</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`relative ${className}`}>
        <div
          ref={scrollerRef}
          onScroll={updateScrollState}
          className="scroll-x flex gap-4 pb-2"
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openLightbox(index)}
              className="group relative flex-shrink-0 overflow-hidden card-hover"
              style={{ width: 256, height: 384 }}
              aria-label={`查看${appName}截图 ${index + 1}`}
            >
              {item.kind === 'video_preview' ? (
                <>
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={`${appName} 视频预览 ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--bg-muted)]" />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-90">
                    <span className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-6 h-6 text-gray-900 fill-current ml-0.5" />
                    </span>
                  </span>
                </>
              ) : item.url ? (
                <img
                  src={item.url}
                  alt={`${appName} 截图 ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-[1.02]"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--bg-muted)] to-[var(--border-subtle)]" />
              )}
            </button>
          ))}
        </div>

        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollBy(-320)}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--bg-surface)] shadow-md flex items-center justify-center hover:bg-[var(--bg-elevated)] z-10"
            aria-label="向左滚动"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollBy(320)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--bg-surface)] shadow-md flex items-center justify-center hover:bg-[var(--bg-elevated)] z-10"
            aria-label="向右滚动"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {activeIndex !== null && (
        <Lightbox
          items={items}
          index={activeIndex}
          appName={appName}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      )}
    </>
  );
}

interface LightboxProps {
  items: MediaItem[];
  index: number;
  appName: string;
  onClose: () => void;
  onNavigate: (dir: 1 | -1) => void;
}

function Lightbox({ items, index, appName, onClose, onNavigate }: LightboxProps) {
  const item = items[index];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(-1);
      if (e.key === 'ArrowRight') onNavigate(1);
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, onNavigate]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] bg-black/90 flex items-center justify-center animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="图片预览"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
        aria-label="关闭"
      >
        <X className="w-6 h-6" />
      </button>

      {index > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(-1);
          }}
          className="absolute left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          aria-label="上一张"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
      )}
      {index < items.length - 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(1);
          }}
          className="absolute right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          aria-label="下一张"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      )}

      <div
        className="max-w-[90vw] max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {item.kind === 'video_preview' && item.videoUrl ? (
          <video
            src={item.videoUrl}
            controls
            autoPlay
            className="max-w-[90vw] max-h-[85vh] rounded-lg"
          />
        ) : item.url ? (
          <img
            src={item.url}
            alt={`${appName} 截图 ${index + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
          />
        ) : (
          <div className="w-[60vw] h-[70vh] bg-white/5 rounded-lg" />
        )}
        <p className="text-center text-white/70 mt-3 text-sm">
          {index + 1} / {items.length}
        </p>
      </div>
    </div>
  );
}
