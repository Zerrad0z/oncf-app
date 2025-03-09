// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; 

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

// Define API service methods for Epaves
export const epaveService = {
  getAll: () => api.get('/epaves'),
  getById: (id) => api.get(`/epaves/${id}`),
  create: (data) => api.post('/epaves', data),
  update: (id, data) => api.put(`/epaves/${id}`, data),
  delete: (id) => api.delete(`/epaves/${id}`),
  getByDate: (date) => api.get(`/epaves/date/${date}`),
  getByDateRange: (startDate, endDate) => 
    api.get(`/epaves/date-range?startDate=${startDate}&endDate=${endDate}`),
  getByTrain: (train) => api.get(`/epaves/train/${train}`),
  getByGareDepot: (gareDepot) => api.get(`/epaves/gare-depot/${gareDepot}`),
  getByController: (controllerId) => api.get(`/epaves/controller/${controllerId}`),
  getByAgentCom: (agentComId) => api.get(`/epaves/agent-com/${agentComId}`),
};

// Define API service methods for Employees
export const employeeService = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  getByRole: (role) => api.get(`/employees/role/${role}`),
  getByAntenne: (antenneId) => api.get(`/employees/antenne/${antenneId}`),
};

// src/services/api.js - Update the ficheInfractionService and cartePerimeeService objects

// Define API service methods for Fiches d'infraction
export const ficheInfractionService = {
  getAll: () => api.get('/fiche-infractions'),
  getById: (id) => api.get(`/fiche-infractions/${id}`),
  create: (data) => api.post('/fiche-infractions', data),
  update: (id, data) => api.put(`/fiche-infractions/${id}`, data),
  delete: (id) => api.delete(`/fiche-infractions/${id}`),
  getByDate: (date) => api.get(`/fiche-infractions/date/${date}`),
  getByDateRange: (startDate, endDate) => 
    api.get(`/fiche-infractions/date-range?startDate=${startDate}&endDate=${endDate}`),
  getByTrain: (train) => api.get(`/fiche-infractions/train/${train}`),
  getByGareDepot: (gareDepot) => api.get(`/fiche-infractions/gare-depot/${gareDepot}`),
  getByController: (controllerId) => api.get(`/fiche-infractions/controller/${controllerId}`),
  getByAgentCom: (agentComId) => api.get(`/fiche-infractions/agent-com/${agentComId}`),
  getByMinAmount: (minAmount) => api.get(`/fiche-infractions/min-amount/${minAmount}`),
};

// Define API service methods for Cartes périmées
export const cartePerimeeService = {
  getAll: () => api.get('/carte-perimees'),
  getById: (id) => api.get(`/carte-perimees/${id}`),
  create: (data) => api.post('/carte-perimees', data),
  update: (id, data) => api.put(`/carte-perimees/${id}`, data),
  delete: (id) => api.delete(`/carte-perimees/${id}`),
  getByDate: (date) => api.get(`/carte-perimees/date/${date}`),
  getByDateRange: (startDate, endDate) => 
    api.get(`/carte-perimees/date-range?startDate=${startDate}&endDate=${endDate}`),
  getByTrain: (train) => api.get(`/carte-perimees/train/${train}`),
  getByNumCarte: (numCarte) => api.get(`/carte-perimees/num-carte/${numCarte}`),
  getByGareD: (gareD) => api.get(`/carte-perimees/gare-d/${gareD}`),
  getByGareA: (gareA) => api.get(`/carte-perimees/gare-a/${gareA}`),
  getByConfort: (confort) => api.get(`/carte-perimees/confort/${confort}`),
  getByController: (controllerId) => api.get(`/carte-perimees/controller/${controllerId}`),
  getByAgentCom: (agentComId) => api.get(`/carte-perimees/agent-com/${agentComId}`),
  getExpiredCartes: (currentDate) => api.get(`/carte-perimees/expired?currentDate=${currentDate || ''}`)
};

export const controleurService = {
  getAll: () => api.get('/controleurs'),
  getById: (id) => api.get(`/controleurs/${id}`),
  create: (data) => api.post('/controleurs', data),
  update: (id, data) => api.put(`/controleurs/${id}`, data),
  delete: (id) => api.delete(`/controleurs/${id}`),
  getByAntenne: (antenneId) => api.get(`/controleurs/antenne/${antenneId}`),
  search: (query, antenneId) => api.get(`/controleurs/search?query=${query || ''}&antenneId=${antenneId}`),
  
  // Methods to get related items
  getEpaves: (controllerId) => api.get(`/controleurs/${controllerId}/epaves`),
  getCartePerimees: (controllerId) => api.get(`/controleurs/${controllerId}/cartes`),
  getFicheInfractions: (controllerId) => api.get(`/controleurs/${controllerId}/fiches`)
};

export default api;