import axiosInstance from '@/lib/axiosInstance';
import type {
  CreateAiPickPresetRequest,
  CreateAiPickPresetResponse,
  UpdateAiPickPresetRequest,
  UpdateAiPickPresetResponse,
  GetAiPickPresetsResponse,
  GetAiPickPresetDetailResponse,
  GetFriendsResponse,
  ReceivedFriendRequestItem,
  SendFriendRequestBody,
  SendFriendRequestResponse,
  ResolveFriendRequestBody,
  ResolveFriendRequestResponse,
  DeleteFriendResponse,
} from '@/types/aiPick';

// POST /api/v1/ai-pick/presets
export const createPreset = async (
  body: CreateAiPickPresetRequest,
): Promise<CreateAiPickPresetResponse> => {
  const { data } = await axiosInstance.post<CreateAiPickPresetResponse>(
    '/api/v1/ai-pick/presets',
    body,
  );
  return data;
};

// GET /api/v1/ai-pick/presets
export const getPresetHistory = async (): Promise<GetAiPickPresetsResponse> => {
  const { data } = await axiosInstance.get<GetAiPickPresetsResponse>('/api/v1/ai-pick/presets');
  return data;
};

// GET /api/v1/ai-pick/presets/{presetId}
export const getPresetDetail = async (
  presetId: string,
): Promise<GetAiPickPresetDetailResponse> => {
  const { data } = await axiosInstance.get<GetAiPickPresetDetailResponse>(
    `/api/v1/ai-pick/presets/${presetId}`,
  );
  return data;
};

// PATCH /api/v1/ai-pick/presets/{presetId}
export const updatePreset = async (
  presetId: string,
  body: UpdateAiPickPresetRequest,
): Promise<UpdateAiPickPresetResponse> => {
  const { data } = await axiosInstance.patch<UpdateAiPickPresetResponse>(
    `/api/v1/ai-pick/presets/${presetId}`,
    body,
  );
  return data;
};

// GET /api/v1/friends
export const getFriends = async (): Promise<GetFriendsResponse> => {
  const { data } = await axiosInstance.get<GetFriendsResponse>('/api/v1/friends');
  return data;
};

// GET /api/v1/friends/requests/received
export const getReceivedFriendRequests = async (): Promise<ReceivedFriendRequestItem[]> => {
  const { data } = await axiosInstance.get<ReceivedFriendRequestItem[]>(
    '/api/v1/friends/requests/received',
  );
  return data;
};

// POST /api/v1/friends/requests
export const requestFriend = async (
  body: SendFriendRequestBody,
): Promise<SendFriendRequestResponse> => {
  const { data } = await axiosInstance.post<SendFriendRequestResponse>(
    '/api/v1/friends/requests',
    body,
  );
  return data;
};

// PATCH /api/v1/friends/requests/{requestId}
export const respondFriendRequest = async (
  requestId: string,
  body: ResolveFriendRequestBody,
): Promise<ResolveFriendRequestResponse> => {
  const { data } = await axiosInstance.patch<ResolveFriendRequestResponse>(
    `/api/v1/friends/requests/${requestId}`,
    body,
  );
  return data;
};

// DELETE /api/v1/friends/{memberId}
export const deleteFriend = async (memberId: string): Promise<DeleteFriendResponse> => {
  const { data } = await axiosInstance.delete<DeleteFriendResponse>(
    `/api/v1/friends/${memberId}`,
  );
  return data;
};
