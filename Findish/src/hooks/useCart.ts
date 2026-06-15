import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCart, addToCart, updateCartQuantity, deleteCartItem, orderCart } from '@/api/cart';
import type { AddCartItemRequest, UpdateCartItemRequest, GetCartResponse } from '@/types/cart';

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
    onMutate: async ({ cartItemId, body }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<GetCartResponse>(CART_QUERY_KEY);
      queryClient.setQueryData<GetCartResponse>(CART_QUERY_KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items?.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity: body.quantity } : item,
          ),
        };
      });
      return { previousCart };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
    },
    onSettled: () => {
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
