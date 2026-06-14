import { Outlet, NavLink } from 'react-router-dom';
import { Home, Search, Download, Heart, User, Bell, Settings } from 'lucide-react';
import { clsx } from 'clsx';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/search', icon: Search, label: 'Search' },
  { path: '/library', icon: Download, label: 'Library' },
  { path: '/notifications', icon: Bell, label: 'Alerts' },
  { path: '/settings', icon: User, label: 'Profile' },
];

export function MobileLayout() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-20">
      <main>
        <Outlet />
      </main>

      {/* Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200 z-50">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === '/'}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center gap-1 py-2 px-3 text-xs transition-colors',
                  isActive ? 'text-blue-500' : 'text-gray-400'
                )
              }
            >
              <tab.icon className="w-6 h-6" />
              <span>{tab.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
