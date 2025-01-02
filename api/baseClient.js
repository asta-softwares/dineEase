import axios from 'axios';
import config from './config';

const baseClient = axios.create({
  baseURL: config.BASE_URL,
  timeout: 10000,
});

export default baseClient;
