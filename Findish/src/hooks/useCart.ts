import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCart, addToCart, updateCartQuantity, deleteCartItem, orderCart } from '@/api/cart';
import type { AddCartItemRequest, UpdateCartItemRequest } from '@/types/cart';

const CART_QUERY_KEY = ['cart'] as const;

export const useCartQuery = () => {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getCart,
  });
};

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddCartItemRequest) => addToCart(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

export const useUpdateCartQuantityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cartItemId, body }: { cartItemId: string; body: UpdateCartItemRequest }) =>
      updateCartQuantity(cartItemId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

export const useDeleteCartItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cartItemId: string) => deleteCartItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

export const useOrderCartMutation = () => {
  return useMutation({
    mutationFn: orderCart,
  });
};
