import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load tokens from AsyncStorage on app start
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      const [storedAuthToken, storedRefreshToken] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('refreshToken'),
      ]);
      
      if (storedAuthToken) setAuthToken(storedAuthToken);
      if (storedRefreshToken) setRefreshToken(storedRefreshToken);
    } catch (error) {
      console.error('Error loading auth tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  const setTokens = async (newAuthToken, newRefreshToken) => {
    try {
      if (newAuthToken) {
        await AsyncStorage.setItem('authToken', newAuthToken);
        setAuthToken(newAuthToken);
      }
      if (newRefreshToken) {
        await AsyncStorage.setItem('refreshToken', newRefreshToken);
        setRefreshToken(newRefreshToken);
      }
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  };

  const clearAuth = async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'refreshToken']);
      setAuthToken(null);
      setRefreshToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authToken,
        refreshToken,
        setTokens,
        clearAuth,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
