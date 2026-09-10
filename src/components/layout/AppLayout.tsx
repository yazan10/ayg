import React from 'react';
import { Outlet } from 'react-router-dom';
import { InstagramHeader } from '../InstagramHeader';
import { InstagramBottomNav } from '../InstagramBottomNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent text-neutral-900 flex flex-col selection:bg-blue-600 selection:text-white">
      <InstagramHeader />
      <div className="flex-1 w-full max-w-[1280px] mx-auto px-0 sm:px-3 md:px-4 lg:px-6 py-0 sm:py-3 md:py-4">
        <div className="w-full bg-white min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-5rem)] sm:rounded-[20px] sm:border sm:border-neutral-200/70 sm:shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:shadow-slate-200/50 overflow-hidden pb-[88px] md:pb-0 backdrop-blur-sm transition-all">
          <Outlet />
        </div>
      </div>
      <InstagramBottomNav />
    </div>
  );
};
