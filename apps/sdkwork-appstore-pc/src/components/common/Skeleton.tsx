interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

const RADIUS_MAP = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  full: 'var(--radius-full)',
};

export function Skeleton({
  width = '100%',
  height = 16,
  rounded = 'md',
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius: RADIUS_MAP[rounded],
      }}
      aria-hidden="true"
    />
  );
}

export function AppCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton width="100%" height={96} rounded="lg" />
      <Skeleton width="80%" height={14} />
      <Skeleton width="60%" height={12} />
    </div>
  );
}

export function AppListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton width={48} height={48} rounded="lg" />
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height={14} />
            <Skeleton width="40%" height={12} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <span
            className="text-[var(--text-tertiary)] font-bold"
            style={{ width: 24, textAlign: 'center' }}
          >
            {i + 1}
          </span>
          <Skeleton width={48} height={48} rounded="lg" />
          <div className="flex-1 space-y-2">
            <Skeleton width="70%" height={14} />
            <Skeleton width="50%" height={12} />
          </div>
        </div>
      ))}
    </div>
  );
}
