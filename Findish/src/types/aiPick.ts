// ─── 공통 유니언 타입 ─────────────────────────────────────────────────────────
export type AiPickSituation =
  | "DATE"
  | "FRIEND"
  | "ALONE"
  | "MEETING"
  | "FAMILY";
export type AiPickPriority =
  | "TASTE"
  | "ATMOSPHERE"
  | "PRICE"
  | "CLEANLINESS"
  | "SERVICE"
  | "PARKING";

// ─── 추천 식당 공통 아이템 ────────────────────────────────────────────────────
export interface AiPickRestaurantItem {
  restaurantId: number;
  name: string;
  category: string;
  address: string;
  thumbnailUrl: string;
  tags: string[];
  lat: number;
  lng: number;
}

// ─── 1. 프리셋 생성 (POST /api/v1/ai-pick/presets) ───────────────────────────
export interface CreateAiPickPresetRequest {
  friendIds?: number[];
  situation: AiPickSituation;
  budgetMin: number;
  budgetMax: number;
  priorities: AiPickPriority[];
  extraCondition?: string;
  lat?: number;
  lng?: number;
}

export interface CreateAiPickPresetResponse {
  presetId: number;
  title: string;
  aiMessage: string;
  restaurants: AiPickRestaurantItem[];
  createdAt: string;
}

// ─── 2. 프리셋 수정 (PATCH /api/v1/ai-pick/presets/{presetId}) ───────────────
export interface UpdateAiPickPresetRequest {
  friendIds?: number[];
  situation?: AiPickSituation;
  budgetMin?: number;
  budgetMax?: number;
  priorities?: AiPickPriority[];
  extraCondition?: string;
}

export interface UpdateAiPickPresetResponse {
  presetId: number;
  title: string;
  aiMessage: string;
  restaurants: AiPickRestaurantItem[];
  updatedAt: string;
}

// ─── 3. 프리셋 히스토리 목록 조회 (GET /api/v1/ai-pick/presets) ──────────────
export interface AiPickPresetHistoryItem {
  presetId: number;
  title: string;
  createdAt: string;
}
export interface GetAiPickPresetsResponse {
  presets: AiPickPresetHistoryItem[];
}

// ─── 4. 프리셋 상세 조회 (GET /api/v1/ai-pick/presets/{presetId}) ─────────────
export interface AiPickPresetFriend {
  memberId: number;
  name: string;
}
export interface GetAiPickPresetDetailResponse {
  presetId: number;
  title: string;
  friends: AiPickPresetFriend[];
  situation: AiPickSituation;
  budgetMin: number;
  budgetMax: number;
  priorities: AiPickPriority[];
  extraCondition: string;
  aiMessage: string;
  restaurants: AiPickRestaurantItem[];
  createdAt: string;
}

// ─── Friend 1. 친구 목록 조회 (GET /api/v1/friends) ──────────────────────────
export interface FriendItem {
  memberId: number;
  loginId: string;
  name: string;
}
export interface GetFriendsResponse {
  friends: FriendItem[];
}

// ─── Friend 2. 친구 요청 (POST /api/v1/friends/requests) ─────────────────────
export interface SendFriendRequestBody {
  loginId: string;
}
export interface SendFriendRequestResponse {
  requestId: number;
  toName: string;
  status: "PENDING";
}

// ─── Friend 3. 받은 친구 요청 목록 조회 (GET /api/v1/friends/requests/received)
export interface ReceivedFriendRequestItem {
  requestId: string;
  senderId: string;
  senderName: string;
  senderLoginId: string;
  requestedAt: string;
}

// ─── Friend 4. 친구 요청 수락/거절 (PATCH /api/v1/friends/requests/{requestId})
export type FriendRequestResolution = "ACCEPTED" | "REJECTED";
export interface ResolveFriendRequestBody {
  status: FriendRequestResolution;
}
export interface ResolveFriendRequestResponse {
  requestId: string;
  status: FriendRequestResolution;
}

// ─── Friend 4. 친구 삭제 (DELETE /api/v1/friends/{memberId}) ─────────────────
export interface DeleteFriendResponse {
  message: string;
}
