import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sendMessage, confirmReservation, confirmOrder, getChatHistory, cancelAgentReservation, cancelAgentOrder } from '@/api/agent';
import type {
  SendMessageRequest,
  ConfirmReservationRequest,
  ConfirmOrderRequest,
  GetChatHistoryRequest,
} from '@/types/agent';

const CHAT_HISTORY_QUERY_KEY = ['chat-history'] as const;

export const useChatHistoryQuery = (params?: GetChatHistoryRequest) => {
  return useQuery({
    queryKey: [...CHAT_HISTORY_QUERY_KEY, params],
    queryFn: () => getChatHistory(params),
  });
};

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SendMessageRequest) => sendMessage(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_HISTORY_QUERY_KEY });
    },
  });
};

export const useConfirmReservationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ConfirmReservationRequest) => confirmReservation(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_HISTORY_QUERY_KEY });
    },
  });
};

export const useConfirmOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ConfirmOrderRequest) => confirmOrder(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_HISTORY_QUERY_KEY });
    },
  });
};

export const useCancelReservationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reservationId: number) => cancelAgentReservation(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_HISTORY_QUERY_KEY });
    },
  });
};

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => cancelAgentOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_HISTORY_QUERY_KEY });
    },
  });
};
