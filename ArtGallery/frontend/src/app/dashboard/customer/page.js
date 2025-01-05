'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, MapPin, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth.service';
import { customerDashboardService } from '@/services/dashboard.service';
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const OrderStatus = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-200 text-green-900';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

const CustomerDashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    orders: {
      content: [],
      totalElements: 0
    },
    addresses: [],
    profile: {}
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [orders, profile, addresses] = await Promise.all([
          customerDashboardService.getMyOrders(),
          customerDashboardService.getProfile(),
          customerDashboardService.getShippingAddresses()
        ]);
        setDashboardData({ orders, profile, addresses });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getOrdersByStatus = (status) => {
    return dashboardData.orders.content.filter(order => 
      status === 'active' 
        ? !['DELIVERED', 'CANCELLED'].includes(order.status)
        : ['DELIVERED', 'CANCELLED'].includes(order.status)
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {dashboardData.profile.firstName}!</h1>
          <p className="text-gray-600">Member since {new Date(dashboardData.profile.createdAt).toLocaleDateString()}</p>
        </div>
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
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.orders.totalElements}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.orders.content.filter(order => order.status === 'DELIVERED').length} Delivered
            </p>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipping Addresses</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.addresses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">{dashboardData.profile.role}</p>
          </CardContent>
        </Card>
      </div>


        {/* Orders Section */}
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="active">Active Orders</TabsTrigger>
                <TabsTrigger value="completed">Order History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active">
                {getOrdersByStatus('active').length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No active orders at the moment.
                  </div>
                ) : (
                  <OrdersTable orders={getOrdersByStatus('active')} />
                )}
              </TabsContent>
              
              <TabsContent value="completed">
                {getOrdersByStatus('completed').length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No completed orders yet.
                  </div>
                ) : (
                  <OrdersTable orders={getOrdersByStatus('completed')} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.addresses.map((address, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="text-sm text-gray-600">{address}</div>
              </div>
            ))}
            {dashboardData.addresses.length === 0 && (
              <div className="text-center py-4 text-gray-500 col-span-2">
                No shipping addresses added yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const OrdersTable = ({ orders }) => (
  <div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left">
      <thead className="text-xs uppercase bg-gray-50">
        <tr>
          <th className="px-6 py-3">Order ID</th>
          <th className="px-6 py-3">Total</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3">Order Date</th>
          <th className="px-6 py-3">Shipping Address</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-4">#{order.id}</td>
            <td className="px-6 py-4">${order.totalAmount.toFixed(2)}</td>
            <td className="px-6 py-4">
              <OrderStatus status={order.status} />
            </td>
            <td className="px-6 py-4">
              {new Date(order.orderDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 truncate max-w-xs">{order.shippingAddress}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


export default CustomerDashboard;