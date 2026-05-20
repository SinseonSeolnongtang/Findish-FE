import { useFriendsQuery } from '@/hooks/useAiPick';

interface Props {
  selected: number[]; // friendIds
  onSelect: (v: number[]) => void;
  onNext: () => void;
}

export default function StepCompanion({ selected, onSelect, onNext }: Props) {
  const { data, isLoading } = useFriendsQuery();
  const friends = data?.friends ?? [];
  const isNone = selected.length === 0;

  const toggle = (memberId: number) => {
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
    <div className="flex flex-col items-center justify-between h-full py-20">
      <div className="w-130 text-center">
        <h1 className="typo-h1 font-bold text-neutral-900">
          누구와 함께 식사하시나요?
        </h1>
      </div>

      <div className="w-130">
        <ul>
          {/* 동행인 없음 */}
          <li>
            <button
              onClick={() => onSelect([])}
              className="flex items-center justify-between w-full py-3 cursor-pointer"
            >
              <span className="typo-t2 text-neutral-900 tracking-[0.4px]">동행인 없음</span>
              <div
                className={`w-6.75 h-6.75 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                  isNone ? 'bg-primary border-primary' : 'bg-orange-100 border-orange-300'
                }`}
              >
                {isNone && (
                  <svg width="13" height="10" viewBox="0 0 18 14" fill="none">
                    <path d="M1.5 7L6.5 12L16.5 1.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
            <div className="h-px bg-primary" />
          </li>

          {/* 친구 목록 */}
          {friends.map((friend, i) => (
            <li key={friend.memberId}>
              <button
                onClick={() => toggle(friend.memberId)}
                className="flex items-center justify-between w-full py-3 cursor-pointer"
              >
                <span className="typo-t2 text-neutral-900 tracking-[0.4px]">{friend.name}</span>
                <div
                  className={`w-6.75 h-6.75 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                    selected.includes(friend.memberId)
                      ? 'bg-primary border-primary'
                      : 'bg-orange-100 border-orange-300'
                  }`}
                >
                  {selected.includes(friend.memberId) && (
                    <svg width="13" height="10" viewBox="0 0 18 14" fill="none">
                      <path d="M1.5 7L6.5 12L16.5 1.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
              {i < friends.length - 1 && <div className="h-px bg-primary" />}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onNext}
        className="w-61.25 h-11.5 bg-primary text-white typo-body-sm rounded-[11px] hover:bg-[#e55e00] transition-colors cursor-pointer"
      >
        다음으로
      </button>
    </div>
  );
}
