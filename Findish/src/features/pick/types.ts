export type Section = "home" | "taste" | "vibe" | "service";

export interface Restaurant {
  id: number;
  name: string;
  category: string;
  distance: string;
  station: string;
  priceRange: string;
  keywords: string[];
  positiveKeywords: string[];
  negativeKeywords: string[];
  tasteSummary: string;
  vibeSummary: string;
  serviceSummary: string;
  imageUrl: string;
  tasteImages: string[];
  vibeImage: string;
  serviceImage: string;
  currentIndex: number;
  total: number;
  lat?: number;
  lng?: number;
}

export const SECTIONS: { key: Section; label: string }[] = [
  { key: "home", label: "홈" },
  { key: "taste", label: "맛" },
  { key: "vibe", label: "분위기" },
  { key: "service", label: "서비스" },
];

export const MOCK_LIST: Restaurant[] = [
  {
    id: 1,
    name: "명삼 성신여대고깃집",
    category: "한식",
    distance: "5.8km",
    station: "성신여대입구역 도보 5분",
    lat: 37.5921,
    lng: 127.0162,
    priceRange: "15,000원 ~ 20,000원",
    keywords: ["#고기", "#성신여대", "#회식"],
    positiveKeywords: ["#육즙", "#양많아요"],
    negativeKeywords: ["#대기", "#주차"],
    tasteSummary: "육즙이 풍부하고 고기 양이 많다는 평이 많아요.",
    vibeSummary: "가성비로 즐기는 풍성한 고기 파티",
    serviceSummary: "직원들이 친절하게 구워주시는 편이에요.",
    imageUrl:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&q=80",
    tasteImages: [
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=300&q=80",
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&q=80",
    ],
    vibeImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
    serviceImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    currentIndex: 1,
    total: 40,
  },
  {
    id: 2,
    name: "방목 2호점",
    category: "한식",
    distance: "2.5km",
    station: "한성대입구역 도보 5분",
    lat: 37.5882,
    lng: 127.0154,
    priceRange: "20,000원 ~ 30,000원",
    keywords: ["#삼겹살", "#성북천", "#서울야경"],
    positiveKeywords: ["#육즙", "#두꺼워요"],
    negativeKeywords: ["#가격", "#대기"],
    tasteSummary: "삼겹살이 두껍고 잡내가 없어 맛있다는 평이 많아요.",
    vibeSummary: "직원이 구워주는 성북천 근처 삼겹살 맛집",
    serviceSummary:
      "주류를 시켰을 때 직원 분들이 서비스를 주신다는 리뷰가 많았어요.",
    imageUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    tasteImages: [
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=300&q=80",
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&q=80",
    ],
    vibeImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
    serviceImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    currentIndex: 2,
    total: 40,
  },
  {
    id: 3,
    name: "홍대 라멘 본가",
    category: "일식",
    distance: "3.1km",
    station: "홍대입구역 도보 8분",
    lat: 37.5570,
    lng: 126.9247,
    priceRange: "12,000원 ~ 16,000원",
    keywords: ["#라멘", "#홍대", "#혼밥"],
    positiveKeywords: ["#진한국물", "#고기많아요"],
    negativeKeywords: ["#웨이팅", "#좁아요"],
    tasteSummary: "진하고 깊은 국물 맛이 일품이라는 리뷰가 많아요.",
    vibeSummary: "진한 돈코츠 라멘 한 그릇의 행복",
    serviceSummary: "혼밥하기 편한 카운터 자리가 있어 1인 손님도 환영해요.",
    imageUrl:
      "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80",
    tasteImages: [
      "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=300&q=80",
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&q=80",
    ],
    vibeImage:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
    serviceImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    currentIndex: 3,
    total: 40,
  },
  {
    id: 4,
    name: "이태원 버거클럽",
    category: "양식",
    distance: "4.3km",
    station: "이태원역 도보 3분",
    lat: 37.5349,
    lng: 126.9942,
    priceRange: "18,000원 ~ 25,000원",
    keywords: ["#수제버거", "#이태원", "#브런치"],
    positiveKeywords: ["#두꺼운패티", "#바삭한번"],
    negativeKeywords: ["#가격", "#주차"],
    tasteSummary: "두꺼운 패티와 신선한 재료로 만든 수제버거가 인기예요.",
    vibeSummary: "이태원에서 즐기는 정통 아메리칸 버거",
    serviceSummary: "주문 후 직접 만들어주는 핸드메이드 버거로 항상 신선해요.",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    tasteImages: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&q=80",
    ],
    vibeImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
    serviceImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    currentIndex: 4,
    total: 40,
  },
  {
    id: 5,
    name: "마포 순대국밥",
    category: "한식",
    distance: "1.2km",
    station: "마포역 도보 2분",
    lat: 37.5387,
    lng: 126.9480,
    priceRange: "8,000원 ~ 12,000원",
    keywords: ["#순대국밥", "#마포", "#해장"],
    positiveKeywords: ["#진한국물", "#가성비"],
    negativeKeywords: ["#냄새", "#협소"],
    tasteSummary: "진하고 구수한 국물이 해장에 딱이라는 평이 많아요.",
    vibeSummary: "24시간 운영하는 든든한 순대국밥 한 그릇",
    serviceSummary:
      "24시간 운영으로 언제든 방문 가능하고 회전이 빠른 편이에요.",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    tasteImages: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80",
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&q=80",
    ],
    vibeImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
    serviceImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    currentIndex: 5,
    total: 40,
  },
];

export const MOCK = MOCK_LIST[0];
