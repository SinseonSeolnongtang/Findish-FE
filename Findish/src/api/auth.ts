import axiosInstance from '@/lib/axiosInstance';
import type { ApiResponse, LoginRequest, ReissueRequest, LogoutRequest, JoinRequest, JoinResponse, GetMeResponse, UpdateMeRequest, UpdateMeResponse, GoogleLoginRequest, GoogleLoginResponse, SearchMemberResponse } from '@/types/auth';

// ─── 로그인 ────────────────────────────────────────────────────────────────────
// POST /api/v1/auth/login
export const login = async (body: LoginRequest) => {
  const { data } = await axiosInstance.post<ApiResponse<{ accessToken: string; refreshToken: string; tokenType: string }>>('/api/v1/auth/login', body);
  return data;
};

// ─── 토큰 재발급 ───────────────────────────────────────────────────────────────
// POST /api/v1/auth/reissue
export const reissue = async (body: ReissueRequest) => {
  const { data } = await axiosInstance.post<ApiResponse<{ accessToken: string; refreshToken: string; tokenType: string }>>('/api/v1/auth/reissue', body);
  return data;
};

// ─── 로그아웃 ──────────────────────────────────────────────────────────────────
// POST /api/v1/auth/logout
export const logout = async (body: LogoutRequest) => {
  const { data } = await axiosInstance.post<ApiResponse<null>>('/api/v1/auth/logout', body);
  return data;
};

// ─── 구글 로그인 ───────────────────────────────────────────────────────────────
// POST /api/v1/auth/google
export const googleLogin = async (body: GoogleLoginRequest) => {
  const { data } = await axiosInstance.post<ApiResponse<GoogleLoginResponse>>('/api/v1/auth/google', body);
  return data;
};

// ─── 구글 캘린더 연동 상태 조회 ────────────────────────────────────────────────
// GET /api/v1/auth/google/calendar
export const getCalendarStatus = async (signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<{ [key: string]: boolean }>>('/api/v1/auth/google/calendar', { signal });
  return data;
};

// ─── 회원가입 ──────────────────────────────────────────────────────────────────
// POST /api/v1/members/join
export const join = async (body: JoinRequest) => {
  const { data } = await axiosInstance.post<ApiResponse<JoinResponse>>('/api/v1/members/join', body);
  return data;
};

// ─── loginId로 회원 조회 ───────────────────────────────────────────────────────
// GET /api/v1/members/search
export const searchMember = async (loginId: string, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<SearchMemberResponse>>('/api/v1/members/search', { params: { loginId }, signal });
  return data;
};

// ─── 아이디 중복 확인 ──────────────────────────────────────────────────────────
// GET /api/v1/members/check-id
export const checkId = async (params: { loginId: string }, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<{ [key: string]: boolean }>>('/api/v1/members/check-id', { params, signal });
  return data;
};

// ─── 내 정보 조회 ──────────────────────────────────────────────────────────────
// GET /api/v1/members/me
export const getMyInfo = async (signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<GetMeResponse>>('/api/v1/members/me', { signal });
  return data;
};

// ─── 회원 정보 수정 ────────────────────────────────────────────────────────────
// PATCH /api/v1/members/me
export const updateMyInfo = async (body: UpdateMeRequest) => {
  const { data } = await axiosInstance.patch<ApiResponse<UpdateMeResponse>>('/api/v1/members/me', body);
  return data;
};
