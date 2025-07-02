// src/utils/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://usi-backend.onrender.com', // ✅ your Render backend
});

export default instance;
