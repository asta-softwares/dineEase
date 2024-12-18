import { Platform } from 'react-native';

const API_URL = 'https://partners.dineease.ca/api';  

// API Configuration
const config = {
  BASE_URL: API_URL,
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export default config;
