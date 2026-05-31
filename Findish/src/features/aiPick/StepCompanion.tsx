import CheckFilled from "@/assets/icons/common/check_filled.svg?react";
import { cn } from "@/lib/utils";
import { useFriendsQuery } from "@/hooks/useAiPick";
import StepLayout from "./StepLayout";

interface Props {
  selected: string[]; // friendIds (UUID)
  onSelect: (v: string[]) => void;
  onNext: () => void;
}

export default function StepCompanion({ selected, onSelect, onNext }: Props) {
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
    <StepLayout title="누구와 함께 식사하시나요?" onNext={onNext}>
      <div className="w-130">
        <ul>
          <li>
            <button
              onClick={() => onSelect([])}
              className="flex items-center justify-between w-full py-3 cursor-pointer"
            >
              <span className="typo-t2 text-neutral-900 tracking-[0.4px]">
                동행인 없음
              </span>
              <CheckFilled
                className={cn(
                  "shrink-0 w-8 h-8 transition-opacity",
                  !isNone && "opacity-20",
                )}
              />
            </button>
            <div className="h-px bg-orange-300" />
          </li>

          {friends.map((friend, i) => (
            <li key={friend.memberId}>
              <button
                onClick={() => toggle(friend.memberId)}
                className="flex items-center justify-between w-full py-3 cursor-pointer"
              >
                <span className="typo-t2 text-neutral-900 tracking-[0.4px]">
                  {friend.name}
                </span>
                <CheckFilled
                  className={cn(
                    "shrink-0 w-8 h-8 transition-opacity",
                    !selected.includes(friend.memberId) && "opacity-20",
                  )}
                />
              </button>
              {i < friends.length - 1 && <div className="h-px bg-orange-300" />}
            </li>
          ))}
        </ul>
      </div>
    </StepLayout>
  );
}
