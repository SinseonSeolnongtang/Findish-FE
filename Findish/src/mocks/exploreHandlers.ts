import { http, HttpResponse } from "msw";
import type { SelectionItem } from "@/types/explore";

// in-memory 선택 목록 (POST/DELETE 간 상태 공유)
let selectionStore: SelectionItem[] = [];

const MOCK_RESTAURANTS = [
  {
    restaurantId: "550e8400-e29b-41d4-a716-446655440001",
    name: "착한돼지집",
    category: "삼겹살",
    address: "서울 마포구 망원동 123",
    distance: 350,
    priceRange: "10,000원 ~ 20,000원",
    lat: 37.5565,
    lng: 126.91,
    imageUrls: ["https://picsum.photos/seed/ex1/800/600"],
    tags: ["#삼겹살", "#혼밥"],
  },
  {
    restaurantId: "550e8400-e29b-41d4-a716-446655440002",
    name: "방목 1호점",
    category: "삼겹살",
    address: "서울 성북구 동선동 45",
    distance: 820,
    priceRange: "15,000원 ~ 25,000원",
    lat: 37.5891,
    lng: 127.016,
    imageUrls: ["https://picsum.photos/seed/ex2/800/600"],
    tags: ["#삼겹살", "#회식"],
  },
  {
    restaurantId: "550e8400-e29b-41d4-a716-446655440003",
    name: "방목 2호점",
    category: "삼겹살",
    address: "서울 성북구 삼선동 67",
    distance: 1200,
    priceRange: "20,000원 ~ 30,000원",
    lat: 37.5893,
    lng: 127.018,
    imageUrls: ["https://picsum.photos/seed/ex3/800/600"],
    tags: ["#삼겹살", "#데이트"],
  },
  {
    restaurantId: "550e8400-e29b-41d4-a716-446655440004",
    name: "명삼 성신여대고깃집",
    category: "고기구이",
    address: "서울 성북구 보문동 89",
    distance: 1500,
    priceRange: "15,000원 ~ 25,000원",
    lat: 37.592,
    lng: 127.02,
    imageUrls: ["https://picsum.photos/seed/ex6/800/600"],
    tags: ["#고기", "#가성비"],
  },
  {
    restaurantId: "550e8400-e29b-41d4-a716-446655440005",
    name: "서울 소금구이",
    category: "삼겹살",
    address: "서울 은평구 불광동 200",
    distance: 2100,
    priceRange: "12,000원 ~ 18,000원",
    lat: 37.6109,
    lng: 126.928,
    imageUrls: ["https://picsum.photos/seed/ex5/800/600"],
    tags: ["#소금구이", "#가성비"],
  },
  {
    restaurantId: "550e8400-e29b-41d4-a716-446655440006",
    name: "황금돼지",
    category: "삼겹살",
    address: "서울 종로구 인사동 10",
    distance: 2500,
    priceRange: "18,000원 ~ 28,000원",
    lat: 37.5741,
    lng: 126.9854,
    imageUrls: ["https://picsum.photos/seed/ex6/800/600"],
    tags: ["#삼겹살", "#접대"],
  },
  {
    restaurantId: "550e8400-e29b-41d4-a716-446655440007",
    name: "흑돼지 명가",
    category: "흑돼지",
    address: "서울 서대문구 창천동 55",
    distance: 3000,
    priceRange: "22,000원 ~ 35,000원",
    lat: 37.5595,
    lng: 126.9393,
    imageUrls: ["https://picsum.photos/seed/ex7/800/600"],
    tags: ["#흑돼지", "#프리미엄"],
  },
  {
    restaurantId: "550e8400-e29b-41d4-a716-446655440008",
    name: "이베리코 하우스",
    category: "이베리코",
    address: "서울 강남구 신사동 300",
    distance: 4200,
    priceRange: "30,000원 ~ 50,000원",
    lat: 37.524,
    lng: 127.0202,
    imageUrls: ["https://picsum.photos/seed/ex8/800/600"],
    tags: ["#이베리코", "#데이트"],
  },
];

