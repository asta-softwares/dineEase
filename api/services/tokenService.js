import baseClient from '../baseClient';
import { useUserStore } from '../../stores/userStore';

export const tokenService = {
  refreshAccessToken: async () => {
    try {
      const refreshToken = useUserStore.getState().refreshToken;
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await baseClient.post('/token/refresh/', {
        refresh: refreshToken
      });

      const { access: newAccessToken } = response.data;
      return { access: newAccessToken };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
};
