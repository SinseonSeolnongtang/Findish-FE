import { useState } from "react";
import { cn } from "@/lib/utils";
import { type StoreCardData } from "@/components/common/StoreCard";
import StoreBasicInfo from "./StoreBasicInfo";
import AiTab from "./tabs/AiTab";
import MenuTab from "./tabs/MenuTab";
import ReviewTab from "./tabs/ReviewTab";
import InfoTab from "./tabs/InfoTab";
import ReservationPanel from "./ReservationPanel";
import CloseLgIcon from "@/assets/icons/common/close_lg.svg?react";
import Button from "@/components/common/Button";

type TabType = "ai" | "menu" | "review" | "info";

const TAB_LABELS: Record<TabType, string> = {
  ai: "AI 요약",
  menu: "메뉴",
  review: "리뷰",
  info: "정보",
};

interface StoreDetailProps {
  store: StoreCardData;
  onClose: () => void;
  initialShowReservation?: boolean;
}

export default function StoreDetail({ store, onClose, initialShowReservation = false }: StoreDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>("ai");
  const [showReservation, setShowReservation] = useState(initialShowReservation);

  const restaurantId = store.id;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 썸네일 + 닫기 버튼 */}
      <div className="relative shrink-0">
        <div className="w-full h-62.5 overflow-hidden">
          {store.imageUrl ? (
            <img
              src={store.imageUrl}
              alt={store.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-[#FFE4CC] to-[#FFD0A8]" />
          )}
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer"
          aria-label="닫기"
        >
          <CloseLgIcon className="w-10 m-2" />
        </button>
      </div>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto">
        <StoreBasicInfo store={store} restaurantId={String(restaurantId)} />

        {showReservation ? (
          <ReservationPanel
            restaurantId={restaurantId}
            restaurantName={store.name}
            onClose={() => setShowReservation(false)}
          />
        ) : (
          <>
            {/* 탭 바 */}
            <div className="flex border-b border-neutral-200">
              {(["ai", "menu", "review", "info"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-2 text-[14px] font-medium transition-colors cursor-pointer",
                    activeTab === tab
                      ? "text-primary border-b-2 border-primary"
                      : "text-neutral-500",
                  )}
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>

            {activeTab === "ai" && (
              <AiTab
                store={store}
                restaurantId={restaurantId}
                onMoreClick={() => setActiveTab("menu")}
              />
            )}
            {activeTab === "menu" && (
              <MenuTab restaurantId={restaurantId} />
            )}
            {activeTab === "review" && (
              <ReviewTab restaurantId={restaurantId} />
            )}
            {activeTab === "info" && (
              <InfoTab restaurantId={restaurantId} />
            )}
          </>
        )}
      </div>

      {/* 예약하기 버튼 */}
      {!showReservation && (
        <div className="shrink-0 p-2 border-t border-neutral-100">
          <Button
            variant="primary"
            size="sm"
            className="w-full h-11 text-[15px] font-bold rounded-xl"
            onClick={() => setShowReservation(true)}
          >
            예약하기
          </Button>
        </div>
      )}
    </div>
  );
}
