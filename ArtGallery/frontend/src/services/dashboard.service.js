import axios from './axios';
import Cookies from 'js-cookie';

// Create a custom axios instance for dashboard services
const dashboardAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add an interceptor to attach the Authorization header
dashboardAxios.interceptors.request.use(
  (config) => {
    // Retrieve token from localStorage or Cookies
    const token = localStorage.getItem('token') || Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle errors globally (optional)
dashboardAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('Unauthorized! Redirecting to login...');
      // Optionally, redirect to the login page or refresh token
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Add a new function to get user profile
const getCurrentUser = async () => {
  const response = await dashboardAxios.get('/api/users/profile');
  return response.data;
};

// Admin Dashboard Services
export const adminDashboardService = {
  getAllUsers: async () => {
    const response = await dashboardAxios.get('/api/users');
    return response.data;
  },
  getAllOrders: async () => {
    const response = await dashboardAxios.get('/api/orders');
    return response.data;
  },
  getCategories: async () => {
    const response = await dashboardAxios.get('/api/categories');
    return response.data;
  },
  updateOrderStatus: async (orderId, status) => {
    const response = await dashboardAxios.patch(`/api/orders/${orderId}`, { status });
    return response.data;
  },
};

// Artist Dashboard Services
export const artistDashboardService = {
  // Get current user's profile first
  getCurrentUser,
  getArtworks: async () => {
    const user = await getCurrentUser();
    const response = await dashboardAxios.get(`/api/artists/${user.id}/artworks`);
    return response.data;
  },
  getMySales: async () => {
    const response = await dashboardAxios.get('/api/orders/my-sales');
    return response.data;
  },
  // Calculate sales stats from the orders data
  getSalesStats: async () => {
    const orders = await artistDashboardService.getMySales(0, 1000); // Get all orders
    const stats = {
      totalSales: 0,
      pendingOrders: 0,
      completedOrders: 0
    };

    orders.content.forEach(order => {
      if (order.status === 'DELIVERED') {
        stats.completedOrders++;
        stats.totalSales += order.totalAmount;
      } else if (order.status === 'PENDING' || order.status === 'CONFIRMED') {
        stats.pendingOrders++;
      }
    });

    return stats;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await dashboardAxios.put(`/api/orders/${orderId}/status`, { status });
    return response.data;
  },
  createArtwork: async (artworkData) => {
    const user = await getCurrentUser();
    const response = await dashboardAxios.post(`/api/artworks?artistId=${user.id}`, artworkData);
    return response.data;
  }
};

// Customer Dashboard Services
export const customerDashboardService = {
  // Get current user's profile first
  getCurrentUser,
  getMyOrders: async () => {
    const response = await dashboardAxios.get('/api/orders/my-orders');
    return response.data;
  },
  getProfile: async (profileData) => {
    const response = await dashboardAxios.get('/api/users/profile', profileData);
    return response.data;
  },
  getShippingAddresses: async () => {
    const user = await getCurrentUser();
    const response = await dashboardAxios.get(`/api/users/${user.id}/addresses`);
    return response.data;
  },
};
