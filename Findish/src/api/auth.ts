import axiosInstance from '@/lib/axiosInstance';
import type {
  LoginRequest,
  LoginResponse,
  ReissueResponse,
  CheckIdResponse,
  JoinRequest,
  JoinResponse,
  GetMeResponse,
  UpdateMeRequest,
  UpdateMeResponse,
} from '@/types/auth';

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post<LoginResponse>('/api/v1/auth/login', body);
  return data;
};

export const reissue = async (): Promise<ReissueResponse> => {
  const { data } = await axiosInstance.post<ReissueResponse>('/api/v1/auth/reissue');
  return data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post('/api/v1/auth/logout');
};

export const checkId = async (loginId: string): Promise<CheckIdResponse> => {
  const { data } = await axiosInstance.get<CheckIdResponse>('/api/v1/members/check-id', {
    params: { loginId },
  });
  return data;
};

export const join = async (body: JoinRequest): Promise<JoinResponse> => {
  const { data } = await axiosInstance.post<JoinResponse>('/api/v1/members/join', body);
  return data;
};

export const getMe = async (): Promise<GetMeResponse> => {
  const { data } = await axiosInstance.get<GetMeResponse>('/api/v1/members/me');
  return data;
};

export const updateMe = async (body: UpdateMeRequest): Promise<UpdateMeResponse> => {
  const { data } = await axiosInstance.patch<UpdateMeResponse>('/api/v1/members/me', body);
  return data;
};
