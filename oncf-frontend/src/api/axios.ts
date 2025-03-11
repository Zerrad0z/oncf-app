// src/api/axios.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle both 401 unauthorized and 403 forbidden errors (expired token)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;