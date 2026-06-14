import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppShell() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
