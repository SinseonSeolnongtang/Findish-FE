// ─── 0. 공통 ──────────────────────────────────────────────────────────────────
export type AgentIntent =
  | 'RESERVATION'
  | 'ORDER'
  | 'MENU_RECOMMEND'
  | 'CANCEL_RESERVATION'
  | 'CANCEL_ORDER'
  | 'GENERAL';

export type AgentStep = 'COLLECTING' | 'CONFIRMING' | 'COMPLETED';

export type MessageRole = 'USER' | 'AGENT';

// ─── 1. 챗 메시지 전송 ────────────────────────────────────────────────────────
// POST /api/v1/agent/chat
export interface SendMessageRequest {
  message: string;
  restaurantId?: number;
}

export interface AgentReservationInfo {
  reservationId: number | null;
  restaurantName: string;
  date: string;
  time: string;
  partySize: number;
}

export interface AgentMenuInfo {
  menuId: number;
  name: string;
  price: number;
  imageUrl: string;
}

export interface ChatResponse {
  message: string;
  intent: AgentIntent;
  step: AgentStep;
  targetId: number | null;
  reservation: AgentReservationInfo | null;
  menus: AgentMenuInfo[] | null;
}

// ─── 2. 예약 확정 ─────────────────────────────────────────────────────────────
// POST /api/v1/agent/reservations
export interface ConfirmReservationRequest {
  restaurantId: number;
  date: string;
  time: string;
  partySize: number;
  saveToCalendar: boolean;
}

export interface ConfirmReservationResponse {
  reservationId: number;
  restaurantName: string;
  date: string;
  time: string;
  partySize: number;
  calendarEventId: string | null;
}

// ─── 3. 주문 확정 ─────────────────────────────────────────────────────────────
// POST /api/v1/agent/orders
export interface ConfirmOrderItem {
  menuId: number;
  quantity: number;
}

export interface ConfirmOrderRequest {
  restaurantId: number;
  items: ConfirmOrderItem[];
}

export interface ConfirmedOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ConfirmOrderResponse {
  orderId: number;
  restaurantName: string;
  items: ConfirmedOrderItem[];
  totalPrice: number;
}

// ─── 4. 대화 내역 조회 ────────────────────────────────────────────────────────
// GET /api/v1/agent/chat/history
export interface GetChatHistoryRequest {
  page?: number;
  size?: number;
}

export interface ChatHistoryMessage {
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface GetChatHistoryResponse {
  messages: ChatHistoryMessage[];
}

// ─── 5. 주문 취소 ─────────────────────────────────────────────────────────────
// PATCH /api/v1/agent/orders/{orderId}/cancel
export interface CancelOrderResponse {
  orderId: number;
  status: 'CANCELLED';
}
