'use client';

import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function HomePage() {
  const auth = useSelector((state) => state.auth);
  
  useEffect(() => {
    // Debug logging
    console.log('Current Auth State:', auth);
    const token = localStorage.getItem('token'); // or however you're storing the token
    console.log('Stored Token:', token);
  }, [auth]);

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Art Gallery</h1>
      <div className="mb-4">
        <p>Authentication Status: {auth.isAuthenticated ? 'Logged In' : 'Not Logged In'}</p>
        {auth.user && (
          <div>
            <p>User: {auth.user.email}</p>
            <p>Role: {auth.user.role}</p>
          </div>
        )}
      </div>
    </div>
  );
}