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
      throw error;
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
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          throw new Error('Invalid email or password');
        } else if (error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
        }
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please check your internet connection.');
      }
      // Something happened in setting up the request that triggered an Error
      throw new Error('An unexpected error occurred. Please try again later.');
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
      throw error;
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
      throw error;
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
      console.error('Error logging out:', error);
      // Still clear local data even if server logout fails
      await useUserStore.getState().clearUser();
      return { success: true };
    }
  },
};

export default authService;
