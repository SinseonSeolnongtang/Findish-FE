import axiosInstance from '@/lib/axiosInstance';
import type { ApiResponse } from '@/types/auth';
import type {
  CreateAiPickPresetRequest,
  CreateAiPickPresetResponse,
  UpdateAiPickPresetRequest,
  UpdateAiPickPresetResponse,
  GetAiPickPresetsResponse,
  GetAiPickPresetDetailResponse,
  FriendItem,
  SendFriendRequestBody,
  SendFriendRequestResponse,
  ReceivedFriendRequestItem,
  ResolveFriendRequestBody,
  ResolveFriendRequestResponse,
  DeleteFriendResponse,
} from '@/types/aiPick';

// ─── 1. 프리셋 목록 조회 ──────────────────────────────────────────────────────
// GET /api/v1/ai-pick/presets
export const getPresetHistory = async (signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<GetAiPickPresetsResponse>>('/api/v1/ai-pick/presets', { signal });
  return data.data;
};

// ─── 2. 프리셋 생성 ────────────────────────────────────────────────────────────
// POST /api/v1/ai-pick/presets
export const createPreset = async (body: CreateAiPickPresetRequest) => {
  const { data } = await axiosInstance.post<ApiResponse<CreateAiPickPresetResponse>>(
    '/api/v1/ai-pick/presets',
    body,
    { timeout: 60000 },
  );
  return data.data;
};

// ─── 3. 프리셋 상세 조회 ──────────────────────────────────────────────────────
// GET /api/v1/ai-pick/presets/{presetId}
export const getPresetDetail = async (presetId: string, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<GetAiPickPresetDetailResponse>>(`/api/v1/ai-pick/presets/${presetId}`, { signal });
  return data.data;
};

// ─── 4. 프리셋 수정 ────────────────────────────────────────────────────────────
// PATCH /api/v1/ai-pick/presets/{presetId}
export const updatePreset = async (presetId: string, body: UpdateAiPickPresetRequest) => {
  const { data } = await axiosInstance.patch<ApiResponse<UpdateAiPickPresetResponse>>(
    `/api/v1/ai-pick/presets/${presetId}`,
    body,
    { timeout: 60000 },
  );
  return data.data;
};

// ─── 5. 프리셋 삭제 ────────────────────────────────────────────────────────────
// DELETE /api/v1/ai-pick/presets/{presetId}
export const deletePreset = async (presetId: string) => {
  await axiosInstance.delete(`/api/v1/ai-pick/presets/${presetId}`);
};

// ─── Friend 1. 친구 목록 조회 ─────────────────────────────────────────────────
// GET /api/v1/friends
export const getFriends = async (signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<FriendItem[]>>('/api/v1/friends', { signal });
  return data.data;
};

// ─── Friend 2. 친구 요청 ──────────────────────────────────────────────────────
// POST /api/v1/friends/requests
export const requestFriend = async (body: SendFriendRequestBody) => {
  const { data } = await axiosInstance.post<ApiResponse<SendFriendRequestResponse>>('/api/v1/friends/requests', body);
  return data.data;
};

// ─── Friend 3. 받은 친구 요청 목록 조회 ───────────────────────────────────────
// GET /api/v1/friends/requests/received
export const getReceivedFriendRequests = async (signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<ReceivedFriendRequestItem[]>>('/api/v1/friends/requests/received', { signal });
  return data.data;
};

// ─── Friend 4. 친구 요청 수락/거절 ────────────────────────────────────────────
// PATCH /api/v1/friends/requests/{requestId}
export const respondFriendRequest = async (requestId: string, body: ResolveFriendRequestBody) => {
  const { data } = await axiosInstance.patch<ApiResponse<ResolveFriendRequestResponse>>(`/api/v1/friends/requests/${requestId}`, body);
  return data.data;
};

// ─── Friend 5. 친구 삭제 ──────────────────────────────────────────────────────
// DELETE /api/v1/friends/{memberId}
export const deleteFriend = async (memberId: string) => {
  const { data } = await axiosInstance.delete<ApiResponse<DeleteFriendResponse>>(`/api/v1/friends/${memberId}`);
  return data.data;
};
