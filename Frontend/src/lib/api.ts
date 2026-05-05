import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3002/api',
});

api.interceptors.request.use((config) => {
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export default api;
