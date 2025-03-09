// src/services/authService.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Define types for request/response
interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  nom?: string;
  prenom?: string;
  role?: string;
}

// Auth service methods
const authService = {
  login: async (credentials: LoginRequest) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData: RegisterRequest) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }
};

export default authService;