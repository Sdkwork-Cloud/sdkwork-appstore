import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNotice } from './MobileNotice';

export function AppShell() {
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-canvas)' }}>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pt-16 md:ml-16 xl:ml-60">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8">
            <div className="block md:hidden">
              <MobileNotice onDismiss={() => setNoticeDismissed(true)} dismissed={noticeDismissed} />
            </div>
            <div className={`${noticeDismissed ? 'block' : 'hidden md:block'}`}>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
