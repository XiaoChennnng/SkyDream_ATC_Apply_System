import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { Footer } from './footer';

export function MainLayout() {

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow w-full max-w-full py-8 px-4">
        <div className="w-full max-w-[1440px] mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}