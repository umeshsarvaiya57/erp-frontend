import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileSidebar } from './MobileSidebar';
import { Breadcrumb } from './Breadcrumb';

export const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Breadcrumb />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
