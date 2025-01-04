import apiClient from '../client';
import config from '../config';
import { useUserStore } from '../../stores/userStore';

const authService = {
  register: async (email, phone, password, first_name, last_name, type_of_user) => {
    try {
      const response = await apiClient.post('/register/', {
        email,
        phone,
        password,
        first_name,
        last_name,
        type_of_user,
      });

      const { access, refresh } = response.data;
      useUserStore.getState().setTokens(access, refresh);
      return response.data;
    } catch (error) {
      // Log the complete error object for debugging
      console.log('Auth service error:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
        originalError: error
      });
      
      // Handle 401 Unauthorized
      if (error?.response?.status === 401) {
        const errorMessage = error?.response?.data?.detail || 'Invalid credentials';
        throw new Error(errorMessage);
      }
      
      // Handle network errors
      if (error?.message === 'Network Error') {
        throw new Error('No response from server. Please check your internet connection.');
      }
      
      // Handle other errors with detail
      if (error?.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      
      // Fallback error
      throw new Error(error?.message || 'An unexpected error occurred. Please try again later.');
    }
  },

  login: async (identifier, password) => {
    try {
      const response = await apiClient.post('/token/', {
        username: identifier,
        password: password,
      });

      const { access, refresh } = response.data;
      
      // Store tokens in userStore
      useUserStore.getState().setTokens(access, refresh);
      
      // Load user data after successful login
      const userData = await authService.fetchUser();
      
      return {
        tokens: {
          accessToken: access,
          refreshToken: refresh
        },
        user: userData
      };
    } catch (error) {
      // Log the complete error object for debugging
      console.log('Auth service error:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
        originalError: error
      });
      
      // Handle 401 Unauthorized
      if (error?.response?.status === 401) {
        const errorMessage = 'Invalid credentials';
        throw new Error(errorMessage);
      }
      
      // Handle network errors
      if (error?.message === 'Network Error') {
        throw new Error('No response from server. Please check your internet connection.');
      }
      
      // Handle other errors with detail
      if (error?.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      
      // Fallback error
      throw new Error(error?.message || 'An unexpected error occurred. Please try again later.');
    }
  },

  fetchUser: async () => {
    const authToken = useUserStore.getState().authToken;
    try {
      const response = await apiClient.get('/me/', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const userData = response.data;
      useUserStore.getState().setUser(userData);
      return userData;
    } catch (error) {
      // Log the complete error object for debugging
      console.log('Auth service error:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
        originalError: error
      });
      
      // Handle 401 Unauthorized
      if (error?.response?.status === 401) {
        const errorMessage = error?.response?.data?.detail || 'Invalid credentials';
        throw new Error(errorMessage);
      }
      
      // Handle network errors
      if (error?.message === 'Network Error') {
        throw new Error('No response from server. Please check your internet connection.');
      }
      
      // Handle other errors with detail
      if (error?.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      
      // Fallback error
      throw new Error(error?.message || 'An unexpected error occurred. Please try again later.');
    }
  },

  updateUser: async (userData) => {
    try {
      const authToken = useUserStore.getState().authToken;
      const response = await apiClient.patch('/update-user/', {
        ...userData,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      // Log the complete error object for debugging
      console.log('Auth service error:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
        originalError: error
      });
      
      // Handle 401 Unauthorized
      if (error?.response?.status === 401) {
        const errorMessage = error?.response?.data?.detail || 'Invalid credentials';
        throw new Error(errorMessage);
      }
      
      // Handle network errors
      if (error?.message === 'Network Error') {
        throw new Error('No response from server. Please check your internet connection.');
      }
      
      // Handle other errors with detail
      if (error?.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      
      // Fallback error
      throw new Error(error?.message || 'An unexpected error occurred. Please try again later.');
    }
  },

  logout: async () => {
    try {
      const authToken = useUserStore.getState().authToken;
      
      // Clear notification token first
      await authService.updateUser({
        profile: { notification_token: "" }
      });

      // Logout from server
      const response = await apiClient.post('/logout/', {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Clear user state and storage
      await useUserStore.getState().clearUser();

      return response.data;
    } catch (error) {
      // Log the complete error object for debugging
      console.log('Auth service error:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
        originalError: error
      });
      
      // Still clear local data even if server logout fails
      await useUserStore.getState().clearUser();
      return { success: true };
    }
  },
};

export default authService;
