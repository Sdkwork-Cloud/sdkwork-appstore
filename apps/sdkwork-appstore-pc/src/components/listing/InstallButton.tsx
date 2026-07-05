import { useState, type ButtonHTMLAttributes } from 'react';
import { Loader2, Check, Download } from 'lucide-react';

export type InstallButtonState =
  | 'free'
  | 'paid'
  | 'installing'
  | 'installed'
  | 'owned'
  | 'updating'
  | 'disabled';

interface InstallButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  state: InstallButtonState;
  priceLabel?: string;
  progress?: number; // 0-100,安装进度
  onClick?: () => void;
}

const STATE_CONFIG: Record<
  InstallButtonState,
  { label: string; variant: 'primary' | 'secondary'; icon?: typeof Loader2 }
> = {
  free: { label: '获取', variant: 'primary' },
  paid: { label: '价格', variant: 'primary' },
  installing: { label: '安装中', variant: 'primary', icon: Loader2 },
  installed: { label: '打开', variant: 'secondary', icon: Check },
  owned: { label: '打开', variant: 'secondary', icon: Check },
  updating: { label: '更新中', variant: 'primary', icon: Loader2 },
  disabled: { label: '不可用', variant: 'secondary' },
};

export function InstallButton({
  state,
  priceLabel,
  progress,
  onClick,
  disabled,
  className = '',
  ...rest
}: InstallButtonProps) {
  const [hovered, setHovered] = useState(false);
  const config = STATE_CONFIG[state];
  const Icon = config.icon;
  const isBusy = state === 'installing' || state === 'updating';
  const isDisabled = disabled || state === 'disabled' || isBusy;

  const label =
    state === 'paid' && priceLabel ? priceLabel : config.label;

  const baseClass =
    config.variant === 'primary' ? 'btn-primary' : 'btn-secondary';

  return (
    <button
      type="button"
      className={`relative overflow-hidden ${baseClass} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-busy={isBusy}
      aria-label={label}
      {...rest}
    >
      {isBusy && typeof progress === 'number' && progress > 0 && (
        <span
          className="absolute inset-0 bg-white/20 transition-all"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          aria-hidden="true"
        />
      )}
      <span className="relative flex items-center gap-2">
        {Icon && <Icon className={`w-4 h-4 ${isBusy ? 'animate-spin' : ''}`} />}
        {!Icon && state === 'free' && hovered && (
          <Download className="w-4 h-4" />
        )}
        <span>{label}</span>
      </span>
    </button>
  );
}
