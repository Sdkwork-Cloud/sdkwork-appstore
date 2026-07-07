import { Smartphone, X, Monitor } from 'lucide-react';

interface MobileNoticeProps {
  onDismiss: () => void;
  dismissed: boolean;
}

/**
 * PRD §6：<768px 显示降级提示「建议使用移动版」（可选）。
 * 用户可选择继续访问，但体验未针对小屏优化。
 */
export function MobileNotice({ onDismiss, dismissed }: MobileNoticeProps) {
  if (dismissed) return null;

  return (
    <div
      className="rounded-2xl border p-6 mb-6"
      style={{
        borderColor: 'var(--border-default)',
        backgroundColor: 'var(--bg-surface)',
      }}
      role="region"
      aria-label="移动端访问提示"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: 'var(--accent-subtle)',
            color: 'var(--accent)',
          }}
        >
          <Smartphone className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h2
            className="text-base font-semibold mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            建议使用更大屏幕访问
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            SDKWork 应用市场 PC 版针对桌面与平板（≥768px）优化，以提供大屏浏览、键盘搜索与多任务操作体验。当前设备屏幕较窄，部分功能可能无法正常使用。
          </p>
          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={onDismiss}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--text-inverse)',
              }}
            >
              <Monitor className="w-4 h-4" />
              继续访问
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="p-1.5 rounded-lg transition-colors hover:bg-[var(--bg-muted)] flex-shrink-0"
          style={{ color: 'var(--text-tertiary)' }}
          aria-label="关闭提示"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
