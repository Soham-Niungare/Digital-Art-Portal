import axios from './axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const authService = {
  async login(email, password) {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password
    });
    if (response.data.token) {
      const token = response.data.token;
      // console.log("API Response:", response.data.token);
      // Decode token to get user info
      const decodedToken = jwtDecode(token);

      // Set cookie for both client and server
      Cookies.set('token', token, { 
        path: '/',
        expires: new Date(decodedToken.exp * 1000),
          secure: true,
          sameSite: 'Strict'
      });
      // Extract user info from decoded token
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;


      return {
        token,
        user: {
          email: decodedToken.sub,
          role: decodedToken.role
        }
      };
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
    Cookies.remove('token', { path: '/' });
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const register = async (userData) => {
  const response = await axiosInstance.post('/api/users/register', userData);
  return response.data;
};

export default authService;