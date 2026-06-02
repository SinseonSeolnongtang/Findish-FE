import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  searchRestaurants,
  getRestaurantBasic,
  getRestaurantAiSummary,
  getRestaurantMenus,
  getRestaurantReviews,
  getRestaurantInfo,
  getAvailableSlots,
  createReservation,
  toggleLike,
  getMyLikes,
} from '@/api/restaurant';
import type {
  SearchRestaurantsRequest,
  GetReviewsRequest,
  GetAvailableSlotsRequest,
  CreateReservationRequest,
  GetMyLikesRequest,
} from '@/types/restaurant';
import { useAuthStore } from '@/stores/authStore';

export const useSearchRestaurantsQuery = (params: SearchRestaurantsRequest) => {
  return useQuery({
    queryKey: ['restaurants', 'search', params],
    queryFn: () => searchRestaurants(params),
    enabled: !!params.keyword.trim(),
  });
};

export const useRestaurantBasicQuery = (restaurantId: string) => {
  return useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: () => getRestaurantBasic(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useRestaurantAiSummaryQuery = (restaurantId: string) => {
  return useQuery({
    queryKey: ['restaurant', restaurantId, 'ai-summary'],
    queryFn: () => getRestaurantAiSummary(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useRestaurantMenusQuery = (restaurantId: string) => {
  return useQuery({
    queryKey: ['restaurant', restaurantId, 'menus'],
    queryFn: () => getRestaurantMenus(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useRestaurantReviewsQuery = (restaurantId: string, params: GetReviewsRequest) => {
  return useQuery({
    queryKey: ['restaurant', restaurantId, 'reviews', params],
    queryFn: () => getRestaurantReviews(restaurantId, params),
    enabled: !!restaurantId,
  });
};

export const useRestaurantKeywordReviewsInfiniteQuery = (
  restaurantId: string,
  keyword: string | undefined,
  size = 10,
) => {
  return useInfiniteQuery({
    queryKey: ['restaurant', restaurantId, 'keyword-reviews', keyword],
    queryFn: ({ pageParam }) =>
      getRestaurantReviews(restaurantId, { keyword, page: pageParam as number, size }),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage.data?.totalPages ?? 0;
      return allPages.length < totalPages ? allPages.length : undefined;
    },
    initialPageParam: 0,
    enabled: !!restaurantId && !!keyword,
  });
};

export const useRestaurantInfoQuery = (restaurantId: string) => {
  return useQuery({
    queryKey: ['restaurant', restaurantId, 'info'],
    queryFn: () => getRestaurantInfo(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useAvailableSlotsQuery = (restaurantId: string, params: GetAvailableSlotsRequest) => {
  return useQuery({
    queryKey: ['restaurant', restaurantId, 'available-slots', params.date],
    queryFn: () => getAvailableSlots(restaurantId, params),
    enabled: !!restaurantId && !!params.date,
  });
};

export const useCreateReservationMutation = (restaurantId: string) => {
  return useMutation({
    mutationFn: (body: CreateReservationRequest) => createReservation(restaurantId, body),
  });
};

export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (restaurantId: string) => toggleLike(restaurantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', 'me'] });
    },
  });
};

export const useMyLikesQuery = (params?: GetMyLikesRequest) => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  return useQuery({
    queryKey: ['likes', 'me', params],
    queryFn: () => getMyLikes(params),
    enabled: isLoggedIn,
  });
};
