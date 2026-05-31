// ─── 공통 장바구니 아이템 ─────────────────────────────────────────────────────
export interface CartItemInfo {
  cartItemId: string;
  menuName: string;
  price: number;
  quantity: number;
  totalPrice?: number;
  imageUrl?: string;
}

// ─── 1. 장바구니 조회 ─────────────────────────────────────────────────────────
// GET /api/v1/cart
export interface GetCartResponse {
  cartId?: string;
  naverPlaceId?: string;
  restaurantName?: string;
  items?: CartItemInfo[];
  totalPrice?: number;
}

// ─── 2. 메뉴 담기 ─────────────────────────────────────────────────────────────
// POST /api/v1/cart
export interface AddCartItemRequest {
  naverPlaceId: string;
  menuName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}
export type AddCartItemResponse = GetCartResponse;

// ─── 3. 수량 변경 ─────────────────────────────────────────────────────────────
// PATCH /api/v1/cart/{cartItemId}
export interface UpdateCartItemRequest {
  quantity: number;
}
export interface UpdateCartItemResponse {
  cartItemId?: string;
  quantity?: number;
  totalPrice?: number;
}

// ─── 4. 메뉴 삭제 ─────────────────────────────────────────────────────────────
// DELETE /api/v1/cart/{cartItemId}
export interface DeleteCartItemResponse {
  totalCount?: number;
  totalPrice?: number;
}

// ─── 5. 주문하기 ──────────────────────────────────────────────────────────────
// POST /api/v1/cart/order
export interface OrderItemResult {
  name?: string;
  quantity?: number;
  price?: number;
}
export interface PlaceOrderResponse {
  orderId?: string;
  naverPlaceId?: string;
  items?: OrderItemResult[];
  totalPrice?: number;
}
