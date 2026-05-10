import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import Header from "@/components/common/Header";
import SearchBar from "@/components/common/SearchBar";
import ChatbotFAB from "@/components/common/ChatbotFAB";
import LikeButton from "@/components/common/LikeButton";
import PickMapView from "@/features/pick/PickMapView";
import { SECTIONS, MOCK_LIST } from "@/features/pick/types";
import SectionDots from "@/features/pick/SectionDots";
import HomeSection from "@/features/pick/HomeSection";
import TasteSection from "@/features/pick/TasteSection";
import VibeSection from "@/features/pick/VibeSection";
import ServiceSection from "@/features/pick/ServiceSection";

export default function PickModePage() {
  const navigate = useNavigate();
  const [section, setSection] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [savedItems, setSavedItems] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [query, setQuery] = useState("");

  const restaurant = MOCK_LIST[currentIdx % MOCK_LIST.length];

  const handleSave = () => {
    const slotIdx = savedItems.findIndex((s) => s === null);
    if (slotIdx === -1) return;
    const next = [...savedItems];
    next[slotIdx] = restaurant.imageUrl;
    setSavedItems(next);
    setCurrentIdx((i) => i + 1);
    setSection(0);
    if (next.filter(Boolean).length === 3) {
      setTimeout(() => navigate("/compare"), 800);
    }
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
      <Header isLoggedIn />

      {/* 검색바 */}
      <div className="fixed top-17 left-0 right-0 z-30 flex justify-center py-3 pointer-events-none">
        <div className="pointer-events-auto">
          <SearchBar
            mode="pick"
            onModeChange={(m) => m === "normal" && navigate("/normal")}
            onSearch={(q) => setQuery(q)}
          />
        </div>
      </div>

      {/* 지도 배경 */}
      <PickMapView restaurant={restaurant} showPin={!!query} />

      {/* 좌측 사이드바 */}
      {query && (
        <div className="absolute left-0 top-17 bottom-0 w-108.5 z-20 flex flex-col pt-3.5 px-5.5 gap-3 bg-white">
          {/* 탐색 상태 */}
          <p className="text-[16px] font-bold text-[#4a5565]">
            현재 <span className="text-[#ff6900]">{currentIdx + 1}</span>번째
            가게 탐색중{" "}
            <span className="font-normal text-[#99a1af]">
              (검색 결과: {restaurant.total}개)
            </span>
          </p>

          {/* 가게 카드 */}
          <div className="bg-[#fff7ed] rounded-[10px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.15)] border border-[#fff1df] flex flex-col overflow-hidden flex-1">
            {section === 0 && <HomeSection restaurant={restaurant} />}
            {section === 1 && <TasteSection restaurant={restaurant} />}
            {section === 2 && <VibeSection restaurant={restaurant} />}
            {section === 3 && <ServiceSection restaurant={restaurant} />}

            {/* 섹션 네비게이션 dots */}
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

          {/* 넘기기 / 저장하기 */}
          <div className="shrink-0">
            {savedItems.filter(Boolean).length === 3 ? (
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
                  disabled={savedItems.filter(Boolean).length >= 3}
                  className="flex-1 rounded-[10px] font-bold"
                >
                  저장하기
                </Button>
              </div>
            )}
          </div>

          {/* 픽 슬롯 */}
          <div className="flex gap-3 justify-center pb-4 shrink-0">
            {savedItems.map((imageUrl, i) => (
              <LikeButton
                key={i}
                liked={imageUrl !== null}
                imageUrl={imageUrl ?? undefined}
              />
            ))}
          </div>
        </div>
      )}

      <ChatbotFAB />
    </div>
  );
}
