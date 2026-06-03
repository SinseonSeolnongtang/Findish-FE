import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/components/common/Header";
import { useAnalysisQuery, useRemoveSelectionMutation, SELECTIONS_KEY } from "@/hooks/useExplore";
import type {
  AnalysisKeyword,
  AnalysisRestaurant,
  AspectRadarKey,
  AspectTradeoff,
} from "@/types/explore";

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const CARD_COLORS = [
  { stroke: "#FF6900", fill: "#FF6900" },
  { stroke: "#FACC15", fill: "#FACC15" },
  { stroke: "#22C55E", fill: "#22C55E" },
] as const;

const RADAR_AXES: { label: string; key: AspectRadarKey }[] = [
  { label: "맛", key: "taste" },
  { label: "분위기", key: "mood" },
  { label: "서비스", key: "service" },
  { label: "가성비", key: "value" },
  { label: "시설", key: "facility" },
  { label: "대기", key: "waiting" },
];

// ─── 식당 카드 ─────────────────────────────────────────────────────────────────

function RestaurantCard({
  restaurant,
  color,
  onClick,
}: {
  restaurant: AnalysisRestaurant;
  color: string;
  onClick?: () => void;
}) {
  return (
    <div
      className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm cursor-pointer hover:bg-orange-50 transition-colors"
      onClick={onClick}
    >
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
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="typo-micro text-neutral-600 truncate">{restaurant.name}</span>
        </div>
      </div>
    </div>
  );
}

// ─── 육각형 레이더 차트 ────────────────────────────────────────────────────────

