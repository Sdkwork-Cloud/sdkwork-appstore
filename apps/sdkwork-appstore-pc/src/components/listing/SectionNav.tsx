import { useState, useEffect, useRef, useCallback } from 'react';

interface SectionNavProps {
  sections: { id: string; label: string }[];
}

/**
 * Sticky section navigation for the listing detail page.
 * Tracks active section via IntersectionObserver and supports
 * smooth-scroll navigation. Mirrors App Store macOS section tabs.
 */
export function SectionNav({ sections }: SectionNavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sections.length === 0) return;

    // Disconnect previous observer
    observerRef.current?.disconnect();

    const visibleMap = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visibleMap.set(id, entry.intersectionRatio);
          } else {
            visibleMap.delete(id);
          }
        });

        // Pick the most visible section
        let bestId: string | null = null;
        let bestRatio = 0;
        visibleMap.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestId) {
          setActiveId(bestId);
        }
      },
      {
        // Trigger when section top reaches ~30% from viewport top (account for sticky header + nav)
        rootMargin: '-140px 0px -60% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    observerRef.current = observer;

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        // Offset for sticky header (64px) + sticky nav (56px) + spacing
        const top =
          el.getBoundingClientRect().top + window.scrollY - 130;
        window.scrollTo({ top, behavior: 'smooth' });
        setActiveId(id);
      }
    },
    [],
  );

  if (sections.length === 0) return null;

  return (
    <div
      ref={navRef}
      className="sticky top-16 z-30 -mx-4 px-4 md:mx-0 md:px-0 py-3 mb-2"
      style={{
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      <nav
        className="flex gap-1 overflow-x-auto scroll-x rounded-2xl p-1.5"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
        aria-label="详情页区块导航"
      >
        {sections.map((section) => {
          const active = activeId === section.id;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(e) => handleClick(e, section.id)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
              style={
                active
                  ? {
                      backgroundColor: 'var(--accent)',
                      color: 'var(--text-inverse)',
                    }
                  : {
                      color: 'var(--text-secondary)',
                    }
              }
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = 'var(--bg-muted)';
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-current={active ? 'true' : undefined}
            >
              {section.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
