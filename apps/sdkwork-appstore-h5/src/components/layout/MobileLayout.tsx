import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Compass, Grid3X3, Gamepad2, Search, Download } from 'lucide-react';
import { clsx } from 'clsx';

const tabs = [
  { path: '/', icon: Compass, label: '发现', end: true },
  { path: '/browse/apps', icon: Grid3X3, label: '应用' },
  { path: '/browse/games', icon: Gamepad2, label: '游戏' },
  { path: '/search', icon: Search, label: '搜索' },
  { path: '/library', icon: Download, label: '库' },
];

const HIDE_TAB_PATHS = ['/app/', '/login', '/publisher'];

export function MobileLayout() {
  const { pathname } = useLocation();
  const hideTabBar = HIDE_TAB_PATHS.some((prefix) => pathname.startsWith(prefix));

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-canvas)', paddingBottom: hideTabBar ? 0 : '4.5rem' }}
    >
      <main>
        <Outlet />
      </main>

      {!hideTabBar ? (
        <nav className="tab-bar" aria-label="主导航">
          <div className="flex items-stretch justify-around h-16 max-w-lg mx-auto px-1">
            {tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                end={tab.end}
                className={({ isActive }) =>
                  clsx(
                    'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors min-w-0',
                    isActive ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]',
                  )
                }
              >
                <tab.icon className="w-6 h-6 flex-shrink-0" strokeWidth={1.75} />
                <span className="truncate max-w-full px-0.5">{tab.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
