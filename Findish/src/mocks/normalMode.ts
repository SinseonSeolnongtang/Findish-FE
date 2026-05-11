import { type StoreCardData } from "@/components/common/StoreCard";

export const MOCK_RESTAURANTS: StoreCardData[] = [
  {
    id: 1,
    name: "고기굽는마을",
    category: "한식",
    isOpen: true,
    reviewCount: "600+",
    rating: 4.5,
    summary: "오징어사리로 완성되는 특별한 맛",
    keywords: ["#가성비", "#질좋은고기", "#고기가두껍"],
    imageUrl:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&q=80",
    lat: 37.5831,
    lng: 127.0028,
  },
  {
    id: 2,
    name: "방목",
    category: "한식",
    isOpen: true,
    reviewCount: "500+",
    rating: 4.4,
    summary: "육즙이 살아있는 두툼한 목살의 매력",
    keywords: ["#고기구워주는", "#찔좋은고기"],
    imageUrl:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&q=80",
    lat: 37.5752,
    lng: 127.0208,
  },
  {
    id: 3,
    name: "착한돼지집",
    category: "한식",
    isOpen: false,
    reviewCount: "300+",
    rating: 4.6,
    summary: "제주 흑돼지 돈마호크의 특별한 맛",
    keywords: ["#돈마호크", "#제주흑돼지", "#가성비"],
    imageUrl:
      "https://images.unsplash.com/photo-1558030006-450675393462?w=200&q=80",
    lat: 37.5858,
    lng: 127.0015,
  },
  {
    id: 4,
    name: "육식주 혜화점",
    category: "한식",
    isOpen: true,
    reviewCount: "2,000+",
    rating: 5.0,
    summary: "밑반찬과 함께 즐기는 고기 한 상",
    keywords: ["#고기구워주는", "#질좋은고기"],
    imageUrl:
      "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=200&q=80",
    lat: 37.5823,
    lng: 127.0018,
  },
  {
    id: 5,
    name: "명삼 성신여대고깃집",
    category: "한식",
    isOpen: true,
    reviewCount: "400+",
    rating: 4.6,
    summary: "가성비로 즐기는 풍성한 고기 파티",
    keywords: ["#고기구워주는", "#뜨는맛집", "#가성비"],
    imageUrl:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&q=80",
    lat: 37.5778,
    lng: 127.0230,
  },
  {
    id: 6,
    name: "방목 2호점",
    category: "한식",
    isOpen: true,
    reviewCount: "400+",
    rating: 4.2,
    summary: "벚꽃뷰와 함께하는 낭만적인 식사",
    keywords: ["#가성비", "#질좋은고기", "#고기가두껍"],
    imageUrl:
      "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=200&q=80",
    lat: 37.5820,
    lng: 127.0255,
  },
];

export const PIN_POSITIONS: Record<number, { left: string; top: string }> = {
  1: { left: "76%", top: "35%" },
  2: { left: "39%", top: "85%" },
  3: { left: "51%", top: "24%" },
  4: { left: "42%", top: "60%" },
  5: { left: "68%", top: "82%" },
  6: { left: "54%", top: "67%" },
};
