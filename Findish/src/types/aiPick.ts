// ─── 공통 유니언 타입 ─────────────────────────────────────────────────────────
export type AiPickSituation =
  | "DATE"
  | "FRIEND"
  | "ALONE"
  | "MEETING"
  | "FAMILY"
  | "OTHER";

export type AiPickPriority =
  | "TASTE"
  | "ATMOSPHERE"
  | "PRICE"
  | "CLEANLINESS"
  | "SERVICE"
  | "PARKING";

// ─── Evidence 관련 타입 ───────────────────────────────────────────────────────
export interface AiPickEvidenceKeywordEvidence {
  text: string;
  sentiment: string;
  highlight: number[];
}

export interface AiPickEvidenceKeyword {
  keyword: string;
  positive_count: number;
  negative_count: number;
  total_mentions: number;
  evidence?: AiPickEvidenceKeywordEvidence[];
}

export interface AiPickAspectRadarItem {
  score: number;
  positiveRatio: number;
  positiveCount: number;
  negativeCount: number;
  reviewCount: number;
}

export interface AiPickEvidence {
  matchScore?: number;
  aiReason?: string;
  reasons?: string[];
  keywords?: AiPickEvidenceKeyword[];
  matchedKeywords?: string[];
  aspectMatch?: Record<string, unknown>;
  aspectRadar?: {
    taste?: AiPickAspectRadarItem;
    mood?: AiPickAspectRadarItem;
    service?: AiPickAspectRadarItem;
    value?: AiPickAspectRadarItem;
    facility?: AiPickAspectRadarItem;
    waiting?: AiPickAspectRadarItem;
  };
  breakdown?: Record<string, number>;
}

// ─── Personalization 타입 ────────────────────────────────────────────────────
export interface AiPickPersonalization {
  mode?: string;
  userLabel?: string;
  personaCode?: string;
  personaLabel?: string;
  topAspects?: string[];
  groupSize?: number;
  groupStrategy?: string | null;
  members?: unknown[];
  vectorActive?: boolean;
  aspectScores?: Record<string, unknown>;
  sharedKeywords?: string[];
}

// ─── 공통 추천 식당 아이템 ────────────────────────────────────────────────────
export interface AiPickRestaurantItem {
  restaurantId?: string;
  name?: string;
  category?: string;
  address?: string;
  thumbnailUrl?: string;
  lat?: number;
  lng?: number;
  reviewCount?: number | null;
  priceRange?: string | null;
  tags?: string[] | null;
  businessHours?: string | null;
  parking?: boolean;
  groupSeating?: boolean;
  isLiked?: boolean;
  evidence?: AiPickEvidence;
}

// ─── 1. 프리셋 생성 (POST /api/v1/ai-pick/presets) ───────────────────────────
export interface CreateAiPickPresetRequest {
  friendIds?: string[];
  situation: AiPickSituation;
  budgetMin: number;
  budgetMax: number;
  priorities?: AiPickPriority[];
  extraCondition?: string;
  lat?: number;
  lng?: number;
}
export interface CreateAiPickPresetResponse {
  presetId?: string;
  title?: string;
  aiMessage?: string;
  restaurants?: AiPickRestaurantItem[];
  aiRestaurants?: AiPickRestaurantItem[];
  personalization?: AiPickPersonalization;
  createdAt?: string;
}

// ─── 2. 프리셋 수정 (PATCH /api/v1/ai-pick/presets/{presetId}) ───────────────
export interface UpdateAiPickPresetRequest {
  friendIds?: string[];
  situation?: AiPickSituation;
  budgetMin?: number;
  budgetMax?: number;
  priorities?: AiPickPriority[];
  extraCondition?: string;
}
export type UpdateAiPickPresetResponse = CreateAiPickPresetResponse;

// ─── 3. 프리셋 히스토리 목록 조회 (GET /api/v1/ai-pick/presets) ──────────────
export interface AiPickPresetHistoryItem {
  presetId?: string;
  title?: string;
  createdAt?: string;
}
export type GetAiPickPresetsResponse = AiPickPresetHistoryItem[];

// ─── 4. 프리셋 상세 조회 (GET /api/v1/ai-pick/presets/{presetId}) ─────────────
export interface AiPickPresetFriend {
  memberId?: string;
  name?: string;
}
export interface GetAiPickPresetDetailResponse {
  presetId?: string;
  title?: string;
  friends?: AiPickPresetFriend[];
  situation?: AiPickSituation;
  budgetMin?: number;
  budgetMax?: number;
  priorities?: AiPickPriority[];
  extraCondition?: string | null;
  aiMessage?: string;
  restaurants?: AiPickRestaurantItem[];
  aiRestaurants?: AiPickRestaurantItem[];
  personalization?: AiPickPersonalization;
  createdAt?: string;
}

// ─── Friend 1. 친구 목록 조회 (GET /api/v1/friends) ──────────────────────────
export interface FriendItem {
  memberId?: string;
  loginId?: string;
  name?: string;
  friendSince?: string;
}
export type GetFriendsResponse = FriendItem[];

// ─── Friend 2. 친구 요청 (POST /api/v1/friends/requests) ─────────────────────
export interface SendFriendRequestBody {
  receiverId: string;
}
export interface SendFriendRequestResponse {
  requestId?: string;
  receiverId?: string;
  status?: string;
}

// ─── Friend 3. 받은 친구 요청 목록 조회 (GET /api/v1/friends/requests/received)
export interface ReceivedFriendRequestItem {
  requestId?: string;
  senderId?: string;
  senderName?: string;
  senderLoginId?: string;
  requestedAt?: string;
}

// ─── Friend 4. 친구 요청 수락/거절 (PATCH /api/v1/friends/requests/{requestId})
export interface ResolveFriendRequestBody {
  action: 'ACCEPT' | 'REJECT';
}
export interface ResolveFriendRequestResponse {
  requestId?: string;
  status?: string;
}

// ─── Friend 5. 친구 삭제 (DELETE /api/v1/friends/{memberId}) ─────────────────
export interface DeleteFriendResponse {
  message?: string;
}
