"use client"; 
import React from 'react';
import { useSelector } from 'react-redux';
import  {Card}  from '@/components/ui/card';
import { BarChart, Activity, Users, ShoppingCart } from 'lucide-react';

const DashboardHome = () => {
  const user = useSelector((state) => state.auth.user);
  
  const stats = [
    { 
      title: 'Total Artworks', 
      value: '0', 
      icon: <BarChart className="w-8 h-8 text-blue-500" />,
      change: '+12.3%',
      changeType: 'positive'
    },
    { 
      title: 'Active Users', 
      value: '0', 
      icon: <Users className="w-8 h-8 text-green-500" />,
      change: '+8.2%',
      changeType: 'positive'
    },
    { 
      title: 'Total Orders', 
      value: '0', 
      icon: <ShoppingCart className="w-8 h-8 text-purple-500" />,
      change: '+23.1%',
      changeType: 'positive'
    },
    { 
      title: 'Monthly Activity', 
      value: '0', 
      icon: <Activity className="w-8 h-8 text-orange-500" />,
      change: '+15.4%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <div className={`text-sm mt-2 ${
                  stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
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
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="text-gray-500 text-sm">No recent activity</div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {user?.role === 'artist' && (
              <button className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
                Upload New Artwork
              </button>
            )}
            <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              View Profile
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;