import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/slices/authSlice';
import authService from '@/services/auth.service';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getStoredToken();
      if (token) {
        try {
          // Assuming your authService has a method to get user data from token
          const user = await authService.getCurrentUser();
          dispatch(loginSuccess({ user, token }));
        } catch (error) {
          console.error('Auth initialization failed:', error);
          authService.logout(); // Clear invalid token
        }
      }
    };

    initAuth();
  }, [dispatch]);

  return children;
};

export default AuthInitializer;