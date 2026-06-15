// 공통 API 응답 래퍼
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// 공통 토큰 응답
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

// ─── 로그인 ────────────────────────────────────────────────────────────────────
// POST /api/v1/auth/login
export interface LoginRequest {
  loginId: string;
  password: string;
}
export type LoginResponse = TokenResponse;

// ─── 토큰 재발급 ───────────────────────────────────────────────────────────────
// POST /api/v1/auth/reissue
export interface ReissueRequest {
  refreshToken: string;
}
export type ReissueResponse = TokenResponse;

// ─── 로그아웃 ──────────────────────────────────────────────────────────────────
// POST /api/v1/auth/logout
export interface LogoutRequest {
  refreshToken: string;
}

// ─── 구글 로그인 ───────────────────────────────────────────────────────────────
// POST /api/v1/auth/google
export interface GoogleLoginRequest {
  authorizationCode: string;
}
export interface GoogleLoginResponse {
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  email?: string;
  name?: string;
  newUser?: boolean;
}

// ─── 아이디 중복 확인 ──────────────────────────────────────────────────────────
// GET /api/v1/members/check-id
export interface CheckIdResponse {
  isDuplicated: boolean;
}

// ─── 회원가입 ──────────────────────────────────────────────────────────────────
// POST /api/v1/members/join
export interface JoinRequest {
  loginId: string;
  password: string;
  passwordCheck: string;
  name: string;
  email: string;
  termsOfService: boolean;
  privacyPolicy: boolean;
  aiService: boolean;
  marketingConsent?: boolean;
}
export interface JoinResponse {
  memberId?: string;
  loginId?: string;
  name?: string;
  email?: string;
  createdAt?: string;
}

// ─── 내 정보 조회 ──────────────────────────────────────────────────────────────
// GET /api/v1/members/me
export interface GetMeResponse {
  memberId?: string;
  loginId?: string;
  name?: string;
  email?: string;
  loginType?: string;
  isLoginIdEditable?: boolean;
}

// ─── loginId로 회원 조회 ───────────────────────────────────────────────────────
// GET /api/v1/members/search
export interface SearchMemberResponse {
  memberId: string;
  loginId: string;
  name: string;
  email: string;
  createdAt: string;
}

// ─── 회원 정보 수정 ────────────────────────────────────────────────────────────
// PATCH /api/v1/members/me
export interface UpdateMeRequest {
  name?: string;
  loginId?: string;
  password?: string;
  passwordCheck?: string;
  email?: string;
}
export interface UpdateMeResponse {
  memberId?: string;
  loginId?: string;
  name?: string;
  email?: string;
  isLoginIdEditable?: boolean;
  updatedAt?: string;
}
