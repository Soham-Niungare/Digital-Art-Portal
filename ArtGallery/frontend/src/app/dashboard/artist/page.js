'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, DollarSign, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { artistDashboardService } from '@/services/dashboard.service';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import authService from '@/services/auth.service';

const ArtistDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    artworks: [],
    sales: {
      content: [],
      totalElements: 0
    }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get all the required data
        const [artworks, sales] = await Promise.all([
          artistDashboardService.getArtworks(),  // This will now handle getting the ID internally
          artistDashboardService.getMySales()
        ]);
  
        setDashboardData({ artworks, sales });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, []);

  // Calculate monthly sales data
  const monthlySales = dashboardData.sales.content.reduce((acc, sale) => {
    const month = new Date(sale.orderDate).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + sale.totalAmount;
    return acc;
  }, {});

  const salesData = Object.entries(monthlySales).map(([month, amount]) => ({
    month,
    amount
  }));


   // Calculate status counts
   const availableArtworks = dashboardData.artworks.filter(art => art.status === 'AVAILABLE').length;
   const soldArtworks = dashboardData.artworks.filter(art => art.status === 'SOLD').length;
   const reservedArtworks = dashboardData.artworks.filter(art => art.status === 'RESERVED').length;
 
   const totalSalesAmount = dashboardData.sales.content.reduce((sum, sale) => sum + sale.totalAmount, 0);

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Artist Dashboard</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artworks</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.artworks.length}</div>
            <p className="text-xs text-muted-foreground">
              {availableArtworks} Available, {soldArtworks} Sold, {reservedArtworks} Reserved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalSalesAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.sales.totalElements} Orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Artworks</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.artworks.filter(art => 
                new Date(art.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">In the last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Latest Artworks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Medium</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Created At</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.artworks.slice(0, 5).map((artwork) => (
                  <tr key={artwork.id} className="bg-white border-b">
                    <td className="px-6 py-4">{artwork.title}</td>
                    <td className="px-6 py-4">${artwork.price.toFixed(2)}</td>
                    <td className="px-6 py-4">{artwork.medium}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        artwork.status === 'SOLD' 
                          ? 'bg-green-100 text-green-800' 
                          : artwork.status === 'RESERVED'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {artwork.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(artwork.createdAt).toLocaleDateString()}
                    </td>
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


export default ArtistDashboard;