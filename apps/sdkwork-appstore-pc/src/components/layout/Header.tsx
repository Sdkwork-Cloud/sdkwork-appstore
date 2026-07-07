import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Settings, Package, Bell, RefreshCw, Sun, Moon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

import { SearchDropdown } from '@/components/search/SearchDropdown';

export function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;

      // "/" 快捷键：仅在非输入态下触发
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        if (isTyping) return;
        event.preventDefault();
        searchRef.current?.focus();
        return;
      }

      // Ctrl/Cmd + K：全局搜索快捷键（对标 App Store / Play 行业标准）
      if ((event.metaKey || event.ctrlKey) && (event.key === 'k' || event.key === 'K')) {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 z-[var(--z-sticky)] border-b"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg-surface) 80%, transparent)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-active))',
              }}
            >
              <ShoppingBag className="w-5 h-5" style={{ color: 'var(--text-inverse)' }} />
            </div>
            <span className="text-[var(--text-md)] font-semibold text-[var(--text-primary)]">
              App Store
            </span>
          </Link>

          <form onSubmit={handleSearch} className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10"
              style={{ color: 'var(--text-tertiary)' }}
            />
            <input
              ref={searchRef}
              type="search"
              placeholder="搜索应用、游戏、开发者"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => {
                window.setTimeout(() => setSearchOpen(false), 150);
              }}
              aria-label="搜索应用、游戏、开发者"
              aria-expanded={searchOpen}
              aria-controls="header-search-dropdown"
              className="w-64 md:w-80 xl:w-96 pl-10 pr-16 py-2 rounded-xl text-[var(--text-sm)] focus:outline-none transition-all"
              style={{
                backgroundColor: searchOpen ? 'var(--bg-surface)' : 'var(--bg-muted)',
                color: 'var(--text-primary)',
                border: searchOpen ? '1px solid var(--accent)' : '1px solid transparent',
                boxShadow: searchOpen ? '0 0 0 3px var(--accent-subtle)' : 'none',
              }}
            />
            {!searchOpen && !searchQuery && (
              <kbd
                className="hidden md:flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium font-mono"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-tertiary)',
                }}
                aria-hidden="true"
              >
                <span className="hidden xl:inline">Ctrl</span>
                <span className="hidden xl:inline">+</span>
                <span>K</span>
              </kbd>
            )}
            <div id="header-search-dropdown">
              <SearchDropdown
                query={searchQuery}
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
                onQueryChange={setSearchQuery}
                inputRef={searchRef}
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-1">
          <HeaderLink to="/updates" icon={<RefreshCw className="w-4 h-4" />} label="更新" />
          <HeaderLink to="/library" icon={<ShoppingBag className="w-4 h-4" />} label="我的库" />
          <HeaderLink to="/publisher" icon={<Package className="w-4 h-4" />} label="开发者" />

          <div
            className="w-px h-6 mx-2"
            style={{ backgroundColor: 'var(--border-default)' }}
          />

          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-muted)]"
            style={{ color: 'var(--text-secondary)' }}
            aria-label={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
            title={theme === 'light' ? '深色模式' : '浅色模式'}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          <Link
            to="/notifications"
            className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-muted)]"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="通知"
          >
            <Bell className="w-5 h-5" />
          </Link>
          <Link
            to="/settings"
            className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-muted)]"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="设置"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

interface HeaderLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function HeaderLink({ to, icon, label }: HeaderLinkProps) {
  return (
    <Link
      to={to}
      title={label}
      aria-label={label}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[var(--text-sm)] font-medium transition-colors hover:bg-[var(--bg-muted)]"
      style={{ color: 'var(--text-primary)' }}
    >
      {icon}
      <span className="hidden xl:inline">{label}</span>
    </Link>
  );
}
