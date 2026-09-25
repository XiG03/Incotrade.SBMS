import axios from 'axios';

let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5130/api';
if (!rawApiUrl.endsWith('/api')) {
  rawApiUrl = `${rawApiUrl.replace(/\/$/, '')}/api`;
}

export const apiClient = axios.create({
  baseURL: rawApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    return Promise.reject(error);
  }
);
