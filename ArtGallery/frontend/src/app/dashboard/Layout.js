'use client';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else {
      // Ensure user is on the correct dashboard
      const currentPath = window.location.pathname;
      const expectedPath = `/dashboard/${user?.role}`;
      if (!currentPath.includes(expectedPath)) {
        router.push(expectedPath);
      }
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      {children}
    </div>
  );
}