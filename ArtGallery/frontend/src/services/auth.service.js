import axios from './axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const authService = {
  async login(email, password) {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password
    });
    if (response.data.token) {
      // Store token in localStorage or cookies
      localStorage.setItem('token', response.data.token);
      // Set default auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  },

  async register(userData) {
    const response = await axios.post(`${API_URL}/api/users/register`, userData);
    return response.data;
  },

  async getCurrentUser() {
    const response = await axios.get(`${API_URL}/api/users/profile`);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const register = async (userData) => {
  const response = await axiosInstance.post('/api/users/register', userData);
  return response.data;
};

export default authService;