function RadarChart({ restaurants }: { restaurants: AnalysisRestaurant[] }) {
  const SIZE = 420;
  const CENTER = SIZE / 2;
  const RADIUS = 132;
  const LEVELS = 4;
  const N = RADAR_AXES.length;

  const [hoveredPoint, setHoveredPoint] = useState<{ ri: number; axisIdx: number } | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showRafRef = useRef<number | null>(null);

  const handlePointEnter = (ri: number, axisIdx: number) => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (showRafRef.current != null) cancelAnimationFrame(showRafRef.current);
    setTooltipVisible(false);
    setHoveredPoint({ ri, axisIdx });
    showRafRef.current = requestAnimationFrame(() => {
      showRafRef.current = requestAnimationFrame(() => setTooltipVisible(true));
    });
  };

  const handlePointLeave = () => {
    if (showRafRef.current != null) cancelAnimationFrame(showRafRef.current);
    setTooltipVisible(false);
    hideTimerRef.current = setTimeout(() => setHoveredPoint(null), 200);
  };

  const getAngle = (i: number) => (Math.PI * 2 * i) / N - Math.PI / 2;
  const getXY = (value: number, i: number) => ({
    x: CENTER + value * RADIUS * Math.cos(getAngle(i)),
    y: CENTER + value * RADIUS * Math.sin(getAngle(i)),
  });

  const gridPolygons = Array.from({ length: LEVELS }, (_, l) => {
    const level = (l + 1) / LEVELS;
    return RADAR_AXES.map((_, i) => {
      const { x, y } = getXY(level, i);
      return `${x},${y}`;
    }).join(" ");
  });

  const outerPoints = RADAR_AXES.map((_, i) => {
    const { x, y } = getXY(1, i);
    return `${x},${y}`;
  }).join(" ");

  const active = restaurants.slice(0, 3);
  const getScore = (r: AnalysisRestaurant, key: AspectRadarKey) =>
    r.aspectRadar?.[key]?.score ?? 0;

  const tooltipContent = (() => {
    if (!hoveredPoint) return null;
    const { ri, axisIdx } = hoveredPoint;
    const r = active[ri];
    const axis = RADAR_AXES[axisIdx];
    const item = r.aspectRadar?.[axis.key];
    if (!item) return null;
    const { x, y } = getXY(getScore(r, axis.key), axisIdx);
    return { x, y, item, ri, axisLabel: axis.label };
  })();

  return (
    <svg width="100%" viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ maxWidth: SIZE }}>
      <defs>
        <filter id="tt-shadow-cmp" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* 바깥 배경 */}
      <polygon points={outerPoints} fill="#FFF7ED" stroke="none" />

      {/* 그리드 */}
      {gridPolygons.map((points, l) => (
        <polygon key={l} points={points} fill="none" stroke="#E5E7EB" strokeWidth={1} />
      ))}

      {/* 축 선 */}
      {RADAR_AXES.map((_, i) => {
        const outer = getXY(1, i);
        return (
          <line
            key={i}
            x1={CENTER} y1={CENTER}
            x2={outer.x} y2={outer.y}
            stroke="#D1D5DB" strokeWidth={1} strokeDasharray="3,2"
          />
        );
      })}

      {/* 데이터 폴리곤 */}
      {active.map((r, ri) => {
        const points = RADAR_AXES.map((axis, i) => {
          const { x, y } = getXY(getScore(r, axis.key), i);
          return `${x},${y}`;
        }).join(" ");
        const c = CARD_COLORS[ri];
        return (
          <polygon
            key={ri} points={points}
            fill={c.fill} fillOpacity={0.15}
            stroke={c.stroke} strokeWidth={2} strokeLinejoin="round"
          />
        );
      })}

      {/* 데이터 점 */}
      {active.map((r, ri) =>
        RADAR_AXES.map((axis, i) => {
          const { x, y } = getXY(getScore(r, axis.key), i);
          const isHovered = hoveredPoint?.ri === ri && hoveredPoint?.axisIdx === i;
          return (
            <circle
              key={`${ri}-${i}`}
              cx={x} cy={y}
              r={isHovered ? 5.5 : 4}
              fill={CARD_COLORS[ri].stroke}
              stroke="white" strokeWidth={1.5}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => handlePointEnter(ri, i)}
              onMouseLeave={handlePointLeave}
            />
          );
        }),
      )}

      {/* 축 레이블 */}
      {RADAR_AXES.map((axis, i) => {
        const angle = getAngle(i);
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const { x, y } = getXY(1.3, i);
        const textAnchor = Math.abs(cosA) < 0.2 ? "middle" : cosA > 0 ? "start" : "end";
        const dominantBaseline = Math.abs(sinA) < 0.2 ? "middle" : sinA > 0 ? "hanging" : "auto";
        return (
          <text
            key={i} x={x} y={y}
            textAnchor={textAnchor} dominantBaseline={dominantBaseline}
            fontSize={15} fontWeight="600" fill="#374151"
          >
            {axis.label}
          </text>
        );
      })}

      {/* 그리드 레벨 수치 */}
      {[0.25, 0.5, 0.75, 1.0].map((level) => {
        const { x, y } = getXY(level, 0);
        return (
          <text
            key={level} x={x + 5} y={y}
            fontSize={8.5} fill="#D1D5DB"
            textAnchor="start" dominantBaseline="middle"
          >
            {Math.round(level * 100)}%
          </text>
        );
      })}

      {/* 호버 툴팁 */}
      {tooltipContent && (() => {
        const { x, y, item, ri, axisLabel } = tooltipContent;
        const color = CARD_COLORS[ri].stroke;
        const restaurantName = active[ri].name ?? `${ri + 1}번`;
        const scoreText = `${((item.score ?? 0) * 100).toFixed(1)}점`;
        const pad = 14;
        const dotR = 5;
        const nameLineH = 26;
        const axisLineH = 22;
        const dataLineH = 19;
        const tw = 175;
        const noReview = (item.reviewCount ?? 0) === 0;
        const th = noReview
          ? pad + nameLineH + 7 + axisLineH + 38 + pad
          : pad + nameLineH + 7 + axisLineH + dataLineH + 27 + dataLineH + pad;
        let tx = x + 14;
        let ty = y - th / 2;
        if (tx + tw > SIZE - 6) tx = x - tw - 14;
        if (ty < 6) ty = 6;
        if (ty + th > SIZE - 6) ty = SIZE - th - 6;

        const nameY = ty + pad + nameLineH * 0.72;
        const dividerY = ty + pad + nameLineH + 3;
        const axisY = dividerY + 5 + axisLineH * 0.72;
        const dataStartY = axisY + axisLineH * 0.4;

        return (
          <g style={{ pointerEvents: "none", opacity: tooltipVisible ? 1 : 0, transition: "opacity 0.18s ease" }}>
            <rect x={tx} y={ty} width={tw} height={th} rx={7} ry={7}
              fill="white" stroke={color} strokeWidth={1.5} filter="url(#tt-shadow-cmp)" />
            <circle cx={tx + pad + dotR} cy={nameY - 2} r={dotR} fill={color} />
            <text x={tx + pad + dotR * 2 + 6} y={nameY} fontSize={14} fontWeight="700" fill={color}>
              {restaurantName}
            </text>
            <line x1={tx + 1} y1={dividerY} x2={tx + tw - 1} y2={dividerY} stroke="#F3F4F6" strokeWidth={1} />
            <text x={tx + pad} y={axisY} fontSize={13} fontWeight="700" fill="#374151">
              {axisLabel}
            </text>
            {(() => {
              const tagPad = 5;
              const tagH = 18;
              const tagW = scoreText.length * 8 + tagPad * 2;
              const tagX = tx + pad + 50;
              const tagY = axisY - tagH * 0.8;
              return (
                <>
                  <rect x={tagX} y={tagY} width={tagW} height={tagH} rx={4} ry={4} fill={color} fillOpacity={0.12} />
                  <text x={tagX + tagPad} y={tagY + tagH * 0.72} fontSize={12} fontWeight="600" fill={color}>
                    {scoreText}
                  </text>
                </>
              );
            })()}
            {noReview ? (
              <>
                <text x={tx + pad} y={dataStartY + 16} fontSize={11} fill="#9CA3AF">등록된 리뷰가 없어</text>
                <text x={tx + pad} y={dataStartY + 16 + 18} fontSize={11} fill="#9CA3AF">수치를 나타낼 수 없어요.</text>
              </>
            ) : (
              <>
                <text x={tx + pad} y={dataStartY + dataLineH} fontSize={12} fill="#374151">
                  {`긍정비율: ${item.positiveRatio}%`}
                </text>
                <text x={tx + pad} y={dataStartY + dataLineH * 2} fontSize={12} fill="#374151">
                  {`리뷰: ${item.reviewCount}건`}
                </text>
                {(() => {
                  const barW = tw - 2 * pad;
                  const total = (item.positiveCount ?? 0) + (item.negativeCount ?? 0);
                  const posW = total > 0
                    ? Math.round(((item.positiveCount ?? 0) / total) * barW)
                    : Math.round(((item.positiveRatio ?? 0) / 100) * barW);
                  const negW = barW - posW;
                  const barTop = dataStartY + 2 * dataLineH + 5;
                  const barH = 8;
                  const labelY = barTop + barH + 14;
                  return (
                    <>
                      <rect x={tx + pad} y={barTop} width={posW} height={barH} rx={3} ry={3} fill="#10B981" />
                      {negW > 0 && (
                        <rect x={tx + pad + posW} y={barTop} width={negW} height={barH} rx={3} ry={3} fill="#EF4444" />
                      )}
                      <text x={tx + pad} y={labelY} fontSize={11} fontWeight="500" fill="#10B981">
                        {`${item.positiveCount}건`}
                      </text>
                      <text x={tx + tw - pad} y={labelY} fontSize={11} fontWeight="500" fill="#EF4444" textAnchor="end">
                        {`${item.negativeCount}건`}
                      </text>
                    </>
                  );
                })()}
              </>
            )}
          </g>
        );
      })()}
    </svg>
  );
}

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

