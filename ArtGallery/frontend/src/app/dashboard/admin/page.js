"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, FolderOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import CategoryCard from '@/components/forms/CategoryCard';  // Adjust the import path as needed
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import authService from "@/services/auth.service";
import { adminDashboardService } from "@/services/dashboard.service";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const OrderStatus = ({ status, onStatusChange, orderId }) => {
  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PAID: "bg-green-100 text-green-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-200 text-green-900",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const allowedTransitions = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PAID", "CANCELLED"],
    PAID: ["SHIPPED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
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

const AdminDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    users: [],
    orders: {
      content: [],
      totalElements: 0,
    },
    categories: [],
  });

  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [users, orders, categories] = await Promise.all([
        adminDashboardService.getAllUsers(),
        adminDashboardService.getAllOrders(),
        adminDashboardService.getCategories(),
      ]);
      setDashboardData({
        users,
        orders,
        categories,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminDashboardService.updateOrderStatus(orderId, newStatus);
      await fetchDashboardData(); // Refresh data after update
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const getFilteredOrders = (type) => {
    return dashboardData.orders.content.filter((order) => {
      if (type == "active") {
        // Active orders are PENDING, CONFIRMED, PAID, SHIPPED
        return ["PENDING", "CONFIRMED", "PAID", "SHIPPED"].includes(
          order.status
        );
      }
      // Completed orders are DELIVERED or CANCELLED
      return ["DELIVERED", "CANCELLED"].includes(order.status);
    });
  };
  console.log("Active orders:", getFilteredOrders("active"));
  console.log("Completed orders:", getFilteredOrders("completed"));

  // Calculate artworks per category for chart
  const categoryStats = dashboardData.categories.map((category) => ({
    name: category.name,
    artworks: category.artworks.length,
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => {
            authService.logout();
            router.push("/auth/login");
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
            <div className="text-2xl font-bold">
              {dashboardData.users.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {
                dashboardData.users.filter((user) => user.role === "ARTIST")
                  .length
              }{" "}
              Artists,
              {
                dashboardData.users.filter((user) => user.role === "CUSTOMER")
                  .length
              }{" "}
              Customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.orders.totalElements}
            </div>
            <p className="text-xs text-muted-foreground">
              {
                dashboardData.orders.content.filter(
                  (order) => order.status === "PAID"
                ).length
              }{" "}
              Paid,
              {
                dashboardData.orders.content.filter(
                  (order) => order.status === "PENDING"
                ).length
              }{" "}
              Pending
              {
                dashboardData.orders.content.filter(
                  (order) => order.status === "DELIVERED"
                ).length
              }{" "}
              Delivered
            </p>
          </CardContent>
        </Card>

        <CategoryCard
          categories={dashboardData.categories}
          onCategoryCreated={(newCategory) => {
            setDashboardData((prev) => ({
              ...prev,
              categories: [...prev.categories, newCategory],
            }));
          }}
        />
      </div>

      {/* Orders Management Section */}
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="flex space-x-4 mb-4 border-b border-gray-200">
              <TabsTrigger
                value="active"
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Active Orders
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Completed Orders
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <OrdersTable
                orders={getFilteredOrders("active")}
                onStatusChange={handleStatusUpdate}
                isAdmin={true}
              />
            </TabsContent>

            <TabsContent value="completed">
              <OrdersTable
                orders={getFilteredOrders("completed")}
                onStatusChange={handleStatusUpdate}
                isAdmin={true}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
    </div>
  );
};

const OrdersTable = ({ orders, onStatusChange, isAdmin }) => (
  <div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left">
      <thead className="text-xs uppercase bg-gray-50">
        <tr>
          <th className="px-6 py-3">Order ID</th>
          {<th className="px-6 py-3">Customer</th>}
          {<th className="px-6 py-3">Artwork</th>}
          {<th className="px-6 py-3">Artist</th>}
          <th className="px-6 py-3">Amount</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3">Address</th>
          <th className="px-6 py-3">Date</th>
          {isAdmin && <th className="px-6 py-3">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-4">#{order.id}</td>
            {<td className="px-6 py-4">{order.buyerName}</td>}
            {<td className="px-6 py-4">{order.artworkTitle}</td>}
            {<td className="px-6 py-4">{order.artistName}</td>}
            <td className="px-6 py-4">
              {isAdmin ? (
                <OrderStatus
                  status={order.status}
                  onStatusChange={onStatusChange}
                  orderId={order.id}
                />
              ) : (
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    order.status === "PAID"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
              )}
            </td>
            <td className="px-6 py-4">${order.totalAmount.toFixed(2)}</td>
            <td className="px-6 py-4 truncate max-w-xs">
              {order.shippingAddress}
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

export default AdminDashboard;
