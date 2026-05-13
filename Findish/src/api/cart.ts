import axiosInstance from '@/lib/axiosInstance';
import type {
  GetCartResponse,
  AddCartItemRequest,
  AddCartItemResponse,
  UpdateCartItemRequest,
  UpdateCartItemResponse,
  DeleteCartItemResponse,
  PlaceOrderResponse,
} from '@/types/cart';

export const getCart = async (): Promise<GetCartResponse> => {
  const { data } = await axiosInstance.get<GetCartResponse>('/api/v1/cart');
  return data;
};

export const addToCart = async (body: AddCartItemRequest): Promise<AddCartItemResponse> => {
  const { data } = await axiosInstance.post<AddCartItemResponse>('/api/v1/cart', body);
  return data;
};

export const updateCartQuantity = async (
  cartItemId: number,
  body: UpdateCartItemRequest,
): Promise<UpdateCartItemResponse> => {
  const { data } = await axiosInstance.patch<UpdateCartItemResponse>(`/api/v1/cart/${cartItemId}`, body);
  return data;
};

export const deleteCartItem = async (cartItemId: number): Promise<DeleteCartItemResponse> => {
  const { data } = await axiosInstance.delete<DeleteCartItemResponse>(`/api/v1/cart/${cartItemId}`);
  return data;
};

export const orderCart = async (): Promise<PlaceOrderResponse> => {
  const { data } = await axiosInstance.post<PlaceOrderResponse>('/api/v1/cart/order');
  return data;
};
