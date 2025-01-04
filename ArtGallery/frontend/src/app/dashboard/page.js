"use client";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';


const DashboardHome = () => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user); // Fetch user info from Redux
  const [isRedirecting, setIsRedirecting] = useState(true); // Handle redirection status

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      switch (user.role) {
        case 'ADMIN':
          router.push('/dashboard/admin');
          break;
        case 'ARTIST':
          router.push('/dashboard/artist');
          break;
        case 'CUSTOMER':
          router.push('/dashboard/customer');
          break;
        default:
          router.push('/'); // Fallback for invalid roles
      }
    } else {
      // Redirect to login if user is not logged in
      router.push('/auth/login');
    }
    setIsRedirecting(false); // Stop redirection state
  }, [user, router]);

  if (isRedirecting) {
    // Show skeleton while redirecting
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-gray-200 rounded-md w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-md">
              <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-md w-full animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="p-4 border rounded-lg shadow-md">
          <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-4 animate-pulse"></div>
          <div className="h-40 bg-gray-200 rounded-md w-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return null; // No content needed as the user is redirected
};

export default DashboardHome;
