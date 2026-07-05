import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft } from 'lucide-react';

export function NotificationsPage() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center"
            aria-label="返回"
          >
            <ArrowLeft className="h-6 w-6" style={{ color: 'var(--text-primary)' }} />
          </button>
          <h1 className="text-lg font-bold text-[var(--text-primary)]">消息通知</h1>
        </div>
      </header>

      <div className="text-center py-20 px-4">
        <Bell className="w-16 h-16 text-[var(--border-strong)] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">暂无通知</h3>
        <p className="text-sm text-[var(--text-tertiary)] mt-2 max-w-sm mx-auto">
          开发者审核、上架动态与安装事件将在通知连接器接入后显示于此。
        </p>
      </div>
    </div>
  );
}
