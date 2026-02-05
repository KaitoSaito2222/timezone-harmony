import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Toaster } from '@/components/ui/sonner';

export function Layout() {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
