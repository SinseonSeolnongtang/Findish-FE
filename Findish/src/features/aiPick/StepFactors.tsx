import findyStep4Url from "@/assets/icons/Findy/findy_ai_pick.svg?url";
import Input from "@/components/common/Input";
import StepLayout from "./StepLayout";

const MOOD_TAGS = [
  "조용한 분위기",
  "아늑한 인테리어",
  "활기찬 분위기",
  "뷰가 예쁜",
  "넓은 좌석",
  "주차 가능",
  "야외 테라스",
  "단체석 가능",
  "반려동물 동반",
];

interface Props {
  additionalNote: string;
  onNoteChange: (v: string) => void;
  onPrev: () => void;
  onNext: () => void;
  loading?: boolean;
}

export default function StepFactors({
  additionalNote,
  onNoteChange,
  onPrev,
  onNext,
  loading,
}: Props) {
  const toggleTag = (tag: string) => {
    if (additionalNote.includes(tag)) {
      const removed = additionalNote
        .split(", ")
        .filter((t) => t !== tag)
        .join(", ");
      onNoteChange(removed);
    } else {
      onNoteChange(additionalNote ? `${additionalNote}, ${tag}` : tag);
    }
  };

  return (
    <StepLayout
      stepNumber={4}
      stepEmoji="✨"
      title={<>추가 <span className="text-primary">조건</span>이 있나요?</>}
      subtitle="원하는 분위기나 특별한 요청을 알려주세요."
      characterSrc={findyStep4Url}
      hint="세세한 요청도 AI가 꼼꼼하게 반영해드려요!"
      onPrev={onPrev}
      onNext={onNext}
      loading={loading}
    >
      <div className="flex flex-col gap-4">
        {/* 분위기 태그 */}
        <div>
          <p className="text-sm font-semibold text-neutral-700 mb-2.5">분위기 키워드 (선택)</p>
          <div className="flex flex-wrap gap-2">
            {MOOD_TAGS.map((tag) => {
              const isActive = additionalNote.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                    isActive
                      ? "border-primary bg-orange-100 text-primary shadow-sm"
                      : "border-neutral-200 bg-white text-neutral-500 hover:border-orange-300 hover:shadow-sm"
                  }`}
                >
                  {isActive ? "✓ " : ""}{tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* 자유 입력 */}
        <div>
          <p className="text-sm font-semibold text-neutral-700 mb-2.5">직접 입력 (선택)</p>
          <Input
            type="text"
            value={additionalNote}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="예: 조용하고 분위기 좋은, 주차 가능한"
            className="h-11 px-4 bg-orange-100 border-primary rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 w-full"
          />
        </div>
      </div>
    </StepLayout>
  );
}
