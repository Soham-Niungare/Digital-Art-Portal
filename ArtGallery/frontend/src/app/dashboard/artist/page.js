'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { DollarSign, Package, Palette, ShoppingBag } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { artistDashboardService } from '@/services/dashboard.service';
import authService from '@/services/auth.service';

const OrderStatus = ({ status, onStatusChange, orderId }) => {
  const statusColors = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'CONFIRMED': 'bg-blue-100 text-blue-800',
    'PAID': 'bg-green-100 text-green-800',
    'SHIPPED': 'bg-purple-100 text-purple-800',
    'DELIVERED': 'bg-green-200 text-green-900',
    'CANCELLED': 'bg-red-100 text-red-800'
  };

  const allowedTransitions = {
    'PENDING': ['CONFIRMED', 'CANCELLED'],
    'CONFIRMED': ['PAID', 'CANCELLED'],
    'PAID': ['SHIPPED'],
    'SHIPPED': ['DELIVERED'],
    'DELIVERED': [],
    'CANCELLED': []
  };

  return (
    <Select
      onValueChange={(newStatus) => onStatusChange(orderId, newStatus)}
      defaultValue={status}
      disabled={!allowedTransitions[status]?.length}
    >
      {({ isOpen, setIsOpen, value, handleSelect, disabled }) => (
        <>
          <SelectTrigger
            className={`w-[140px] ${statusColors[status]}`}
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <SelectValue value={value} placeholder={status} />
          </SelectTrigger>
          <SelectContent isOpen={isOpen}>
            {allowedTransitions[status]?.map((newStatus) => (
              <SelectItem
                key={newStatus}
                value={newStatus}
                onSelect={handleSelect}
              >
                {newStatus}
              </SelectItem>
            ))}
          </SelectContent>
        </>
      )}
    </Select>
  );
};

const OrdersTable = ({ orders, onStatusChange }) => (
  <div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left">
      <thead className="text-xs uppercase bg-gray-50">
        <tr>
          <th className="px-6 py-3">Order ID</th>
          <th className="px-6 py-3">Artwork</th>
          <th className="px-6 py-3">Customer</th>
          <th className="px-6 py-3">Total</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3">Order Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-4">#{order.id}</td>
            <td className="px-6 py-4">
              <div className="flex flex-col">
                <span className="font-medium">{order.artworkTitle}</span>
                <span className="text-xs text-gray-500">${order.totalAmount}</span>
              </div>
            </td>
            <td className="px-6 py-4">{order.buyerName}</td>
            <td className="px-6 py-4">${order.totalAmount}</td>
            <td className="px-6 py-4">
              <OrderStatus 
                status={order.status} 
                onStatusChange={onStatusChange}
                orderId={order.id}
              />
            </td>
            <td className="px-6 py-4">
              {new Date(order.orderDate).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ArtistDashboard = () => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState({
    artworks: [],
    sales: {
      content: [],
      totalElements: 0,
      pageable: {
        pageNumber: 0,
        pageSize: 10
      }
    },
    salesStats: {
      totalSales: 0,
      pendingOrders: 0,
      completedOrders: 0
    },
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [artworks, sales, salesStats] = await Promise.all([
        artistDashboardService.getArtworks(),
        artistDashboardService.getMySales(0, 10),
        artistDashboardService.getSalesStats()
      ]);
      
      setDashboardData({
        artworks,
        sales,
        salesStats,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch dashboard data'
      }));
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await artistDashboardService.updateOrderStatus(orderId, newStatus);
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getOrdersByStatus = (type) => {
    return dashboardData.sales.content.filter(order => {
      if (type === 'active') {
        return !['DELIVERED', 'CANCELLED'].includes(order.status);
      }
      return ['DELIVERED', 'CANCELLED'].includes(order.status);
    });
  };

  // Calculate monthly sales data
  const monthlySales = dashboardData.sales.content.reduce((acc, sale) => {
    const month = new Date(sale.orderDate).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + sale.totalAmount;
    return acc;
  }, {});

  const salesChartData = Object.entries(monthlySales).map(([month, amount]) => ({
    month,
    amount
  }));

  // Calculate artwork stats
  const availableArtworks = dashboardData.artworks.filter(art => art.status === 'AVAILABLE').length;
  const soldArtworks = dashboardData.artworks.filter(art => art.status === 'SOLD').length;
  const reservedArtworks = dashboardData.artworks.filter(art => art.status === 'RESERVED').length;
  const recentArtworks = dashboardData.artworks.filter(art => 
    new Date(art.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;

  if (dashboardData.loading) {
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <div className="text-2xl font-bold">${dashboardData.salesStats.totalSales}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.sales.totalElements} Orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.salesStats.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Artworks</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentArtworks}</div>
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
              <LineChart data={salesChartData}>
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
          <CardTitle>Orders Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList>
              <TabsTrigger value="active">Active Orders</TabsTrigger>
              <TabsTrigger value="completed">Completed Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <OrdersTable 
                orders={getOrdersByStatus('active')} 
                onStatusChange={handleStatusUpdate}
              />
            </TabsContent>
            
            <TabsContent value="completed">
              <OrdersTable 
                orders={getOrdersByStatus('completed')} 
                onStatusChange={handleStatusUpdate}
              />
            </TabsContent>
          </Tabs>
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