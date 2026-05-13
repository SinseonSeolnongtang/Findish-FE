import { http, HttpResponse } from 'msw';
import type { CartItem } from '@/types/cart';
import { MOCK_MENUS, MOCK_SEARCH_RESTAURANTS } from './restaurantHandlers';

// ─── 인메모리 장바구니 상태 ────────────────────────────────────────────────────
let nextCartItemId = 1;
let mockCartItems: CartItem[] = [];
let mockCartRestaurant = { restaurantId: 0, restaurantName: '' };

const calcTotalPrice = () => mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
const calcTotalCount = () => mockCartItems.reduce((sum, item) => sum + item.quantity, 0);

export const cartHandlers = [
  // 5. 주문하기 — /api/v1/cart POST 보다 앞에 배치
  http.post('/api/v1/cart/order', () => {
    const orderedItems = mockCartItems.map(({ name, quantity, price }) => ({ name, quantity, price }));
    const totalPrice = calcTotalPrice();

    mockCartItems = [];

    return HttpResponse.json(
      {
        orderId: Math.floor(Math.random() * 100000),
        restaurantName: mockCartRestaurant.restaurantName,
        items: orderedItems,
        totalPrice,
      },
      { status: 201 },
    );
  }),

  // 1. 장바구니 조회
  http.get('/api/v1/cart', () => {
    return HttpResponse.json({
      ...mockCartRestaurant,
      items: mockCartItems,
      totalPrice: calcTotalPrice(),
    });
  }),

  // 2. 메뉴 담기
  http.post('/api/v1/cart', async ({ request }) => {
    const body = (await request.json()) as { restaurantId: number; menuId: number; quantity: number };

    // 식당 변경 시 장바구니 초기화
    if (mockCartRestaurant.restaurantId !== body.restaurantId) {
      mockCartItems = [];
      const restaurant = MOCK_SEARCH_RESTAURANTS.find((r) => r.restaurantId === body.restaurantId);
      mockCartRestaurant = {
        restaurantId: body.restaurantId,
        restaurantName: restaurant?.name ?? `식당 ${body.restaurantId}`,
      };
    }

    const menu = MOCK_MENUS.find((m) => m.menuId === body.menuId);
    const existing = mockCartItems.find((item) => item.menuId === body.menuId);

    if (existing) {
      existing.quantity += body.quantity;
      return HttpResponse.json(
        { cartItemId: existing.cartItemId, totalCount: calcTotalCount(), totalPrice: calcTotalPrice() },
        { status: 200 },
      );
    }

    const cartItemId = nextCartItemId++;
    mockCartItems.push({
      cartItemId,
      menuId: body.menuId,
      name: menu?.name ?? `메뉴 ${body.menuId}`,
      price: menu?.price ?? 0,
      quantity: body.quantity,
      imageUrl: menu?.imageUrl ?? '',
    });

    return HttpResponse.json(
      { cartItemId, totalCount: calcTotalCount(), totalPrice: calcTotalPrice() },
      { status: 201 },
    );
  }),

  // 3. 수량 변경
  http.patch('/api/v1/cart/:cartItemId', async ({ params, request }) => {
    const cartItemId = Number(params.cartItemId);
    const { quantity } = (await request.json()) as { quantity: number };
    const item = mockCartItems.find((i) => i.cartItemId === cartItemId);

    if (!item) return HttpResponse.json({ message: '항목을 찾을 수 없습니다.' }, { status: 404 });

    item.quantity = quantity;
    return HttpResponse.json({ cartItemId, quantity, totalPrice: calcTotalPrice() });
  }),

  // 4. 메뉴 삭제
  http.delete('/api/v1/cart/:cartItemId', ({ params }) => {
    const cartItemId = Number(params.cartItemId);
    mockCartItems = mockCartItems.filter((i) => i.cartItemId !== cartItemId);
    return HttpResponse.json({ totalCount: calcTotalCount(), totalPrice: calcTotalPrice() });
  }),
];
