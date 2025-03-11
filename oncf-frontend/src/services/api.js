// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Remove /api since it's included in specific paths

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
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

// Intercept responses to handle auth errors
api.interceptors.response.use(
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

// Authentication Service
export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
  
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  }
};

// Define API service methods for Epaves
export const epaveService = {
  getAll: () => api.get('/api/epaves'),
  getById: (id) => api.get(`/api/epaves/${id}`),
  create: (data) => api.post('/api/epaves', data),
  update: (id, data) => api.put(`/api/epaves/${id}`, data),
  delete: (id) => api.delete(`/api/epaves/${id}`),
  getByDate: (date) => api.get(`/api/epaves/date/${date}`),
  getByDateRange: (startDate, endDate) => 
    api.get(`/api/epaves/date-range?startDate=${startDate}&endDate=${endDate}`),
  getByTrain: (train) => api.get(`/api/epaves/train/${train}`),
  getByGareDepot: (gareDepot) => api.get(`/api/epaves/gare-depot/${gareDepot}`),
  getByController: (controllerId) => api.get(`/api/epaves/controller/${controllerId}`),
  getByAgentCom: (agentComId) => api.get(`/api/epaves/agent-com/${agentComId}`),
};

// Define API service methods for Employees
export const employeeService = {
  getAll: () => api.get('/api/employees'),
  getById: (id) => api.get(`/api/employees/${id}`),
  // For new employee creation, use the auth/register endpoint
  create: (data) => api.post('/api/auth/register', data),
  update: (id, data) => api.put(`/api/employees/${id}`, data),
  delete: (id) => api.delete(`/api/employees/${id}`),
  getByRole: (role) => api.get(`/api/employees/role/${role}`),
  getByAntenne: (antenneId) => api.get(`/api/employees/antenne/${antenneId}`),
};

// Define API service methods for Fiches d'infraction
export const ficheInfractionService = {
  getAll: () => api.get('/api/fiche-infractions'),
  getById: (id) => api.get(`/api/fiche-infractions/${id}`),
  create: (data) => api.post('/api/fiche-infractions', data),
  update: (id, data) => api.put(`/api/fiche-infractions/${id}`, data),
  delete: (id) => api.delete(`/api/fiche-infractions/${id}`),
  getByDate: (date) => api.get(`/api/fiche-infractions/date/${date}`),
  getByDateRange: (startDate, endDate) => 
    api.get(`/api/fiche-infractions/date-range?startDate=${startDate}&endDate=${endDate}`),
  getByTrain: (train) => api.get(`/api/fiche-infractions/train/${train}`),
  getByGareDepot: (gareDepot) => api.get(`/api/fiche-infractions/gare-depot/${gareDepot}`),
  getByController: (controllerId) => api.get(`/api/fiche-infractions/controller/${controllerId}`),
  getByAgentCom: (agentComId) => api.get(`/api/fiche-infractions/agent-com/${agentComId}`),
  getByMinAmount: (minAmount) => api.get(`/api/fiche-infractions/min-amount/${minAmount}`),
};

//API service methods for Cartes périmées
export const cartePerimeeService = {
  getAll: () => api.get('/api/carte-perimees'),
  getById: (id) => api.get(`/api/carte-perimees/${id}`),
  create: (data) => api.post('/api/carte-perimees', data),
  update: (id, data) => api.put(`/api/carte-perimees/${id}`, data),
  delete: (id) => api.delete(`/api/carte-perimees/${id}`),
  getByDate: (date) => api.get(`/api/carte-perimees/date/${date}`),
  getByDateRange: (startDate, endDate) => 
    api.get(`/api/carte-perimees/date-range?startDate=${startDate}&endDate=${endDate}`),
  getByTrain: (train) => api.get(`/api/carte-perimees/train/${train}`),
  getByNumCarte: (numCarte) => api.get(`/api/carte-perimees/num-carte/${numCarte}`),
  getByGareD: (gareD) => api.get(`/api/carte-perimees/gare-d/${gareD}`),
  getByGareA: (gareA) => api.get(`/api/carte-perimees/gare-a/${gareA}`),
  getByConfort: (confort) => api.get(`/api/carte-perimees/confort/${confort}`),
  getByController: (controllerId) => api.get(`/api/carte-perimees/controller/${controllerId}`),
  getByAgentCom: (agentComId) => api.get(`/api/carte-perimees/agent-com/${agentComId}`),
  getExpiredCartes: (currentDate) => api.get(`/api/carte-perimees/expired?currentDate=${currentDate || ''}`)
};

//API service methods for Controleur
export const controleurService = {
  getAll: () => api.get('/api/controleurs'),
  getById: (id) => api.get(`/api/controleurs/${id}`),
  create: (data) => api.post('/api/controleurs', data),
  update: (id, data) => api.put(`/api/controleurs/${id}`, data),
  delete: (id) => api.delete(`/api/controleurs/${id}`),
  getByAntenne: (antenneId) => api.get(`/api/controleurs/antenne/${antenneId}`),
  search: (query, antenneId) => api.get(`/api/controleurs/search?query=${query || ''}&antenneId=${antenneId}`),
  
  // Methods to get related items
  getEpaves: (controllerId) => api.get(`/api/controleurs/${controllerId}/epaves`),
  getCartePerimees: (controllerId) => api.get(`/api/controleurs/${controllerId}/cartes`),
  getFicheInfractions: (controllerId) => api.get(`/api/controleurs/${controllerId}/fiches`)
};

//API service methods for Antenne
export const antenneService = {
  getAll: () => api.get('/api/antennes'),
  getById: (id) => api.get(`/api/antennes/${id}`),
  create: (data) => api.post('/api/antennes', data),
  update: (id, data) => api.put(`/api/antennes/${id}`, data),
  delete: (id) => api.delete(`/api/antennes/${id}`),
  getByNom: (nom) => api.get(`/api/antennes/nom/${nom}`)
};

export default api;