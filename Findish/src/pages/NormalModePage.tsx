import { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RightIcon from "@/assets/icons/common/right.svg?react";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import SearchBar from "@/components/common/SearchBar";
import LikeButton from "@/components/common/LikeButton";
import SharedMapView from "@/components/common/SharedMapView";
import ChatbotFAB from "@/features/agent/ChatbotFAB";
import StoreDetail from "@/features/store/StoreDetail";
import SearchResultPanel from "@/features/normalMode/SearchResultPanel";
import HomeSection from "@/features/pick/HomeSection";
import TasteSection from "@/features/pick/TasteSection";
import VibeSection from "@/features/pick/VibeSection";
import ServiceSection from "@/features/pick/ServiceSection";
import SectionDots from "@/features/pick/SectionDots";
import { SECTIONS } from "@/features/pick/types";
import type { Restaurant } from "@/features/pick/types";
import {
  useSearchRestaurantsQuery,
  useMyLikesQuery,
  useToggleLikeMutation,
  useRestaurantBasicQuery,
} from "@/hooks/useRestaurant";
import {
  useExploreSearchQuery,
  useCardSummaryQuery,
  useSelectionsQuery,
  useAddSelectionMutation,
  useRemoveSelectionMutation,
} from "@/hooks/useExplore";
import type { StoreCardData } from "@/components/common/StoreCard";
import type { RestaurantBasicItem } from "@/types/restaurant";
import { getBusinessStatus } from "@/lib/businessHours";

type Mode = "normal" | "pick";
type SlotItem = { restaurantId: string; thumbnailUrl: string };

function toStoreCard(item: RestaurantBasicItem): StoreCardData {
  const businessStatus = item.businessHours
    ? getBusinessStatus(item.businessHours)
    : (item.isOpen ? "영업중" : "영업 종료");
  return {
    id: String(item.restaurantId),
    name: item.name,
    category: item.category,
    isOpen: businessStatus === "영업중",
    businessStatus,
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
  const locationState = location.state as {
    preSelectedStore?: StoreCardData;
    openReservation?: boolean;
    openMenuTab?: boolean;
  } | null;
  const preSelectedStore = locationState?.preSelectedStore ?? null;
  const openReservation = locationState?.openReservation ?? false;

  // ── 모드 ──────────────────────────────────────────
  const [mode, setMode] = useState<Mode>("normal");

  // ── 일반 모드 state ───────────────────────────────
  const [keyword, setKeyword] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(preSelectedStore?.id ?? null);
  const [reserveOnOpen, setReserveOnOpen] = useState<boolean>(openReservation);
  const [menuTabOnOpen, setMenuTabOnOpen] = useState<boolean>(locationState?.openMenuTab ?? false);
  const [toggledIds, setToggledIds] = useState<Record<string, boolean>>({});

  // ── 선택 모드 state ───────────────────────────────
  const [pickQuery, setPickQuery] = useState("");
  const [pickSearched, setPickSearched] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [section, setSection] = useState(0);
  const [localSelections, setLocalSelections] = useState<SlotItem[]>([]);
  const serverSyncedRef = useRef(false);

  // 딥링크 재진입 시 (location.key 변경) normal 모드로 복귀 및 state 갱신
  useEffect(() => {
    const newId = preSelectedStore?.id ?? null;
    if (newId) {
      setMode("normal");
      setSelectedId(newId);
      setReserveOnOpen(locationState?.openReservation ?? false);
      setMenuTabOnOpen(locationState?.openMenuTab ?? false);
    }
  }, [location.key]);

  // ── 모드 전환 핸들러 ──────────────────────────────
  const handleModeChange = (newMode: Mode) => {
    if (newMode === mode) return;
    if (newMode === "pick") {
      setPickQuery("");
      setPickSearched(false);
      setCurrentIdx(0);
      setSection(0);
    } else {
      setKeyword("");
      setSelectedId(null);
      setToggledIds({});
      setReserveOnOpen(false);
      setMenuTabOnOpen(false);
    }
    setMode(newMode);
  };

  // ── 검색 핸들러 ───────────────────────────────────
  const handleSearch = (q: string) => {
    if (mode === "normal") {
      setSelectedId(null);
      setKeyword(q.trim());
    } else {
      const trimmed = q.trim();
      if (trimmed) {
        setPickQuery(trimmed);
        setPickSearched(true);
        setCurrentIdx(0);
        setSection(0);
      }
    }
  };

  // ── 일반 모드 훅 ──────────────────────────────────
  const { data: normalData, isLoading: normalLoading } = useSearchRestaurantsQuery({ keyword });
  const { data: likesData } = useMyLikesQuery();
  const { mutate: toggleLikeMutate } = useToggleLikeMutation();
  const { data: pinnedBasic } = useRestaurantBasicQuery(preSelectedStore?.id ?? "");

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

  const restaurants = useMemo(
    () => (normalData?.data ?? []).map(toStoreCard),
    [normalData],
  );

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

  const normalSearched = !!keyword.trim();
  const selected = restaurants.find((r) => r.id === selectedId)
    ?? (preSelectedStore?.id === selectedId ? (pinnedStore ?? preSelectedStore) : null);

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

  const handlePinClick = (id: string) => {
    setSelectedId(id === selectedId ? null : id);
    setReserveOnOpen(false);
  };
  const handleCardSelect = (id: string) => {
    setSelectedId(id === selectedId ? null : id);
    setReserveOnOpen(false);
  };
  const handleReserve = (id: string) => {
    setSelectedId(id);
    setReserveOnOpen(true);
  };

  // ── 선택 모드 훅 ──────────────────────────────────
  const { data: pickData, isLoading: pickLoading } = useExploreSearchQuery({ keyword: pickQuery });
  const pickRestaurants = pickData?.data ?? [];
  const currentRestaurant = pickRestaurants.length > 0
    ? pickRestaurants[currentIdx % pickRestaurants.length]
    : null;

  const { data: aiSummary, isLoading: summaryLoading } = useCardSummaryQuery(
    currentRestaurant?.restaurantId ?? "",
  );
  const { data: selectionsData } = useSelectionsQuery();
  const addMutation = useAddSelectionMutation();
  const removeMutation = useRemoveSelectionMutation();

  useEffect(() => {
    if (selectionsData?.data?.selections && !serverSyncedRef.current) {
      serverSyncedRef.current = true;
      setLocalSelections(
        selectionsData.data.selections
          .filter((s) => s.restaurantId)
          .slice(0, 3)
          .map((s) => ({ restaurantId: s.restaurantId!, thumbnailUrl: s.thumbnailUrl ?? "" })),
      );
    }
  }, [selectionsData]);

  const aiData = aiSummary?.data;
  const thumbnail = currentRestaurant?.thumbnailUrl ?? "";
  const distanceRaw = currentRestaurant?.distance;
  const distanceLabel = distanceRaw != null
    ? distanceRaw >= 1000
      ? `${(distanceRaw / 1000).toFixed(1)}km`
      : `${distanceRaw}m`
    : "";

  const pickRestaurant: Restaurant | null = currentRestaurant
    ? {
        id: currentRestaurant.restaurantId as unknown as number,
        name: currentRestaurant.name ?? "",
        category: currentRestaurant.category ?? "",
        distance: distanceLabel,
        station: currentRestaurant.address ?? "",
        priceRange: currentRestaurant.priceRange ?? "",
        keywords: currentRestaurant.tags ?? [],
        tasteSummary: aiData?.tasteSummary ?? "",
        vibeSummary: aiData?.ambianceSummary ?? "",
        serviceSummary: aiData?.serviceSummary ?? "",
        imageUrl: thumbnail,
        tasteImages: aiData?.tasteImages?.length ? aiData.tasteImages : (thumbnail ? [thumbnail] : []),
        vibeImages: aiData?.moodImages?.length ? aiData.moodImages : (thumbnail ? [thumbnail] : []),
        serviceImages: aiData?.serviceImages?.length ? aiData.serviceImages : (thumbnail ? [thumbnail] : []),
        currentIndex: (currentIdx % pickRestaurants.length) + 1,
        total: pickData?.data?.length ?? 0,
        lat: currentRestaurant.lat,
        lng: currentRestaurant.lng,
      }
    : null;

  const isAlreadySaved = localSelections.some(
    (s) => s.restaurantId === currentRestaurant?.restaurantId,
  );
  const localSelectedCount = localSelections.length;
  const isCompleted = localSelectedCount >= 3;

  const slots: (SlotItem | null)[] = [null, null, null];
  localSelections.forEach((s, i) => { if (i < 3) slots[i] = s; });

  const handleSave = () => {
    if (!currentRestaurant || isAlreadySaved || localSelectedCount >= 3) return;
    const newEntry: SlotItem = {
      restaurantId: currentRestaurant.restaurantId ?? "",
      thumbnailUrl: currentRestaurant.thumbnailUrl ?? "",
    };
    setLocalSelections((prev) => [...prev, newEntry]);
    addMutation.mutate(
      { naverPlaceId: currentRestaurant.restaurantId ?? "" },
      {
        onSuccess: () => {
          setCurrentIdx((i) => i + 1);
          setSection(0);
        },
        onError: () => {
          setLocalSelections((prev) =>
            prev.filter((s) => s.restaurantId !== currentRestaurant.restaurantId),
          );
        },
      },
    );
  };

  const handleRemove = (restaurantId: string) => {
    setLocalSelections((prev) => prev.filter((s) => s.restaurantId !== restaurantId));
    removeMutation.mutate(restaurantId);
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

      {/* 검색바 — 모드 전환 시 입력 필드 초기화를 위해 key 사용 */}
      <div className="fixed top-17 left-0 right-0 z-30 flex justify-center py-3 pointer-events-none">
        <div className="pointer-events-auto">
          <SearchBar
            key={mode}
            mode={mode}
            onModeChange={handleModeChange}
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* 공유 지도 — 모드가 바뀌어도 절대 언마운트되지 않음 */}
      <SharedMapView
        mode={mode}
        restaurants={restaurants}
        selectedId={selectedId}
        onPinClick={handlePinClick}
        searched={normalSearched && !normalLoading}
        pinnedStore={pinnedStore}
        pickRestaurant={pickRestaurant}
        showPickPin={!!pickQuery && !!pickRestaurant}
      />

      {/* ── 일반 모드 UI ───────────────────────────── */}
      {mode === "normal" && normalSearched && !normalLoading && (
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

      {mode === "normal" && selected && (
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

      {/* ── 선택 모드 UI ───────────────────────────── */}
      {mode === "pick" && pickSearched && (
        <div className="absolute left-0 top-17 bottom-0 w-108.5 z-20 flex flex-col pt-3.5 px-5.5 gap-3 bg-white">
          {pickLoading ? (
            <div className="flex flex-col gap-3 flex-1 pt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 rounded bg-neutral-100 animate-pulse" />
              ))}
            </div>
          ) : pickRestaurants.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="typo-body-md text-neutral-400">검색 결과가 없어요.</p>
            </div>
          ) : (
            <>
              <p className="text-[16px] font-bold text-[#4a5565]">
                현재 <span className="text-[#ff6900]">{(currentIdx % pickRestaurants.length) + 1}</span>번째
                가게 탐색중{" "}
                <span className="font-normal text-[#99a1af]">
                  (검색 결과: {pickData?.data?.length ?? 0}개)
                </span>
              </p>

              {pickRestaurant && (
                <div className="bg-[#fff7ed] rounded-[10px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.15)] border border-[#fff1df] flex flex-col overflow-hidden flex-1">
                  {section === 0 ? (
                    <HomeSection restaurant={pickRestaurant} />
                  ) : summaryLoading ? (
                    <div className="flex-1 flex flex-col gap-3 p-4">
                      <div className="h-90 rounded-[10px] bg-neutral-200 animate-pulse" />
                      <div className="h-4 rounded bg-neutral-200 animate-pulse w-3/4" />
                      <div className="h-4 rounded bg-neutral-200 animate-pulse w-1/2" />
                    </div>
                  ) : (
                    <>
                      {section === 1 && <TasteSection restaurant={pickRestaurant} />}
                      {section === 2 && <VibeSection restaurant={pickRestaurant} />}
                      {section === 3 && <ServiceSection restaurant={pickRestaurant} />}
                    </>
                  )}

                  <div className="flex items-center justify-between px-4 pt-3 pb-4 shrink-0">
                    <button
                      onClick={() => handleSwipe("prev")}
                      disabled={section === 0}
                      className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-30 transition-opacity cursor-pointer"
                    >
                      <RightIcon width={10} height={10} className="text-neutral-700 rotate-180" />
                    </button>
                    <SectionDots active={section} />
                    <button
                      onClick={() => handleSwipe("next")}
                      disabled={section === SECTIONS.length - 1}
                      className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-30 transition-opacity cursor-pointer"
                    >
                      <RightIcon width={10} height={10} className="text-neutral-700" />
                    </button>
                  </div>
                </div>
              )}

              <div className="shrink-0">
                {isCompleted ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate("/compare")}
                    disabled={addMutation.isPending}
                    className="w-full rounded-[10px] font-bold"
                  >
                    {addMutation.isPending ? "저장 중..." : "AI 분석하러 가기 →"}
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
                      disabled={isAlreadySaved || localSelectedCount >= 3 || addMutation.isPending}
                      className="flex-1 rounded-[10px] font-bold"
                    >
                      {isAlreadySaved ? "저장됨" : "저장하기"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-center pb-4 shrink-0">
                {slots.map((slot, i) => (
                  <LikeButton
                    key={i}
                    liked={slot !== null}
                    imageUrl={slot?.thumbnailUrl}
                    onClick={slot ? () => handleRemove(slot.restaurantId) : undefined}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {(mode === "pick" || !selected) && <ChatbotFAB />}
    </div>
  );
}
