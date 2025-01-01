'use client';

import { useSelector } from 'react-redux';

export default function HomePage() {
  const auth = useSelector((state) => state.auth);
  console.log('Dashboard Auth State:', useSelector(state => state.auth))

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Art Gallery</h1>
      <div className="mb-4">
        <p>Authentication Status: {auth.isAuthenticated ? 'Logged In' : 'Not Logged In'}</p>
      </div>
    </div>
  );
}