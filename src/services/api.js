import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4001';

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token JWT do cliente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('client_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para adicionar token de admin
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('admin_token');
  if (adminToken) {
    config.headers['x-admin-token'] = adminToken;
  }
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const publicPages = ['/login', '/cadastro', '/esqueci-senha', '/'];
      const isPublicPage = publicPages.some(page => currentPath.startsWith(page));
      
      if (!isPublicPage) {
        localStorage.removeItem('client_token');
        localStorage.removeItem('admin_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
