import { useEffect, useState } from "react";
import { RADAR_AXES } from "./constants";

export interface RadarSeries {
  label: string;
  color: string;
  data: Record<string, number>;
}

interface Props {
  series: RadarSeries[];
  bgColor?: string;
}

export default function GroupRadarChart({ series, bgColor = "#FFF7ED" }: Props) {
  const SIZE = 380;
  const CENTER = SIZE / 2;
  const RADIUS = 120;
  const LEVELS = 4;
  const N = RADAR_AXES.length;

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let rafId: number;
    let startTime: number | null = null;
    const duration = 900;
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

  return (
    <svg width="100%" viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ maxWidth: SIZE }}>
      <g>
        <polygon points={outerPoints} fill={bgColor} stroke="none" />
        {gridPolygons.map((points, l) => (
          <polygon key={l} points={points} fill="none" stroke="#E5E7EB" strokeWidth={1} />
        ))}
        {RADAR_AXES.map((_, i) => {
          const outer = getXY(1, i);
          return (
            <line key={i} x1={CENTER} y1={CENTER} x2={outer.x} y2={outer.y}
              stroke="#D1D5DB" strokeWidth={1} strokeDasharray="3,2" />
          );
        })}
        {series.map((s, si) => {
          const points = RADAR_AXES.map((axis, i) => {
            const val = (s.data[axis.key] ?? 0) * progress;
            const { x, y } = getXY(val, i);
            return `${x},${y}`;
          }).join(" ");
          return (
            <polygon key={si} points={points}
              fill={s.color} fillOpacity={0.12}
              stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" />
          );
        })}
        {series.map((s, si) =>
          RADAR_AXES.map((axis, i) => {
            const val = (s.data[axis.key] ?? 0) * progress;
            const { x, y } = getXY(val, i);
            return (
              <circle key={`${si}-${i}`} cx={x} cy={y} r={4}
                fill={s.color} stroke="white" strokeWidth={1.5} />
            );
          })
        )}
        {RADAR_AXES.map((axis, i) => {
          const angle = getAngle(i);
          const cosA = Math.cos(angle);
          const sinA = Math.sin(angle);
          const { x, y } = getXY(1.28, i);
          const textAnchor = Math.abs(cosA) < 0.2 ? "middle" : cosA > 0 ? "start" : "end";
          const dominantBaseline = Math.abs(sinA) < 0.2 ? "middle" : sinA > 0 ? "hanging" : "auto";
          return (
            <text key={i} x={x} y={y}
              textAnchor={textAnchor} dominantBaseline={dominantBaseline}
              fontSize={14} fontWeight="600" fill="#374151">
              {axis.label}
            </text>
          );
        })}
        {[0.25, 0.5, 0.75, 1.0].map((level) => {
          const { x, y } = getXY(level, 0);
          return (
            <text key={level} x={x + 5} y={y}
              fontSize={8.5} fill="#D1D5DB"
              textAnchor="start" dominantBaseline="middle">
              {Math.round(level * 100)}%
            </text>
          );
        })}
      </g>
    </svg>
  );
}
