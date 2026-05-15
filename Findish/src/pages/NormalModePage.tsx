import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import SearchBar from "@/components/common/SearchBar";
import ChatbotFAB from "@/features/agent/ChatbotFAB";
import StoreDetail from "@/features/store/StoreDetail";
import MapView from "@/features/normalMode/MapView";
import SearchResultPanel from "@/features/normalMode/SearchResultPanel";
import {
  useSearchRestaurantsQuery,
  useMyLikesQuery,
  useToggleLikeMutation,
} from "@/hooks/useRestaurant";
import type { StoreCardData } from "@/components/common/StoreCard";
import type { SearchRestaurantItem } from "@/types/restaurant";

function toStoreCard(item: SearchRestaurantItem): StoreCardData {
  return {
    id: item.restaurantId,
    name: item.name,
    category: item.category,
    isOpen: item.isOpen,
    reviewCount: String(item.reviewCount),
    keywords: item.tags,
    imageUrl: item.thumbnailUrl,
    lat: item.lat,
    lng: item.lng,
  };
}

export default function NormalModePage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");
  // id → true(좋아요) / false(취소) 낙관적 오버라이드
  const [toggledIds, setToggledIds] = useState<Record<number, boolean>>({});

  const { data, isLoading } = useSearchRestaurantsQuery({ keyword });
  const { data: likesData } = useMyLikesQuery();
  const { mutate: toggleLikeMutate } = useToggleLikeMutation();

  const likedIds = useMemo(() => {
    const base = new Set<number>(
      likesData?.restaurants.map((r) => r.restaurantId) ?? [],
    );
    Object.entries(toggledIds).forEach(([id, isLiked]) => {
      if (isLiked) base.add(Number(id));
      else base.delete(Number(id));
    });
    return base;
  }, [likesData, toggledIds]);

  const handleToggleLike = (id: number) => {
    const currentlyLiked = likedIds.has(id);
    setToggledIds((prev) => ({ ...prev, [id]: !currentlyLiked }));
    toggleLikeMutate(id, {
      onSuccess: (res) => {
        setToggledIds((prev) => ({ ...prev, [id]: res.isLiked }));
      },
      onError: () => {
        setToggledIds((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      },
    });
  };

  const restaurants = useMemo(
    () => (data?.restaurants ?? []).map(toStoreCard),
    [data],
  );

  const selected = restaurants.find((r) => r.id === selectedId);
  const searched = !!keyword.trim();

  const handlePinClick = (id: number) => setSelectedId(id === selectedId ? null : id);
  const handleCardSelect = (id: number) => setSelectedId(id === selectedId ? null : id);

  return (
    <div className="h-screen overflow-hidden">
      <Header />

      <div className="fixed top-17 left-0 right-0 z-30 flex justify-center py-3 pointer-events-none">
        <div className="pointer-events-auto">
          <SearchBar
            mode="normal"
            onModeChange={() => navigate("/pick")}
            onSearch={(q) => {
              setSelectedId(null);
              setKeyword(q.trim());
            }}
          />
        </div>
      </div>

      <MapView
        restaurants={restaurants}
        selectedId={selectedId}
        onPinClick={handlePinClick}
        searched={searched && !isLoading}
      />

      {searched && !isLoading && (
        <SearchResultPanel
          restaurants={restaurants}
          totalCount={data?.totalCount ?? 0}
          selectedId={selectedId}
          onSelect={handleCardSelect}
          likedIds={likedIds}
          onToggleLike={handleToggleLike}
        />
      )}

      {selected && (
        <div className="absolute right-0 top-17 bottom-0 w-95 bg-white shadow-[-4px_0px_12px_rgba(0,0,0,0.08)] z-20 rounded-tl-2xl overflow-hidden">
          <StoreDetail store={selected} onClose={() => setSelectedId(null)} />
        </div>
      )}

      {!selected && <ChatbotFAB />}
    </div>
  );
}
