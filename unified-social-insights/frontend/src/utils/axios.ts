// src/utils/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5050', // ✅ This ensures you're calling local backend
  withCredentials: false, // optional; can be true if you use cookies
});

export default instance;
