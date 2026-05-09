export const MOCK_REVIEWS: { text: string; date: string }[] = [
  { text: "검색해서 찾아갔는데, 추천 메뉴가 너무 맛있네요. 직원분도 친절하셔서 기분좋게 식사하고 왔습니다.", date: "2026.03.05" },
  { text: "사장님이 너무 친절하십니다. 서비스 감사합니다. 다음에 또 올게요~", date: "2026.03.05" },
  { text: "고기가 정말 신선해요! 당일 입고된 재료만 쓴다고 하더라고요.", date: "2026.03.05" },
  { text: "분위기 존좋. 사장님이 맛있고 고기가 친절해요. 번창하세요❤️", date: "2026.03.05" },
  { text: "채소도 다 신선하고 고기 퀄리티가 너무 좋아요.", date: "2026.03.03" },
  { text: "전반적으로 만족스러운 식사였습니다. 또 방문할 것 같아요.", date: "2026.03.01" },
  { text: "직원이 좀 불친절했어요. 음식은 맛있는데 서비스가 아쉽네요.", date: "2026.03.04" },
  { text: "환기가 잘 안 돼서 옷에 냄새가 너무 배요. 환기 시설을 개선해줬으면 해요.", date: "2026.03.04" },
  { text: "가격 대비 양이 너무 적어요. 배가 안 찼습니다.", date: "2026.02.28" },
];

export const MOCK_MENUS = [
  { name: "모듬한판 (600g)", price: 41900 },
  { name: "생삼겹살 (180g)", price: 16800 },
  { name: "특 목살 (180g)", price: 16800 },
];

export type ReviewSentiment = "positive" | "negative";

export interface AiReviewTag {
  label: string;
  sentiment: ReviewSentiment;
  reviews: { text: string; date: string }[];
}

export const AI_REVIEW_TAGS: AiReviewTag[] = [
  {
    label: "친절한",
    sentiment: "positive",
    reviews: [
      { text: "검색해서 찾아갔는데, 추천 메뉴가 너무 맛있네요. 직원분도 친절하셔서 기분좋게 식사하고 왔습니다.", date: "2026.03.05" },
      { text: "사장님이 너무 친절하십니다. 서비스 감사합니다. 다음에 또 올게요~", date: "2026.03.05" },
      { text: "분위기 존좋. 사장님이 맛있고 고기가 친절해요. 번창하세요❤️", date: "2026.03.05" },
    ],
  },
  {
    label: "불친절한",
    sentiment: "negative",
    reviews: [
      { text: "직원이 좀 불친절했어요. 음식은 맛있는데 서비스가 아쉽네요.", date: "2026.03.04" },
      { text: "주문할 때 무시하는 느낌이 들어서 기분이 별로였어요.", date: "2026.03.02" },
    ],
  },
  {
    label: "신선한",
    sentiment: "positive",
    reviews: [
      { text: "고기가 정말 신선해요! 당일 입고된 재료만 쓴다고 하더라고요.", date: "2026.03.05" },
      { text: "채소도 다 신선하고 고기 퀄리티가 너무 좋아요.", date: "2026.03.03" },
    ],
  },
  {
    label: "좋은말",
    sentiment: "positive",
    reviews: [
      { text: "사장님이 항상 좋은 말씀 해주셔서 기분 좋게 식사했어요.", date: "2026.03.05" },
    ],
  },
  {
    label: "좋은키워드",
    sentiment: "positive",
    reviews: [
      { text: "전반적으로 만족스러운 식사였습니다. 또 방문할 것 같아요.", date: "2026.03.01" },
    ],
  },
  {
    label: "부정키워드",
    sentiment: "negative",
    reviews: [
      { text: "가격 대비 양이 너무 적어요. 배가 안 찼습니다.", date: "2026.02.28" },
    ],
  },
  {
    label: "냄새남",
    sentiment: "negative",
    reviews: [
      { text: "환기가 잘 안 돼서 옷에 냄새가 너무 배요. 환기 시설을 개선해줬으면 해요.", date: "2026.03.04" },
      { text: "맛은 있는데 냄새가 너무 심해서 꺼려지네요.", date: "2026.03.01" },
    ],
  },
];
