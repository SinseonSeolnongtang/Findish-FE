import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPreset,
  getPresetHistory,
  getPresetDetail,
  updatePreset,
  deletePreset,
  getFriends,
  getReceivedFriendRequests,
  requestFriend,
  respondFriendRequest,
  deleteFriend,
  getMePreference,
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
const ME_PREFERENCE_KEY = ['me-preference'] as const;

// ─── useQuery ────────────────────────────────────────────────────────────────

// GET /api/v1/ai-pick/presets
export const usePresetHistoryQuery = () => {
  return useQuery({
    queryKey: PRESET_HISTORY_KEY,
    queryFn: ({ signal }) => getPresetHistory(signal),
  });
};

// GET /api/v1/ai-pick/presets/{presetId}
export const usePresetDetailQuery = (presetId: string) => {
  return useQuery({
    queryKey: ['preset-detail', presetId],
    queryFn: ({ signal }) => getPresetDetail(presetId, signal),
    enabled: !!presetId,
  });
};

// GET /api/v1/friends
export const useFriendsQuery = () => {
  return useQuery({
    queryKey: FRIENDS_KEY,
    queryFn: ({ signal }) => getFriends(signal),
  });
};

// GET /api/v1/friends/requests/received
export const useReceivedFriendRequestsQuery = () => {
  return useQuery({
    queryKey: RECEIVED_REQUESTS_KEY,
    queryFn: ({ signal }) => getReceivedFriendRequests(signal),
  });
};

// GET /api/v1/members/me/preference
export const useMePreferenceQuery = () => {
  return useQuery({
    queryKey: ME_PREFERENCE_KEY,
    queryFn: ({ signal }) => getMePreference(signal),
    enabled: false,
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
    mutationFn: ({ presetId, body }: { presetId: string; body: UpdateAiPickPresetRequest }) =>
      updatePreset(presetId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRESET_HISTORY_KEY });
    },
  });
};

// DELETE /api/v1/ai-pick/presets/{presetId}
export const useDeletePresetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (presetId: string) => deletePreset(presetId),
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
    mutationFn: (memberId: string) => deleteFriend(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDS_KEY });
    },
  });
};
