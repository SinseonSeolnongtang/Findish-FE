import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import { useAnalysisQuery, useRemoveSelectionMutation } from "@/hooks/useExplore";
import type { AnalysisKeyword, AnalysisRestaurant } from "@/types/explore";

const CARD_COLORS = ["#FF6900", "#FACC15", "#22C55E"] as const;

function RestaurantCard({
  restaurant,
  color,
}: {
  restaurant: AnalysisRestaurant;
  color: string;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
      <div className="w-full h-30 overflow-hidden">
        <img
          src={restaurant.thumbnailUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <p className="text-[14px] font-bold text-neutral-800">{restaurant.name}</p>
        <p className="text-[11px] text-neutral-400 mt-0.5">{restaurant.category}</p>

        {restaurant.topKeywords?.map((kw, i) => (
          <div key={i} className="mt-2">
            <div className="flex items-center justify-between typo-micro text-neutral-600 mb-1">
              <span>{kw.keyword}</span>
              <span className="text-primary">{kw.positiveRatio}%</span>
              <span className="text-neutral-400">{kw.negativeRatio}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden bg-[#E5E7EB]">
              <div
                className="h-full rounded-full"
                style={{ width: `${kw.positiveRatio}%`, backgroundColor: color }}
              />
            </div>
          </div>
        ))}

        <div className="flex items-center gap-1 mt-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="typo-micro text-neutral-600 truncate">{restaurant.name}</span>
        </div>
      </div>
    </div>
  );
}

function BarGroup({
  data,
  restaurantNames,
}: {
  data: AnalysisKeyword;
  restaurantNames: string[];
}) {
  return (
    <div className="mb-4">
      <p className="text-[13px] font-bold text-neutral-800 mb-1">{data.keyword}</p>
      {data.scores?.map((score, i) => (
        <div key={score.restaurantId ?? i} className="flex items-center gap-2 mb-1">
          <span className="text-[11px] text-neutral-600 w-20 shrink-0 truncate">
            {restaurantNames[i] ?? "-"}
          </span>
          <div className="flex-1 h-3 rounded-full overflow-hidden bg-[#E5E7EB]">
            <div
              className="h-full rounded-full"
              style={{ width: `${score.ratio}%`, backgroundColor: CARD_COLORS[i] }}
            />
          </div>
          <span className="typo-micro text-neutral-400 w-8 text-right">
            {score.ratio}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ComparePage() {
  const navigate = useNavigate();
  const { data, isLoading } = useAnalysisQuery();
  const removeMutation = useRemoveSelectionMutation();
  const clearedRef = useRef(false);

  useEffect(() => {
    if (data?.restaurants && !clearedRef.current) {
      clearedRef.current = true;
      data.restaurants.forEach((r) => {
        if (r.restaurantId) removeMutation.mutate(r.restaurantId);
      });
    }
  }, [data]);

  const restaurantNames = data?.restaurants?.map((r) => r.name ?? "") ?? [];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-17 max-w-225 mx-auto px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-[15px] text-neutral-600 hover:text-primary transition-colors m-4 cursor-pointer"
        >
          ← 뒤로가기
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center h-60">
            <p className="typo-body-md text-neutral-400">분석 중...</p>
          </div>
        ) : data ? (
          <>
            {/* 레스토랑 카드 3개 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {data.restaurants?.map((r, i) => (
                <RestaurantCard
                  key={r.restaurantId ?? i}
                  restaurant={r}
                  color={CARD_COLORS[i]}
                />
              ))}
            </div>

            {/* 공통점 / 트레이드 오프 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                <h2 className="text-[20px] font-bold text-[#22C55E] mb-1">공통점</h2>
                {data.summary?.commonText && (
                  <p className="text-[12px] text-neutral-500 mb-4 whitespace-pre-line">
                    {data.summary.commonText}
                  </p>
                )}
                {data.commonKeywords?.map((kw, i) => (
                  <BarGroup key={i} data={kw} restaurantNames={restaurantNames} />
                ))}
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                <h2 className="text-[20px] font-bold text-primary mb-1">트레이드 오프</h2>
                {data.summary?.tradeOffText && (
                  <p className="text-[12px] text-neutral-500 mb-4 whitespace-pre-line">
                    {data.summary.tradeOffText}
                  </p>
                )}
                {data.tradeOffKeywords?.map((kw, i) => (
                  <BarGroup key={i} data={kw} restaurantNames={restaurantNames} />
                ))}
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