// ─── 측면별 비교 테이블 ────────────────────────────────────────────────────────

function AspectTable({ restaurants }: { restaurants: AnalysisRestaurant[] }) {
  const [viewMode, setViewMode] = useState<"percent" | "rank">("percent");
  const [sortByIdx, setSortByIdx] = useState<number | null>(null);
  const active = restaurants.slice(0, 3);

  const getRank = (key: AspectRadarKey, ri: number): number | null => {
    const scores = active.map((r) => r.aspectRadar?.[key]?.positiveRatio ?? -1);
    const myScore = scores[ri];
    if (myScore < 0) return null;
    return scores.filter((s) => s > myScore).length + 1;
  };

  const getWinners = (key: AspectRadarKey) => {
    const entries = active
      .map((r, i) => ({ i, ratio: r.aspectRadar?.[key]?.positiveRatio }))
      .filter((e): e is { i: number; ratio: number } => e.ratio != null);
    if (entries.length === 0) return [];
    const max = Math.max(...entries.map((e) => e.ratio));
    return entries.filter((e) => e.ratio === max);
  };

  const sortedAxes =
    sortByIdx == null
      ? RADAR_AXES
      : [...RADAR_AXES].sort((a, b) => {
          const aVal = active[sortByIdx]?.aspectRadar?.[a.key]?.positiveRatio ?? -1;
          const bVal = active[sortByIdx]?.aspectRadar?.[b.key]?.positiveRatio ?? -1;
          return bVal - aVal;
        });

  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[14px] font-semibold text-neutral-700">측면별 점수 비교</p>
        <div className="flex rounded-lg overflow-hidden border border-neutral-200 text-xs">
          <button
            onClick={() => setViewMode("percent")}
            className={`px-3 py-1.5 font-medium transition-colors ${
              viewMode === "percent" ? "bg-primary text-white" : "text-neutral-500 hover:bg-neutral-50"
            }`}
          >
            % 점수
          </button>
          <button
            onClick={() => setViewMode("rank")}
            className={`px-3 py-1.5 font-medium border-l border-neutral-200 transition-colors ${
              viewMode === "rank" ? "bg-primary text-white" : "text-neutral-500 hover:bg-neutral-50"
            }`}
          >
            순위
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left py-2 pr-3 typo-caption text-neutral-400 font-normal whitespace-nowrap">
                측면
              </th>
              {active.map((r, i) => (
                <th
                  key={r.restaurantId ?? i}
                  className="py-2 px-2 text-left typo-caption font-medium cursor-pointer select-none"
                  style={{ color: CARD_COLORS[i].stroke }}
                  onClick={() => setSortByIdx(sortByIdx === i ? null : i)}
                >
                  <div className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: CARD_COLORS[i].stroke }}
                    />
                    <span className="truncate max-w-30">{r.name}</span>
                    {sortByIdx === i && <span className="opacity-60" style={{ fontSize: 9 }}>↓</span>}
                  </div>
                </th>
              ))}
              {viewMode === "percent" && (
                <th className="py-2 pl-2 typo-caption text-neutral-400 font-medium text-right whitespace-nowrap">
                  1위 가게
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedAxes.map((axis) => {
              const winners = getWinners(axis.key);
              return (
                <tr key={axis.key} className="border-b border-neutral-50 last:border-0">
                  <td className="py-2.5 pr-3 whitespace-nowrap">
                    <span className="typo-caption text-neutral-600">{axis.label}</span>
                  </td>
                  {active.map((r, i) => {
                    const item = r.aspectRadar?.[axis.key];
                    if (viewMode === "percent") {
                      return (
                        <td key={i} className="py-2.5 px-2">
                          <div className="flex items-center gap-1.5 min-w-22.5">
                            <div className="flex-1 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  width: item ? `${item.positiveRatio}%` : "0%",
                                  backgroundColor: CARD_COLORS[i].stroke,
                                }}
                              />
                            </div>
                            <span
                              className="typo-caption font-semibold whitespace-nowrap w-9 text-right"
                              style={{ color: item ? CARD_COLORS[i].stroke : "#D1D5DB" }}
                            >
                              {item ? `${item.positiveRatio}%` : "—"}
                            </span>
                          </div>
                        </td>
                      );
                    } else {
                      const rank = getRank(axis.key, i);
                      return (
                        <td key={i} className="py-2.5 px-2 text-center">
                          <span
                            className="typo-caption font-semibold"
                            style={{ color: rank === 1 ? CARD_COLORS[i].stroke : "#9CA3AF" }}
                          >
                            {rank != null ? `${rank}위` : "—"}
                          </span>
                        </td>
                      );
                    }
                  })}
                  {viewMode === "percent" && (
                    <td className="py-2.5 pl-2 text-right">
                      {winners.length > 0 &&
                        (winners.length > 1 ? (
                          <span className="typo-caption font-semibold flex flex-col items-end gap-0.5">
                            {winners.map((w) => (
                              <span key={w.i} style={{ color: CARD_COLORS[w.i].stroke }}>
                                {active[w.i].name ?? `${w.i + 1}위`}
                              </span>
                            ))}
                            <span className="text-neutral-400">(공동 1위)</span>
                          </span>
                        ) : (
                          <span
                            className="typo-caption font-semibold"
                            style={{ color: CARD_COLORS[winners[0].i].stroke }}
                          >
                            {active[winners[0].i].name ?? `${winners[0].i + 1}위`}
                          </span>
                        ))}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── 공통 키워드 바 그룹 ──────────────────────────────────────────────────────

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
                <RestaurantCard
                  key={r.restaurantId ?? i}
                  restaurant={r}
                  color={CARD_COLORS[i].stroke}
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
                <div className="flex items-center gap-6">
                  <div className="flex-1 min-w-0">
                    <RadarChart restaurants={restaurants} />
                  </div>
                  <div className="w-44 shrink-0">
                    <ScorePanel restaurants={restaurants} />
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

            {/* 측면별 비교 테이블 */}
            {hasRadar && restaurants.length > 1 && (
              <div className="mb-4">
                <AspectTable restaurants={restaurants} />
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
