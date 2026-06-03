import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { refreshAccessToken, forceLogout } from '@/lib/tokenRefresh';

const agentAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AGENT_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

agentAxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

agentAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const hasRefreshToken = !!localStorage.getItem('refreshToken');

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      hasRefreshToken
    ) {
      originalRequest._retry = true;

      try {
        const accessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return agentAxiosInstance(originalRequest);
      } catch {
        forceLogout();
      }
    }

    return Promise.reject(error);
  },
);

export default agentAxiosInstance;
