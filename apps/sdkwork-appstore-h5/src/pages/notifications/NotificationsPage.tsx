import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  ArrowLeft,
  Download,
  Star,
  Shield,
  Package,
  Gift,
  AlertCircle,
  Clock,
  Trash2,
} from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  iconColor: string;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'update', title: 'App Update Available', message: 'Amazing Productivity has a new version available.', time: '2m ago', read: false, iconColor: 'bg-blue-100 text-blue-600' },
  { id: '2', type: 'review', title: 'New Review', message: 'Someone left a 5-star review on your app.', time: '1h ago', read: false, iconColor: 'bg-yellow-100 text-yellow-600' },
  { id: '3', type: 'download', title: 'Download Complete', message: 'Photo Editor Pro has been installed.', time: '3h ago', read: true, iconColor: 'bg-green-100 text-green-600' },
  { id: '4', type: 'security', title: 'Security Alert', message: 'New login detected from a new device.', time: '5h ago', read: true, iconColor: 'bg-red-100 text-red-600' },
];

export function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
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
      default: return Bell;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-500">{unreadCount} unread</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button className="text-sm text-blue-500 font-medium">Mark all read</button>
          )}
        </div>
      </header>

      {/* Notifications */}
      <div className="px-4 py-4 space-y-2">
        {notifications.map(notification => {
          const Icon = getIcon(notification.type);
          return (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-4 rounded-xl ${
                notification.read ? 'bg-white' : 'bg-blue-50/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notification.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className={`text-sm font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {notification.time}
                  </span>
                  <div className="flex items-center gap-2 ml-auto">
                    {!notification.read && (
                      <button onClick={() => markAsRead(notification.id)} className="text-xs text-blue-500">
                        Read
                      </button>
                    )}
                    <button onClick={() => deleteNotification(notification.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-20 px-4">
          <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No notifications</h3>
          <p className="text-sm text-gray-500 mt-2">You're all caught up!</p>
        </div>
      )}
    </div>
  );
}
