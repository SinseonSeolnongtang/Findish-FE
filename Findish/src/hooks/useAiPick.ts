import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPreset,
  getPresetHistory,
  getPresetDetail,
  updatePreset,
  getFriends,
  getReceivedFriendRequests,
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
const RECEIVED_REQUESTS_KEY = ['received-friend-requests'] as const;

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

// GET /api/v1/friends/requests/received
export const useReceivedFriendRequestsQuery = () => {
  return useQuery({
    queryKey: RECEIVED_REQUESTS_KEY,
    queryFn: getReceivedFriendRequests,
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
    mutationFn: ({ requestId, body }: { requestId: string; body: ResolveFriendRequestBody }) =>
      respondFriendRequest(requestId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDS_KEY });
      queryClient.invalidateQueries({ queryKey: RECEIVED_REQUESTS_KEY });
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
