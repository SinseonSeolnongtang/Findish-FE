import axiosInstance from '@/lib/axiosInstance';
import type { ApiResponse } from '@/types/auth';
import type { GetReservationsRequest, ReservationsResponse, CancelReservationResponse, GetOrdersRequest, OrdersResponse, GetLikesRequest, LikesResponse } from '@/types/myPage';

// ─── 1. 예약 내역 조회 ────────────────────────────────────────────────────────
// GET /api/v1/members/me/reservations
export const getMyReservations = async (params?: GetReservationsRequest, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<ReservationsResponse>>('/api/v1/members/me/reservations', { params, signal });
  return data;
};

// ─── 2. 예약 취소 ─────────────────────────────────────────────────────────────
// PATCH /api/v1/members/me/reservations/{reservationId}/cancel
export const cancelMyReservation = async (reservationId: string, signal?: AbortSignal) => {
  const { data } = await axiosInstance.patch<ApiResponse<CancelReservationResponse>>(`/api/v1/members/me/reservations/${reservationId}/cancel`, null, { signal });
  return data;
};

// ─── 3. 주문 내역 조회 ────────────────────────────────────────────────────────
// GET /api/v1/members/me/orders
export const getMyOrders = async (params?: GetOrdersRequest, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<OrdersResponse>>('/api/v1/members/me/orders', { params, signal });
  return data;
};

// ─── 4. 좋아요 목록 조회 ──────────────────────────────────────────────────────
// GET /api/v1/members/me/likes
export const getMyLikes = async (params?: GetLikesRequest, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<LikesResponse>>('/api/v1/members/me/likes', { params, signal });
  return data;
};

// ─── 5. AI 선호도 벡터 조회 ───────────────────────────────────────────────────
// GET /api/v1/members/me/preference
export const getMyPreference = async (signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<Record<string, Record<string, unknown>>>>('/api/v1/members/me/preference', { signal });
  return data;
};
