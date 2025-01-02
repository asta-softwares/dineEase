import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const ACCESS_TOKEN_KEY = '@access_token';
const REFRESH_TOKEN_KEY = '@refresh_token';
const USER_DATA_KEY = '@user_data';

export const useUserStore = create((set, get) => ({
  user: null,
  authToken: null,
  refreshToken: null,
  isInitialized: false,

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

  // Initialize data from AsyncStorage
  initializeAuth: async () => {
    try {
      const [[, authToken], [, refreshToken], [, userData]] = await AsyncStorage.multiGet([
        ACCESS_TOKEN_KEY,
        REFRESH_TOKEN_KEY,
        USER_DATA_KEY
      ]);

      const initialState = {
        isInitialized: true
      };

      if (authToken && refreshToken) {
        initialState.authToken = authToken;
        initialState.refreshToken = refreshToken;
      }

      if (userData) {
        initialState.user = JSON.parse(userData);
      }

      set(initialState);
      return initialState;
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isInitialized: true });
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const state = get();
    return !!(state.user && state.authToken);
  },
}));
