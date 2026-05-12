// ─── 0. 키워드 검색 (일반모드) ────────────────────────────────────────────────
// GET /api/v1/restaurants/search
export interface SearchRestaurantItem {
  restaurantId: number;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  reviewCount: number;
  distance: number; // 단위: m
  thumbnailUrl: string;
  tags: string[];
  isOpen: boolean;
}
export interface SearchRestaurantsRequest {
  keyword: string;
  lat?: number;
  lng?: number;
  sort?: string;
  page?: number;
  size?: number;
}
export interface SearchRestaurantsResponse {
  totalCount: number;
  restaurants: SearchRestaurantItem[];
}

// ─── 1. 식당 기본 정보 ───────────────────────────────────────────────────────
// GET /api/v1/restaurants/{restaurantId}
export interface GetRestaurantResponse {
  restaurantId: number;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  priceRange: string;
  businessHours: string;
  isOpen: boolean;
  imageUrls: string[];
  tags: string[];
}

// ─── 2. AI 요약 조회 ──────────────────────────────────────────────────────────
// GET /api/v1/restaurants/{restaurantId}/ai-summary
export interface GetAiSummaryResponse {
  summary: string;
  positiveKeywords: string[];
  negativeKeywords: string[];
  atmosphereTags: string[];
  updatedAt: string;
}

// ─── 3. 메뉴 목록 조회 ───────────────────────────────────────────────────────
// GET /api/v1/restaurants/{restaurantId}/menus
export interface MenuItem {
  menuId: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}
export interface GetMenusResponse {
  menus: MenuItem[];
}

// ─── 4. 리뷰 목록 조회 ───────────────────────────────────────────────────────
// GET /api/v1/restaurants/{restaurantId}/reviews
export interface GetReviewsRequest {
  page?: number;
  size?: number;
  photoOnly?: boolean;
  sort?: string;
  keyword?: string;
}
export interface ReviewItem {
  reviewId: number;
  author: string;
  content: string;
  imageUrls: string[];
  createdAt: string;
  source: string;
}
export interface GetReviewsResponse {
  totalCount: number;
  reviews: ReviewItem[];
}

// ─── 5. 가게 정보 조회 ───────────────────────────────────────────────────────
// GET /api/v1/restaurants/{restaurantId}/info
export interface BusinessHourItem {
  day: string;
  hours: string;
  isHoliday: boolean;
}
export interface GetRestaurantInfoResponse {
  address: string;
  phone: string;
  businessHours: BusinessHourItem[];
  facilities: string[];
  naverUrl: string;
  kakaoUrl: string;
}

// ─── 6. 예약 가능 날짜/시간 ──────────────────────────────────────────────────
// GET /api/v1/restaurants/{restaurantId}/reservations/available
export interface GetAvailableSlotsRequest {
  date: string;
}
export interface GetAvailableSlotsResponse {
  date: string;
  isHoliday: boolean;
  maxPartySize: number;
  slots: string[];
}

// ─── 7. 예약 확정 ─────────────────────────────────────────────────────────────
// POST /api/v1/restaurants/{restaurantId}/reservations
export interface CreateReservationRequest {
  date: string;
  time: string;
  partySize: number;
}
export interface CreateReservationResponse {
  reservationId: number;
  restaurantName: string;
  date: string;
  time: string;
  partySize: number;
  status: string;
  calendarSaved: boolean;
}
