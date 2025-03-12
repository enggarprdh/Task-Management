'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { User } from '@/types/task';

interface MainLayoutProps {
  children: ReactNode;
  user?: User | null;
}

export default function MainLayout({ children, user }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <Sidebar user={user} />
      <div className="pt-[61px] pl-64 transition-all duration-300">
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
} 