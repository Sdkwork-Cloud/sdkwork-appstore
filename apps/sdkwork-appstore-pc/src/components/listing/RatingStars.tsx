import { Star, StarHalf } from 'lucide-react';

interface RatingStarsProps {
  rating: number; // 0-5
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showValue?: boolean;
  count?: number;
  className?: string;
}

const SIZE_MAP = {
  xs: 12,
  sm: 14,
  md: 18,
  lg: 24,
};

export function RatingStars({
  rating,
  size = 'sm',
  showValue = false,
  count,
  className = '',
}: RatingStarsProps) {
  const px = SIZE_MAP[size];
  const clamped = Math.max(0, Math.min(5, rating));
  const full = Math.floor(clamped);
  const hasHalf = clamped - full >= 0.25 && clamped - full < 0.75;
  const roundedUp = clamped - full >= 0.75;
  const totalFull = full + (roundedUp ? 1 : 0);

  return (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      role="img"
      aria-label={`评分 ${clamped.toFixed(1)} 星`}
    >
      <span className="inline-flex items-center">
        {Array.from({ length: 5 }, (_, i) => {
          if (i < totalFull) {
            return (
              <Star
                key={i}
                style={{ width: px, height: px }}
                className="fill-current"
                color="var(--star)"
                strokeWidth={0}
              />
            );
          }
          if (i === totalFull && hasHalf) {
            return (
              <span key={i} style={{ position: 'relative', display: 'inline-flex' }}>
                <Star
                  style={{ width: px, height: px }}
                  color="var(--border-default)"
                  strokeWidth={0}
                  className="fill-current"
                />
                <StarHalf
                  style={{
                    width: px,
                    height: px,
                    position: 'absolute',
                    inset: 0,
                  }}
                  className="fill-current"
                  color="var(--star)"
                  strokeWidth={0}
                />
              </span>
            );
          }
          return (
            <Star
              key={i}
              style={{ width: px, height: px }}
              color="var(--border-default)"
              strokeWidth={0}
              className="fill-current"
            />
          );
        })}
      </span>
      {showValue && (
        <span
          style={{ fontSize: px * 0.85 }}
          className="font-medium"
        >
          {clamped.toFixed(1)}
        </span>
      )}
      {typeof count === 'number' && (
        <span
          style={{ fontSize: px * 0.85 }}
          className="text-[var(--text-tertiary)]"
        >
          ({count.toLocaleString()})
        </span>
      )}
    </span>
  );
}
