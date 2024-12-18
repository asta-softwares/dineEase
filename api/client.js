import axios from 'axios';
import config from './config';
import { useUserStore } from '../stores/userStore';

const apiClient = axios.create({
  baseURL: config.BASE_URL,
  timeout: config.TIMEOUT,
  headers: config.HEADERS,
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const authToken = useUserStore.getState().authToken;
    // if (authToken) {
    //   config.headers.Authorization = `Bearer ${authToken}`;
    // }

    config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NTQ0MDU5LCJpYXQiOjE3MzQ0NTc2NTksImp0aSI6ImYxNjFhNTA5ZmJlZDRkMWJiMTJiZDBlOTY4ZGQ1MTZkIiwidXNlcl9pZCI6MX0.a_-kBJQdZHs6VYF-4jsqY06uOe5mzMXY4y5bAvusDrA`;
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
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Unable to connect to the server. Please try again later.');
    }

    if (error.response) {
      switch (error.response.status) {
        case 401:
          try {
            const refreshToken = useUserStore.getState().refreshToken;
            if (refreshToken) {
              const response = await apiClient.post('/token/refresh/', {
                refresh: refreshToken,
              });
              const { access } = response.data;
              useUserStore.getState().setTokens(access, refreshToken);
              
              const originalRequest = error.config;
              originalRequest.headers.Authorization = `Bearer ${access}`;
              return apiClient(originalRequest);
            }
          } catch (refreshError) {
            useUserStore.getState().logout();
            throw new Error('Session expired. Please login again.');
          }
          break;

        case 404:
          throw new Error('Resource not found.');

        case 500:
          throw new Error('Server error. Please try again later.');

        default:
          throw new Error(error.response.data?.message || 'An error occurred.');
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
