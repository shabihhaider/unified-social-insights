// src/utils/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // ✅ API base URL (backend)
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auto-attach token if available
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default instance;
