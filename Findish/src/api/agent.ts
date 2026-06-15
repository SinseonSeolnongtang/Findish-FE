import agentAxiosInstance from '@/lib/agentAxiosInstance';
import type { ApiResponse } from '@/types/auth';
import type {
  SendMessageRequest,
  ChatResponse,
  GetChatHistoryRequest,
  GetChatHistoryResponse,
} from '@/types/agent';

// ─── 1. 챗 메시지 전송 ────────────────────────────────────────────────────────
// POST /api/v1/agent/chat
export const sendMessage = async (body: SendMessageRequest) => {
  const { data } = await agentAxiosInstance.post<ApiResponse<ChatResponse>>('/api/v1/agent/chat', body);
  return data;
};

// ─── 2. 대화 내역 조회 ────────────────────────────────────────────────────────
// GET /api/v1/agent/chat/history
export const getChatHistory = async (params?: GetChatHistoryRequest, signal?: AbortSignal) => {
  const { data } = await agentAxiosInstance.get<ApiResponse<GetChatHistoryResponse>>('/api/v1/agent/chat/history', { params, signal });
  return data;
};
