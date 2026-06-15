import { useState } from "react";
import type { AiPickRestaurantItem, AiPickPersonalization, AiPickSituation } from "@/types/aiPick";
import { RESTAURANT_COLORS } from "./result/constants";
import PersonalizationPanel from "./result/PersonalizationPanel";
import RestaurantCard from "./result/RestaurantCard";
import GroupAnalysisPanel from "./result/GroupAnalysisPanel";

export interface SelectedConditions {
  situation: AiPickSituation | "";
  budgetMin: number;
  budgetMax: number;
  extraCondition?: string;
  companionCount?: number;
  friendNames?: string[];
}

interface Props {
  restaurants: AiPickRestaurantItem[];
  personalization?: AiPickPersonalization;
  friendNames?: string[];
}

type TabId = "overall" | "individual" | "group";

const TABS: { id: TabId; label: string }[] = [
  { id: "overall", label: "가게 전체 분석" },
  { id: "individual", label: "가게별 분석" },
  { id: "group", label: "그룹 분석" },
];

export default function StepResult({ restaurants, personalization, friendNames }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("overall");
  const activeRestaurants = restaurants.slice(0, 3);

  return (
    <div className="flex flex-col px-6 py-6 w-full max-w-6xl mx-auto">
      {/* 탭 헤더 */}
      <div className="flex border-b border-neutral-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-6 py-3 typo-body-sm font-semibold transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "text-neutral-800"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* 탭1: 가게 전체 분석 — 육각형 비교 차트 */}
      {activeTab === "overall" && activeRestaurants.length > 1 && (
        <PersonalizationPanel restaurants={activeRestaurants} />
      )}
      {activeTab === "overall" && activeRestaurants.length <= 1 && (
        <div className="flex items-center justify-center h-60">
          <p className="typo-body-md text-neutral-400">비교할 식당이 없어요.</p>
        </div>
      )}

      {/* 탭2: 가게별 분석 — 상세 카드 */}
      {activeTab === "individual" && (
        <div className="grid grid-cols-3 gap-4">
          {activeRestaurants.map((r, i) => (
            <RestaurantCard
              key={r.restaurantId ?? i}
              r={r}
              rank={i + 1}
              color={RESTAURANT_COLORS[i]}
            />
          ))}
        </div>
      )}

      {/* 탭3: 그룹 분석 */}
      {activeTab === "group" && (
        <GroupAnalysisPanel personalization={personalization} friendNames={friendNames} />
      )}
    </div>
  );
}
