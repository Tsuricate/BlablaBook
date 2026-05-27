import axios from 'axios';

// Create an Axios instance for all authenticated requests
export const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// --- Response interceptor ---
// Intercepts every response from requests made with axiosAuth before it reaches our code
axiosAuth.interceptors.response.use(
  (response) => response, // If response is successful, we just return it
  async (error) => {
    const originalRequest = error.config;

    // If token is expired (401) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call the refresh endpoint to get a new token
        await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
          withCredentials: true,
        });

        // Retry the original request with the new token
        return axiosAuth(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // For all other errors, just reject
    return Promise.reject(error);
  }
);
