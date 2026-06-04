import { useEffect, useRef, useState } from "react";
import type { RadarRestaurant } from "./radarChart.constants";
import { RADAR_COLORS } from "./radarChart.constants";

const RADAR_AXES = [
  { label: "맛", key: "taste" },
  { label: "분위기", key: "mood" },
  { label: "서비스", key: "service" },
  { label: "가성비", key: "value" },
  { label: "시설", key: "facility" },
  { label: "대기", key: "waiting" },
] as const;

export default function RadarChart({ restaurants }: { restaurants: RadarRestaurant[] }) {
  const SIZE = 420;
  const CENTER = SIZE / 2;
  const RADIUS = 132;
  const LEVELS = 4;
  const N = RADAR_AXES.length;

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let rafId: number;
    let startTime: number | null = null;
    const duration = 975;
    const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const t = Math.min((ts - startTime) / duration, 1);
      setProgress(easeOutExpo(t));
      if (t < 1) rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const [hoveredAxis, setHoveredAxis] = useState<number | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showRafRef = useRef<number | null>(null);

  const [hoveredPoint, setHoveredPoint] = useState<{ ri: number; ai: number } | null>(null);
  const [pointTooltipVisible, setPointTooltipVisible] = useState(false);
  const pointHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointShowRafRef = useRef<number | null>(null);

  const handleAxisEnter = (axisIdx: number) => {
    if (hoveredPoint !== null) return;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (showRafRef.current != null) cancelAnimationFrame(showRafRef.current);
    setTooltipVisible(false);
    setHoveredAxis(axisIdx);
    showRafRef.current = requestAnimationFrame(() => {
      showRafRef.current = requestAnimationFrame(() => setTooltipVisible(true));
    });
  };

  const handleAxisLeave = () => {
    if (showRafRef.current != null) cancelAnimationFrame(showRafRef.current);
    setTooltipVisible(false);
    hideTimerRef.current = setTimeout(() => setHoveredAxis(null), 200);
  };

  const handlePointEnter = (ri: number, ai: number) => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (showRafRef.current != null) cancelAnimationFrame(showRafRef.current);
    setTooltipVisible(false);
    setHoveredAxis(null);
    if (pointHideTimerRef.current) clearTimeout(pointHideTimerRef.current);
    if (pointShowRafRef.current != null) cancelAnimationFrame(pointShowRafRef.current);
    setPointTooltipVisible(false);
    setHoveredPoint({ ri, ai });
    pointShowRafRef.current = requestAnimationFrame(() => {
      pointShowRafRef.current = requestAnimationFrame(() => setPointTooltipVisible(true));
    });
  };

  const handlePointLeave = () => {
    if (pointShowRafRef.current != null) cancelAnimationFrame(pointShowRafRef.current);
    setPointTooltipVisible(false);
    pointHideTimerRef.current = setTimeout(() => setHoveredPoint(null), 200);
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
  const getScore = (r: RadarRestaurant, key: string) => r.aspectRadar?.[key]?.score ?? 0;

  const axisTooltip = (() => {
    if (hoveredAxis === null) return null;
    const axis = RADAR_AXES[hoveredAxis];
    const labelPos = getXY(1.3, hoveredAxis);
    const tw = 236;
    const pad = 12;
    const titleH = 28;
    const rowH = 27;
    const barAreaX = 90;
    const barW = 92;
    const th = pad + titleH + 6 + active.length * rowH + pad;
    let tx = labelPos.x + 12;
    let ty = labelPos.y - th / 2;
    if (tx + tw > SIZE - 6) tx = labelPos.x - tw - 12;
    if (ty < 6) ty = 6;
    if (ty + th > SIZE - 6) ty = SIZE - th - 6;
    return { axis, tw, pad, titleH, rowH, barAreaX, barW, th, tx, ty };
  })();

  const clickTooltip = (() => {
    if (!hoveredPoint) return null;
    const { ri, ai } = hoveredPoint;
    if (ri >= active.length) return null;
    const r = active[ri];
    const axis = RADAR_AXES[ai];
    const item = r.aspectRadar?.[axis.key];
    const score = getScore(r, axis.key);
    const color = RADAR_COLORS[ri].stroke;
    const { x: px, y: py } = getXY(score, ai);
    const scoreText = `${(score * 100).toFixed(1)}점`;
    const noReview = (item?.reviewCount ?? 0) === 0;
    const pad = 14;
    const dotR = 5;
    const nameLineH = 26;
    const axisLineH = 22;
    const dataLineH = 19;
    const tw = 175;
    const th = noReview
      ? pad + nameLineH + 7 + axisLineH + 38 + pad
      : pad + nameLineH + 7 + axisLineH + dataLineH + 27 + dataLineH + pad;
    let tx = px + 14;
    let ty = py - th / 2;
    if (tx + tw > SIZE - 6) tx = px - tw - 14;
    if (ty < 6) ty = 6;
    if (ty + th > SIZE - 6) ty = SIZE - th - 6;
    return { r, ri, axis, item, score, color, scoreText, noReview, pad, dotR, nameLineH, axisLineH, dataLineH, tw, th, tx, ty };
  })();

  return (
    <svg
      width={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
    >
      <defs>
        <filter id="tt-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
        </filter>
      </defs>

      <g>
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

        {/* 식당별 데이터 폴리곤 */}
        {active.map((r, ri) => {
          const points = RADAR_AXES.map((axis, i) => {
            const { x, y } = getXY(getScore(r, axis.key) * progress, i);
            return `${x},${y}`;
          }).join(" ");
          const c = RADAR_COLORS[ri];
          return (
            <polygon
              key={ri} points={points}
              fill={c.fill} fillOpacity={0.15}
              stroke={c.stroke} strokeWidth={2} strokeLinejoin="round"
            />
          );
        })}

        {/* 축 호버 히트 영역 */}
        {RADAR_AXES.map((_, i) => {
          const start = getXY(0.88, i);
          const end = getXY(1.2, i);
          return (
            <line
              key={i}
              x1={start.x} y1={start.y}
              x2={end.x} y2={end.y}
              stroke="transparent" strokeWidth={14}
              style={{ pointerEvents: "all", cursor: "pointer" }}
              onMouseEnter={() => handleAxisEnter(i)}
              onMouseLeave={handleAxisLeave}
            />
          );
        })}

        {/* 데이터 점 */}
        {active.map((r, ri) =>
          RADAR_AXES.map((axis, i) => {
            const { x, y } = getXY(getScore(r, axis.key) * progress, i);
            const isHoveredPt = hoveredPoint?.ri === ri && hoveredPoint?.ai === i;
            return (
              <circle
                key={`${ri}-${i}`}
                cx={x} cy={y}
                r={isHoveredPt ? 5.5 : 4}
                fill={RADAR_COLORS[ri].stroke}
                stroke="white"
                strokeWidth={isHoveredPt ? 2 : 1.5}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => handlePointEnter(ri, i)}
                onMouseLeave={handlePointLeave}
              />
            );
          })
        )}

        {/* 축 레이블 */}
        {RADAR_AXES.map((axis, i) => {
          const angle = getAngle(i);
          const cosA = Math.cos(angle);
          const sinA = Math.sin(angle);
          const { x, y } = getXY(1.3, i);
          const textAnchor = Math.abs(cosA) < 0.2 ? "middle" : cosA > 0 ? "start" : "end";
          const dominantBaseline = Math.abs(sinA) < 0.2 ? "middle" : sinA > 0 ? "hanging" : "auto";
          const isHovered = hoveredAxis === i;
          return (
            <text
              key={i}
              x={x} y={y}
              textAnchor={textAnchor} dominantBaseline={dominantBaseline}
              fontSize={15} fontWeight={isHovered ? "700" : "600"}
              fill={isHovered ? "#FF6900" : "#374151"}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => handleAxisEnter(i)}
              onMouseLeave={handleAxisLeave}
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
              key={level}
              x={x + 5} y={y}
              fontSize={8.5} fill="#D1D5DB"
              textAnchor="start" dominantBaseline="middle"
            >
              {Math.round(level * 100)}%
            </text>
          );
        })}

        {/* 축별 비교 툴팁 */}
        {axisTooltip && (() => {
          const { axis, tw, pad, titleH, rowH, barAreaX, barW, th, tx, ty } = axisTooltip;
          const titleY = ty + pad + titleH * 0.72;
          const dividerY = ty + pad + titleH + 2;
          return (
            <g style={{ pointerEvents: "none", opacity: tooltipVisible ? 1 : 0, transition: "opacity 0.18s ease" }}>
              <rect x={tx} y={ty} width={tw} height={th} rx={8} ry={8}
                fill="white" stroke="#E5E7EB" strokeWidth={1.5} filter="url(#tt-shadow)" />
              <text x={tx + pad} y={titleY} fontSize={14} fontWeight="700" fill="#111827">
                {axis.label}
              </text>
              <line x1={tx + 1} y1={dividerY} x2={tx + tw - 1} y2={dividerY} stroke="#F3F4F6" strokeWidth={1} />
              {active.map((r, ri) => {
                const item = r.aspectRadar?.[axis.key];
                const ratio = item?.positiveRatio ?? null;
                const color = RADAR_COLORS[ri].stroke;
                const dotY = dividerY + 6 + ri * rowH + rowH * 0.5;
                const rowY = dividerY + 6 + ri * rowH + rowH * 0.72;
                const filledW = ratio != null ? Math.round((ratio / 100) * barW) : 0;
                return (
                  <g key={ri}>
                    <circle cx={tx + pad + 4} cy={dotY} r={4} fill={color} />
                    <text x={tx + pad + 14} y={rowY} fontSize={11} fontWeight="500" fill="#374151">
                      {(r.name ?? `${ri + 1}위`).slice(0, 8)}
                    </text>
                    <rect x={tx + barAreaX} y={dotY - 5} width={barW} height={9} rx={4} fill="#F3F4F6" />
                    {ratio != null && filledW > 0 && (
                      <rect x={tx + barAreaX} y={dotY - 5} width={filledW} height={9} rx={4} fill={color} fillOpacity={0.85} />
                    )}
                    <text x={tx + tw - pad} y={rowY} fontSize={12} fontWeight="700" fill={color} textAnchor="end">
                      {ratio != null ? `${ratio}%` : "—"}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })()}

        {/* 점 툴팁 */}
        {clickTooltip && (() => {
          const { r, ri, axis, item, color, scoreText, noReview, pad, dotR, nameLineH, axisLineH, dataLineH, tw, th, tx, ty } = clickTooltip;
          const nameY = ty + pad + nameLineH * 0.72;
          const dividerY = ty + pad + nameLineH + 3;
          const axisY = dividerY + 5 + axisLineH * 0.72;
          const dataStartY = axisY + axisLineH * 0.4;
          return (
            <g style={{ pointerEvents: "none", opacity: pointTooltipVisible ? 1 : 0, transition: "opacity 0.18s ease" }}>
              <rect x={tx} y={ty} width={tw} height={th} rx={7} ry={7}
                fill="white" stroke={color} strokeWidth={1.5} filter="url(#tt-shadow)" />
              <circle cx={tx + pad + dotR} cy={nameY - 2} r={dotR} fill={color} />
              <text x={tx + pad + dotR * 2 + 6} y={nameY} fontSize={14} fontWeight="700" fill={color}>
                {(r.name ?? `${ri + 1}위`).slice(0, 13)}
              </text>
              <line x1={tx + 1} y1={dividerY} x2={tx + tw - 1} y2={dividerY} stroke="#F3F4F6" strokeWidth={1} />
              <text x={tx + pad} y={axisY} fontSize={13} fontWeight="700" fill="#374151">
                {axis.label}
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
                    {`긍정비율: ${item?.positiveRatio}%`}
                  </text>
                  <text x={tx + pad} y={dataStartY + dataLineH * 2} fontSize={12} fill="#374151">
                    {`리뷰: ${item?.reviewCount}건`}
                  </text>
                  {(() => {
                    const barW = tw - 2 * pad;
                    const total = (item?.positiveCount ?? 0) + (item?.negativeCount ?? 0);
                    const posW = total > 0
                      ? Math.round(((item?.positiveCount ?? 0) / total) * barW)
                      : Math.round(((item?.positiveRatio ?? 0) / 100) * barW);
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
                          {`${item?.positiveCount}건`}
                        </text>
                        <text x={tx + tw - pad} y={labelY} fontSize={11} fontWeight="500" fill="#EF4444" textAnchor="end">
                          {`${item?.negativeCount}건`}
                        </text>
                      </>
                    );
                  })()}
                </>
              )}
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
