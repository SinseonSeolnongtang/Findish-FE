import Button from "@/components/common/Button";
import Keyword from "@/components/common/Keyword";
import { PRIORITY_LABEL, SITUATION_LABEL } from "@/constants/aiPick";
import StarFilled from "@/assets/icons/common/star_filled.svg?react";
import type {
  AiPickPriority,
  AiPickRestaurantItem,
  AiPickSituation,
} from "@/types/aiPick";

export interface SelectedConditions {
  situation: AiPickSituation | "";
  budgetMin: number;
  budgetMax: number;
  priorities: AiPickPriority[];
  extraCondition?: string;
  companionCount?: number;
}

interface Props {
  title: string;
  restaurants: AiPickRestaurantItem[];
  conditions?: SelectedConditions;
  onReset: () => void;
}

export default function StepResult({
  title,
  restaurants,
  conditions,
  onReset,
}: Props) {
  const chips: string[] = [];
  if (conditions) {
    if (conditions.companionCount)
      chips.push(`친구 ${conditions.companionCount}명`);
    if (conditions.situation) chips.push(SITUATION_LABEL[conditions.situation]);
    chips.push(
      `${conditions.budgetMin.toLocaleString("ko-KR")}원 ~ ${conditions.budgetMax.toLocaleString("ko-KR")}원`,
    );
    conditions.priorities.forEach((p) => chips.push(PRIORITY_LABEL[p]));
  }

  return (
    <div className="flex flex-col items-center gap-5 px-8 py-10">
      <p className="typo-body-md text-neutral-500">AI가 선택한 가게는</p>

      {/* AI 메시지 */}
      <div className="w-full max-w-130 flex items-start gap-2.5 bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4">
        <StarFilled width={15} height={15} fill="#ff6900" className="shrink-0 mt-0.5" />
        <p className="typo-body-sm text-neutral-700 leading-relaxed">
          Findish AI가 {title}에 딱 맞는 가게를 골라봤어요!
        </p>
      </div>

      {/* 선택한 조건 요약 */}
      {conditions && (
        <div className="w-full max-w-130 flex flex-col gap-2">
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

      {/* 추천 식당 카드 목록 */}
      {restaurants.map((r) => (
        <div
          key={r.restaurantId}
          className="w-full max-w-130 bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden"
        >
          {/* 히어로 이미지 */}
          <div className="relative h-52">
            <img
              src={r.thumbnailUrl}
              alt={r.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />

            {/* 이름 + 카테고리 + 주소 */}
            <div className="absolute bottom-4 left-5 right-5">
              <div className="flex items-end gap-2">
                <h2 className="typo-h3 font-bold text-white leading-tight">
                  {r.name}
                </h2>
                <span className="typo-caption text-white/75 mb-0.5">
                  {r.category}
                </span>
              </div>
              <p className="typo-caption text-white/70 mt-0.5">{r.address}</p>
            </div>
          </div>

          {/* 태그 */}
          <div className="px-5 py-3 flex flex-wrap gap-1.5">
            {(r.tags ?? []).map((tag) => (
              <Keyword key={tag} label={tag} />
            ))}
          </div>
        </div>
      ))}

      {/* 액션 버튼 */}
      <div className="flex gap-3 mt-2">
        <Button variant="outline" size="sm" onClick={onReset}>
          다시 설정
        </Button>
        <Button variant="primary" size="sm">
          가게 보러가기
        </Button>
      </div>
    </div>
  );
}
