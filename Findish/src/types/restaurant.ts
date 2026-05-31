// ─── 공통 식당 기본 정보 ──────────────────────────────────────────────────────
export interface RestaurantBasicItem {
  restaurantId?: string;
  name?: string;
  category?: string;
  address?: string;
  lat?: number;
  lng?: number;
  reviewCount?: number;
  priceRange?: string;
  thumbnailUrl?: string;
  tags?: string[];
  parking?: boolean;
  groupSeating?: boolean;
  isLiked?: boolean;
  isOpen?: boolean;
}

// ─── 0. 키워드 검색 (일반모드) ────────────────────────────────────────────────
// GET /api/v1/restaurants/search
export interface SearchRestaurantsRequest {
  keyword: string;
}
export type SearchRestaurantsResponse = RestaurantBasicItem[];

// ─── 1. 식당 기본 정보 ───────────────────────────────────────────────────────
// GET /api/v1/restaurants/{naverPlaceId}
export type GetRestaurantResponse = RestaurantBasicItem;

// ─── 2. AI 요약 조회 ──────────────────────────────────────────────────────────
// GET /api/v1/restaurants/{naverPlaceId}/ai-summary
export interface AiKeyword {
  aspect?: string;
  key?: string;
  sentenceCount?: number;
  positiveCount?: number;
  negativeCount?: number;
  positiveSentences?: string[];
  negativeSentences?: string[];
}

export interface GetAiSummaryResponse {
  naverPlaceId?: string;
  name?: string;
  tasteSummary?: string;
  ambianceSummary?: string;
  serviceSummary?: string;
  priceSummary?: string;
  facilitySummary?: string;
  waitingSummary?: string;
  overallSummary?: string;
  photos?: string[];
  keywords?: AiKeyword[];
}

// ─── 3. 메뉴 목록 조회 ───────────────────────────────────────────────────────
// GET /api/v1/restaurants/{naverPlaceId}/menus
export interface MenuItem {
  name?: string;
  price?: string;
  imageUrl?: string;
  isSignature?: boolean;
}
export type GetMenusResponse = MenuItem[];

// ─── 4. 리뷰 목록 조회 ───────────────────────────────────────────────────────
// GET /api/v1/restaurants/{naverPlaceId}/reviews
export interface GetReviewsRequest {
  page?: number;
  size?: number;
  photoOnly?: boolean;
  sort?: string;
  keyword?: string;
}
export interface ReviewImage {
  image_url: string;
}

export interface ReviewItem {
  reviewId?: string;
  author?: string;
  content?: string;
  images?: string; // JSON string: "[{\"image_url\": \"...\"}]"
  createdAt?: string;
  sourceUrl?: string;
}
export interface GetReviewsResponse {
  totalElements?: number;
  totalPages?: number;
  content?: ReviewItem[];
}

// ─── 5. 가게 정보 조회 ───────────────────────────────────────────────────────
// GET /api/v1/restaurants/{naverPlaceId}/info
export interface GetRestaurantInfoResponse {
  naverPlaceId?: string;
  name?: string;
  address?: string;
  category?: string;
  businessHours?: string;
  parking?: boolean;
  groupSeating?: boolean;
  reviewCount?: number;
  isOpen?: boolean;
}

// ─── 6. 예약 가능 날짜/시간 ──────────────────────────────────────────────────
// GET /api/v1/restaurants/{naverPlaceId}/reservations/available
export interface GetAvailableSlotsRequest {
  date: string;
}
export interface GetAvailableSlotsResponse {
  date?: string;
  isHoliday?: boolean;
  maxPartySize?: number;
  slots?: string[];
}

// ─── 7. 예약 확정 ─────────────────────────────────────────────────────────────
// POST /api/v1/restaurants/{naverPlaceId}/reservations
export interface CreateReservationRequest {
  date: string;
  time: string;
  partySize: number;
}
export interface CreateReservationResponse {
  reservationId?: string;
  naverPlaceId?: string;
  reservationDate?: string;
  reservationTime?: { hour?: number; minute?: number; second?: number; nano?: number };
  partySize?: number;
  status?: string;
  calendarAdded?: boolean;
}

// ─── 8. 좋아요 토글 ───────────────────────────────────────────────────────────
// POST /api/v1/restaurants/{naverPlaceId}/like
export type ToggleLikeResponse = { [key: string]: boolean };

// ─── 9. 좋아요 목록 조회 ──────────────────────────────────────────────────────
// GET /api/v1/members/me/likes
export interface GetMyLikesRequest {
  page?: number;
  size?: number;
}
export interface LikedRestaurantItem {
  naverPlaceId?: string;
  likedAt?: string;
}
export interface GetMyLikesResponse {
  totalElements?: number;
  totalPages?: number;
  content?: LikedRestaurantItem[];
}
