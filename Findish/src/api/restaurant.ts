import axiosInstance from '@/lib/axiosInstance';
import type { ApiResponse } from '@/types/auth';
import type {
  SearchRestaurantsRequest,
  SearchRestaurantsResponse,
  GetRestaurantResponse,
  GetAiSummaryResponse,
  GetMenusResponse,
  GetReviewsRequest,
  GetReviewsResponse,
  GetRestaurantInfoResponse,
  GetAvailableSlotsRequest,
  GetAvailableSlotsResponse,
  CreateReservationRequest,
  CreateReservationResponse,
  ToggleLikeResponse,
  GetMyLikesRequest,
  GetMyLikesResponse,
  GetRandomRestaurantsResponse,
} from '@/types/restaurant';

// ─── 0. 키워드 검색 (일반모드) ────────────────────────────────────────────────
// GET /api/v1/restaurants/search
export const searchRestaurants = async (params: SearchRestaurantsRequest, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<SearchRestaurantsResponse>>('/api/v1/restaurants/search', { params, signal });
  return data;
};

// ─── 1. 식당 기본 정보 ───────────────────────────────────────────────────────
// GET /api/v1/restaurants/{naverPlaceId}
export const getRestaurantBasic = async (naverPlaceId: string, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<GetRestaurantResponse>>(`/api/v1/restaurants/${naverPlaceId}`, { signal });
  return data;
};

// ─── 2. AI 요약 조회 ──────────────────────────────────────────────────────────
// GET /api/v1/restaurants/{naverPlaceId}/ai-summary
export const getRestaurantAiSummary = async (naverPlaceId: string, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<GetAiSummaryResponse>>(`/api/v1/restaurants/${naverPlaceId}/ai-summary`, { signal });
  return data;
};

// ─── 3. 메뉴 목록 조회 ───────────────────────────────────────────────────────
// GET /api/v1/restaurants/{naverPlaceId}/menus
export const getRestaurantMenus = async (naverPlaceId: string, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<GetMenusResponse>>(`/api/v1/restaurants/${naverPlaceId}/menus`, { signal });
  return data;
};

// ─── 4. 리뷰 목록 조회 ───────────────────────────────────────────────────────
// GET /api/v1/restaurants/{naverPlaceId}/reviews
export const getRestaurantReviews = async (naverPlaceId: string, params?: GetReviewsRequest, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<GetReviewsResponse>>(`/api/v1/restaurants/${naverPlaceId}/reviews`, { params, signal });
  return data;
};

// ─── 5. 가게 정보 조회 ───────────────────────────────────────────────────────
// GET /api/v1/restaurants/{naverPlaceId}/info
export const getRestaurantInfo = async (naverPlaceId: string, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<GetRestaurantInfoResponse>>(`/api/v1/restaurants/${naverPlaceId}/info`, { signal });
  return data;
};

// ─── 6. 예약 가능 날짜/시간 ──────────────────────────────────────────────────
// GET /api/v1/restaurants/{naverPlaceId}/reservations/available
export const getAvailableSlots = async (naverPlaceId: string, params: GetAvailableSlotsRequest, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<GetAvailableSlotsResponse>>(`/api/v1/restaurants/${naverPlaceId}/reservations/available`, { params, signal });
  return data;
};

// ─── 7. 예약 확정 ─────────────────────────────────────────────────────────────
// POST /api/v1/restaurants/{naverPlaceId}/reservations
export const createReservation = async (naverPlaceId: string, body: CreateReservationRequest) => {
  const { data } = await axiosInstance.post<ApiResponse<CreateReservationResponse>>(`/api/v1/restaurants/${naverPlaceId}/reservations`, body);
  return data;
};

// ─── 8. 좋아요 토글 ───────────────────────────────────────────────────────────
// POST /api/v1/restaurants/{naverPlaceId}/like
export const toggleLike = async (naverPlaceId: string) => {
  const { data } = await axiosInstance.post<ApiResponse<ToggleLikeResponse>>(`/api/v1/restaurants/${naverPlaceId}/like`);
  return data;
};

// ─── 9. 좋아요 목록 조회 ──────────────────────────────────────────────────────
// GET /api/v1/members/me/likes
export const getMyLikes = async (params?: GetMyLikesRequest, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<GetMyLikesResponse>>('/api/v1/members/me/likes', { params, signal });
  return data;
};

// ─── 10. 랜덤 식당 조회 (온보딩용) ───────────────────────────────────────────
// GET /api/v1/restaurants/random
export const getRandomRestaurants = async (size = 5, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<GetRandomRestaurantsResponse>>('/api/v1/restaurants/random', { params: { size }, signal });
  return data;
};
