import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

let baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
if (baseURL && !baseURL.startsWith('http')) {
  baseURL = `https://${baseURL}`;
}
if (baseURL.endsWith('/')) {
  baseURL = baseURL.slice(0, -1);
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (typeof window !== 'undefined') {
  console.log('📡 API Base URL initialized as:', api.defaults.baseURL);
}

// Add a request interceptor to inject the JWT
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
