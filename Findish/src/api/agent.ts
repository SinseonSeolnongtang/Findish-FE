import axiosInstance from '@/lib/axiosInstance';
import type { ApiResponse } from '@/types/auth';
import type {
  SendMessageRequest,
  ChatResponse,
  GetChatHistoryRequest,
  GetChatHistoryResponse,
  ConfirmReservationRequest,
  ConfirmReservationResponse,
  ConfirmOrderRequest,
  ConfirmOrderResponse,
  CancelReservationResponse,
  CancelOrderResponse,
} from '@/types/agent';

// ─── 1. 챗 메시지 전송 ────────────────────────────────────────────────────────
// POST /api/v1/agent/chat
export const sendMessage = async (body: SendMessageRequest) => {
  const { data } = await axiosInstance.post<ApiResponse<ChatResponse>>('/api/v1/agent/chat', body);
  return data;
};

// ─── 2. 예약 확정 ─────────────────────────────────────────────────────────────
// POST /api/v1/agent/reservations
export const confirmReservation = async (body: ConfirmReservationRequest) => {
  const { data } = await axiosInstance.post<ApiResponse<ConfirmReservationResponse>>('/api/v1/agent/reservations', body);
  return data;
};

// ─── 3. 주문 확정 ─────────────────────────────────────────────────────────────
// POST /api/v1/agent/orders
export const confirmOrder = async (body: ConfirmOrderRequest) => {
  const { data } = await axiosInstance.post<ApiResponse<ConfirmOrderResponse>>('/api/v1/agent/orders', body);
  return data;
};

// ─── 4. 대화 내역 조회 ────────────────────────────────────────────────────────
// GET /api/v1/agent/chat/history
export const getChatHistory = async (params?: GetChatHistoryRequest, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<GetChatHistoryResponse>>('/api/v1/agent/chat/history', { params, signal });
  return data;
};

// ─── 5. 예약 취소 ─────────────────────────────────────────────────────────────
// PATCH /api/v1/agent/reservations/{reservationId}/cancel
export const cancelAgentReservation = async (reservationId: string) => {
  const { data } = await axiosInstance.patch<ApiResponse<CancelReservationResponse>>(`/api/v1/agent/reservations/${reservationId}/cancel`);
  return data;
};

// ─── 6. 주문 취소 ─────────────────────────────────────────────────────────────
// PATCH /api/v1/agent/orders/{orderId}/cancel
export const cancelAgentOrder = async (orderId: string) => {
  const { data } = await axiosInstance.patch<ApiResponse<CancelOrderResponse>>(`/api/v1/agent/orders/${orderId}/cancel`);
  return data;
};
