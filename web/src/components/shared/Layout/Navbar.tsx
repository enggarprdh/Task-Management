'use client';

import Link from 'next/link';
import { useState } from 'react';
import { User } from '@/types/task';

interface NavbarProps {
  user?: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed w-full top-0 left-0 z-50">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap">Task Manager</span>
          </Link>
        </div>
        
        <div className="flex items-center md:order-2">
          {user ? (
            <div className="flex items-center">
              <button
                type="button"
                className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
              </button>
              {isMenuOpen && (
                <div className="absolute top-10 right-4 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow">
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900">{user.firstName} {user.lastName}</span>
                    <span className="block text-sm font-medium text-gray-500 truncate">{user.email}</span>
                  </div>
                  <ul className="py-1">
                    <li>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          // Handle logout
                          localStorage.removeItem('token');
                          window.location.href = '/login';
                        }}
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link href="/login" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
                Login
              </Link>
              <Link href="/register" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5">
                Register
              </Link>
            </div>
          )}
        </div>
        
        <div className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1">
          <div className="relative mt-3 md:hidden">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block p-2 pl-10 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search..."
            />
          </div>
          <ul className="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white">
            <li>
              <Link href="/" className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0">
                Home
              </Link>
            </li>
            <li>
              <Link href="/board" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">
                Board
              </Link>
            </li>
            <li>
              <Link href="/tasks" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">
                Tasks
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
} 