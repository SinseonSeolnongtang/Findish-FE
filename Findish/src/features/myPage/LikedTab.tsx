import { useState } from "react";
import Pagination from "@/components/common/Pagination";
import StoreCard, { type StoreCardData } from "@/components/common/StoreCard";

const FOOD_IMG =
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80";
const ITEMS_PER_PAGE = 10;

const MOCK_LIKED: StoreCardData[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: "고기굽는마을",
  category: "한식",
  isOpen: true,
  reviewCount: "400+",
  rating: 0.0,
  summary: "오징어사리로 완성되는 특별한 맛",
  keywords: ["#가성비", "#질좋은고기", "#고기가두껍"],
  imageUrl: FOOD_IMG,
}));

export default function LikedTab() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("최신순");

  const totalPages = Math.ceil(MOCK_LIKED.length / ITEMS_PER_PAGE);
  const paged = MOCK_LIKED.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="typo-h1 text-neutral-900">좋아요 내역</h2>
        <button
          onClick={() =>
            setSort((s) => (s === "최신순" ? "오래된순" : "최신순"))
          }
          className="typo-body-lg text-primary border border-primary bg-white rounded-xl px-4.5 py-2 hover:bg-orange-100 transition-colors cursor-pointer"
        >
          {sort} ∨
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {paged.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            className="border border-neutral-300 rounded-xl overflow-hidden"
          />
        ))}
      </div>
      <Pagination current={page} total={totalPages} onChange={setPage} />
    </>
  );
}
