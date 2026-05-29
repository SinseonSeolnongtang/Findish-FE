import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Pagination from "@/components/common/Pagination";
import StoreCard, { type StoreCardData } from "@/components/common/StoreCard";
import { useMyLikesQuery, useToggleLikeMutation } from "@/hooks/useRestaurant";
import type { LikedRestaurantItem } from "@/types/restaurant";

const PAGE_SIZE = 10;

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
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const queryParams = { sort: "LATEST", page: page - 1, size: PAGE_SIZE };

  const { data, isLoading } = useMyLikesQuery(queryParams);
  const { mutate: toggleLike } = useToggleLikeMutation();

  const stores = (data?.restaurants ?? []).map(toStoreCardData);
  const totalPages = Math.max(
    1,
    Math.ceil((data?.totalCount ?? 0) / PAGE_SIZE),
  );

  const handleUnlike = (restaurantId: string) => {
    toggleLike(restaurantId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["likes", "me"] });
      },
    });
  };

  return (
    <>
      {isLoading ? (
        <p className="typo-body-md text-neutral-400 py-10 text-center">
          불러오는 중...
        </p>
      ) : stores.length === 0 ? (
        <p className="typo-body-md text-neutral-400 py-10 text-center">
          좋아요한 식당이 없습니다.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                isFavorited={true}
                onClick={() => navigate("/normal", { state: { preSelectedStore: store } })}
                onReserve={() => navigate("/normal", { state: { preSelectedStore: store, openReservation: true } })}
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
