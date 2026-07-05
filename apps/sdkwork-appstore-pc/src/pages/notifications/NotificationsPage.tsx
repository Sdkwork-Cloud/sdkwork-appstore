import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Filter } from 'lucide-react';

export function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const notifications: never[] = [];
  const unreadCount = 0;
  const filteredNotifications = activeFilter === 'unread' ? notifications : notifications;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">消息通知</h1>
          <p className="text-[var(--text-tertiary)] mt-1">及时了解应用动态与账户活动</p>
        </div>
        <button
          type="button"
          disabled
          className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-tertiary)] border border-[var(--border-default)] rounded-full cursor-not-allowed"
        >
          <CheckCheck className="w-4 h-4" />
          全部标为已读
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
              : 'bg-[var(--bg-surface)] border border-[var(--border-default)] hover:bg-[var(--bg-canvas)]'
          }`}
        >
          <Filter className="w-4 h-4" />
          全部
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('unread')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === 'unread'
              ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
              : 'bg-[var(--bg-surface)] border border-[var(--border-default)] hover:bg-[var(--bg-canvas)]'
          }`}
        >
          未读
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-[var(--accent-subtle)] text-[var(--accent)] rounded-full text-xs">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-10 text-center">
        <Bell className="mx-auto h-10 w-10 text-[var(--text-tertiary)] mb-3" />
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">暂无通知</h2>
        <p className="text-sm text-[var(--text-tertiary)] max-w-md mx-auto">
          开发者审核、上架动态与安装事件将在通知连接器接入后显示于此。
        </p>
        <Link
          to="/updates"
          className="mt-6 inline-block text-[var(--accent)] hover:opacity-90 font-medium text-sm"
        >
          前往查看应用更新
        </Link>
      </div>

      {filteredNotifications.length === 0 ? null : null}
    </div>
  );
}
