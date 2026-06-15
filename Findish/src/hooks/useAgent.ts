import { useMutation, useQuery } from '@tanstack/react-query';
import { sendMessage, getChatHistory } from '@/api/agent';
import type { SendMessageRequest, GetChatHistoryRequest } from '@/types/agent';

const CHAT_HISTORY_QUERY_KEY = ['chat-history'] as const;

export const useChatHistoryQuery = (params?: GetChatHistoryRequest) => {
  return useQuery({
    queryKey: [...CHAT_HISTORY_QUERY_KEY, params],
    queryFn: () => getChatHistory(params),
    refetchOnMount: 'always',
  });
};

export const useSendMessageMutation = () => {
  return useMutation({
    mutationFn: (body: SendMessageRequest) => sendMessage(body),
  });
};
