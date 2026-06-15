import { useNavigate, useParams } from "react-router-dom";
import { useRestaurantBasicQuery } from "@/hooks/useRestaurant";
import StoreDetail from "@/features/store/StoreDetail";
import MapView from "@/features/normalMode/MapView";
import Header from "@/components/common/Header";
import type { StoreCardData } from "@/components/common/StoreCard";

export default function StorePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useRestaurantBasicQuery(id ?? "");

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const item = data?.data;
  if (!item) return null;

  const store: StoreCardData = {
    id: id ?? "",
    name: item.name ?? "",
    category: item.category ?? "",
    isOpen: item.isOpen ?? false,
    reviewCount: String(item.reviewCount ?? 0),
    keywords: item.tags ?? [],
    imageUrl: item.thumbnailUrl,
    lat: item.lat,
    lng: item.lng,
  };

  return (
    <div className="h-screen overflow-hidden">
      <Header />
      <MapView
        restaurants={[store]}
        selectedId={store.id}
        onPinClick={() => {}}
        searched={false}
        pinnedStore={store}
      />
      <div className="absolute right-0 top-17 bottom-0 w-95 bg-white shadow-[-4px_0px_12px_rgba(0,0,0,0.08)] z-20 rounded-tl-2xl overflow-hidden">
        <StoreDetail store={store} onClose={() => navigate(-1)} />
      </div>
    </div>
  );
}
