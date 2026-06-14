import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Grid3X3,
  Compass,
  TrendingUp,
  Star,
  Download,
  Heart,
  Settings,
  Bell,
  RefreshCw,
  User,
  Package,
} from 'lucide-react';
import { clsx } from 'clsx';

const discoverItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/category/featured', icon: Star, label: 'Featured' },
  { to: '/category/top-charts', icon: TrendingUp, label: 'Top Charts' },
  { to: '/category/collections', icon: Compass, label: 'Collections' },
  { to: '/category/apps', icon: Grid3X3, label: 'Categories' },
];

const libraryItems = [
  { to: '/library', icon: Download, label: 'My Apps' },
  { to: '/wishlist', icon: Heart, label: 'Wishlist' },
  { to: '/updates', icon: RefreshCw, label: 'Updates' },
];

const accountItems = [
  { to: '/publisher', icon: Package, label: 'Developer' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-6">
        {/* Discover */}
        <div>
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Discover
          </h3>
          <ul className="space-y-1">
            {discoverItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Library */}
        <div>
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Library
          </h3>
          <ul className="space-y-1">
            {libraryItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Account
          </h3>
          <ul className="space-y-1">
            {accountItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
