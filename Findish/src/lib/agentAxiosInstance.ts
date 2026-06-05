import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { refreshAccessToken, forceLogout } from '@/lib/tokenRefresh';

const agentAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AGENT_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
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
    const hasAccessToken = !!localStorage.getItem('accessToken');

    if (error.response?.status === 401 || error.response?.status === 403) {
      if (!originalRequest._retry && hasRefreshToken) {
        originalRequest._retry = true;

        try {
          const accessToken = await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return agentAxiosInstance(originalRequest);
        } catch {
          forceLogout();
          return Promise.reject(error);
        }
      }

      // 리프레시 토큰 없거나 이미 재시도한 경우: 로그인 상태였다면 강제 로그아웃
      if (hasAccessToken || hasRefreshToken) {
        forceLogout();
      }
    }

    return Promise.reject(error);
  },
);

export default agentAxiosInstance;
