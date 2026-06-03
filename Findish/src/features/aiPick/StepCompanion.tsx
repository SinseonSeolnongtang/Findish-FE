import findyStep2Url from "@/assets/icons/Findy/findy_ai_pick.svg?url";
import { cn } from "@/lib/utils";
import { useFriendsQuery } from "@/hooks/useAiPick";
import StepLayout from "./StepLayout";

interface Props {
  selected: string[]; // friendIds (UUID)
  onSelect: (v: string[]) => void;
  onPrev?: () => void;
  onNext: () => void;
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6">
      <circle cx="14" cy="8" r="4.5" stroke="#FF6900" strokeWidth="1.6" />
      <path d="M5 26c0-5 4-8 9-8s9 3 9 8" stroke="#FF6900" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function StepCompanion({ selected, onSelect, onPrev, onNext }: Props) {
  const { data, isLoading } = useFriendsQuery();
  const friends = data ?? [];
  const isNone = selected.length === 0;

  const toggle = (memberId: string) => {
    if (selected.includes(memberId)) {
      onSelect(selected.filter((id) => id !== memberId));
    } else {
      onSelect([...selected, memberId]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <StepLayout
      stepNumber={2}
      stepEmoji="👥"
      title={<>누구와 <span className="text-primary">함께</span>하나요?</>}
      subtitle="함께하는 분들의 취향도 AI가 반영해드려요."
      characterSrc={findyStep2Url}
      hint="친구를 선택하면 모두의 취향을 함께 분석해드려요!"
      onPrev={onPrev}
      onNext={onNext}
    >
      <div className="grid grid-cols-3 gap-3">
        {/* 혼자 */}
        <button
          onClick={() => onSelect([])}
          className={cn(
            "flex items-start gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer",
            isNone
              ? "border-primary bg-orange-100 shadow-sm"
              : "border-neutral-200 bg-white hover:border-orange-300 hover:shadow-sm",
          )}
        >
          <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center shrink-0 text-xl">
            🙋
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="font-bold text-neutral-900 text-sm mb-1">혼자 가요</p>
            <p className="text-neutral-400 text-xs leading-relaxed whitespace-pre-line">
              {"동행인 없이\n혼자 식사해요"}
            </p>
          </div>
          <div
            className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
              isNone ? "border-primary bg-primary" : "border-neutral-300 bg-white",
            )}
          >
            {isNone && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
        </button>

        {/* 친구 카드 */}
        {friends.map((friend) => {
          const id = friend.memberId ?? "";
          const isSelected = selected.includes(id);
          const initial = (friend.name ?? "?")[0];
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              className={cn(
                "flex items-start gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer",
                isSelected
                  ? "border-primary bg-orange-100 shadow-sm"
                  : "border-neutral-200 bg-white hover:border-orange-300 hover:shadow-sm",
              )}
            >
              <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-lg">{initial}</span>
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="font-bold text-neutral-900 text-sm mb-1">{friend.name}</p>
                {friend.loginId && (
                  <p className="text-neutral-400 text-xs leading-relaxed truncate">
                    @{friend.loginId}
                  </p>
                )}
              </div>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                  isSelected ? "border-primary bg-primary" : "border-neutral-300 bg-white",
                )}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}

        {/* 친구 없음 안내 */}
        {friends.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center gap-2 py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <PersonIcon />
            </div>
            <p className="text-neutral-400 text-sm">
              아직 친구가 없어요.
              <br />
              친구를 추가하면 여기에 표시돼요!
            </p>
          </div>
        )}
      </div>
    </StepLayout>
  );
}
