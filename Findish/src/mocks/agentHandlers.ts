import { http, HttpResponse } from 'msw';
import type { SendMessageRequest, ConfirmReservationRequest, ConfirmOrderRequest } from '@/types/agent';

const MOCK_RESTAURANT_NAME = '방목 2호점';
const MOCK_MENUS = [
  { menuId: 1, name: '목살 완판(600g)', price: 43900, imageUrl: 'https://placehold.co/80x80?text=목살' },
  { menuId: 2, name: '항정살(400g)', price: 36900, imageUrl: 'https://placehold.co/80x80?text=항정' },
  { menuId: 3, name: '삼겹살(400g)', price: 32900, imageUrl: 'https://placehold.co/80x80?text=삼겹' },
];

const MOCK_CHAT_HISTORY = [
  { role: 'USER', content: '6/5 20시에 방목 2호점으로 5명 예약해줘', createdAt: '2026-05-01T10:00:00' },
  { role: 'AGENT', content: '삼겹살이 유명한 방목을 가실 예정이군요! 방목 2호점으로 5명 예약해드릴까요?', createdAt: '2026-05-01T10:00:01' },
];

export const agentHandlers = [
  // 1. 메시지 전송 — 키워드 기반 분기 응답
  http.post('/api/v1/agent/chat', async ({ request }) => {
    const { message } = (await request.json()) as SendMessageRequest;

    if (message.includes('예약 취소')) {
      return HttpResponse.json({
        message: `${MOCK_RESTAURANT_NAME} 예약을 취소할까요?`,
        intent: 'CANCEL_RESERVATION',
        step: 'CONFIRMING',
        targetId: 1,
        reservation: null,
        menus: null,
      });
    }

    if (message.includes('주문 취소') || message.includes('취소')) {
      return HttpResponse.json({
        message: `${MOCK_RESTAURANT_NAME} 주문을 취소할까요?`,
        intent: 'CANCEL_ORDER',
        step: 'CONFIRMING',
        targetId: 2,
        reservation: null,
        menus: null,
      });
    }

    if (message.includes('예약')) {
      return HttpResponse.json({
        message: `${MOCK_RESTAURANT_NAME}으로 5명 예약할까요?`,
        intent: 'RESERVATION',
        step: 'CONFIRMING',
        targetId: null,
        reservation: {
          reservationId: null,
          restaurantName: MOCK_RESTAURANT_NAME,
          date: '2026-06-05',
          time: '20:00',
          partySize: 5,
        },
        menus: null,
      });
    }

    if (message.includes('주문')) {
      return HttpResponse.json({
        message: `${MOCK_RESTAURANT_NAME} 주문을 확정할까요?`,
        intent: 'ORDER',
        step: 'CONFIRMING',
        targetId: null,
        reservation: null,
        menus: [MOCK_MENUS[0]],
      });
    }

    if (message.includes('추천')) {
      return HttpResponse.json({
        message: `${MOCK_RESTAURANT_NAME} 대표 메뉴입니다.`,
        intent: 'MENU_RECOMMEND',
        step: 'COLLECTING',
        targetId: null,
        reservation: null,
        menus: MOCK_MENUS,
      });
    }

    return HttpResponse.json({
      message: '무엇을 도와드릴까요? 예약, 주문, 메뉴 추천, 취소 등을 말씀해 주세요.',
      intent: 'GENERAL',
      step: 'COLLECTING',
      targetId: null,
      reservation: null,
      menus: null,
    });
  }),

  // 2. 예약 확정
  http.post('/api/v1/agent/reservations', async ({ request }) => {
    const body = (await request.json()) as ConfirmReservationRequest;
    return HttpResponse.json(
      {
        reservationId: 1,
        restaurantName: MOCK_RESTAURANT_NAME,
        date: body.date,
        time: body.time,
        partySize: body.partySize,
        calendarEventId: body.saveToCalendar ? 'google_event_mock_id' : null,
      },
      { status: 201 },
    );
  }),

  // 3. 주문 확정
  http.post('/api/v1/agent/orders', async ({ request }) => {
    const body = (await request.json()) as ConfirmOrderRequest;
    const items = body.items.map(({ menuId, quantity }) => {
      const menu = MOCK_MENUS.find((m) => m.menuId === menuId);
      return { name: menu?.name ?? `메뉴 ${menuId}`, quantity, price: menu?.price ?? 0 };
    });
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return HttpResponse.json(
      { orderId: 1, restaurantName: MOCK_RESTAURANT_NAME, items, totalPrice },
      { status: 201 },
    );
  }),

  // 4. 대화 내역 조회
  http.get('/api/v1/agent/chat/history', () => {
    return HttpResponse.json({ messages: MOCK_CHAT_HISTORY });
  }),

  // 5. 예약 취소
  http.patch('/api/v1/agent/reservations/:reservationId/cancel', ({ params }) => {
    const reservationId = Number(params.reservationId);
    return HttpResponse.json({ reservationId, status: 'CANCELLED' });
  }),

  // 6. 주문 취소
  http.patch('/api/v1/agent/orders/:orderId/cancel', ({ params }) => {
    const orderId = Number(params.orderId);
    return HttpResponse.json({ orderId, status: 'CANCELLED' });
  }),
];
