import { http, HttpResponse } from 'msw';
import { likedRestaurantIds, MOCK_SEARCH_RESTAURANTS } from './restaurantHandlers';

export const handlers = [
  // Auth
  http.post('/api/v1/auth/login', async ({ request }) => {
    const body = await request.json() as { loginId: string; password: string };
    if (body.loginId === 'testuser' && body.password === 'abc123!@#') {
      return HttpResponse.json({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        tokenType: 'Bearer',
      });
    }
    return HttpResponse.json(
      { message: '아이디 또는 비밀번호가 올바르지 않습니다.' },
      { status: 401 },
    );
  }),

  http.post('/api/v1/auth/reissue', () => {
    return HttpResponse.json({
      accessToken: 'new-mock-access-token',
      refreshToken: 'new-mock-refresh-token',
      tokenType: 'Bearer',
    });
  }),

  http.post('/api/v1/auth/logout', () => {
    return HttpResponse.json({
      message: '성공적으로 로그아웃 되었습니다.',
    });
  }),

  // Members
  http.get('/api/v1/members/check-id', () => {
    return HttpResponse.json({ isDuplicated: false });
  }),

  http.get('/api/v1/members/me', () => {
    return HttpResponse.json({
      memberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      loginId: 'mockuser123',
      name: '홍길동',
      email: 'mock@example.com',
      loginType: 'LOCAL',
      isLoginIdEditable: true,
    });
  }),

  http.post('/api/v1/members/join', () => {
    return HttpResponse.json(
      {
        memberId: 1,
        loginId: 'mock-user',
        name: '테스트 유저',
        email: 'mock@findish.com',
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  }),

  http.patch('/api/v1/members/me', async ({ request }) => {
    const body = await request.json() as { loginId?: string; name?: string };
    return HttpResponse.json({
      memberId: 1,
      loginId: body.loginId ?? 'mockuser123',
      name: body.name ?? '홍길동',
      email: 'mock@example.com',
      isLoginIdEditable: true,
      updatedAt: new Date().toISOString(),
    });
  }),

  // 좋아요 목록 조회
  http.get('/api/v1/members/me/likes', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);

    const liked = MOCK_SEARCH_RESTAURANTS.filter((r) =>
      likedRestaurantIds.has(String(r.restaurantId)),
    ).map((r) => ({
      restaurantId: String(r.restaurantId),
      name: r.name,
      category: r.category,
      address: r.address,
      thumbnailUrl: r.thumbnailUrl,
      likedAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
    }));

    const start = page * size;
    return HttpResponse.json({
      totalCount: liked.length,
      restaurants: liked.slice(start, start + size),
    });
  }),
];
