'use client';
import React, { useState, useEffect } from 'react';
import  {Card , CardContent, CardHeader, CardTitle }  from '@/components/ui/card';
import { Users, ShoppingCart, FolderOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth.service';
import { adminDashboardService } from '@/services/dashboard.service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    users: [],
    orders: {
      content: [],
      totalElements: 0
    },
    categories: []
  });
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [users, orders, categories] = await Promise.all([
          adminDashboardService.getAllUsers(),
          adminDashboardService.getAllOrders(),
          adminDashboardService.getCategories()
        ]);
        setDashboardData({
          users,
          orders,
          categories
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Calculate artworks per category for chart
  const categoryStats = dashboardData.categories.map(category => ({
    name: category.name,
    artworks: category.artworks.length
  }));


  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }


  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={() => {
            authService.logout();
            router.push('/auth/login');
          }} 
          className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.users.length}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.users.filter(user => user.role === 'ARTIST').length} Artists,
              {dashboardData.users.filter(user => user.role === 'CUSTOMER').length} Customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.orders.totalElements}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.orders.content.filter(order => order.status === 'PAID').length} Paid,
              {dashboardData.orders.content.filter(order => order.status === 'PENDING').length} Pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.categories.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Stats Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Artworks by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="artworks" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Address</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.orders.content.map((order) => (
                  <tr key={order.id} className="bg-white border-b">
                    <td className="px-6 py-4">#{order.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">${order.totalAmount}</td>
                    <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 truncate max-w-xs">{order.shippingAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};


export default AdminDashboard;