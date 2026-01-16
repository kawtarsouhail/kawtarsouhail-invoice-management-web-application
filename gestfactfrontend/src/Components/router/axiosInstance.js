// services/axiosService.js
import axios from 'axios';
import { getToken } from './auth'; 

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

axiosInstance.interceptors.request.use(function(config) {
  const token = getToken();
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
}, function(error) {
  return Promise.reject(error);
});

export default axiosInstance;