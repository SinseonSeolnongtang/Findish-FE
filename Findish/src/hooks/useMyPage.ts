import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyReservations, cancelMyReservation, getMyOrders } from '@/api/myPage';
import type { ReservationStatus } from '@/types/myPage';

const MY_RESERVATIONS_QUERY_KEY = ['my-reservations'] as const;
const MY_ORDERS_QUERY_KEY = ['my-orders'] as const;

export const useMyReservationsQuery = (status: ReservationStatus, page?: number, size?: number) => {
  return useQuery({
    queryKey: [...MY_RESERVATIONS_QUERY_KEY, status, page, size],
    queryFn: () => getMyReservations({ status, page, size }),
  });
};

export const useMyOrdersQuery = (page?: number, size?: number) => {
  return useQuery({
    queryKey: [...MY_ORDERS_QUERY_KEY, page, size],
    queryFn: () => getMyOrders({ page, size }),
  });
};

export const useCancelReservationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reservationId: string) => cancelMyReservation(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_RESERVATIONS_QUERY_KEY });
    },
  });
};
