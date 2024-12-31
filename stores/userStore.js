import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserStore = create((set) => ({
  user: null,
  authToken: null,
  refreshToken: null,

  setUser: async (user) => {
    set({ user });
    // Store user data in AsyncStorage
    if (user) {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
    }
  },

  setTokens: (authToken, refreshToken) => {
    set({ authToken, refreshToken });
    // Store tokens in AsyncStorage
    if (authToken) AsyncStorage.setItem('authToken', authToken);
    if (refreshToken) AsyncStorage.setItem('refreshToken', refreshToken);
  },

  clearUser: async () => {
    set({ user: null, authToken: null, refreshToken: null });
    // Clear all data from AsyncStorage
    await Promise.all([
      AsyncStorage.removeItem('authToken'),
      AsyncStorage.removeItem('refreshToken'),
      AsyncStorage.removeItem('userData'),
    ]);
  },

  // Initialize data from AsyncStorage
  initializeAuth: async () => {
    try {
      const [authToken, refreshToken, userData] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('refreshToken'),
        AsyncStorage.getItem('userData'),
      ]);
      
      const initialState = {};
      
      if (authToken && refreshToken) {
        initialState.authToken = authToken;
        initialState.refreshToken = refreshToken;
      }
      
      if (userData) {
        initialState.user = JSON.parse(userData);
      }
      
      if (Object.keys(initialState).length > 0) {
        set(initialState);
        return true;
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
    return false;
  },
}));
