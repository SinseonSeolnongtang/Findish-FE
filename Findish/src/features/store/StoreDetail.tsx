import { useState } from "react";
import { cn } from "@/lib/utils";
import { type StoreCardData } from "@/components/common/StoreCard";
import StoreBasicInfo from "./StoreBasicInfo";
import AiTab from "./tabs/AiTab";
import MenuTab from "./tabs/MenuTab";
import ReviewTab from "./tabs/ReviewTab";
import InfoTab from "./tabs/InfoTab";
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
}

export default function StoreDetail({ store, onClose }: StoreDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>("ai");

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
        <StoreBasicInfo store={store} />

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
          <AiTab store={store} onMoreClick={() => setActiveTab("menu")} />
        )}
        {activeTab === "menu" && <MenuTab store={store} />}
        {activeTab === "review" && <ReviewTab store={store} />}
        {activeTab === "info" && <InfoTab />}
      </div>

      {/* 예약하기 버튼 */}
      <div className="shrink-0 p-2 border-t border-neutral-100">
        <Button
          variant="primary"
          size="sm"
          className="w-full h-11 text-[15px] font-bold rounded-xl"
        >
          예약하기
        </Button>
      </div>
    </div>
  );
}
