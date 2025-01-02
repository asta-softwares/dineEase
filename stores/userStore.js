import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const ACCESS_TOKEN_KEY = '@access_token';
const REFRESH_TOKEN_KEY = '@refresh_token';
const USER_DATA_KEY = '@user_data';

export const useUserStore = create((set) => ({
  user: null,
  authToken: null,
  refreshToken: null,

  setUser: async (user) => {
    set({ user });
    if (user) {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(USER_DATA_KEY);
    }
  },

  setTokens: async (authToken, refreshToken) => {
    set({ authToken, refreshToken });
    if (authToken) {
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, authToken);
    }
    if (refreshToken) {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  clearUser: async () => {
    set({
      user: undefined,
      authToken: undefined,
      refreshToken: undefined
    });
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY]);
  },

  // Initialize state from storage
  initialize: async () => {
    try {
      const [[, authToken], [, refreshToken], [, userData]] = await AsyncStorage.multiGet([
        ACCESS_TOKEN_KEY,
        REFRESH_TOKEN_KEY,
        USER_DATA_KEY
      ]);

      set({
        authToken: authToken || null,
        refreshToken: refreshToken || null,
        user: userData ? JSON.parse(userData) : null
      });

      return true;
    } catch (error) {
      console.error('Error initializing from storage:', error);
      return false;
    }
  }
}));
