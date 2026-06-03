import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

// 진행 중인 refresh 요청을 저장 — 여러 요청이 동시에 401을 받아도 reissue는 1번만 호출됨
let refreshPromise: Promise<string> | null = null;

export const refreshAccessToken = (): Promise<string> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    const { data } = await axios.post<{
      success: boolean;
      data: { accessToken: string; refreshToken: string; tokenType: string };
      message: string | null;
    }>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/reissue`, { refreshToken });

    const { accessToken, refreshToken: newRefreshToken } = data.data;
    useAuthStore.getState().login(accessToken, newRefreshToken);
    return accessToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

export const forceLogout = () => {
  useAuthStore.getState().logout();
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};
