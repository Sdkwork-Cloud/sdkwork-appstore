interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const SIZE_MAP = {
  sm: 'h-4 w-4 border',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-2',
};

export function LoadingSpinner({ size = 'md', className = '', label = '加载中' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-transparent ${SIZE_MAP[size]}`}
        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
        role="status"
        aria-label={label}
      />
    </div>
  );
}
