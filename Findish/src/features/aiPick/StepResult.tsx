import Button from "@/components/common/Button";
import Keyword from "@/components/common/Keyword";
import { SITUATION_LABEL } from "@/constants/aiPick";
import StarFilled from "@/assets/icons/common/star_filled.svg?react";
import TrashIcon from "@/assets/icons/common/trash.svg?react";
import type {
  AiPickRestaurantItem,
  AiPickEvidenceKeyword,
  AiPickSituation,
} from "@/types/aiPick";

export interface SelectedConditions {
  situation: AiPickSituation | "";
  budgetMin: number;
  budgetMax: number;
  extraCondition?: string;
  companionCount?: number;
}

interface Props {
  title: string;
  aiMessage?: string;
  restaurants: AiPickRestaurantItem[];
  conditions?: SelectedConditions;
  onReset: () => void;
  onDelete?: () => void;
}

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const RESTAURANT_COLORS = [
  { stroke: "#FF6900", fill: "#FF6900" },
  { stroke: "#3B82F6", fill: "#3B82F6" },
  { stroke: "#10B981", fill: "#10B981" },
] as const;

const RADAR_AXES = [
  {
    label: "AI 점수",
    getValue: (r: AiPickRestaurantItem) =>
      Math.min((r.evidence?.matchScore ?? 0) / 1.2, 1),
  },
  {
    label: "규칙 적합도",
    getValue: (r: AiPickRestaurantItem) =>
      (r.evidence?.breakdown?.["rule"] ?? 0) as number,
  },
  {
    label: "가격 적합도",
    getValue: (r: AiPickRestaurantItem) =>
      (r.evidence?.breakdown?.["priceFit"] ?? 0) as number,
  },
  {
    label: "전체 매칭",
    getValue: (r: AiPickRestaurantItem) =>
      (r.evidence?.breakdown?.["overallMatch"] ?? 0) as number,
  },
  {
    label: "측면 분석",
    getValue: (r: AiPickRestaurantItem) =>
      (r.evidence?.breakdown?.["aspectSummary"] ?? 0) as number,
  },
  {
    label: "의미 매칭",
    getValue: (r: AiPickRestaurantItem) =>
      Math.min(
        ((r.evidence?.breakdown?.["softMatch"] ?? 0) as number) * 8,
        1,
      ),
  },
];

// ─── 육각형 레이더 차트 ────────────────────────────────────────────────────────

function RadarChart({ restaurants }: { restaurants: AiPickRestaurantItem[] }) {
  const SIZE = 280;
  const CENTER = SIZE / 2;
  const RADIUS = 88;
  const LEVELS = 4;
  const N = RADAR_AXES.length;

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

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ maxWidth: SIZE }}
    >
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
          const { x, y } = getXY(axis.getValue(r), i);
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

      {/* 데이터 점 */}
      {active.map((r, ri) =>
        RADAR_AXES.map((axis, i) => {
          const { x, y } = getXY(axis.getValue(r), i);
          return (
            <circle
              key={`${ri}-${i}`}
              cx={x}
              cy={y}
              r={3.5}
              fill={RESTAURANT_COLORS[ri].stroke}
              stroke="white"
              strokeWidth={1.5}
            />
          );
        }),
      )}

      {/* 축 레이블 */}
      {RADAR_AXES.map((axis, i) => {
        const angle = getAngle(i);
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const { x, y } = getXY(1.28, i);

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
            fontSize={10}
            fill="#6B7280"
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
            x={x + 4}
            y={y}
            fontSize={7.5}
            fill="#D1D5DB"
            textAnchor="start"
            dominantBaseline="middle"
          >
            {Math.round(level * 100)}%
          </text>
        );
      })}
    </svg>
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
          <span className="typo-caption text-neutral-500 w-18 shrink-0 truncate text-right">
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
      <div className="relative h-44">
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
      <div className="px-4 pt-3 pb-1 flex flex-wrap gap-2">
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

      {/* AI 추천 이유 */}
      {r.evidence?.reasons && r.evidence.reasons.length > 0 && (
        <div className="px-4 pt-2 pb-1 flex flex-wrap gap-1.5">
          {r.evidence.reasons.map((reason) => (
            <Keyword key={reason} label={reason} />
          ))}
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
  title,
  aiMessage,
  restaurants,
  conditions,
  onReset,
  onDelete,
}: Props) {
  const chips: string[] = [];
  if (conditions) {
    if (conditions.companionCount)
      chips.push(`친구 ${conditions.companionCount}명`);
    if (conditions.situation) chips.push(SITUATION_LABEL[conditions.situation]);
    chips.push(
      `${conditions.budgetMin.toLocaleString("ko-KR")}원 ~ ${conditions.budgetMax.toLocaleString("ko-KR")}원`,
    );
  }

  const activeRestaurants = restaurants.slice(0, 3);

  return (
    <div className="flex flex-col items-center gap-5 px-6 py-10 max-w-2xl mx-auto">
      <p className="typo-body-md text-neutral-500">AI가 선택한 가게는</p>

      {/* AI 메시지 */}
      <div className="w-full flex items-start gap-2.5 bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4">
        <StarFilled
          width={15}
          height={15}
          fill="#ff6900"
          className="shrink-0 mt-0.5"
        />
        <p className="typo-body-sm text-neutral-700 leading-relaxed">
          {aiMessage ?? `Findish AI가 ${title}에 딱 맞는 가게를 골라봤어요!`}
        </p>
      </div>

      {/* 선택한 조건 요약 */}
      {conditions && (
        <div className="w-full flex flex-col gap-2">
          <p className="typo-caption text-neutral-400">내가 고른 조건</p>
          <div className="flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <Keyword key={chip} label={chip} />
            ))}
          </div>
          {conditions.extraCondition && (
            <p className="typo-caption text-neutral-400 italic">
              "{conditions.extraCondition}"
            </p>
          )}
        </div>
      )}

      {/* 육각형 레이더 차트 — 3곳 종합 비교 */}
      {activeRestaurants.length > 1 && (
        <div className="w-full bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          <p className="typo-body-sm font-semibold text-neutral-700 mb-1 text-center">
            AI 종합 비교 분석
          </p>
          <p className="typo-caption text-neutral-400 mb-4 text-center">
            6개 항목을 기준으로 3곳을 한눈에 비교해요
          </p>
          <div className="flex justify-center">
            <RadarChart restaurants={activeRestaurants} />
          </div>
          {/* 범례 */}
          <div className="flex justify-center gap-5 mt-3 flex-wrap">
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
      )}

      {/* 식당 카드 목록 */}
      <div className="w-full flex flex-col gap-4">
        {activeRestaurants.map((r, i) => (
          <RestaurantCard
            key={r.restaurantId ?? i}
            r={r}
            rank={i + 1}
            color={RESTAURANT_COLORS[i]}
          />
        ))}
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center gap-3 mt-2">
        <Button variant="outline" size="sm" onClick={onReset}>
          다시 설정
        </Button>
        <Button variant="primary" size="sm">
          가게 보러가기
        </Button>
        {onDelete && (
          <button
            onClick={onDelete}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-neutral-200 text-neutral-400 hover:border-red-300 hover:text-red-400 transition-colors"
            aria-label="프리셋 삭제"
          >
            <TrashIcon width={16} height={16} />
          </button>
        )}
      </div>
    </div>
  );
}
