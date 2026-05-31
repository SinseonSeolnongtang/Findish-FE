import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const isAuthEndpoint = originalRequest.url?.includes('/auth/');
    const refreshToken = localStorage.getItem('refreshToken');

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !isAuthEndpoint &&
      refreshToken
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/reissue`,
          { refreshToken },
        );

        useAuthStore.getState().login(data.data.accessToken, data.data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;

        return axiosInstance(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

// orval mutator: AxiosInstance를 래핑하여 Promise<T>를 반환
export const customAxiosMutator = <T>(config: AxiosRequestConfig): Promise<T> =>
  axiosInstance<T>(config).then(({ data }) => data);
