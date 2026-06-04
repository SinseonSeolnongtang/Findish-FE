import type { AiPickRestaurantItem } from "@/types/aiPick";
import RadarChart from "@/components/common/RadarChart";
import { RADAR_COLORS } from "@/components/common/radarChart.constants";

function HighlightedSummary({ text }: { text: string }) {
  const parts = text.split(/([\+\-]\d+(?:\.\d+)?점|'[^']+')/g);
  return (
    <>
      {parts.map((part, i) =>
        /^[\+\-]\d+(?:\.\d+)?점$/.test(part) || /^'[^']+'$/.test(part) ? (
          <span key={i} className="font-bold text-primary">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

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
  restaurants: AiPickRestaurantItem[];
}

export default function PersonalizationPanel({ restaurants }: Props) {
  const activeRestaurants = restaurants.slice(0, 3);

  const radarRestaurants = activeRestaurants.map((r) => ({
    name: r.name,
    aspectRadar: r.evidence?.aspectRadar,
  }));

  const summaryRestaurants = activeRestaurants.filter(
    (r) => r.evidence?.reasonSummary
  );

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-4">
            <RadarChart restaurants={radarRestaurants} />
            <div className="w-44 shrink-0">
              <OverallScorePanel restaurants={activeRestaurants} />
            </div>
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

      {summaryRestaurants.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 flex flex-col gap-3">
          <p className="typo-caption font-semibold text-neutral-500">AI 분석 요약</p>
          {summaryRestaurants.map((r, i) => {
            const colorIdx = activeRestaurants.findIndex(
              (ar) => ar.restaurantId === r.restaurantId
            );
            const color = RADAR_COLORS[colorIdx >= 0 ? colorIdx : i].stroke;
            return (
              <div
                key={r.restaurantId ?? i}
                className="flex gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                  style={{ backgroundColor: color }}
                />
                <div className="flex flex-col gap-0.5">
                  <span
                    className="typo-caption font-semibold"
                    style={{ color }}
                  >
                    {r.name}
                  </span>
                  <p className="typo-caption text-neutral-600 leading-relaxed">
                    <HighlightedSummary text={r.evidence!.reasonSummary!} />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
