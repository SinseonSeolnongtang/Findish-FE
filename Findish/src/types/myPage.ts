// ─── 1. 예약 내역 목록 조회 ───────────────────────────────────────────────────
// GET /api/v1/members/me/reservations
export interface GetReservationsRequest {
  status?: string;
  page?: number;
  size?: number;
}
export interface ReservationItem {
  reservationId?: string;
  naverPlaceId?: string;
  date?: string;
  time?: string;
  partySize?: number;
  status?: string;
}
export interface ReservationsResponse {
  totalElements?: number;
  totalPages?: number;
  content?: ReservationItem[];
}

// ─── 2. 예약 취소 ─────────────────────────────────────────────────────────────
// PATCH /api/v1/members/me/reservations/{reservationId}/cancel
export type CancelReservationResponse = ReservationItem;

// ─── 3. 주문 내역 목록 조회 ───────────────────────────────────────────────────
// GET /api/v1/members/me/orders
export interface GetOrdersRequest {
  page?: number;
  size?: number;
}
export interface OrderItemInfo {
  menuName?: string;
  quantity?: number;
  price?: number;
}
export interface OrderItem {
  orderId?: string;
  naverPlaceId?: string;
  items?: OrderItemInfo[];
  totalPrice?: number;
  status?: string;
  orderedAt?: string;
}
export interface OrdersResponse {
  totalElements?: number;
  totalPages?: number;
  content?: OrderItem[];
}

// ─── 4. 좋아요 목록 조회 ──────────────────────────────────────────────────────
// GET /api/v1/members/me/likes
export interface GetLikesRequest {
  page?: number;
  size?: number;
}
export interface LikeItem {
  naverPlaceId?: string;
  likedAt?: string;
}
export interface LikesResponse {
  totalElements?: number;
  totalPages?: number;
  content?: LikeItem[];
}