export const exploreHandlers = [
  // 1. 자연어 검색
  http.get("/api/v1/explore/search", ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword") ?? "";

    const matched = keyword
      ? MOCK_RESTAURANTS.filter(
          (r) =>
            r.name.includes(keyword) ||
            r.category.includes(keyword) ||
            r.tags.some((t) => t.includes(keyword)),
        )
      : MOCK_RESTAURANTS;

    // 자연어 검색 mock: 매칭 없으면 전체 반환
    const results = matched.length > 0 ? matched : MOCK_RESTAURANTS;

    return HttpResponse.json({
      totalCount: results.length,
      restaurants: results,
    });
  }),

  // 2. 카드 AI 요약 (맛 / 분위기 / 서비스)
  http.get("/api/v1/explore/:restaurantId/card-summary", () => {
    return HttpResponse.json({
      taste: {
        summary: "삼겹살이 두껍고 잡내가 없어 맛있다는 평이 많아요.",
        positiveKeywords: ["#고기가두꺼움", "#잡내없음", "#육즙풍부"],
        negativeKeywords: ["#짠맛", "#양이적음"],
      },
      atmosphere: {
        summary:
          "성북천 앞에 위치해서 벚꽃과 함께 운치있는 식사를 즐길 수 있어요.",
        positiveKeywords: ["#활기넘치는분위기", "#산뜻"],
        negativeKeywords: ["#소음내부"],
      },
      service: {
        summary: "주문을 시켰을 때 직원분들이 서비스를 주신다는 리뷰가 많아요.",
        positiveKeywords: ["#친절함", "#서비스"],
        negativeKeywords: ["#대기시간", "#혼잡"],
      },
    });
  }),

  // 3. 식당 선택 (저장)
  http.post("/api/v1/explore/selections", async ({ request }) => {
    const body = (await request.json()) as { restaurantId: string };
    const restaurant = MOCK_RESTAURANTS.find(
      (r) => r.restaurantId === body.restaurantId,
    );

    if (
      restaurant &&
      !selectionStore.some((s) => s.restaurantId === body.restaurantId)
    ) {
      selectionStore.push({
        restaurantId: restaurant.restaurantId,
        name: restaurant.name,
        thumbnailUrl: restaurant.imageUrls[0] ?? "",
      });
    }

    return HttpResponse.json({
      selectedCount: selectionStore.length,
      isCompleted: selectionStore.length >= 3,
      selections: [...selectionStore],
    });
  }),

  // 4. 현재 선택목록 조회
  http.get("/api/v1/explore/selections", () => {
    return HttpResponse.json({
      selectedCount: selectionStore.length,
      isCompleted: selectionStore.length >= 3,
      selections: [...selectionStore],
    });
  }),

  // 5. 선택 취소
  http.delete("/api/v1/explore/selections/:restaurantId", ({ params }) => {
    const restaurantId = params.restaurantId as string;
    selectionStore = selectionStore.filter(
      (s) => s.restaurantId !== restaurantId,
    );

    return HttpResponse.json({
      selectedCount: selectionStore.length,
      isCompleted: selectionStore.length >= 3,
      selections: [...selectionStore],
    });
  }),

  // 6. 가게 비교 분석
  http.get("/api/v1/explore/analysis", () => {
    const selected = selectionStore.slice(0, 3);

    const restaurants = selected.map((s) => {
      const found = MOCK_RESTAURANTS.find((r) => r.restaurantId === s.restaurantId);
      return {
        restaurantId: s.restaurantId,
        name: s.name,
        category: found?.category ?? "기타",
        thumbnailUrl: s.thumbnailUrl,
        topKeywords: [
          { keyword: "청결도", positiveRatio: 88, negativeRatio: 12 },
          { keyword: "친절함", positiveRatio: 75, negativeRatio: 25 },
        ],
      };
    });

    const ids = selected.map((s) => s.restaurantId);

    const commonKeywords = [
      {
        keyword: "청결도",
        scores: ids.map((id, i) => ({ restaurantId: id, ratio: [88, 82, 90][i] ?? 80 })),
      },
      {
        keyword: "친절함",
        scores: ids.map((id, i) => ({ restaurantId: id, ratio: [75, 80, 72][i] ?? 70 })),
      },
      {
        keyword: "재방문의사",
        scores: ids.map((id, i) => ({ restaurantId: id, ratio: [70, 68, 74][i] ?? 65 })),
      },
    ];

    const tradeOffKeywords = [
      {
        keyword: "가성비",
        scores: ids.map((id, i) => ({ restaurantId: id, ratio: [90, 45, 60][i] ?? 50 })),
      },
      {
        keyword: "대기시간",
        scores: ids.map((id, i) => ({ restaurantId: id, ratio: [30, 80, 55][i] ?? 50 })),
      },
      {
        keyword: "양",
        scores: ids.map((id, i) => ({ restaurantId: id, ratio: [85, 40, 70][i] ?? 60 })),
      },
    ];

    return HttpResponse.json({
      restaurants,
      summary: {
        commonText:
          `공통점은 청결도와 친절함이 높다는 점입니다.\n재방문 의사를 중시한다면 ${selected[2]?.name ?? "세 번째 가게"}를 추천해요.`,
        tradeOffText:
          `가성비를 중시한다면 ${selected[0]?.name ?? "첫 번째 가게"}가 유리하고,\n대기 없이 빠른 식사를 원한다면 ${selected[0]?.name ?? "첫 번째 가게"}를 선택하세요.`,
      },
      commonKeywords,
      tradeOffKeywords,
    });
  }),
];
