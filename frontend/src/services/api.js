import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const unwrap = (response) => response.data?.data;

const ensureApiBaseUrl = () => {
  if (!API_BASE_URL) {
    throw new Error('Missing VITE_API_BASE_URL. Create frontend/.env from frontend/.env.example.');
  }
};

export const backendApi = {
  async getBackendHealth() {
    ensureApiBaseUrl();
    const response = await api.get('/api/health');
    return unwrap(response);
  },

  async listInternships() {
    ensureApiBaseUrl();
    const response = await api.get('/items');
    return unwrap(response);
  },

  async getInternshipExplanation(id) {
    ensureApiBaseUrl();
    const response = await api.get(`/explain/${id}`);
    return unwrap(response);
  },

  async recommendInternships(profile) {
    ensureApiBaseUrl();
    const response = await api.post('/recommend', profile);
    return unwrap(response);
  },
};

export const getApiErrorMessage = (error) => {
  if (error.message?.startsWith('Missing VITE_API_BASE_URL')) {
    return error.message;
  }

  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  if (error.code === 'ECONNABORTED') {
    return 'The backend took too long to respond. Please try again.';
  }

  if (error.message === 'Network Error') {
    return 'Unable to reach the backend. Confirm the API server is running and VITE_API_BASE_URL is set.';
  }

  return 'Something went wrong. Please try again.';
};
