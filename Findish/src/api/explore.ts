import axiosInstance from '@/lib/axiosInstance';
import type { ApiResponse } from '@/types/auth';
import type {
  ExploreSearchRequest,
  ExploreSearchResponse,
  GetCardSummaryResponse,
  AddSelectionRequest,
  SelectionsResponse,
  GetAnalysisResponse,
} from '@/types/explore';

// ─── 1. 자연어 검색 ──────────────────────────────────────────────────────────
// GET /api/v1/explore/search
export const getExploreSearch = async (params: ExploreSearchRequest, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<ExploreSearchResponse>>('/api/v1/explore/search', { params, signal });
  return data;
};

// ─── 2. 카드 AI 요약 조회 ────────────────────────────────────────────────────
// GET /api/v1/explore/{naverPlaceId}/card-summary
export const getCardSummary = async (naverPlaceId: string, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<GetCardSummaryResponse>>(`/api/v1/explore/${naverPlaceId}/card-summary`, { signal });
  return data;
};

// ─── 3. 선택 목록 조회 ───────────────────────────────────────────────────────
// GET /api/v1/explore/selections
export const getSelections = async (signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<SelectionsResponse>>('/api/v1/explore/selections', { signal });
  return data;
};

// ─── 4. 선택 추가 ─────────────────────────────────────────────────────────────
// POST /api/v1/explore/selections
export const addSelection = async (body: AddSelectionRequest) => {
  const { data } = await axiosInstance.post<ApiResponse<SelectionsResponse>>('/api/v1/explore/selections', body);
  return data;
};

// ─── 5. 선택 삭제 ─────────────────────────────────────────────────────────────
// DELETE /api/v1/explore/selections/{naverPlaceId}
export const removeSelection = async (naverPlaceId: string) => {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(`/api/v1/explore/selections/${naverPlaceId}`);
  return data;
};

// ─── 6. 가게 비교 분석 ───────────────────────────────────────────────────────
// GET /api/v1/explore/analysis
export const getAnalysis = async (signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<ApiResponse<GetAnalysisResponse>>('/api/v1/explore/analysis', { signal });
  return data;
};
