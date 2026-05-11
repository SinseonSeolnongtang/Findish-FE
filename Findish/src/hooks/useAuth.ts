import { useMutation, useQuery } from '@tanstack/react-query';
import { login, join, checkId } from '@/api/auth';
import type { LoginRequest, JoinRequest } from '@/types/auth';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (body: LoginRequest) => login(body),
  });
};

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: (body: JoinRequest) => join(body),
  });
};

export const useCheckIdQuery = (loginId: string) => {
  return useQuery({
    queryKey: ['checkId', loginId],
    queryFn: () => checkId(loginId),
    enabled: loginId.trim().length > 0,
    staleTime: 1000 * 30,
  });
};
