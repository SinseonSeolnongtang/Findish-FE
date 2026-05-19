import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPreset,
  getPresetHistory,
  getPresetDetail,
  updatePreset,
  getFriends,
  requestFriend,
  respondFriendRequest,
  deleteFriend,
} from '@/api/aiPick';
import type {
  CreateAiPickPresetRequest,
  UpdateAiPickPresetRequest,
  SendFriendRequestBody,
  ResolveFriendRequestBody,
} from '@/types/aiPick';

const PRESET_HISTORY_KEY = ['preset-history'] as const;
const FRIENDS_KEY = ['friends'] as const;

// ─── useQuery ────────────────────────────────────────────────────────────────

// GET /api/v1/ai-pick/presets
export const usePresetHistoryQuery = () => {
  return useQuery({
    queryKey: PRESET_HISTORY_KEY,
    queryFn: getPresetHistory,
  });
};

// GET /api/v1/ai-pick/presets/{presetId}
export const usePresetDetailQuery = (presetId: number) => {
  return useQuery({
    queryKey: ['preset-detail', presetId],
    queryFn: () => getPresetDetail(presetId),
    enabled: !!presetId,
  });
};

// GET /api/v1/friends
export const useFriendsQuery = () => {
  return useQuery({
    queryKey: FRIENDS_KEY,
    queryFn: getFriends,
  });
};

// ─── useMutation ─────────────────────────────────────────────────────────────

// POST /api/v1/ai-pick/presets
export const useCreatePresetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAiPickPresetRequest) => createPreset(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRESET_HISTORY_KEY });
    },
  });
};

// PATCH /api/v1/ai-pick/presets/{presetId}
export const useUpdatePresetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ presetId, body }: { presetId: number; body: UpdateAiPickPresetRequest }) =>
      updatePreset(presetId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRESET_HISTORY_KEY });
    },
  });
};

// POST /api/v1/friends/requests
export const useRequestFriendMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SendFriendRequestBody) => requestFriend(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDS_KEY });
    },
  });
};

// PATCH /api/v1/friends/requests/{requestId}
export const useRespondFriendRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, body }: { requestId: number; body: ResolveFriendRequestBody }) =>
      respondFriendRequest(requestId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDS_KEY });
    },
  });
};

// DELETE /api/v1/friends/{memberId}
export const useDeleteFriendMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: number) => deleteFriend(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDS_KEY });
    },
  });
};
