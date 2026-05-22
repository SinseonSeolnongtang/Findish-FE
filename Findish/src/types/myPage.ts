// ─── 공통 ─────────────────────────────────────────────────────────────────────

export type ReservationStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';
export type CancelReason = 'USER_CANCEL' | 'NO_SHOW';
export type OrderType = 'CART' | 'AGENT';

// ─── 1. 예약 내역 목록 조회 ───────────────────────────────────────────────────
// GET /api/v1/members/me/reservations

export interface GetReservationsRequest {
  status: ReservationStatus;
  page?: number;
  size?: number;
}

export interface ReservationItem {
  reservationId: string;
  restaurantId: string;
  restaurantName: string;
  thumbnailUrl: string;
  date: string;
  time: string;
  partySize: number;
  status: ReservationStatus;
  cancelReason: CancelReason | null;
}

export interface ReservationsResponse {
  totalCount: number;
  reservations: ReservationItem[];
}

// ─── 2. 예약 취소 ─────────────────────────────────────────────────────────────
// DELETE /api/v1/members/me/reservations/{reservationId}

export interface CancelReservationResponse {
  reservationId: string;
  status: 'CANCELLED';
  cancelReason: 'USER_CANCEL';
}

// ─── 3. 주문 내역 목록 조회 ───────────────────────────────────────────────────
// GET /api/v1/members/me/orders

export interface GetOrdersRequest {
  orderType?: OrderType;
  sort?: string;
  page?: number;
  size?: number;
}

export interface OrderMenuItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderItem {
  orderId: number;
  restaurantId: number;
  restaurantName: string;
  thumbnailUrl: string;
  items: OrderMenuItem[];
  totalPrice: number;
  orderType: OrderType;
  orderedAt: string;
}

export interface OrdersResponse {
  totalCount: number;
  orders: OrderItem[];
}
