import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout } from '@/store/slices/authSlice';
import authService from '@/services/auth.service';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user, loading, error } = useSelector((state) => state.auth);

  const login = async (email, password) => {
    try {
      dispatch(loginStart());
      const data = await authService.login(email, password);
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      router.push('/dashboard');
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
    }
  };

  const registerUser = async (userData) => {
    try {
      dispatch(loginStart());
      await authService.register(userData);
      // After registration, log them in automatically
      const loginData = await authService.login(userData.email, userData.password);
      dispatch(loginSuccess({ user: loginData.user, token: loginData.token }));
      router.push('/dashboard');
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || 'Registration failed'));
    }
  };

  const logoutUser = () => {
    authService.logout();
    dispatch(logout());
    router.push('/');
  };

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    registerUser,
    logoutUser
  };
};