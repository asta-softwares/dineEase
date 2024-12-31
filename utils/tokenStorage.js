import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEYS = {
  ACCESS: '@dineease_access_token',
  REFRESH: '@dineease_refresh_token',
};

export const tokenStorage = {
  async storeTokens(accessToken, refreshToken) {
    try {
      await AsyncStorage.multiSet([
        [TOKEN_KEYS.ACCESS, accessToken],
        [TOKEN_KEYS.REFRESH, refreshToken],
      ]);
    } catch (error) {
      console.error('Error storing tokens:', error);
      throw error;
    }
  },

  async getTokens() {
    try {
      const tokens = await AsyncStorage.multiGet([TOKEN_KEYS.ACCESS, TOKEN_KEYS.REFRESH]);
      const [accessToken, refreshToken] = tokens.map(([_, value]) => value);
      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error getting tokens:', error);
      return null;
    }
  },

  async getAccessToken() {
    try {
      return await AsyncStorage.getItem(TOKEN_KEYS.ACCESS);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  async getRefreshToken() {
    try {
      return await AsyncStorage.getItem(TOKEN_KEYS.REFRESH);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  async clearTokens() {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEYS.ACCESS, TOKEN_KEYS.REFRESH]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw error;
    }
  },
};
