import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Pagination from "@/components/common/Pagination";
import StoreCard, { type StoreCardData } from "@/components/common/StoreCard";
import { useMyLikesQuery, useToggleLikeMutation } from "@/hooks/useRestaurant";
import type { LikedRestaurantItem } from "@/types/restaurant";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { label: "최신순", value: "LATEST" },
  { label: "오래된순", value: "OLDEST" },
] as const;

type SortLabel = (typeof SORT_OPTIONS)[number]["label"];

function toStoreCardData(item: LikedRestaurantItem): StoreCardData {
  return {
    id: item.restaurantId,
    name: item.name,
    category: item.category,
    summary: item.address,
    imageUrl: item.thumbnailUrl,
    isOpen: false,
    reviewCount: "",
    keywords: [],
  };
}

export default function LikedTab() {
  const [page, setPage] = useState(1);
  const [sortLabel, setSortLabel] = useState<SortLabel>("최신순");

  const queryClient = useQueryClient();
  const sortValue = SORT_OPTIONS.find((o) => o.label === sortLabel)!.value;
  const queryParams = { sort: sortValue, page: page - 1, size: PAGE_SIZE };

  const { data, isLoading } = useMyLikesQuery(queryParams);
  const { mutate: toggleLike } = useToggleLikeMutation();

  const stores = (data?.restaurants ?? []).map(toStoreCardData);
  const totalPages = Math.max(1, Math.ceil((data?.totalCount ?? 0) / PAGE_SIZE));

  const handleSortToggle = () => {
    setSortLabel((s) => (s === "최신순" ? "오래된순" : "최신순"));
    setPage(1);
  };

  const handleUnlike = (restaurantId: string) => {
    toggleLike(restaurantId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["likes", "me"] });
      },
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="typo-h1 text-neutral-900">좋아요 내역</h2>
        <button
          onClick={handleSortToggle}
          className="typo-body-lg text-primary border border-primary bg-white rounded-xl px-4.5 py-2 hover:bg-orange-100 transition-colors cursor-pointer"
        >
          {sortLabel} ∨
        </button>
      </div>
      {isLoading ? (
        <p className="typo-body-md text-neutral-400 py-10 text-center">불러오는 중...</p>
      ) : stores.length === 0 ? (
        <p className="typo-body-md text-neutral-400 py-10 text-center">좋아요한 식당이 없습니다.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                isFavorited={true}
                onFavorite={() => handleUnlike(store.id)}
                className="border border-neutral-300 rounded-xl overflow-hidden"
              />
            ))}
          </div>
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
}
