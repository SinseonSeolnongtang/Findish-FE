import { http, HttpResponse } from 'msw';
import type { ReservationItem, OrderItem } from '@/types/myPage';

const THUMBNAIL = 'https://placehold.co/120x120?text=식당';

const PENDING_RESERVATIONS: ReservationItem[] = [
  {
    reservationId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567801',
    restaurantId: 'r1b2c3d4-e5f6-7890-abcd-ef1234567801',
    restaurantName: '방목 2호점',
    thumbnailUrl: THUMBNAIL,
    date: '2026-06-10',
    time: '19:00',
    partySize: 4,
    status: 'PENDING',
    cancelReason: null,
  },
  {
    reservationId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567802',
    restaurantId: 'r1b2c3d4-e5f6-7890-abcd-ef1234567802',
    restaurantName: '고기굽는마을',
    thumbnailUrl: THUMBNAIL,
    date: '2026-06-15',
    time: '18:00',
    partySize: 2,
    status: 'PENDING',
    cancelReason: null,
  },
];

const COMPLETED_RESERVATIONS: ReservationItem[] = [
  {
    reservationId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567803',
    restaurantId: 'r1b2c3d4-e5f6-7890-abcd-ef1234567803',
    restaurantName: '청담 순두부',
    thumbnailUrl: THUMBNAIL,
    date: '2026-05-01',
    time: '12:00',
    partySize: 3,
    status: 'COMPLETED',
    cancelReason: null,
  },
  {
    reservationId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567804',
    restaurantId: 'r1b2c3d4-e5f6-7890-abcd-ef1234567804',
    restaurantName: '참치왕국',
    thumbnailUrl: THUMBNAIL,
    date: '2026-04-20',
    time: '20:00',
    partySize: 5,
    status: 'COMPLETED',
    cancelReason: null,
  },
];

const CANCELLED_RESERVATIONS: ReservationItem[] = [
  {
    reservationId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567805',
    restaurantId: 'r1b2c3d4-e5f6-7890-abcd-ef1234567801',
    restaurantName: '방목 2호점',
    thumbnailUrl: THUMBNAIL,
    date: '2026-04-10',
    time: '19:00',
    partySize: 2,
    status: 'CANCELLED',
    cancelReason: 'USER_CANCEL',
  },
  {
    reservationId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567806',
    restaurantId: 'r1b2c3d4-e5f6-7890-abcd-ef1234567805',
    restaurantName: '이자카야 하나',
    thumbnailUrl: THUMBNAIL,
    date: '2026-03-22',
    time: '20:30',
    partySize: 4,
    status: 'CANCELLED',
    cancelReason: 'NO_SHOW',
  },
];

const MOCK_ORDERS: OrderItem[] = [
  {
    orderId: 1,
    restaurantId: 101,
    restaurantName: '방목 2호점',
    thumbnailUrl: THUMBNAIL,
    items: [
      { name: '목살 완판(600g)', quantity: 2, price: 43900 },
      { name: '항정살(400g)', quantity: 1, price: 36900 },
    ],
    totalPrice: 124700,
    orderType: 'CART',
    orderedAt: '2026-05-10T18:30:00',
  },
  {
    orderId: 2,
    restaurantId: 102,
    restaurantName: '고기굽는마을',
    thumbnailUrl: THUMBNAIL,
    items: [
      { name: '삼겹살', quantity: 6, price: 15000 },
      { name: '오겹살', quantity: 6, price: 17000 },
    ],
    totalPrice: 192000,
    orderType: 'AGENT',
    orderedAt: '2026-05-08T19:00:00',
  },
  {
    orderId: 3,
    restaurantId: 103,
    restaurantName: '청담 순두부',
    thumbnailUrl: THUMBNAIL,
    items: [
      { name: '순두부찌개', quantity: 2, price: 9000 },
      { name: '공기밥', quantity: 2, price: 1000 },
    ],
    totalPrice: 20000,
    orderType: 'CART',
    orderedAt: '2026-05-05T12:10:00',
  },
  {
    orderId: 4,
    restaurantId: 104,
    restaurantName: '참치왕국',
    thumbnailUrl: THUMBNAIL,
    items: [{ name: '참치 특선 세트', quantity: 1, price: 85000 }],
    totalPrice: 85000,
    orderType: 'AGENT',
    orderedAt: '2026-04-28T20:00:00',
  },
];

export const myPageHandlers = [
  // 1. 예약 내역 조회 — status에 따라 분기
  http.get('/api/v1/members/me/reservations', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    let reservations: ReservationItem[];
    if (status === 'COMPLETED') {
      reservations = COMPLETED_RESERVATIONS;
    } else if (status === 'CANCELLED') {
      reservations = CANCELLED_RESERVATIONS;
    } else {
      reservations = PENDING_RESERVATIONS;
    }

    return HttpResponse.json({ totalCount: reservations.length, reservations });
  }),

  // 2. 예약 직접 취소
  http.patch('/api/v1/members/me/reservations/:reservationId/cancel', ({ params }) => {
    const reservationId = params.reservationId as string;
    return HttpResponse.json({ reservationId, status: 'CANCELLED', cancelReason: 'USER_CANCEL' });
  }),

  // 3. 주문 내역 조회 — CART / AGENT 혼합 데이터 반환
  http.get('/api/v1/members/me/orders', () => {
    return HttpResponse.json({ totalCount: MOCK_ORDERS.length, orders: MOCK_ORDERS });
  }),
];
