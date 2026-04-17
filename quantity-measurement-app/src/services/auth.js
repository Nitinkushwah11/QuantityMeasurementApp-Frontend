import api from './api';
import { API_BASE_URL } from '../utils/constants';
import axios from 'axios';

export const authService = {
  register: async (name, email, mobileNumber, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      name,
      email,
      mobileNumber,
      password
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
    if (response.data && response.data.token) {
      localStorage.setItem('accessToken', response.data.token);
      localStorage.setItem('email', email);
    }

    return response.data;
  },

  logout: async () => {
    localStorage.clear();
  },

  getCurrentUser: () => {
    return {
      email: localStorage.getItem('email'),
      fullName: localStorage.getItem('fullName')
    };
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  }
};

export const measurementService = {
  compare: async (quantity1, quantity2) => {
    const response = await api.post('/api/v1/quantities/compare', {
      thisQuantityDTO: quantity1,
      thatQuantityDTO: quantity2
    });
    return response.data;
  },

  convert: async (quantity, targetUnit) => {
    const response = await api.post('/api/v1/quantities/convert', {
      thisQuantityDTO: quantity,
      thatQuantityDTO: { ...quantity, unit: targetUnit },
      targetUnit
    });
    return response.data;
  },

  add: async (quantity1, quantity2, targetUnit) => {
    const response = await api.post('/api/v1/quantities/add', {
      thisQuantityDTO: quantity1,
      thatQuantityDTO: quantity2,
      targetUnit: targetUnit || null
    });
    return response.data;
  },

  subtract: async (quantity1, quantity2, targetUnit) => {
    const response = await api.post('/api/v1/quantities/subtract', {
      thisQuantityDTO: quantity1,
      thatQuantityDTO: quantity2,
      targetUnit: targetUnit || null
    });
    return response.data;
  },

  divide: async (quantity1, quantity2) => {
    const response = await api.post('/api/v1/quantities/divide', {
      thisQuantityDTO: quantity1,
      thatQuantityDTO: quantity2
    });
    return response.data;
  },

  getHistory: async (operation) => {
    const response = await api.get(`/api/v1/quantities/history/operation/${operation}`);
    return response.data;
  },

  getHistoryByType: async (type) => {
    const response = await api.get(`/api/v1/quantities/history/type/${type}Unit`);
    return response.data;
  },

  getErrorHistory: async () => {
    const response = await api.get('/api/v1/quantities/history/errored');
    return response.data;
  }
};
