// 공통 토큰 응답
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

// 로그인
export interface LoginRequest {
  loginId: string;
  password: string;
}
export type LoginResponse = TokenResponse;

// 토큰 재발급
export type ReissueResponse = TokenResponse;

// 아이디 중복 확인
export interface CheckIdResponse {
  isDuplicated: boolean;
}

// 회원가입
export interface JoinRequest {
  loginId: string;
  password: string;
  passwordCheck: string;
  name: string;
  email: string;
  agreements: {
    termsOfService: boolean;
    privacyPolicy: boolean;
    aiService: boolean;
    marketingConsent: boolean;
  };
}
export interface JoinResponse {
  memberId: number;
  loginId: string;
  name: string;
  email: string;
  createdAt: string;
}

// 내 정보 조회
export interface GetMeResponse {
  memberId: string;
  loginId: string;
  name: string;
  email: string;
  loginType: string;
  isLoginIdEditable: boolean;
}

// 회원 정보 수정
export interface UpdateMeRequest {
  loginId?: string;
  name?: string;
}
export interface UpdateMeResponse {
  memberId: number;
  loginId: string;
  name: string;
  email: string;
  isLoginIdEditable: boolean;
  updatedAt: string;
}
