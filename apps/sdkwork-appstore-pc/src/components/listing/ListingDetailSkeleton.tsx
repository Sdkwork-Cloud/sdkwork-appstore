export function ListingDetailSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-10 animate-fade-in">
      <div className="skeleton" style={{ width: 280, height: 16 }} />
      <div className="flex gap-8">
        <div className="skeleton flex-shrink-0" style={{ width: 128, height: 128, borderRadius: 'var(--radius-icon)' }} />
        <div className="flex-1 space-y-4">
          <div className="skeleton" style={{ width: '60%', height: 40 }} />
          <div className="skeleton" style={{ width: '40%', height: 20 }} />
          <div className="skeleton" style={{ width: '30%', height: 16 }} />
          <div className="flex gap-3 mt-4">
            <div className="skeleton" style={{ width: 120, height: 44, borderRadius: 'var(--radius-full)' }} />
            <div className="skeleton rounded-full" style={{ width: 48, height: 48 }} />
          </div>
        </div>
      </div>
      <div>
        <div className="skeleton mb-4" style={{ width: 120, height: 24 }} />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton flex-shrink-0" style={{ width: 280, height: 500, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      </div>
      <div className="card p-6 space-y-3">
        <div className="skeleton" style={{ width: '100%', height: 14 }} />
        <div className="skeleton" style={{ width: '92%', height: 14 }} />
        <div className="skeleton" style={{ width: '78%', height: 14 }} />
      </div>
    </div>
  );
}
