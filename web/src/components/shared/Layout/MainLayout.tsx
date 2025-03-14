'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { User } from '@/types/task';
import { useAuth } from '@/hooks/useAuth';

interface MainLayoutProps {
  children: ReactNode;
  user?: User | null;
}

export default function MainLayout({ children, user: propUser }: MainLayoutProps) {
  const { user: authUser, loading } = useAuth();
  const user = propUser || authUser;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <Sidebar />
      <div className="pt-[61px] pl-64 transition-all duration-300">
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
} 