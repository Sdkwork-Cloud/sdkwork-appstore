import { useEffect, useState } from 'react';
import { InstallButton, type InstallButtonState } from './InstallButton';

interface StickyInstallBarProps {
  displayName: string;
  iconLetter: string;
  installState: InstallButtonState;
  priceLabel: string;
  onInstall: () => void;
  threshold?: number;
}

export function StickyInstallBar({
  displayName,
  iconLetter,
  installState,
  priceLabel,
  onInstall,
  threshold = 320,
}: StickyInstallBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-16 left-0 md:left-16 xl:left-60 right-0 z-[var(--z-sticky)] border-b animate-slide-up"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg-surface) 92%, transparent)',
        backdropFilter: 'blur(16px)',
        borderColor: 'var(--border-subtle)',
      }}
      role="region"
      aria-label="快速获取"
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="app-icon w-10 h-10 flex items-center justify-center font-bold text-[var(--text-secondary)]"
            style={{ background: 'linear-gradient(135deg, var(--accent-subtle), var(--bg-muted))' }}
          >
            {iconLetter}
          </div>
          <p className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {displayName}
          </p>
        </div>
        <InstallButton
          state={installState}
          priceLabel={priceLabel}
          onClick={onInstall}
          className="px-6 py-2 text-[var(--text-sm)] flex-shrink-0"
        />
      </div>
    </div>
  );
}
