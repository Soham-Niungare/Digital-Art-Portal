import axios from './axios';

const orderService = {
  createOrder: async (orderData) => {
    const response = await axios.post('/api/orders', orderData);
    return response.data;
  },

  getAllOrders: async (page = 0, size = 20, status = null) => {
    const params = new URLSearchParams({ page, size });
    if (status) params.append('status', status);
    const response = await axios.get(`/api/orders?${params}`);
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await axios.get(`/api/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await axios.put(`/api/orders/${id}/status`, { status });
    return response.data;
  },

  getMyOrders: async (page = 0, size = 20) => {
    const response = await axios.get(`/api/orders/my-orders?page=${page}&size=${size}`);
    return response.data;
  },

  getMySales: async (page = 0, size = 20) => {
    const response = await axios.get(`/api/orders/my-sales?page=${page}&size=${size}`);
    return response.data;
  }
};

export default orderService;