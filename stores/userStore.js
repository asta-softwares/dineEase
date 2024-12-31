import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserStore = create((set, get) => ({
  user: null,
  authToken: null,
  refreshToken: null,
  isInitialized: false,

  setUser: async (user) => {
    set({ user });
    if (user) {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
    }
  },

  setTokens: async (authToken, refreshToken) => {
    set({ authToken, refreshToken });
    if (authToken) await AsyncStorage.setItem('authToken', authToken);
    if (refreshToken) await AsyncStorage.setItem('refreshToken', refreshToken);
  },

  clearUser: async () => {
    // Clear cart and other app state here
    set({ 
      user: null, 
      authToken: null, 
      refreshToken: null,
    });
    
    // Clear all data from AsyncStorage
    await Promise.all([
      AsyncStorage.removeItem('authToken'),
      AsyncStorage.removeItem('refreshToken'),
      AsyncStorage.removeItem('userData'),
      AsyncStorage.removeItem('cart'), // Also clear cart data
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
