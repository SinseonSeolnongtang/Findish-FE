import { http, HttpResponse } from "msw";

const BASE = "/api/v1/restaurants/:restaurantId";

export const restaurantHandlers = [
  // 1. 식당 기본 정보
  http.get(BASE, () => {
    return HttpResponse.json({
      restaurantId: 1,
      name: "미슐랭 한우 구이",
      category: "한식",
      address: "서울 강남구 테헤란로 123",
      lat: 37.5012,
      lng: 127.0396,
      rating: 4.7,
      reviewCount: 312,
      priceRange: "50,000~80,000원",
      businessHours: "11:30 - 22:00",
      isOpen: true,
      imageUrls: [
        "https://picsum.photos/seed/rest1/800/600",
        "https://picsum.photos/seed/rest2/800/600",
        "https://picsum.photos/seed/rest3/800/600",
      ],
      tags: ["한우", "프리미엄", "데이트", "접대"],
    });
  }),

  // 2. AI 요약
  http.get(`${BASE}/ai-summary`, () => {
    return HttpResponse.json({
      summary:
        "신선한 한우를 직화로 구워 육즙이 풍부하다는 평가가 많습니다. 직원들의 친절한 서비스와 깔끔한 인테리어로 데이트 및 접대 장소로 인기가 높습니다.",
      positiveKeywords: ["육즙", "신선", "친절", "깔끔", "분위기"],
      negativeKeywords: ["가격", "대기시간"],
      atmosphereTags: ["고급스러운", "조용한", "아늑한"],
      updatedAt: "2026-05-10T09:00:00.000Z",
    });
  }),

  // 3. 메뉴 목록
  http.get(`${BASE}/menus`, () => {
    return HttpResponse.json({
      menus: [
        {
          menuId: 1,
          name: "한우 꽃등심 200g",
          price: 65000,
          imageUrl: "https://picsum.photos/seed/menu1/400/300",
          description: "1++ 등급 한우 꽃등심을 직화로 구워드립니다.",
        },
        {
          menuId: 2,
          name: "한우 안심 150g",
          price: 72000,
          imageUrl: "https://picsum.photos/seed/menu2/400/300",
          description: "부드럽고 담백한 한우 안심.",
        },
        {
          menuId: 3,
          name: "된장찌개",
          price: 8000,
          imageUrl: "https://picsum.photos/seed/menu3/400/300",
          description: "직접 담근 된장으로 끓인 구수한 찌개.",
        },
        {
          menuId: 4,
          name: "공기밥",
          price: 2000,
          imageUrl: "https://picsum.photos/seed/menu4/400/300",
          description: "",
        },
      ],
    });
  }),

  // 4. 리뷰 목록
  http.get(`${BASE}/reviews`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const size = Number(url.searchParams.get("size") ?? 10);

    const allReviews = Array.from({ length: 25 }, (_, i) => ({
      reviewId: i + 1,
      author: `리뷰어${i + 1}`,
      content:
        i % 3 === 0
          ? "고기 퀄리티가 정말 최고입니다. 다음에도 꼭 방문하고 싶어요!"
          : i % 3 === 1
            ? "가격이 좀 있지만 그만한 가치가 있어요. 서비스도 훌륭합니다."
            : "분위기가 너무 좋아서 기념일에 딱 맞는 식당이에요.",
      imageUrls:
        i % 4 === 0 ? [`https://picsum.photos/seed/review${i}/400/300`] : [],
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      source: i % 5 === 0 ? "NAVER" : "KAKAO",
    }));

    const start = (page - 1) * size;
    return HttpResponse.json({
      totalCount: allReviews.length,
      reviews: allReviews.slice(start, start + size),
    });
  }),

  // 5. 가게 상세 정보
  http.get(`${BASE}/info`, () => {
    return HttpResponse.json({
      address: "서울 강남구 테헤란로 123 1층",
      phone: "02-1234-5678",
      businessHours: [
        { day: "월", hours: "11:30 - 22:00", isHoliday: false },
        { day: "화", hours: "11:30 - 22:00", isHoliday: false },
        { day: "수", hours: "11:30 - 22:00", isHoliday: false },
        { day: "목", hours: "11:30 - 22:00", isHoliday: false },
        { day: "금", hours: "11:30 - 23:00", isHoliday: false },
        { day: "토", hours: "12:00 - 23:00", isHoliday: false },
        { day: "일", hours: "", isHoliday: true },
      ],
      facilities: ["주차가능", "단체석", "개인룸", "와이파이", "반려동물 불가"],
      naverUrl: "https://map.naver.com/v5/entry/place/123456789",
      kakaoUrl: "https://place.map.kakao.com/987654321",
    });
  }),

  // 6. 예약 가능 날짜/시간
  http.get(`${BASE}/reservations/available`, ({ request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get("date") ?? "2026-05-15";
    const isHoliday = new Date(date).getDay() === 0;

    return HttpResponse.json({
      date,
      isHoliday,
      maxPartySize: 8,
      slots: isHoliday
        ? []
        : [
            "12:00",
            "12:30",
            "13:00",
            "18:00",
            "18:30",
            "19:00",
            "19:30",
            "20:00",
          ],
    });
  }),

  // 7. 예약 확정
  http.post(`${BASE}/reservations`, async ({ request }) => {
    const body = (await request.json()) as {
      date: string;
      time: string;
      partySize: number;
    };
    return HttpResponse.json(
      {
        reservationId: Math.floor(Math.random() * 10000),
        restaurantName: "미슐랭 한우 구이",
        date: body.date,
        time: body.time,
        partySize: body.partySize,
        status: "CONFIRMED",
        calendarSaved: false,
      },
      { status: 201 },
    );
  }),
];
