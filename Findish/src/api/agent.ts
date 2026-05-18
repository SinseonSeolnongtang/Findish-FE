import axiosInstance from '@/lib/axiosInstance';
import type {
  SendMessageRequest,
  ChatResponse,
  ConfirmReservationRequest,
  ConfirmReservationResponse,
  ConfirmOrderRequest,
  ConfirmOrderResponse,
  GetChatHistoryRequest,
  GetChatHistoryResponse,
  CancelReservationResponse,
  CancelOrderResponse,
} from '@/types/agent';

export const sendMessage = async (body: SendMessageRequest): Promise<ChatResponse> => {
  const { data } = await axiosInstance.post<ChatResponse>('/api/v1/agent/chat', body);
  return data;
};

export const confirmReservation = async (body: ConfirmReservationRequest): Promise<ConfirmReservationResponse> => {
  const { data } = await axiosInstance.post<ConfirmReservationResponse>('/api/v1/agent/reservations', body);
  return data;
};

export const confirmOrder = async (body: ConfirmOrderRequest): Promise<ConfirmOrderResponse> => {
  const { data } = await axiosInstance.post<ConfirmOrderResponse>('/api/v1/agent/orders', body);
  return data;
};

export const getChatHistory = async (params?: GetChatHistoryRequest): Promise<GetChatHistoryResponse> => {
  const { data } = await axiosInstance.get<GetChatHistoryResponse>('/api/v1/agent/chat/history', { params });
  return data;
};

export const cancelAgentReservation = async (reservationId: number): Promise<CancelReservationResponse> => {
  const { data } = await axiosInstance.patch<CancelReservationResponse>(`/api/v1/agent/reservations/${reservationId}/cancel`);
  return data;
};

export const cancelAgentOrder = async (orderId: number): Promise<CancelOrderResponse> => {
  const { data } = await axiosInstance.patch<CancelOrderResponse>(`/api/v1/agent/orders/${orderId}/cancel`);
  return data;
};
