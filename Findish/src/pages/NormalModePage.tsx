import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  useRestaurantBasicQuery,
} from "@/hooks/useRestaurant";
import type { StoreCardData } from "@/components/common/StoreCard";
import type { RestaurantBasicItem } from "@/types/restaurant";
import { isOpenNow } from "@/lib/businessHours";

function toStoreCard(item: RestaurantBasicItem): StoreCardData {
  return {
    id: String(item.restaurantId),
    name: item.name,
    category: item.category,
    isOpen: item.businessHours ? isOpenNow(item.businessHours) : (item.isOpen ?? false),
    reviewCount: String(item.reviewCount),
    keywords: item.tags ?? [],
    imageUrl: item.thumbnailUrl,
    lat: item.lat,
    lng: item.lng,
  };
}

export default function NormalModePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { preSelectedStore?: StoreCardData; openReservation?: boolean; openMenuTab?: boolean } | null;
  const preSelectedStore = locationState?.preSelectedStore ?? null;
  const openReservation = locationState?.openReservation ?? false;
  const [selectedId, setSelectedId] = useState<string | null>(preSelectedStore?.id ?? null);
  const [reserveOnOpen, setReserveOnOpen] = useState<boolean>(openReservation);
  const [menuTabOnOpen, setMenuTabOnOpen] = useState<boolean>(locationState?.openMenuTab ?? false);

  useEffect(() => {
    const newId = preSelectedStore?.id ?? null;
    if (newId) {
      setSelectedId(newId);
      setReserveOnOpen(locationState?.openReservation ?? false);
      setMenuTabOnOpen(locationState?.openMenuTab ?? false);
    }
  }, [location.key]);
  const [keyword, setKeyword] = useState("");
  // id → true(좋아요) / false(취소) 낙관적 오버라이드
  const [toggledIds, setToggledIds] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useSearchRestaurantsQuery({ keyword });
  const { data: likesData } = useMyLikesQuery();
  const { mutate: toggleLikeMutate } = useToggleLikeMutation();

  const { data: pinnedBasic } = useRestaurantBasicQuery(preSelectedStore?.id ?? "");
  const pinnedStore: StoreCardData | null = preSelectedStore && pinnedBasic
    ? {
        ...preSelectedStore,
        lat: pinnedBasic.lat,
        lng: pinnedBasic.lng,
        isOpen: pinnedBasic.isOpen,
        reviewCount: String(pinnedBasic.reviewCount),
        keywords: pinnedBasic.tags,
      }
    : null;

  const likedIds = useMemo(() => {
    const base = new Set<string>(
      likesData?.data?.content?.map((r) => r.naverPlaceId ?? "") ?? [],
    );
    Object.entries(toggledIds).forEach(([id, isLiked]) => {
      if (isLiked) base.add(id);
      else base.delete(id);
    });
    return base;
  }, [likesData, toggledIds]);

  const handleToggleLike = (id: string) => {
    const currentlyLiked = likedIds.has(id);
    setToggledIds((prev) => ({ ...prev, [id]: !currentlyLiked }));
    toggleLikeMutate(id, {
      onSuccess: (res) => {
        setToggledIds((prev) => ({ ...prev, [id]: res.data?.isLiked ?? !currentlyLiked }));
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
    () => (data?.data ?? []).map(toStoreCard),
    [data],
  );

  const selected = restaurants.find((r) => r.id === selectedId)
    ?? (preSelectedStore?.id === selectedId ? (pinnedStore ?? preSelectedStore) : null);
  const searched = !!keyword.trim();

  const handlePinClick = (id: string) => { setSelectedId(id === selectedId ? null : id); setReserveOnOpen(false); };
  const handleCardSelect = (id: string) => { setSelectedId(id === selectedId ? null : id); setReserveOnOpen(false); };
  const handleReserve = (id: string) => { setSelectedId(id); setReserveOnOpen(true); };

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
        pinnedStore={pinnedStore}
      />

      {searched && !isLoading && (
        <SearchResultPanel
          restaurants={restaurants}
          totalCount={restaurants.length}
          selectedId={selectedId}
          onSelect={handleCardSelect}
          onReserve={handleReserve}
          likedIds={likedIds}
          onToggleLike={handleToggleLike}
        />
      )}

      {selected && (
        <div className="absolute right-0 top-17 bottom-0 w-95 bg-white shadow-[-4px_0px_12px_rgba(0,0,0,0.08)] z-20 rounded-tl-2xl overflow-hidden">
          <StoreDetail
            key={`${selectedId}-${reserveOnOpen}-${menuTabOnOpen}`}
            store={selected}
            onClose={() => { setSelectedId(null); setMenuTabOnOpen(false); }}
            initialShowReservation={reserveOnOpen}
            initialTab={menuTabOnOpen ? "menu" : undefined}
          />
        </div>
      )}

      {!selected && <ChatbotFAB />}
    </div>
  );
}
