import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (optional - for adding auth tokens, etc.)
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'Terjadi kesalahan';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Tidak ada response dari server');
    } else {
      // Something else happened
      throw new Error(error.message || 'Terjadi kesalahan');
    }
  }
);

// Auth API
export const authAPI = {
  login: async (NIP, password) => {
    return apiClient.post('/auth', { NIP, password });
  },

  logout: async () => {
    return Promise.resolve();
  },
};

// User API
export const userAPI = {
  getAll: async (params = {}) => {
    return apiClient.get('/user', { params });
  },

  getById: async (id) => {
    return apiClient.get(`/user/${id}`);
  },

  create: async (data) => {
    return apiClient.post('/user', data);
  },

  update: async (id, data) => {
    return apiClient.put(`/user/${id}`, data);
  },

  delete: async (id) => {
    return apiClient.delete(`/user/${id}`);
  },
};

// Presensi API
export const presensiAPI = {
  getAll: async (params = {}) => {
    return apiClient.get('/presensi', { params });
  },

  getById: async (id) => {
    return apiClient.get(`/presensi/${id}`);
  },

  create: async (data) => {
    return apiClient.put('/presensi/0', data);
  },

  update: async (id, data) => {
    return apiClient.put(`/presensi/${id}`, data);
  },

  delete: async (id) => {
    return apiClient.delete(`/presensi/${id}`);
  },
};

// Laporan API
export const laporanAPI = {
  getAll: async (params = {}) => {
    return apiClient.get('/laporan', { params });
  },

  getById: async (id) => {
    return apiClient.get(`/laporan/${id}`);
  },

  create: async (data) => {
    return apiClient.post('/laporan', data);
  },

  update: async (id, data) => {
    return apiClient.put(`/laporan/${id}`, data);
  },

  delete: async (id) => {
    return apiClient.delete(`/laporan/${id}`);
  },
};
