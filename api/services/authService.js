import apiClient from '../client';
import config from '../config';
import { useUserStore } from '../../stores/userStore';

const authService = {
  register: async (email, phone, username, password, name, typeOfUser) => {
    try {
      const response = await apiClient.post('/register/', {
        email,
        phone,
        username,
        password,
        name,
        typeOfUser,
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
        password,
      });

      const { access, refresh } = response.data;
      useUserStore.getState().setTokens(access, refresh);
      
      // Load user data after successful login
      await authService.fetchUser();
      
      return response.data;
    } catch (error) {
      throw error;
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
      if (error.response?.status === 401) {
        const success = await authService.refreshAccessToken();
        if (success) {
          return await authService.fetchUser();
        }
      }
      throw error;
    }
  },

  refreshAccessToken: async () => {
    const refreshToken = useUserStore.getState().refreshToken;
    if (!refreshToken) {
      console.error('No refresh token found. Please log in again.');
      return false;
    }

    try {
      const response = await apiClient.post('/token/refresh/', {
        refresh: refreshToken,
      });

      const { access } = response.data;
      useUserStore.getState().setTokens(access, refreshToken);
      return true;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return false;
    }
  },

  logout: async () => {
    const authToken = useUserStore.getState().authToken;
    if (!authToken) {
      console.error('No auth token found. Cannot log out.');
      return;
    }

    try {
      await apiClient.post('/token/logout/', null, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    } catch (error) {
      console.error('Error logging out on server:', error);
    } finally {
      useUserStore.getState().clearUser();
    }
  },
};

export default authService;
