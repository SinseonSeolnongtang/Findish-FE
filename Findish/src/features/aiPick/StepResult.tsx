import { useRef, useState } from "react";
import Keyword from "@/components/common/Keyword";
import StarFilled from "@/assets/icons/common/star_filled.svg?react";
import type {
  AiPickRestaurantItem,
  AiPickEvidenceKeyword,
  AiPickSituation,
  AiPickPersonalization,
} from "@/types/aiPick";

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
}

// ─── aiReason 파싱 헬퍼 ────────────────────────────────────────────────────────

function parseRestaurantPersona(aiReason?: string): string | null {
  if (!aiReason) return null;
  const match = aiReason.match(/\[이 식당\][^\S\n]+([^\n(]+)/);
  return match ? match[1].trim() : null;
}

function parseUserTasteMsg(aiReason?: string): string | null {
  if (!aiReason) return null;
  const match = aiReason.match(/\[당신의 취향\][^\S\n]+([^\n]+)/);
  return match ? match[1].trim() : null;
}

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const RESTAURANT_COLORS = [
  { stroke: "#FF6900", fill: "#FF6900" },
  { stroke: "#3B82F6", fill: "#3B82F6" },
  { stroke: "#10B981", fill: "#10B981" },
] as const;

type AspectKey =
  | "taste"
  | "mood"
  | "service"
  | "value"
  | "facility"
  | "waiting";

const RADAR_AXES: { label: string; key: AspectKey }[] = [
  { label: "맛", key: "taste" },
  { label: "분위기", key: "mood" },
  { label: "서비스", key: "service" },
  { label: "가성비", key: "value" },
  { label: "시설", key: "facility" },
  { label: "대기", key: "waiting" },
];

// ─── 육각형 레이더 차트 ────────────────────────────────────────────────────────

function RadarChart({ restaurants }: { restaurants: AiPickRestaurantItem[] }) {
  const SIZE = 420;
  const CENTER = SIZE / 2;
  const RADIUS = 132;
  const LEVELS = 4;
  const N = RADAR_AXES.length;

  const [hoveredPoint, setHoveredPoint] = useState<{
    ri: number;
    axisIdx: number;
  } | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showRafRef = useRef<number | null>(null);

  const handlePointEnter = (ri: number, axisIdx: number) => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (showRafRef.current != null) cancelAnimationFrame(showRafRef.current);
    // opacity=0 상태로 먼저 DOM에 추가한 뒤, 다음 페인트 프레임에서 opacity=1로 전환
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

  const getScore = (r: AiPickRestaurantItem, key: AspectKey) =>
    r.evidence?.aspectRadar?.[key]?.score ?? 0;

  const tooltipContent = (() => {
    if (!hoveredPoint) return null;
    const { ri, axisIdx } = hoveredPoint;
    const r = active[ri];
    const axis = RADAR_AXES[axisIdx];
    const item = r.evidence?.aspectRadar?.[axis.key];
    if (!item) return null;
    const { x, y } = getXY(getScore(r, axis.key), axisIdx);
    return { x, y, item, ri, axisLabel: axis.label };
  })();

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ maxWidth: SIZE }}
    >
      <defs>
        <filter id="tt-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* 바깥 배경 */}
      <polygon points={outerPoints} fill="#FFF7ED" stroke="none" />

      {/* 그리드 */}
      {gridPolygons.map((points, l) => (
        <polygon
          key={l}
          points={points}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={1}
        />
      ))}

      {/* 축 선 */}
      {RADAR_AXES.map((_, i) => {
        const outer = getXY(1, i);
        return (
          <line
            key={i}
            x1={CENTER}
            y1={CENTER}
            x2={outer.x}
            y2={outer.y}
            stroke="#D1D5DB"
            strokeWidth={1}
            strokeDasharray="3,2"
          />
        );
      })}

      {/* 데이터 폴리곤 */}
      {active.map((r, ri) => {
        const points = RADAR_AXES.map((axis, i) => {
          const { x, y } = getXY(getScore(r, axis.key), i);
          return `${x},${y}`;
        }).join(" ");
        const c = RESTAURANT_COLORS[ri];
        return (
          <polygon
            key={ri}
            points={points}
            fill={c.fill}
            fillOpacity={0.15}
            stroke={c.stroke}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        );
      })}

      {/* 데이터 점 (호버 이벤트 포함) */}
      {active.map((r, ri) =>
        RADAR_AXES.map((axis, i) => {
          const { x, y } = getXY(getScore(r, axis.key), i);
          const isHovered =
            hoveredPoint?.ri === ri && hoveredPoint?.axisIdx === i;
          return (
            <circle
              key={`${ri}-${i}`}
              cx={x}
              cy={y}
              r={isHovered ? 5.5 : 4}
              fill={RESTAURANT_COLORS[ri].stroke}
              stroke="white"
              strokeWidth={1.5}
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

        const textAnchor =
          Math.abs(cosA) < 0.2 ? "middle" : cosA > 0 ? "start" : "end";
        const dominantBaseline =
          Math.abs(sinA) < 0.2 ? "middle" : sinA > 0 ? "hanging" : "auto";

        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor={textAnchor}
            dominantBaseline={dominantBaseline}
            fontSize={15}
            fontWeight="600"
            fill="#374151"
          >
            {axis.label}
          </text>
        );
      })}

      {/* 그리드 레벨 수치 (25 / 50 / 75 / 100%) */}
      {[0.25, 0.5, 0.75, 1.0].map((level) => {
        const { x, y } = getXY(level, 0);
        return (
          <text
            key={level}
            x={x + 5}
            y={y}
            fontSize={8.5}
            fill="#D1D5DB"
            textAnchor="start"
            dominantBaseline="middle"
          >
            {Math.round(level * 100)}%
          </text>
        );
      })}

      {/* 호버 툴팁 */}
      {tooltipContent &&
        (() => {
          const { x, y, item, ri, axisLabel } = tooltipContent;
          const color = RESTAURANT_COLORS[ri].stroke;
          const restaurantName = active[ri].name ?? `${ri + 1}위`;
          const scoreText = `${(item.score * 100).toFixed(1)}점`;
          const pad = 14;
          const dotR = 5;
          const nameLineH = 26;
          const axisLineH = 22;
          const dataLineH = 19;
          const tw = 175;
          const noReview = (item.reviewCount ?? 0) === 0;
          // 리뷰 없음: 안내 문구 2줄(38px) / 정상: 긍정비율 + bar(27) + 리뷰
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
            <g
              style={{
                pointerEvents: "none",
                opacity: tooltipVisible ? 1 : 0,
                transition: "opacity 0.18s ease",
              }}
            >
              <rect
                x={tx}
                y={ty}
                width={tw}
                height={th}
                rx={7}
                ry={7}
                fill="white"
                stroke={color}
                strokeWidth={1.5}
                filter="url(#tt-shadow)"
              />
              {/* 가게명 + 컬러 도트 */}
              <circle
                cx={tx + pad + dotR}
                cy={nameY - 2}
                r={dotR}
                fill={color}
              />
              <text
                x={tx + pad + dotR * 2 + 6}
                y={nameY}
                fontSize={14}
                fontWeight="700"
                fill={color}
              >
                {restaurantName}
              </text>
              {/* 구분선 */}
              <line
                x1={tx + 1}
                y1={dividerY}
                x2={tx + tw - 1}
                y2={dividerY}
                stroke="#F3F4F6"
                strokeWidth={1}
              />
              {/* 축 이름 + 점수 태그 */}
              <text
                x={tx + pad}
                y={axisY}
                fontSize={13}
                fontWeight="700"
                fill="#374151"
              >
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
                    <rect
                      x={tagX}
                      y={tagY}
                      width={tagW}
                      height={tagH}
                      rx={4}
                      ry={4}
                      fill={color}
                      fillOpacity={0.12}
                    />
                    <text
                      x={tagX + tagPad}
                      y={tagY + tagH * 0.72}
                      fontSize={12}
                      fontWeight="600"
                      fill={color}
                    >
                      {scoreText}
                    </text>
                  </>
                );
              })()}
              {noReview ? (
                <>
                  <text
                    x={tx + pad}
                    y={dataStartY + 16}
                    fontSize={11}
                    fill="#9CA3AF"
                  >
                    등록된 리뷰가 없어
                  </text>
                  <text
                    x={tx + pad}
                    y={dataStartY + 16 + 18}
                    fontSize={11}
                    fill="#9CA3AF"
                  >
                    수치를 나타낼 수 없어요.
                  </text>
                </>
              ) : (
                <>
                  {/* 긍정비율 */}
                  <text
                    x={tx + pad}
                    y={dataStartY + dataLineH}
                    fontSize={12}
                    fontWeight="400"
                    fill="#374151"
                  >
                    {`긍정비율: ${item.positiveRatio}%`}
                  </text>

                  {/* 리뷰 */}
                  <text
                    x={tx + pad}
                    y={dataStartY + dataLineH + dataLineH}
                    fontSize={12}
                    fontWeight="400"
                    fill="#374151"
                  >
                    {`리뷰: ${item.reviewCount}건`}
                  </text>

                  {/* 긍정/부정 막대 그래프 */}
                  {(() => {
                    const barW = tw - 2 * pad;
                    const total = item.positiveCount + item.negativeCount;
                    const posW =
                      total > 0
                        ? Math.round((item.positiveCount / total) * barW)
                        : Math.round((item.positiveRatio / 100) * barW);
                    const negW = barW - posW;
                    const barTop = dataStartY + 2 * dataLineH + 5;
                    const barH = 8;
                    const labelY = barTop + barH + 14;
                    return (
                      <>
                        <rect
                          x={tx + pad}
                          y={barTop}
                          width={posW}
                          height={barH}
                          rx={3}
                          ry={3}
                          fill="#10B981"
                        />
                        {negW > 0 && (
                          <rect
                            x={tx + pad + posW}
                            y={barTop}
                            width={negW}
                            height={barH}
                            rx={3}
                            ry={3}
                            fill="#EF4444"
                          />
                        )}
                        <text
                          x={tx + pad}
                          y={labelY}
                          fontSize={11}
                          fontWeight="500"
                          fill="#10B981"
                        >
                          {`${item.positiveCount}건`}
                        </text>
                        <text
                          x={tx + tw - pad}
                          y={labelY}
                          fontSize={11}
                          fontWeight="500"
                          fill="#EF4444"
                          textAnchor="end"
                        >
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

// ─── 개인화 패널 ───────────────────────────────────────────────────────────────

function PersonalizationPanel({
  personalization,
  restaurants,
}: {
  personalization?: AiPickPersonalization;
  restaurants: AiPickRestaurantItem[];
}) {
  const personalizationMessage =
    parseUserTasteMsg(
      restaurants.find((r) => r.evidence?.aiReason)?.evidence?.aiReason,
    ) ?? (personalization?.vectorActive === false
      ? "좋아요를 더 누를수록 취향 분석이 정확해져요!"
      : null);

  const personaLabel = personalization?.personaLabel;
  const isDataInsufficient = !personalization?.vectorActive;
  const activeRestaurants = restaurants.slice(0, 3);

  return (
    <div className="w-full bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="typo-body-sm font-semibold text-neutral-700">나의 취향 매칭</p>
        {personaLabel && (
          <span
            className={`typo-caption font-semibold px-2.5 py-1 rounded-full ${
              isDataInsufficient
                ? "bg-neutral-100 text-neutral-500"
                : "bg-orange-100 text-primary"
            }`}
          >
            {personaLabel}
          </span>
        )}
      </div>

      {personalizationMessage && (
        <p className="typo-caption text-neutral-400 mb-4">{personalizationMessage}</p>
      )}

      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <RadarChart restaurants={activeRestaurants} />
        </div>
        <div className="w-44 shrink-0">
          <OverallScorePanel restaurants={activeRestaurants} />
        </div>
      </div>

      <div className="flex justify-center gap-5 mt-4 flex-wrap">
        {activeRestaurants.map((r, i) => (
          <div key={r.restaurantId ?? i} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: RESTAURANT_COLORS[i].stroke }}
            />
            <span className="typo-caption text-neutral-600 font-medium">
              {r.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 종합 점수 패널 ────────────────────────────────────────────────────────────

function OverallScorePanel({
  restaurants,
}: {
  restaurants: AiPickRestaurantItem[];
}) {
  const ranked = restaurants
    .slice(0, 3)
    .map((r, idx) => {
      const radar = r.evidence?.aspectRadar;
      const items = radar ? Object.values(radar) : [];
      const avgScore =
        items.length > 0
          ? items.reduce((s, v) => s + (v?.score ?? 0), 0) / items.length
          : 0;
      return { r, idx, score: r.evidence?.matchScore ?? avgScore };
    })
    .sort((a, b) => b.score - a.score);

  const medalBg = ["#F59E0B", "#9CA3AF", "#A87B52"];

  return (
    <div className="flex flex-col gap-2.5">
      <p className="typo-caption font-semibold text-neutral-500 text-center">
        종합 점수
      </p>
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
              style={{ color: RESTAURANT_COLORS[idx].stroke }}
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

// ─── 측면별 점수 비교 ──────────────────────────────────────────────────────────

function AspectComparison({
  restaurants,
}: {
  restaurants: AiPickRestaurantItem[];
}) {
  const [viewMode, setViewMode] = useState<"percent" | "rank">("percent");
  const [sortByIdx, setSortByIdx] = useState<number | null>(null);
  const active = restaurants.slice(0, 3);

  const getRank = (key: AspectKey, ri: number): number | null => {
    const scores = active.map(
      (r) => r.evidence?.aspectRadar?.[key]?.positiveRatio ?? -1,
    );
    const myScore = scores[ri];
    if (myScore < 0) return null;
    return scores.filter((s) => s > myScore).length + 1;
  };

  const getWinners = (key: AspectKey) => {
    const entries = active
      .map((r, i) => ({
        i,
        ratio: r.evidence?.aspectRadar?.[key]?.positiveRatio,
      }))
      .filter((e): e is { i: number; ratio: number } => e.ratio != null);
    if (entries.length === 0) return [];
    const max = Math.max(...entries.map((e) => e.ratio));
    return entries.filter((e) => e.ratio === max);
  };

  const sortedAxes =
    sortByIdx == null
      ? RADAR_AXES
      : [...RADAR_AXES].sort((a, b) => {
          const aVal =
            active[sortByIdx]?.evidence?.aspectRadar?.[a.key]?.positiveRatio ??
            -1;
          const bVal =
            active[sortByIdx]?.evidence?.aspectRadar?.[b.key]?.positiveRatio ??
            -1;
          return bVal - aVal;
        });

  return (
    <div className="w-full bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="typo-body-sm font-semibold text-neutral-700">
          측면별 점수 비교
        </p>
        <div className="flex rounded-lg overflow-hidden border border-neutral-200 text-xs">
          <button
            onClick={() => setViewMode("percent")}
            className={`px-3 py-1.5 font-medium transition-colors ${
              viewMode === "percent"
                ? "bg-primary text-white"
                : "text-neutral-500 hover:bg-neutral-50"
            }`}
          >
            % 점수
          </button>
          <button
            onClick={() => setViewMode("rank")}
            className={`px-3 py-1.5 font-medium border-l border-neutral-200 transition-colors ${
              viewMode === "rank"
                ? "bg-primary text-white"
                : "text-neutral-500 hover:bg-neutral-50"
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
                  style={{ color: RESTAURANT_COLORS[i].stroke }}
                  onClick={() => setSortByIdx(sortByIdx === i ? null : i)}
                >
                  <div className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: RESTAURANT_COLORS[i].stroke }}
                    />
                    <span className="truncate max-w-30">{r.name}</span>
                    {sortByIdx === i && (
                      <span className="opacity-60" style={{ fontSize: 9 }}>
                        ↓
                      </span>
                    )}
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
                <tr
                  key={axis.key}
                  className="border-b border-neutral-50 last:border-0"
                >
                  <td className="py-2.5 pr-3 whitespace-nowrap">
                    <span className="typo-caption text-neutral-600">
                      {axis.label}
                    </span>
                  </td>
                  {active.map((r, i) => {
                    const item = r.evidence?.aspectRadar?.[axis.key];
                    if (viewMode === "percent") {
                      return (
                        <td key={i} className="py-2.5 px-2">
                          <div className="flex items-center gap-1.5 min-w-[90px]">
                            <div className="flex-1 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  width: item ? `${item.positiveRatio}%` : "0%",
                                  backgroundColor: RESTAURANT_COLORS[i].stroke,
                                }}
                              />
                            </div>
                            <span
                              className="typo-caption font-semibold whitespace-nowrap w-9 text-right"
                              style={{
                                color: item
                                  ? RESTAURANT_COLORS[i].stroke
                                  : "#D1D5DB",
                              }}
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
                            style={{
                              color:
                                rank === 1
                                  ? RESTAURANT_COLORS[i].stroke
                                  : "#9CA3AF",
                            }}
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
                              <span
                                key={w.i}
                                style={{ color: RESTAURANT_COLORS[w.i].stroke }}
                              >
                                {active[w.i].name ?? `${w.i + 1}위`}
                              </span>
                            ))}
                            <span className="text-neutral-400">(공동 1위)</span>
                          </span>
                        ) : (
                          <span
                            className="typo-caption font-semibold"
                            style={{
                              color: RESTAURANT_COLORS[winners[0].i].stroke,
                            }}
                          >
                            {active[winners[0].i].name ??
                              `${winners[0].i + 1}위`}
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

// ─── 키워드 바 차트 ────────────────────────────────────────────────────────────

function KeywordBars({
  keywords,
  color,
}: {
  keywords: AiPickEvidenceKeyword[];
  color: string;
}) {
  const top = [...keywords]
    .sort((a, b) => b.total_mentions - a.total_mentions)
    .slice(0, 6);
  const maxM = top[0]?.total_mentions ?? 1;

  return (
    <div className="space-y-2">
      {top.map((kw) => (
        <div key={kw.keyword} className="flex items-center gap-2">
          <span className="typo-caption text-neutral-500 w-14 shrink-0 truncate text-right">
            {kw.keyword}
          </span>
          <div className="flex-1 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(kw.total_mentions / maxM) * 100}%`,
                backgroundColor: color,
              }}
            />
          </div>
          <span className="typo-caption text-neutral-400 w-6 text-right shrink-0">
            {kw.total_mentions}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── 식당 카드 ─────────────────────────────────────────────────────────────────

function RestaurantCard({
  r,
  rank,
  color,
}: {
  r: AiPickRestaurantItem;
  rank: number;
  color: (typeof RESTAURANT_COLORS)[number];
}) {
  return (
    <div className="w-full bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
      {/* 썸네일 */}
      <div className="relative h-36">
        {r.thumbnailUrl ? (
          <img
            src={r.thumbnailUrl}
            alt={r.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
            <span className="typo-caption text-neutral-400">이미지 없음</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

        {/* 순위 배지 */}
        <div
          className="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-white font-bold typo-caption"
          style={{ backgroundColor: color.stroke }}
        >
          {rank}
        </div>

        {/* matchScore 배지 */}
        {r.evidence?.matchScore != null && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white rounded-full px-2.5 py-0.5 flex items-center gap-1">
            <StarFilled width={10} height={10} fill="#FFD700" />
            <span className="text-[10px] font-semibold">
              {r.evidence.matchScore.toFixed(3)}
            </span>
          </div>
        )}

        {/* 이름 + 카테고리 + 주소 */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end gap-2 flex-wrap">
            <h3 className="typo-t1 font-bold text-white leading-tight">
              {r.name}
            </h3>
            {r.category && (
              <span className="typo-caption text-white/80 mb-0.5 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                {r.category}
              </span>
            )}
          </div>
          {r.address && (
            <p className="typo-caption text-white/70 mt-1 flex items-center gap-1">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3 h-3 shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-2.003 3.5-4.697 3.5-8.327a8.25 8.25 0 0 0-16.5 0c0 3.63 1.556 6.324 3.5 8.327a19.58 19.58 0 0 0 2.683 2.282 16.975 16.975 0 0 0 1.144.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  clipRule="evenodd"
                />
              </svg>
              {r.address}
            </p>
          )}
        </div>
      </div>

      {/* 정보 배지 */}
      <div className="px-4 pt-3 pb-1 flex flex-nowrap gap-2">
        {/* 주차 */}
        {r.parking === true && (
          <span className="flex items-center gap-1 typo-caption bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
            </svg>
            주차 가능
          </span>
        )}
        {r.parking === false && (
          <span className="flex items-center gap-1 typo-caption bg-neutral-50 text-neutral-400 px-2.5 py-1 rounded-full border border-neutral-200">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
            </svg>
            주차 불가
          </span>
        )}

        {/* 단체석 */}
        {r.groupSeating === true && (
          <span className="flex items-center gap-1 typo-caption bg-green-50 text-green-600 px-2.5 py-1 rounded-full border border-green-100">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
            </svg>
            단체석 가능
          </span>
        )}
        {r.groupSeating === false && (
          <span className="flex items-center gap-1 typo-caption bg-neutral-50 text-neutral-400 px-2.5 py-1 rounded-full border border-neutral-200">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
            </svg>
            단체석 없음
          </span>
        )}

        {/* 리뷰 수 */}
        {r.reviewCount != null && (
          <span className="flex items-center gap-1 typo-caption bg-neutral-50 text-neutral-500 px-2.5 py-1 rounded-full border border-neutral-200">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path
                fillRule="evenodd"
                d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                clipRule="evenodd"
              />
            </svg>
            리뷰 {r.reviewCount}건
          </span>
        )}

        {/* 가격 범위 */}
        {r.priceRange && (
          <span className="flex items-center gap-1 typo-caption bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full border border-amber-100">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
                clipRule="evenodd"
              />
            </svg>
            {r.priceRange}
          </span>
        )}
      </div>

      {/* 식당 페르소나 */}
      {(() => {
        const persona = parseRestaurantPersona(r.evidence?.aiReason);
        return persona ? (
          <div className="px-4 pt-3 pb-1">
            <span className="inline-flex items-center gap-1 typo-caption font-semibold text-primary bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">
              <span className="text-[10px]">✦</span>
              {persona}
            </span>
          </div>
        ) : null;
      })()}

      {/* 매칭 키워드 칩 */}
      {r.evidence?.matchedKeywords && r.evidence.matchedKeywords.length > 0 && (
        <div className="px-4 pt-2 pb-1">
          <p className="typo-caption text-neutral-400 mb-1.5">매칭 키워드</p>
          <div className="flex flex-wrap gap-1.5">
            {r.evidence.matchedKeywords.map((kw) => (
              <Keyword key={kw} label={kw} />
            ))}
          </div>
        </div>
      )}

      {/* 주요 키워드 바 차트 */}
      {r.evidence?.keywords && r.evidence.keywords.length > 0 && (
        <div className="px-4 pt-2 pb-4">
          <p className="typo-caption text-neutral-400 mb-2">주요 언급 키워드</p>
          <KeywordBars keywords={r.evidence.keywords} color={color.stroke} />
        </div>
      )}
    </div>
  );
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

export default function StepResult({
  restaurants,
  personalization,
}: Props) {
  const activeRestaurants = restaurants.slice(0, 3);

  return (
    <div className="flex flex-col items-center gap-5 px-6 py-10 w-full max-w-6xl mx-auto">
      {/* 개인화 패널 — 레이더 포함 */}
      {activeRestaurants.length > 1 && (
        <div className="w-full">
          <PersonalizationPanel
            personalization={personalization}
            restaurants={activeRestaurants}
          />
        </div>
      )}

      {/* 측면별 점수 비교 */}
      {activeRestaurants.length > 1 && (
        <div className="w-full max-w-2xl">
          <AspectComparison restaurants={activeRestaurants} />
        </div>
      )}

      {/* 식당 카드 — 3열 가로 배치 */}
      <div className="w-full grid grid-cols-3 gap-4">
        {activeRestaurants.map((r, i) => (
          <RestaurantCard
            key={r.restaurantId ?? i}
            r={r}
            rank={i + 1}
            color={RESTAURANT_COLORS[i]}
          />
        ))}
      </div>
    </div>
  );
}
