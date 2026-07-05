import { NavLink } from 'react-router-dom';
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
  Package,
  Gamepad2,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}

const discoverItems: NavItem[] = [
  { to: '/', icon: Home, label: '发现', end: true },
  { to: '/apps', icon: Grid3X3, label: '应用' },
  { to: '/games', icon: Gamepad2, label: '游戏' },
  { to: '/charts', icon: TrendingUp, label: '榜单' },
  { to: '/category/featured', icon: Star, label: '精选' },
  { to: '/category/collections', icon: Compass, label: '合集' },
];

const libraryItems: NavItem[] = [
  { to: '/library', icon: Download, label: '我的应用' },
  { to: '/wishlist', icon: Heart, label: '收藏夹' },
  { to: '/updates', icon: RefreshCw, label: '更新中心' },
];

const accountItems: NavItem[] = [
  { to: '/publisher', icon: Package, label: '开发者中心' },
  { to: '/notifications', icon: Bell, label: '通知' },
  { to: '/settings', icon: Settings, label: '设置' },
];

const NAV_LINK_BASE =
  'nav-link flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--text-sm)] font-medium transition-colors';

const NAV_LINK_INACTIVE =
  'text-[var(--text-primary)] hover:bg-[var(--bg-muted)]';

const NAV_LINK_ACTIVE =
  'nav-link-active bg-[var(--accent-subtle)] text-[var(--accent)]';

export function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-16 bottom-0 w-60 overflow-y-auto border-r"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <nav className="p-4 space-y-6">
        <NavSection title="发现" items={discoverItems} />
        <NavSection title="我的库" items={libraryItems} />
        <div
          className="pt-4 border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <NavSection title="账户" items={accountItems} />
        </div>
      </nav>
    </aside>
  );
}

function NavSection({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <h3
        className="px-3 mb-2 text-[var(--text-xs)] font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {title}
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${NAV_LINK_BASE} ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE}`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
