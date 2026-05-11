import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/v1/auth/login', () => {
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      tokenType: 'Bearer',
    });
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
];
