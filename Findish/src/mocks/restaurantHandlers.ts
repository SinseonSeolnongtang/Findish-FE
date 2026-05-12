import { http, HttpResponse } from "msw";

const BASE = "/api/v1/restaurants/:restaurantId";

const MOCK_SEARCH_RESTAURANTS = [
  {
    restaurantId: 1,
    name: "착한돼지집",
    category: "삼겹살",
    address: "서울 성동구 왕십리로 123",
    lat: 37.5665,
    lng: 126.978,
    reviewCount: 500,
    distance: 400,
    thumbnailUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80",
    tags: ["#삼겹살", "#혼밥"],
    isOpen: true,
  },
  {
    restaurantId: 2,
    name: "고기굽는마을",
    category: "삼겹살",
    address: "서울 성북구 동선동 45",
    lat: 37.5831,
    lng: 127.0028,
    reviewCount: 600,
    distance: 820,
    thumbnailUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80",
    tags: ["#가성비", "#질좋은고기"],
    isOpen: true,
  },
  {
    restaurantId: 3,
    name: "방목",
    category: "삼겹살",
    address: "서울 성북구 삼선동 67",
    lat: 37.5752,
    lng: 127.0208,
    reviewCount: 500,
    distance: 1200,
    thumbnailUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80",
    tags: ["#고기구워주는", "#질좋은고기"],
    isOpen: true,
  },
  {
    restaurantId: 4,
    name: "육식주 혜화점",
    category: "한식",
    address: "서울 종로구 혜화동 89",
    lat: 37.5823,
    lng: 127.0018,
    reviewCount: 2000,
    distance: 1500,
    thumbnailUrl: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80",
    tags: ["#고기구워주는", "#질좋은고기"],
    isOpen: true,
  },
  {
    restaurantId: 5,
    name: "명삼 성신여대고깃집",
    category: "삼겹살",
    address: "서울 성북구 보문동 200",
    lat: 37.5778,
    lng: 127.023,
    reviewCount: 400,
    distance: 2100,
    thumbnailUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80",
    tags: ["#고기구워주는", "#뜨는맛집", "#가성비"],
    isOpen: true,
  },
  {
    restaurantId: 6,
    name: "방목 2호점",
    category: "삼겹살",
    address: "서울 성북구 정릉동 10",
    lat: 37.582,
    lng: 127.0255,
    reviewCount: 400,
    distance: 2500,
    thumbnailUrl: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80",
    tags: ["#가성비", "#질좋은고기"],
    isOpen: true,
  },
];

export const restaurantHandlers = [
  // 0. 키워드 검색 — /:restaurantId 패턴보다 반드시 앞에 위치해야 함
  http.get("/api/v1/restaurants/search", ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword") ?? "";
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 20);
    const sort = url.searchParams.get("sort");

    const lower = keyword.toLowerCase();
    const matched = keyword
      ? MOCK_SEARCH_RESTAURANTS.filter(
          (r) =>
            r.name.includes(keyword) ||
            r.category.includes(keyword) ||
            r.tags.some((t) => t.includes(lower)),
        )
      : MOCK_SEARCH_RESTAURANTS;

    const results = matched.length > 0 ? matched : MOCK_SEARCH_RESTAURANTS;

    const sorted = sort === "distance"
      ? [...results].sort((a, b) => a.distance - b.distance)
      : results;

    const start = page * size;
    const paginated = sorted.slice(start, start + size);

    return HttpResponse.json({
      totalCount: sorted.length,
      restaurants: paginated,
    });
  }),

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
