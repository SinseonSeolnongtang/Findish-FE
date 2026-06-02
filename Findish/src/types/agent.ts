// ─── 공통 유니언 타입 ─────────────────────────────────────────────────────────
export type AgentIntent =
  // Action 도메인
  | "RESERVATION"
  | "CANCEL_RESERVATION"
  | "LIST_RESERVATIONS"
  | "ORDER"
  | "ADD_TO_CART"
  | "VIEW_CART"
  | "UPDATE_CART_ITEM"
  | "REMOVE_FROM_CART"
  | "CLEAR_CART"
  | "LIST_ORDERS"
  // Discovery 도메인
  | "SEARCH"
  | "COMPARE"
  | "QA"
  | "MENU_RECOMMEND"
  | "ADD_TO_SELECTIONS"
  | "VIEW_SELECTIONS"
  | "REMOVE_FROM_SELECTIONS"
  | "CLEAR_SELECTIONS"
  // General
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
  menuId?: string | null;
  name?: string;
  price?: number;
  quantity?: number;
  imageUrl?: string | null;
  isSignature?: boolean;
}

export interface AgentRestaurantInfo {
  restaurantId: string;
  name: string;
  category: string;
  address: string;
  thumbnailUrl?: string;
  reviewCount?: number;
  lat?: number;
  lng?: number;
}

export interface ChatResponse {
  message?: string;
  intent?: AgentIntent;
  step?: AgentStep;
  targetId?: string;
  restaurantId?: string;
  thumbnailUrl?: string;
  reservation?: AgentReservationInfo;
  menus?: AgentMenuInfo[];
  restaurants?: AgentRestaurantInfo[];
}

// ─── 2. 대화 내역 조회 ────────────────────────────────────────────────────────
// GET /api/v1/agent/chat/history
export interface GetChatHistoryRequest {
  page?: number;
  size?: number;
}

export interface HistoryMessage {
  role: "USER" | "AGENT";
  content: string;
  intent?: AgentIntent;
  step?: AgentStep;
  restaurantId?: string;
  menus?: AgentMenuInfo[];
  restaurants?: AgentRestaurantInfo[];
}

export interface GetChatHistoryResponse {
  messages: HistoryMessage[];
}
