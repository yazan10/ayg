import React from 'react';
import { Outlet } from 'react-router-dom';
import { InstagramHeader } from '../InstagramHeader';
import { InstagramBottomNav } from '../InstagramBottomNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-neutral-900 flex flex-col selection:bg-blue-600 selection:text-white">
      <InstagramHeader />
      <div className="flex-1 w-full max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-0 md:px-6 lg:px-8 py-0 md:py-6">
        <div className="w-full bg-white md:bg-transparent min-h-[calc(100vh-56px)] md:min-h-0 pb-[88px] md:pb-0 overflow-hidden md:overflow-visible">
          <Outlet />
        </div>
      </div>
      <InstagramBottomNav />
    </div>
  );
};
