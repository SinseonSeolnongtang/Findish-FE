import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sendMessage, getChatHistory } from '@/api/agent';
import type { SendMessageRequest, GetChatHistoryRequest } from '@/types/agent';

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
