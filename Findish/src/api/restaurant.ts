import axiosInstance from '@/lib/axiosInstance';
import type {
  GetRestaurantResponse,
  GetAiSummaryResponse,
  GetMenusResponse,
  GetReviewsRequest,
  GetReviewsResponse,
  GetRestaurantInfoResponse,
  GetAvailableSlotsRequest,
  GetAvailableSlotsResponse,
  CreateReservationRequest,
  CreateReservationResponse,
} from '@/types/restaurant';

export const getRestaurantBasic = async (restaurantId: number): Promise<GetRestaurantResponse> => {
  const { data } = await axiosInstance.get<GetRestaurantResponse>(`/api/v1/restaurants/${restaurantId}`);
  return data;
};

export const getRestaurantAiSummary = async (restaurantId: number): Promise<GetAiSummaryResponse> => {
  const { data } = await axiosInstance.get<GetAiSummaryResponse>(`/api/v1/restaurants/${restaurantId}/ai-summary`);
  return data;
};

export const getRestaurantMenus = async (restaurantId: number): Promise<GetMenusResponse> => {
  const { data } = await axiosInstance.get<GetMenusResponse>(`/api/v1/restaurants/${restaurantId}/menus`);
  return data;
};

export const getRestaurantReviews = async (
  restaurantId: number,
  params: GetReviewsRequest,
): Promise<GetReviewsResponse> => {
  const { data } = await axiosInstance.get<GetReviewsResponse>(`/api/v1/restaurants/${restaurantId}/reviews`, {
    params,
  });
  return data;
};

export const getRestaurantInfo = async (restaurantId: number): Promise<GetRestaurantInfoResponse> => {
  const { data } = await axiosInstance.get<GetRestaurantInfoResponse>(`/api/v1/restaurants/${restaurantId}/info`);
  return data;
};

export const getAvailableSlots = async (
  restaurantId: number,
  params: GetAvailableSlotsRequest,
): Promise<GetAvailableSlotsResponse> => {
  const { data } = await axiosInstance.get<GetAvailableSlotsResponse>(
    `/api/v1/restaurants/${restaurantId}/reservations/available`,
    { params },
  );
  return data;
};

export const createReservation = async (
  restaurantId: number,
  body: CreateReservationRequest,
): Promise<CreateReservationResponse> => {
  const { data } = await axiosInstance.post<CreateReservationResponse>(
    `/api/v1/restaurants/${restaurantId}/reservations`,
    body,
  );
  return data;
};
