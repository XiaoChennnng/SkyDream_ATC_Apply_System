import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { Footer } from './footer';
import { useAuth } from '@/contexts/auth-context';

export function MainLayout() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header userRole={user?.role} userName={user?.name} />
      <main className="flex-grow w-full max-w-full py-8 px-4">
        <div className="w-full max-w-[1440px] mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}