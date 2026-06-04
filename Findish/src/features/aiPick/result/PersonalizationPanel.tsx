import type { AiPickRestaurantItem, AiPickPersonalization } from "@/types/aiPick";
import RadarChart from "@/components/common/RadarChart";
import { RADAR_COLORS } from "@/components/common/radarChart.constants";

function OverallScorePanel({ restaurants }: { restaurants: AiPickRestaurantItem[] }) {
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
              style={{ color: RADAR_COLORS[idx].stroke }}
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

interface Props {
  personalization?: AiPickPersonalization;
  restaurants: AiPickRestaurantItem[];
}

export default function PersonalizationPanel({ personalization, restaurants }: Props) {
  const personalizationMessage =
    personalization?.personalizationMessage ??
    (personalization?.vectorActive === false
      ? "좋아요를 더 누를수록 취향 분석이 정확해져요!"
      : null);

  const personaLabel = personalization?.personaLabel;
  const isDataInsufficient = !personalization?.vectorActive;
  const activeRestaurants = restaurants.slice(0, 3);

  const radarRestaurants = activeRestaurants.map((r) => ({
    name: r.name,
    aspectRadar: r.evidence?.aspectRadar,
  }));

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
          <RadarChart restaurants={radarRestaurants} />
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
              style={{ backgroundColor: RADAR_COLORS[i].stroke }}
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
