// ─── 공통 유니언 타입 ─────────────────────────────────────────────────────────
export type AgentIntent =
  | "RESERVATION"
  | "ORDER"
  | "MENU_RECOMMEND"
  | "CANCEL_RESERVATION"
  | "CANCEL_ORDER"
  | "GENERAL";

export type AgentStep = "COLLECTING" | "CONFIRMING" | "COMPLETED";

// ─── 1. 챗 메시지 전송 ────────────────────────────────────────────────────────
// POST /api/v1/agent/chat
export interface SendMessageRequest {
  message: string;
  restaurantId?: string;
}

export interface AgentReservationInfo {
  reservationId?: string;
  restaurantName?: string;
  date?: string;
  time?: string;
  partySize?: number;
}

export interface AgentMenuInfo {
  menuId?: string;
  name?: string;
  price?: number;
  imageUrl?: string;
}

export interface ChatResponse {
  message?: string;
  intent?: string;
  step?: string;
  targetId?: string;
  reservation?: AgentReservationInfo;
  menus?: AgentMenuInfo[];
}

// ─── 2. 예약 확정 ─────────────────────────────────────────────────────────────
// POST /api/v1/agent/reservations
export interface ConfirmReservationRequest {
  restaurantId: string;
  date: string;
  time: string;
  partySize: number;
}
export interface ConfirmReservationResponse {
  reservationId?: string;
  restaurantName?: string;
  date?: string;
  time?: string;
  partySize?: number;
}

// ─── 3. 주문 확정 ─────────────────────────────────────────────────────────────
// POST /api/v1/agent/orders
export interface ConfirmOrderItem {
  menuId: string;
  quantity: number;
}
export interface ConfirmOrderRequest {
  restaurantId: string;
  items: ConfirmOrderItem[];
}
export interface ConfirmOrderResponse {
  orderId?: string;
  restaurantName?: string;
  items?: Array<{ name?: string; quantity?: number; price?: number }>;
  totalPrice?: number;
}

// ─── 4. 대화 내역 조회 ────────────────────────────────────────────────────────
// GET /api/v1/agent/chat/history
export interface GetChatHistoryRequest {
  page?: number;
  size?: number;
}
export type GetChatHistoryResponse = ChatResponse[];

// ─── 3. 예약 취소 ─────────────────────────────────────────────────────────────
// PATCH /api/v1/agent/reservations/{reservationId}/cancel
export interface CancelReservationResponse {
  reservationId?: string;
  status?: string;
  cancelReason?: string;
}

// ─── 4. 주문 취소 ─────────────────────────────────────────────────────────────
// PATCH /api/v1/agent/orders/{orderId}/cancel
export interface CancelOrderResponse {
  orderId?: string;
  status?: string;
}
