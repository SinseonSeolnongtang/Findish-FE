import axiosInstance from '@/lib/axiosInstance';
import type {
  ExploreSearchRequest,
  ExploreSearchResponse,
  GetCardSummaryResponse,
  AddSelectionRequest,
  SelectionsResponse,
} from '@/types/explore';

export const getExploreSearch = async (params: ExploreSearchRequest): Promise<ExploreSearchResponse> => {
  const { data } = await axiosInstance.get<ExploreSearchResponse>('/api/v1/explore/search', { params });
  return data;
};

export const getCardSummary = async (restaurantId: string): Promise<GetCardSummaryResponse> => {
  const { data } = await axiosInstance.get<GetCardSummaryResponse>(`/api/v1/explore/${restaurantId}/card-summary`);
  return data;
};

export const addSelection = async (body: AddSelectionRequest): Promise<SelectionsResponse> => {
  const { data } = await axiosInstance.post<SelectionsResponse>('/api/v1/explore/selections', body);
  return data;
};

export const getSelections = async (): Promise<SelectionsResponse> => {
  const { data } = await axiosInstance.get<SelectionsResponse>('/api/v1/explore/selections');
  return data;
};

export const removeSelection = async (restaurantId: string): Promise<SelectionsResponse> => {
  const { data } = await axiosInstance.delete<SelectionsResponse>(`/api/v1/explore/selections/${restaurantId}`);
  return data;
};
