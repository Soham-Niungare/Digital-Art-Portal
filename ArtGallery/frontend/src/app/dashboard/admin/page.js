'use client';
import React from 'react';
import  Card  from '@/components/ui/card';
import { Users, Palette, DollarSign, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth.service';

const AdminDashboard = () => {
  const adminStats = [
    {
      title: 'Total Users',
      value: '0',
      icon: <Users className="w-8 h-8 text-blue-500" />,
      change: '+15.3%',
      changeType: 'positive'
    },
    {
      title: 'Active Artists',
      value: '0',
      icon: <Palette className="w-8 h-8 text-purple-500" />,
      change: '+8.7%',
      changeType: 'positive'
    },
    {
      title: 'Revenue',
      value: '$0',
      icon: <DollarSign className="w-8 h-8 text-green-500" />,
      change: '+25.8%',
      changeType: 'positive'
    },
    {
      title: 'Reports',
      value: '0',
      icon: <ShieldCheck className="w-8 h-8 text-red-500" />,
      change: '-12.4%',
      changeType: 'negative'
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
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Generate Report
        </button>
        <button onClick={handleLogout} style={logoutButtonStyle}>
        Logout
      </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat) => (
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
          <h2 className="text-lg font-semibold mb-4">Recent User Registrations</h2>
          <div className="space-y-4">
            <div className="text-gray-500 text-sm">No recent registrations</div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Pending Approvals</h2>
          <div className="space-y-4">
            <div className="text-gray-500 text-sm">No pending approvals</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">System Alerts</h2>
          <div className="space-y-4">
            <div className="text-gray-500 text-sm">No active alerts</div>
          </div>
        </Card>
      </div>
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

export default AdminDashboard;