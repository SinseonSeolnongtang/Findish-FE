// ─── 0. 공통 ──────────────────────────────────────────────────────────────────
export interface CartItem {
  cartItemId: number;
  menuId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

// ─── 1. 장바구니 조회 ─────────────────────────────────────────────────────────
// GET /api/v1/cart
export interface GetCartResponse {
  restaurantId: number;
  restaurantName: string;
  items: CartItem[];
  totalPrice: number;
}

// ─── 2. 메뉴 담기 ─────────────────────────────────────────────────────────────
// POST /api/v1/cart
export interface AddCartItemRequest {
  restaurantId: number;
  menuId: number;
  quantity: number;
}
export interface AddCartItemResponse {
  cartItemId: number;
  totalCount: number;
  totalPrice: number;
}

// ─── 3. 수량 변경 ─────────────────────────────────────────────────────────────
// PATCH /api/v1/cart/{cartItemId}
export interface UpdateCartItemRequest {
  quantity: number;
}
export interface UpdateCartItemResponse {
  cartItemId: number;
  quantity: number;
  totalPrice: number;
}

// ─── 4. 메뉴 삭제 ─────────────────────────────────────────────────────────────
// DELETE /api/v1/cart/{cartItemId}
export interface DeleteCartItemResponse {
  totalCount: number;
  totalPrice: number;
}

// ─── 5. 주문하기 ──────────────────────────────────────────────────────────────
// POST /api/v1/cart/order
export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}
export interface PlaceOrderResponse {
  orderId: number;
  restaurantName: string;
  items: OrderItem[];
  totalPrice: number;
}
