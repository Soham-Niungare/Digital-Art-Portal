'use client';
import React from 'react';
import  Card  from '@/components/ui/card';
import { Image, DollarSign, Eye, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth.service';

const ArtistDashboard = () => {
  const artistStats = [
    {
      title: 'Total Artworks',
      value: '0',
      icon: <Image className="w-8 h-8 text-blue-500" />,
      change: '+5.3%',
      changeType: 'positive'
    },
    {
      title: 'Total Sales',
      value: '$0',
      icon: <DollarSign className="w-8 h-8 text-green-500" />,
      change: '+12.7%',
      changeType: 'positive'
    },
    {
      title: 'Profile Views',
      value: '0',
      icon: <Eye className="w-8 h-8 text-purple-500" />,
      change: '+18.2%',
      changeType: 'positive'
    },
    {
      title: 'Average Rating',
      value: '0.0',
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      change: '0%',
      changeType: 'neutral'
    }
  ];
  const router = useRouter();

  const handleLogout = () => {
    authService.logout();

    // Redirect to login page
    router.push('/auth/login');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Artist Dashboard</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Upload Artwork
        </button>
        <button onClick={handleLogout} style={logoutButtonStyle}>
        Logout
      </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {artistStats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <div className={`text-sm mt-2 ${
                  stat.changeType === 'positive' ? 'text-green-500' : 
                  stat.changeType === 'negative' ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {stat.change}
                </div>
              </div>
              {stat.icon}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
          <div className="space-y-4">
            <div className="text-gray-500 text-sm">No recent sales</div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Latest Reviews</h2>
          <div className="space-y-4">
            <div className="text-gray-500 text-sm">No reviews yet</div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Popular Artworks</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="text-gray-500 text-sm">No artworks uploaded</div>
        </div>
      </Card>
    </div>
  );
};

const logoutButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default ArtistDashboard;