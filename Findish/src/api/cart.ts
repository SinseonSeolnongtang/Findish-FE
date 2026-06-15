import axiosInstance from '@/lib/axiosInstance';
import type { ApiResponse } from '@/types/auth';
import type {
  GetCartResponse,
  AddCartItemRequest,
  AddCartItemResponse,
  UpdateCartItemRequest,
  UpdateCartItemResponse,
  DeleteCartItemResponse,
  PlaceOrderResponse,
} from '@/types/cart';

// ─── 1. 장바구니 조회 ─────────────────────────────────────────────────────────
// GET /api/v1/cart
export const getCart = async ({ signal }: { signal: AbortSignal }) => {
  const { data } = await axiosInstance.get<ApiResponse<GetCartResponse>>('/api/v1/cart', { signal });
  return data.data;
};

// ─── 2. 메뉴 담기 ─────────────────────────────────────────────────────────────
// POST /api/v1/cart
export const addToCart = async (body: AddCartItemRequest) => {
  const { data } = await axiosInstance.post<ApiResponse<AddCartItemResponse>>('/api/v1/cart', body);
  return data;
};

// ─── 3. 수량 변경 ─────────────────────────────────────────────────────────────
// PATCH /api/v1/cart/{cartItemId}
export const updateCartQuantity = async (cartItemId: string, body: UpdateCartItemRequest) => {
  const { data } = await axiosInstance.patch<ApiResponse<UpdateCartItemResponse>>(`/api/v1/cart/${cartItemId}`, body);
  return data;
};

// ─── 4. 메뉴 삭제 ─────────────────────────────────────────────────────────────
// DELETE /api/v1/cart/{cartItemId}
export const deleteCartItem = async (cartItemId: string) => {
  const { data } = await axiosInstance.delete<ApiResponse<DeleteCartItemResponse>>(`/api/v1/cart/${cartItemId}`);
  return data;
};

// ─── 5. 주문하기 ──────────────────────────────────────────────────────────────
// POST /api/v1/cart/order
export const orderCart = async () => {
  const { data } = await axiosInstance.post<ApiResponse<PlaceOrderResponse>>('/api/v1/cart/order');
  return data.data;
};
