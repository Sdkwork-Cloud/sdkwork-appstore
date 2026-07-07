interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: 'h-5 w-5 border',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-2',
};

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-transparent ${SIZE_MAP[size]}`}
        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
        role="status"
        aria-label="加载中"
      />
    </div>
  );
}
