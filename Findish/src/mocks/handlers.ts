import { http, HttpResponse } from 'msw';

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
];
