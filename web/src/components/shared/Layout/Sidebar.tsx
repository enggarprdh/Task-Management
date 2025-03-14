'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`fixed top-[61px] left-0 z-40 h-screen transition-width duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      } bg-white border-r border-gray-200`}
    >
      <div className="h-full px-3 py-4 overflow-y-auto">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex justify-end mb-4 text-gray-500 hover:text-gray-900"
        >
          {isCollapsed ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
          )}
        </button>
        
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
              {!isCollapsed && <span className="ml-3">Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/board"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              {!isCollapsed && <span className="ml-3">Kanban Board</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/tasks"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
              </svg>
              {!isCollapsed && <span className="ml-3">Tasks</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/categories"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
              </svg>
              {!isCollapsed && <span className="ml-3">Categories</span>}
            </Link>
          </li>
        </ul>
        
        {!isCollapsed && (
          <div className="pt-4 mt-4 space-y-2 border-t border-gray-200">
            <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Team Members
            </h5>
            {/* This would be populated from the API */}
            <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                JD
              </div>
              <span className="ml-3">John Doe</span>
            </div>
            <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                JS
              </div>
              <span className="ml-3">Jane Smith</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
} 