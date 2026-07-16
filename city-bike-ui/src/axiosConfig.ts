import axios from 'axios';
import store from './store';

// This interceptor runs BEFORE every axios request is sent
axios.interceptors.request.use((config) => {
  // Read the current token from Redux state
  const token = store.getState().auth.token;

  // If a token exists, add it to the Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
