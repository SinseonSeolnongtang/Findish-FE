import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import SearchBar from "@/components/common/SearchBar";
import ChatbotFAB from "@/components/common/ChatbotFAB";
import StoreDetail from "@/features/store/StoreDetail";
import MapView from "@/features/normalMode/MapView";
import SearchResultPanel from "@/features/normalMode/SearchResultPanel";
import { useSearchRestaurantsQuery } from "@/hooks/useRestaurant";
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

  const { data, isLoading } = useSearchRestaurantsQuery({ keyword });

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
