import type { AiPickRestaurantItem } from '@/types/aiPick';

interface Props {
  aiMessage: string;
  restaurants: AiPickRestaurantItem[];
  onReset: () => void;
}

export default function StepResult({ aiMessage, restaurants, onReset }: Props) {
  return (
    <div className="flex flex-col items-center gap-5 px-8 py-10">
      <p className="typo-body-md text-neutral-500">AI가 선택한 가게는</p>

      {/* AI 메시지 */}
      <div className="w-full max-w-130 flex items-start gap-2.5 bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#ff6900" className="shrink-0 mt-0.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <p className="typo-body-sm text-neutral-700 leading-relaxed">{aiMessage}</p>
      </div>

      {/* 추천 식당 카드 목록 */}
      {restaurants.map((r, idx) => (
        <div
          key={r.restaurantId}
          className="w-full max-w-130 bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden"
        >
          {/* 히어로 이미지 */}
          <div className="relative h-52">
            <img src={r.thumbnailUrl} alt={r.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />

            {/* 첫 번째 카드에만 AI Pick 뱃지 */}
            {idx === 0 && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#ff6900">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="typo-caption font-semibold text-primary">AI Pick</span>
              </div>
            )}

            {/* 이름 + 카테고리 + 주소 */}
            <div className="absolute bottom-4 left-5 right-5">
              <div className="flex items-end gap-2">
                <h2 className="typo-h3 font-bold text-white leading-tight">{r.name}</h2>
                <span className="typo-caption text-white/75 mb-0.5">{r.category}</span>
              </div>
              <p className="typo-caption text-white/70 mt-0.5">{r.address}</p>
            </div>
          </div>

          {/* 태그 */}
          <div className="px-5 py-3 flex flex-wrap gap-1.5">
            {r.tags.map((tag) => (
              <span
                key={tag}
                className="bg-orange-200 text-primary-dark typo-micro px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* 액션 버튼 */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={onReset}
          className="px-6 py-2.5 border border-neutral-300 rounded-xl typo-body-sm text-neutral-600 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          다시 설정
        </button>
        <button className="px-6 py-2.5 bg-primary text-white typo-body-sm font-bold rounded-xl hover:bg-[#e55e00] transition-colors cursor-pointer">
          가게 보러가기
        </button>
      </div>
    </div>
  );
}
