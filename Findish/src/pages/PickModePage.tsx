import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import Header from "@/components/common/Header";
import SearchBar from "@/components/common/SearchBar";
import ChatbotFAB from "@/components/common/ChatbotFAB";
import LikeButton from "@/components/common/LikeButton";
import PickMapView from "@/features/pick/PickMapView";
import { SECTIONS } from "@/features/pick/types";
import type { Restaurant } from "@/features/pick/types";
import SectionDots from "@/features/pick/SectionDots";
import HomeSection from "@/features/pick/HomeSection";
import TasteSection from "@/features/pick/TasteSection";
import VibeSection from "@/features/pick/VibeSection";
import ServiceSection from "@/features/pick/ServiceSection";
import {
  useExploreSearchQuery,
  useCardSummaryQuery,
  useSelectionsQuery,
  useAddSelectionMutation,
  useRemoveSelectionMutation,
} from "@/hooks/useExplore";

export default function PickModePage() {
  const navigate = useNavigate();
  const [section, setSection] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const { data: searchData, isLoading: searchLoading } = useExploreSearchQuery({ keyword: query });
  const restaurants = searchData?.restaurants ?? [];
  const currentRestaurant = restaurants.length > 0
    ? restaurants[currentIdx % restaurants.length]
    : null;

  const { data: cardSummary } = useCardSummaryQuery(currentRestaurant?.restaurantId ?? 0);
  const { data: selectionsData } = useSelectionsQuery();
  const addMutation = useAddSelectionMutation();
  const removeMutation = useRemoveSelectionMutation();

  const restaurant: Restaurant | null = currentRestaurant
    ? {
        id: currentRestaurant.restaurantId,
        name: currentRestaurant.name,
        category: currentRestaurant.category,
        distance:
          currentRestaurant.distance >= 1000
            ? `${(currentRestaurant.distance / 1000).toFixed(1)}km`
            : `${currentRestaurant.distance}m`,
        station: currentRestaurant.address,
        priceRange: currentRestaurant.priceRange,
        keywords: currentRestaurant.tags,
        positiveKeywords: cardSummary?.taste.positiveKeywords ?? [],
        negativeKeywords: cardSummary?.taste.negativeKeywords ?? [],
        tasteSummary: cardSummary?.taste.summary ?? "",
        vibeSummary: cardSummary?.atmosphere.summary ?? "",
        serviceSummary: cardSummary?.service.summary ?? "",
        imageUrl: currentRestaurant.imageUrls[0] ?? "",
        tasteImages: currentRestaurant.imageUrls,
        vibeImage: currentRestaurant.imageUrls[0] ?? "",
        serviceImage: currentRestaurant.imageUrls[0] ?? "",
        currentIndex: currentIdx + 1,
        total: searchData?.totalCount ?? 0,
        lat: currentRestaurant.lat,
        lng: currentRestaurant.lng,
      }
    : null;

  const selectedCount = selectionsData?.selectedCount ?? 0;
  const isCompleted = selectionsData?.isCompleted ?? false;
  const isAlreadySaved =
    selectionsData?.selections.some(
      (s) => s.restaurantId === currentRestaurant?.restaurantId,
    ) ?? false;

  const slots: ({ restaurantId: number; thumbnailUrl: string } | null)[] = [null, null, null];
  (selectionsData?.selections ?? []).forEach((s, i) => {
    if (i < 3) slots[i] = { restaurantId: s.restaurantId, thumbnailUrl: s.thumbnailUrl };
  });

  const handleSave = () => {
    if (!currentRestaurant || isAlreadySaved || selectedCount >= 3) return;
    addMutation.mutate(
      { restaurantId: currentRestaurant.restaurantId },
      {
        onSuccess: () => {
          setCurrentIdx((i) => i + 1);
          setSection(0);
        },
      },
    );
  };

  const handleSkip = () => {
    setCurrentIdx((i) => i + 1);
    setSection(0);
  };

  const handleSwipe = (dir: "prev" | "next") => {
    setSection((s) =>
      dir === "next"
        ? Math.min(s + 1, SECTIONS.length - 1)
        : Math.max(s - 1, 0),
    );
  };

  return (
    <div className="h-screen overflow-hidden">
      <Header />

      {/* 검색바 */}
      <div className="fixed top-17 left-0 right-0 z-30 flex justify-center py-3 pointer-events-none">
        <div className="pointer-events-auto">
          <SearchBar
            mode="pick"
            onModeChange={(m) => m === "normal" && navigate("/normal")}
            onSearch={(q) => {
              const trimmed = q.trim();
              if (trimmed) {
                setQuery(trimmed);
                setSearched(true);
                setCurrentIdx(0);
                setSection(0);
              }
            }}
          />
        </div>
      </div>

      {/* 지도 배경 */}
      <PickMapView restaurant={restaurant} showPin={!!query && !!restaurant} />

      {/* 좌측 사이드바 */}
      {searched && (
        <div className="absolute left-0 top-17 bottom-0 w-108.5 z-20 flex flex-col pt-3.5 px-5.5 gap-3 bg-white">
          {searchLoading ? (
            <div className="flex flex-col gap-3 flex-1 pt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 rounded bg-neutral-100 animate-pulse" />
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="typo-body-md text-neutral-400">검색 결과가 없어요.</p>
            </div>
          ) : (
            <>
              {/* 탐색 상태 */}
              <p className="text-[16px] font-bold text-[#4a5565]">
                현재 <span className="text-[#ff6900]">{currentIdx + 1}</span>번째
                가게 탐색중{" "}
                <span className="font-normal text-[#99a1af]">
                  (검색 결과: {searchData?.totalCount ?? 0}개)
                </span>
              </p>

              {/* 가게 카드 */}
              {restaurant && (
                <div className="bg-[#fff7ed] rounded-[10px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.15)] border border-[#fff1df] flex flex-col overflow-hidden flex-1">
                  {section === 0 && <HomeSection restaurant={restaurant} />}
                  {section === 1 && <TasteSection restaurant={restaurant} />}
                  {section === 2 && <VibeSection restaurant={restaurant} atmosphere={cardSummary?.atmosphere} />}
                  {section === 3 && <ServiceSection restaurant={restaurant} service={cardSummary?.service} />}

                  <div className="flex items-center justify-between px-4 pt-3 pb-4 shrink-0">
                    <button
                      onClick={() => handleSwipe("prev")}
                      disabled={section === 0}
                      className="text-neutral-400 disabled:opacity-30 hover:text-[#ff6900] transition-colors p-1 cursor-pointer"
                    >
                      ←
                    </button>
                    <SectionDots active={section} />
                    <button
                      onClick={() => handleSwipe("next")}
                      disabled={section === SECTIONS.length - 1}
                      className="text-neutral-400 disabled:opacity-30 hover:text-[#ff6900] transition-colors p-1 cursor-pointer"
                    >
                      →
                    </button>
                  </div>
                </div>
              )}

              {/* 넘기기 / 저장하기 */}
              <div className="shrink-0">
                {isCompleted ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate("/compare")}
                    className="w-full rounded-[10px] font-bold"
                  >
                    AI 분석하러 가기 →
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSkip}
                      className="flex-1 rounded-[10px] bg-[#fff1df] text-[#ff6900] font-bold hover:bg-[#fff1df] hover:brightness-95"
                    >
                      넘기기
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSave}
                      disabled={isAlreadySaved || selectedCount >= 3 || addMutation.isPending}
                      className="flex-1 rounded-[10px] font-bold"
                    >
                      {isAlreadySaved ? "저장됨" : "저장하기"}
                    </Button>
                  </div>
                )}
              </div>

              {/* 픽 슬롯 */}
              <div className="flex gap-3 justify-center pb-4 shrink-0">
                {slots.map((slot, i) => (
                  <LikeButton
                    key={i}
                    liked={slot !== null}
                    imageUrl={slot?.thumbnailUrl}
                    onClick={slot ? () => removeMutation.mutate(slot.restaurantId) : undefined}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <ChatbotFAB />
    </div>
  );
}
