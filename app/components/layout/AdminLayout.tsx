import React from 'react';
import { Outlet, Navigate } from 'react-router';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { useCommandPalette } from '../../hooks/useCommandPalette';
import { CommandPalette } from '../advanced/CommandPalette';
import { SidebarProvider, SidebarInset } from '../ui/sidebar';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { isOpen, setIsOpen } = useCommandPalette();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar - as layout component */}
        <Sidebar />
        
        {/* Main content area */}
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header />
          
          {/* Page content */}
          <main className="flex-1 py-6">
            <div className="mx-auto w-full max-w-none px-6">
              {children || <Outlet />}
            </div>
          </main>
        </SidebarInset>
        
        {/* Command Palette */}
        <CommandPalette open={isOpen} onOpenChange={setIsOpen} />
      </div>
    </SidebarProvider>
  );
}
