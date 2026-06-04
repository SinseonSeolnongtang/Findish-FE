import { useEffect, useRef } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/components/common/Header";
import RadarChart from "@/components/common/RadarChart";
import RestaurantPickCard from "@/components/common/RestaurantPickCard";
import { useAnalysisQuery, useRemoveSelectionMutation, SELECTIONS_KEY } from "@/hooks/useExplore";
import type {
  AnalysisKeyword,
  AnalysisRestaurant,
  AspectTradeoff,
} from "@/types/explore";

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const CARD_COLORS = [
  { stroke: "#FF6900", fill: "#FF6900" },
  { stroke: "#FACC15", fill: "#FACC15" },
  { stroke: "#22C55E", fill: "#22C55E" },
] as const;


// ─── 종합 점수 패널 ────────────────────────────────────────────────────────────

function ScorePanel({ restaurants }: { restaurants: AnalysisRestaurant[] }) {
  const ranked = restaurants
    .slice(0, 3)
    .map((r, idx) => {
      const radar = r.aspectRadar;
      const items = radar ? Object.values(radar) : [];
      const avgScore =
        items.length > 0
          ? items.reduce((s, v) => s + (v?.score ?? 0), 0) / items.length
          : 0;
      return { r, idx, score: avgScore };
    })
    .sort((a, b) => b.score - a.score);

  const medalBg = ["#F59E0B", "#9CA3AF", "#A87B52"];

  return (
    <div className="flex flex-col gap-2.5">
      <p className="typo-caption font-semibold text-neutral-500 text-center">종합 점수</p>
      {ranked.map(({ r, idx, score }, rank) => (
        <div
          key={r.restaurantId ?? idx}
          className="bg-neutral-50 rounded-xl px-3 py-2.5 flex flex-col items-center gap-1 border border-neutral-100"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold shrink-0"
              style={{ backgroundColor: medalBg[rank], fontSize: 10 }}
            >
              {rank + 1}
            </span>
            <span
              className="text-lg font-bold leading-none"
              style={{ color: CARD_COLORS[idx].stroke }}
            >
              {(score * 100).toFixed(1)}점
            </span>
          </div>
          <span className="typo-caption text-neutral-500 text-center leading-snug line-clamp-2">
            {r.name}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── 키워드 아이콘 ────────────────────────────────────────────────────────────

const KEYWORD_ICONS: Record<string, React.ReactElement> = {
  "직원 친절도": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
      <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
    </svg>
  ),
  "음식": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z" />
      <path d="M21 15v7" />
    </svg>
  ),
  "분위기": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2.5" />
  </svg>
);

function getSentimentLabel(avg: number): string {
  if (avg >= 90) return "매우 높음";
  if (avg >= 75) return "높음";
  if (avg >= 50) return "보통";
  return "낮음";
}

// ─── 공통 키워드 카드 아이템 ──────────────────────────────────────────────────

function CommonKeywordItem({ data }: { data: AnalysisKeyword }) {
  const ratios = (data.scores ?? []).map((s) => s.positiveRatio ?? 0).filter((v) => v > 0);
  const minRatio = ratios.length > 0 ? Math.min(...ratios) : 0;
  const maxRatio = ratios.length > 0 ? Math.max(...ratios) : 0;
  const avgRatio = ratios.length > 0 ? ratios.reduce((a, b) => a + b, 0) / ratios.length : 0;
  const label = getSentimentLabel(avgRatio);
  const icon = data.keyword ? (KEYWORD_ICONS[data.keyword] ?? DEFAULT_ICON) : DEFAULT_ICON;

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="w-12 h-12 rounded-full border-2 border-[#22C55E] flex items-center justify-center text-[#22C55E] shrink-0 bg-[#F0FDF4]">
        {icon}
      </div>
      <span className="text-[15px] font-bold text-neutral-800 flex-1">{data.keyword}</span>
      <div className="w-px h-10 bg-neutral-200 shrink-0" />
      <div className="flex flex-col items-end shrink-0 min-w-[80px]">
        <span className="text-[15px] font-bold text-[#22C55E] leading-tight">
          {minRatio === maxRatio ? `${maxRatio}%` : `${minRatio}~${maxRatio}%`}
        </span>
        <span className="text-[12px] text-neutral-400 mt-0.5">{label}</span>
      </div>
    </div>
  );
}

// ─── 트레이드 오프 키워드 바 그룹 ────────────────────────────────────────────

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
              style={{ width: `${score.positiveRatio}%`, backgroundColor: CARD_COLORS[i].stroke }}
            />
          </div>
          <span className="typo-micro text-neutral-400 w-8 text-right">
            {score.positiveRatio}%
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── 트레이드 오프 바 그룹 ────────────────────────────────────────────────────

function TradeOffGroup({
  data,
  restaurants,
}: {
  data: AspectTradeoff;
  restaurants: AnalysisRestaurant[];
}) {
  const idToIdx = Object.fromEntries(
    restaurants.map((r, i) => [r.restaurantId, i]),
  );

  return (
    <div className="mb-4">
      <p className="text-[13px] font-bold text-neutral-800 mb-1">{data.label}</p>
      {data.scores?.map((score, fallbackIdx) => {
        const idx = score.naverPlaceId != null ? (idToIdx[score.naverPlaceId] ?? fallbackIdx) : fallbackIdx;
        const name = restaurants[idx]?.name ?? "-";
        const ratio = score.positiveRatio ?? 0;
        return (
          <div key={score.naverPlaceId ?? fallbackIdx} className="flex items-center gap-2 mb-1">
            <span className="text-[11px] text-neutral-600 w-20 shrink-0 truncate">{name}</span>
            <div className="flex-1 h-3 rounded-full overflow-hidden bg-[#E5E7EB]">
              <div
                className="h-full rounded-full"
                style={{ width: `${ratio}%`, backgroundColor: CARD_COLORS[idx]?.stroke ?? "#9CA3AF" }}
              />
            </div>
            <span className="typo-micro text-neutral-400 w-8 text-right">{ratio}%</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────

export default function ComparePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useAnalysisQuery();
  const removeMutation = useRemoveSelectionMutation();
  const clearedRef = useRef(false);

  useEffect(() => {
    if (data?.restaurants && !clearedRef.current) {
      clearedRef.current = true;
      queryClient.removeQueries({ queryKey: SELECTIONS_KEY });
      data.restaurants.forEach((r) => {
        if (r.restaurantId) removeMutation.mutate(r.restaurantId);
      });
    }
  }, [data]);

  const restaurants = data?.restaurants ?? [];
  const restaurantNames = restaurants.map((r) => r.name ?? "");
  const hasRadar = restaurants.some((r) => r.aspectRadar && Object.keys(r.aspectRadar).length > 0);

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
              {restaurants.map((r, i) => (
                <RestaurantPickCard
                  key={r.restaurantId ?? i}
                  name={r.name}
                  category={r.category}
                  address={r.address}
                  thumbnailUrl={r.thumbnailUrl}
                  rank={i + 1}
                  color={CARD_COLORS[i].stroke}
                  parking={r.parking}
                  groupSeating={r.groupSeating}
                  personaLabel={r.restaurantPersona?.label}
                  keywordTags={r.topKeywords?.map((kw) => kw.keyword ?? "").filter(Boolean)}
                  onClick={() => {
                    if (!r.restaurantId) return;
                    navigate("/normal", {
                      state: {
                        preSelectedStore: {
                          id: r.restaurantId,
                          name: r.name ?? "",
                          category: r.category ?? "",
                          isOpen: false,
                          reviewCount: "0",
                          keywords: [],
                          imageUrl: r.thumbnailUrl,
                        },
                      },
                    });
                  }}
                />
              ))}
            </div>

            {/* 레이더 차트 섹션 */}
            {hasRadar && restaurants.length > 1 && (
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm mb-4">
                <p className="text-[16px] font-semibold text-neutral-700 mb-4">종합 비교</p>
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-6">
                    <RadarChart
                      restaurants={restaurants.map((r) => ({
                        name: r.name,
                        aspectRadar: r.aspectRadar,
                      }))}
                    />
                    <div className="w-44 shrink-0">
                      <ScorePanel restaurants={restaurants} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-5 mt-3 flex-wrap">
                  {restaurants.map((r, i) => (
                    <div key={r.restaurantId ?? i} className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: CARD_COLORS[i].stroke }}
                      />
                      <span className="typo-caption text-neutral-600 font-medium">{r.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 공통점 / 트레이드 오프 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                <h2 className="text-[20px] font-bold text-[#22C55E] mb-1">공통점</h2>
                {data.summary?.commonText && (
                  <p className="text-[12px] text-neutral-500 mb-4 whitespace-pre-line">
                    {data.summary.commonText}
                  </p>
                )}
                <div className="divide-y divide-neutral-100">
                  {data.commonKeywords?.map((kw, i) => (
                    <CommonKeywordItem key={i} data={kw} />
                  ))}
                </div>
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
                {data.aspectTradeoff?.map((item, i) => (
                  <TradeOffGroup key={i} data={item} restaurants={restaurants} />
                ))}
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
