import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserStore = create((set) => ({
  user: null,
  authToken: null,
  refreshToken: null,

  setUser: (user) => set({ user }),
  setTokens: (authToken, refreshToken) => {
    set({ authToken, refreshToken });
    // Store tokens in AsyncStorage
    if (authToken) AsyncStorage.setItem('authToken', authToken);
    if (refreshToken) AsyncStorage.setItem('refreshToken', refreshToken);
  },

  clearUser: () => {
    set({ user: null, authToken: null, refreshToken: null });
    // Clear tokens from AsyncStorage
    AsyncStorage.removeItem('authToken');
    AsyncStorage.removeItem('refreshToken');
  },

  // Initialize tokens from AsyncStorage
  initializeAuth: async () => {
    try {
      const [authToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('refreshToken'),
      ]);
      if (authToken && refreshToken) {
        set({ authToken, refreshToken });
        return true;
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
    return false;
  },
}));
