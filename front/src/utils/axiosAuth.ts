import axios, { type AxiosRequestConfig } from 'axios';

// Create an Axios instance for all authenticated requests
export const axiosAuth = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

axiosAuth.interceptors.request.use((requestConfig) => {
  const csrfCookieValue = document.cookie
    .split('; ')
    .find((cookieEntry) => cookieEntry.startsWith('csrf_token='))
    ?.split('=')[1];
  if (csrfCookieValue) {
    requestConfig.headers = requestConfig.headers ?? {};
    requestConfig.headers['x-csrf-token'] = csrfCookieValue;
  }
  return requestConfig;
});

let isRefreshing = false;

// --- Response interceptor ---
// Intercepts every response from requests made with axiosAuth before it reaches our code
axiosAuth.interceptors.response.use(
  (response) => response, // If response is successful, we just return it
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;
    const url = originalRequest?.url;

    // Only handle 401 errors
    if (status !== 401) return Promise.reject(error);

    // Prevent retry loops

    if (originalRequest._retry) return Promise.reject(error);

    // Do not try to refresh on the refresh endpoint itself
    if (url?.includes('/auth/refresh')) return Promise.reject(error);

    // Prevent multiple refresh calls at the same time
    if (isRefreshing) return Promise.reject(error);

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Try to refresh the access token
      await axiosAuth.post('/auth/refresh', {}, { withCredentials: true });

      isRefreshing = false;

      // Retry the original request
      return axiosAuth(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;

      return Promise.reject(refreshError);
    }
  }
);
