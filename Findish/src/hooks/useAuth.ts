import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { login, logout as logoutApi, join, getMyInfo, searchMember, deleteMe } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import type { LoginRequest } from '@/types/auth';

const THREE_HOURS = 1000 * 60 * 60 * 3;

// ─── 내 정보 조회 ──────────────────────────────────────────────────────────────
export const useGetMeQuery = () => {
  return useQuery({
    queryKey: ['getMyInfo'],
    queryFn: ({ signal }) => getMyInfo(signal),
    select: (res) => res.data,
    staleTime: THREE_HOURS,
    gcTime: THREE_HOURS,
  });
};

// ─── 로그인 ────────────────────────────────────────────────────────────────────
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (body: LoginRequest) => login(body).then((res) => res.data),
  });
};

// ─── 로그아웃 ──────────────────────────────────────────────────────────────────
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const logoutStore = useAuthStore((s) => s.logout);
  return useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem('refreshToken') ?? '';
      return logoutApi({ refreshToken });
    },
    onSuccess: () => {
      queryClient.clear();
      logoutStore();
    },
  });
};

// ─── 회원 탈퇴 ─────────────────────────────────────────────────────────────────
export const useDeleteMeMutation = () => {
  const queryClient = useQueryClient();
  const logoutStore = useAuthStore((s) => s.logout);
  return useMutation({
    mutationFn: () => deleteMe(),
    onSuccess: () => {
      queryClient.clear();
      logoutStore();
    },
  });
};

// ─── loginId로 회원 조회 ───────────────────────────────────────────────────────
export const useSearchMemberMutation = () => {
  return useMutation({
    mutationFn: (loginId: string) => searchMember(loginId).then((res) => res.data),
  });
};

// ─── 회원가입 ──────────────────────────────────────────────────────────────────
interface SignupInput {
  loginId: string;
  password: string;
  passwordCheck: string;
  name: string;
  email: string;
  agreements: {
    termsOfService: boolean;
    privacyPolicy: boolean;
    aiService: boolean;
    marketingConsent?: boolean;
  };
}

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: ({ agreements, ...rest }: SignupInput) =>
      join({ ...rest, ...agreements }),
  });
};
