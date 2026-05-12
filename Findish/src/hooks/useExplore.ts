import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getExploreSearch,
  getCardSummary,
  addSelection,
  getSelections,
  removeSelection,
} from '@/api/explore';
import type { ExploreSearchRequest, AddSelectionRequest } from '@/types/explore';

const SELECTIONS_KEY = ['explore', 'selections'] as const;

export const useExploreSearchQuery = (params: ExploreSearchRequest) => {
  return useQuery({
    queryKey: ['explore', 'search', params],
    queryFn: () => getExploreSearch(params),
    enabled: !!params.keyword,
  });
};

export const useCardSummaryQuery = (restaurantId: number) => {
  return useQuery({
    queryKey: ['explore', restaurantId, 'card-summary'],
    queryFn: () => getCardSummary(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useSelectionsQuery = () => {
  return useQuery({
    queryKey: SELECTIONS_KEY,
    queryFn: getSelections,
  });
};

export const useAddSelectionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddSelectionRequest) => addSelection(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELECTIONS_KEY });
    },
  });
};

export const useRemoveSelectionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (restaurantId: number) => removeSelection(restaurantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELECTIONS_KEY });
    },
  });
};
