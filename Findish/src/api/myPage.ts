import axiosInstance from '@/lib/axiosInstance';
import type {
  GetReservationsRequest,
  ReservationsResponse,
  CancelReservationResponse,
  GetOrdersRequest,
  OrdersResponse,
} from '@/types/myPage';

export const getMyReservations = async (params?: GetReservationsRequest): Promise<ReservationsResponse> => {
  const { data } = await axiosInstance.get<ReservationsResponse>('/api/v1/members/me/reservations', { params });
  return data;
};

export const cancelMyReservation = async (reservationId: number): Promise<CancelReservationResponse> => {
  const { data } = await axiosInstance.patch<CancelReservationResponse>(
    `/api/v1/members/me/reservations/${reservationId}/cancel`,
  );
  return data;
};

export const getMyOrders = async (params?: GetOrdersRequest): Promise<OrdersResponse> => {
  const { data } = await axiosInstance.get<OrdersResponse>('/api/v1/members/me/orders', { params });
  return data;
};
