import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Download,
  Star,
  Shield,
  Package,
  Gift,
  Clock,
  Filter,
  Trash2,
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'update' | 'review' | 'download' | 'security' | 'promotion' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  appId?: string;
  appName?: string;
  iconColor: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'update',
    title: 'App Update Available',
    message: 'Amazing Productivity has a new version (2.5.2) available with bug fixes and improvements.',
    time: '2 minutes ago',
    read: false,
    appId: '1',
    appName: 'Amazing Productivity',
    iconColor: 'bg-blue-100 text-blue-600',
  },
  {
    id: '2',
    type: 'review',
    title: 'New Review',
    message: 'Someone left a 5-star review on your app Task Manager Pro.',
    time: '1 hour ago',
    read: false,
    appId: '2',
    appName: 'Task Manager Pro',
    iconColor: 'bg-yellow-100 text-yellow-600',
  },
  {
    id: '3',
    type: 'download',
    title: 'Download Complete',
    message: 'Photo Editor Pro has been successfully installed.',
    time: '3 hours ago',
    read: true,
    appId: '3',
    appName: 'Photo Editor Pro',
    iconColor: 'bg-green-100 text-green-600',
  },
  {
    id: '4',
    type: 'security',
    title: 'Security Alert',
    message: 'A new login was detected from a new device in San Francisco, CA.',
    time: '5 hours ago',
    read: true,
    iconColor: 'bg-red-100 text-red-600',
  },
  {
    id: '5',
    type: 'promotion',
    title: 'Special Offer',
    message: 'Premium apps are 50% off this weekend! Explore the sale now.',
    time: '1 day ago',
    read: true,
    iconColor: 'bg-purple-100 text-purple-600',
  },
  {
    id: '6',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on Sunday, 2:00 AM - 4:00 AM UTC.',
    time: '2 days ago',
    read: true,
    iconColor: 'bg-gray-100 text-gray-600',
  },
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = activeFilter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'update': return Package;
      case 'review': return Star;
      case 'download': return Download;
      case 'security': return Shield;
      case 'promotion': return Gift;
      case 'system': return AlertCircle;
      default: return Bell;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-500 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg text-sm font-medium"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Filter className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('unread')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === 'unread' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.map(notification => {
          const Icon = getIcon(notification.type);
          return (
            <div
              key={notification.id}
              className={`flex items-start gap-4 p-5 rounded-2xl transition-all ${
                notification.read
                  ? 'bg-white border border-gray-100'
                  : 'bg-blue-50/50 border border-blue-100'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notification.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    <p className={`text-sm mt-0.5 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {notification.time}
                  </span>
                  {notification.appName && (
                    <Link
                      to={`/app/${notification.appId}`}
                      className="text-xs text-blue-500 hover:text-blue-600"
                    >
                      {notification.appName}
                    </Link>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-20">
          <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">No notifications</h3>
          <p className="text-gray-500 mt-2">
            {activeFilter === 'unread' ? "You're all caught up!" : "You don't have any notifications yet"}
          </p>
        </div>
      )}
    </div>
  );
}
