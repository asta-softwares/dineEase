import axios from 'axios';
import config from './config';
import { useUserStore } from '../stores/userStore';
import { tokenService } from './services/tokenService';

const apiClient = axios.create({
  baseURL: config.BASE_URL,
  timeout: config.TIMEOUT,
  headers: config.HEADERS,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const authToken = useUserStore.getState().authToken;
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = useUserStore.getState().refreshToken;
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await tokenService.refreshAccessToken();
      const { access: newAccessToken } = response;
      
      await useUserStore.getState().setTokens(newAccessToken, refreshToken);
      
      // Update authorization header
      apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      
      processQueue(null, newAccessToken);
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      // Clear tokens and user state
      await useUserStore.getState().clearUser();
      
      // Pass through the original 401 error instead of the refresh error
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
