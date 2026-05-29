import axios from 'axios';

export const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosAuth.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
