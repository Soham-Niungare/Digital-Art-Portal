'use client';

import { useSelector } from 'react-redux';
import Link from 'next/link';

export default function Header() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Art Gallery
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/gallery" className="hover:text-gray-300">
              Gallery
            </Link>
            <Link href="/artists" className="hover:text-gray-300">
              Artists
            </Link>
            
            {!isAuthenticated ? (
              <>
                <Link href="/auth/login" className="hover:text-gray-300">
                  Login
                </Link>
                <Link href="/auth/register" className="hover:text-gray-300">
                  Register
                </Link>
              </>
            ) : (
              <Link href="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}