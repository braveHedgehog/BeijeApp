import axios from 'axios';
import { store } from '../redux/store';

const BASE_URL = 'https://96318a87-0588-4da5-9843-b3d7919f1782.mock.pstmn.io';

// Genel axios instance
const api = axios.create({
  baseURL: BASE_URL
});

// Request interceptor: token eklemek için
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;
  if (token && config.headers) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export const signInRequest = async (email: string, password: string) => {
  const response = await api.post('/sign-in-request', { email, password });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const getMenstruationDays = async () => {
  const response = await api.get('/menstruation-days');
  return response.data;
};

export const getInsights = async () => {
  const response = await api.get('/insights');
  return response.data;
};

export default api;
