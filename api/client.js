import axios from 'axios';
import config from './config';

// Create axios instance
const apiClient = axios.create({
  baseURL: config.BASE_URL,
  timeout: config.TIMEOUT,
  headers: config.HEADERS,
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Get token from secure storage if needed
    // const token = await getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
