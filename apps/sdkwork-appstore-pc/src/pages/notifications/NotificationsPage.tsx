import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Filter, ExternalLink } from 'lucide-react';
import { useNotifications, formatApiError } from '@/hooks/useApi';
import { getNotificationService } from '@/services/notificationClient';
import { isAuthenticated } from '@/bootstrap/iamRuntime';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import type { AppstoreNotificationItem } from '@sdkwork/appstore-notification-core';

export function NotificationsPage() {
  const authed = isAuthenticated();
  const { data, loading, error, execute } = useNotifications(authed);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [ackBusy, setAckBusy] = useState(false);

  const notifications = data?.items ?? [];
  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read && !item.archived).length,
    [notifications],
  );
  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'unread') {
      return notifications.filter((item) => !item.read && !item.archived);
    }
    return notifications;
  }, [activeFilter, notifications]);

  async function handleAcknowledgeAll() {
    const unreadIds = notifications.filter((item) => !item.read).map((item) => item.id);
    if (unreadIds.length === 0) {
      return;
    }
    setAckBusy(true);
    try {
      await getNotificationService().acknowledgeAll(unreadIds);
      await execute();
    } finally {
      setAckBusy(false);
    }
  }

  async function handleAcknowledgeOne(notificationId: string) {
    setAckBusy(true);
    try {
      await getNotificationService().acknowledge(notificationId);
      await execute();
    } finally {
      setAckBusy(false);
    }
  }

  if (!authed) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">消息通知</h1>
        <p className="text-[var(--text-tertiary)] mb-8">登录后查看审核、上架与账户动态。</p>
        <Link to="/login" className="btn-primary inline-flex">
          前往登录
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">消息通知</h1>
          <p className="text-[var(--text-tertiary)] mt-1">及时了解应用动态与账户活动</p>
        </div>
        <button
          type="button"
          disabled={ackBusy || unreadCount === 0}
          onClick={() => void handleAcknowledgeAll()}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-[var(--border-default)] rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg-canvas)]"
          style={{ color: 'var(--text-secondary)' }}
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
            <span className="badge badge-info">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div
          className="rounded-2xl border p-8 text-center"
          style={{
            borderColor: 'var(--warning)',
            backgroundColor: 'var(--warning-subtle)',
            color: 'var(--warning)',
          }}
          role="alert"
        >
          {formatApiError(error)}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-10 text-center">
          <Bell className="mx-auto h-10 w-10 text-[var(--text-tertiary)] mb-3" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            {activeFilter === 'unread' ? '暂无未读通知' : '暂无通知'}
          </h2>
          <p className="text-sm text-[var(--text-tertiary)] max-w-md mx-auto">
            开发者审核、上架动态与安装事件将显示于此。
          </p>
          <Link
            to="/updates"
            className="mt-6 inline-block text-[var(--accent)] hover:opacity-90 font-medium text-sm"
          >
            前往查看应用更新
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => (
            <NotificationRow
              key={item.id}
              item={item}
              busy={ackBusy}
              onAcknowledge={() => void handleAcknowledgeOne(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationRow({
  item,
  busy,
  onAcknowledge,
}: {
  item: AppstoreNotificationItem;
  busy: boolean;
  onAcknowledge: () => void;
}) {
  const isUnread = !item.read && !item.archived;
  const timeLabel = formatNotificationTime(item.time);

  return (
    <article
      className="rounded-2xl border p-4 transition-colors"
      style={{
        borderColor: 'var(--border-default)',
        backgroundColor: isUnread ? 'var(--accent-subtle)' : 'var(--bg-surface)',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[var(--text-primary)] truncate">{item.title}</h3>
            {isUnread ? (
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
                未读
              </span>
            ) : null}
          </div>
          {item.desc ? (
            <p className="text-sm text-[var(--text-secondary)] mb-1">{item.desc}</p>
          ) : null}
          {item.content ? (
            <p className="text-sm text-[var(--text-tertiary)] whitespace-pre-line">{item.content}</p>
          ) : null}
          <p className="text-xs text-[var(--text-tertiary)] mt-2">{timeLabel}</p>
          {item.actionUrl ? (
            <a
              href={item.actionUrl}
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]"
            >
              查看详情
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
        {isUnread ? (
          <button
            type="button"
            disabled={busy}
            onClick={onAcknowledge}
            className="shrink-0 text-xs font-medium text-[var(--accent)] hover:opacity-90 disabled:opacity-50"
          >
            标为已读
          </button>
        ) : null}
      </div>
    </article>
  );
}

function formatNotificationTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
