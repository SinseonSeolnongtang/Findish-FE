import { useMutation, useQuery } from '@tanstack/react-query';
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

export const useRestaurantBasicQuery = (restaurantId: number) => {
  return useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: () => getRestaurantBasic(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useRestaurantAiSummaryQuery = (restaurantId: number) => {
  return useQuery({
    queryKey: ['restaurant', restaurantId, 'ai-summary'],
    queryFn: () => getRestaurantAiSummary(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useRestaurantMenusQuery = (restaurantId: number) => {
  return useQuery({
    queryKey: ['restaurant', restaurantId, 'menus'],
    queryFn: () => getRestaurantMenus(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useRestaurantReviewsQuery = (restaurantId: number, params: GetReviewsRequest) => {
  return useQuery({
    queryKey: ['restaurant', restaurantId, 'reviews', params],
    queryFn: () => getRestaurantReviews(restaurantId, params),
    enabled: !!restaurantId,
  });
};

export const useRestaurantInfoQuery = (restaurantId: number) => {
  return useQuery({
    queryKey: ['restaurant', restaurantId, 'info'],
    queryFn: () => getRestaurantInfo(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useAvailableSlotsQuery = (restaurantId: number, params: GetAvailableSlotsRequest) => {
  return useQuery({
    queryKey: ['restaurant', restaurantId, 'available-slots', params.date],
    queryFn: () => getAvailableSlots(restaurantId, params),
    enabled: !!restaurantId && !!params.date,
  });
};

export const useCreateReservationMutation = (restaurantId: number) => {
  return useMutation({
    mutationFn: (body: CreateReservationRequest) => createReservation(restaurantId, body),
  });
};

export const useToggleLikeMutation = () => {
  return useMutation({
    mutationFn: (restaurantId: number) => toggleLike(restaurantId),
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
