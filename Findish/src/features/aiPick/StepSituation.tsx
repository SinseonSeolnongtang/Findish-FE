import findyStep1Url from "@/assets/icons/Findy/findy_ai_pick_step1.svg?url";
import type { AiPickSituation } from "@/types/aiPick";

interface Props {
  selected: AiPickSituation | "";
  onSelect: (v: AiPickSituation | "") => void;
  onPrev?: () => void;
  onNext: () => void;
}

function DateIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
      <circle cx="9" cy="8" r="3.5" stroke="#FF6900" strokeWidth="1.6" />
      <path d="M2 24c0-4 3-6 7-6" stroke="#FF6900" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="19" cy="8" r="3.5" stroke="#FF6900" strokeWidth="1.6" />
      <path d="M26 24c0-4-3-6-7-6" stroke="#FF6900" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 15c-1.6 0-2.8 1.3-2.8 2.8 0 2.2 2.8 4.2 2.8 4.2s2.8-2 2.8-4.2c0-1.5-1.2-2.8-2.8-2.8z" fill="#FF6900" />
    </svg>
  );
}

function FriendIcon() {
  return (
    <svg viewBox="0 0 30 26" fill="none" className="w-7 h-7">
      <circle cx="15" cy="7" r="3.5" stroke="#FF6900" strokeWidth="1.6" />
      <path d="M8 24c0-4 3-6 7-6s7 2 7 6" stroke="#FF6900" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="5" cy="8.5" r="2.8" stroke="#FF6900" strokeWidth="1.5" />
      <path d="M1 24c0-3.5 1.8-5 4-5" stroke="#FF6900" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="25" cy="8.5" r="2.8" stroke="#FF6900" strokeWidth="1.5" />
      <path d="M29 24c0-3.5-1.8-5-4-5" stroke="#FF6900" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AloneIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
      <circle cx="14" cy="8" r="4.5" stroke="#FF6900" strokeWidth="1.6" />
      <path d="M5 26c0-5 4-8 9-8s9 3 9 8" stroke="#FF6900" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BusinessIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" y1="4" x2="10" y2="24" stroke="#FF6900" strokeWidth="1.6" />
      <line x1="7" y1="4" x2="7" y2="10" stroke="#FF6900" strokeWidth="1.6" />
      <line x1="13" y1="4" x2="13" y2="10" stroke="#FF6900" strokeWidth="1.6" />
      <path d="M7 10c0 1.7 1.3 3 3 3s3-1.3 3-3" stroke="#FF6900" strokeWidth="1.6" />
      <ellipse cx="20" cy="9" rx="3.2" ry="4.5" stroke="#FF6900" strokeWidth="1.6" />
      <line x1="20" y1="13.5" x2="20" y2="24" stroke="#FF6900" strokeWidth="1.6" />
    </svg>
  );
}

function FamilyIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7" strokeLinecap="round" strokeLinejoin="round" stroke="#FF6900" strokeWidth="1.6">
      <path d="M4 13.5L14 4l10 9.5" />
      <path d="M6.5 11.5V24h15V11.5" />
      <rect x="11" y="17" width="6" height="7" rx="1" />
    </svg>
  );
}

function OtherIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="#FF6900" className="w-7 h-7">
      <circle cx="7" cy="14" r="2.5" />
      <circle cx="14" cy="14" r="2.5" />
      <circle cx="21" cy="14" r="2.5" />
    </svg>
  );
}

const SITUATION_OPTIONS: {
  value: AiPickSituation;
  label: string;
  description: string;
  Icon: () => React.JSX.Element;
}[] = [
  {
    value: "DATE",
    label: "데이트",
    description: "분위기 좋고\n특별한 시간을 보내고 싶어요",
    Icon: DateIcon,
  },
  {
    value: "FRIEND",
    label: "친구와 모임",
    description: "친구들과 맛있게\n수다 떨고 싶어요",
    Icon: FriendIcon,
  },
  {
    value: "ALONE",
    label: "혼자 편하게",
    description: "혼밥도 좋고,\n조용히 힐링하고 싶어요",
    Icon: AloneIcon,
  },
  {
    value: "MEETING",
    label: "회사/비즈니스",
    description: "점심 회식이나\n비즈니스 미팅이에요",
    Icon: BusinessIcon,
  },
  {
    value: "FAMILY",
    label: "가족과 함께",
    description: "온 가족이 함께\n맛있는 식사를 해요",
    Icon: FamilyIcon,
  },
  {
    value: "OTHER",
    label: "기타 상황",
    description: "여행, 기념일 등\n특별한 상황이에요",
    Icon: OtherIcon,
  },
];

export default function StepSituation({ selected, onSelect, onPrev, onNext }: Props) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex-1 px-10 pt-8 pb-4 max-w-5xl mx-auto w-full">
        {/* Back Button */}
        {onPrev && (
          <button
            onClick={onPrev}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-700 text-sm mb-5 cursor-pointer transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 14l-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            처음으로
          </button>
        )}
        {/* Header */}
        <div className="flex justify-between items-start mb-7">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-orange-100 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
              🏠 STEP 1
            </div>
            <h1 className="text-[28px] font-bold text-neutral-900 leading-tight mb-1.5">
              어떤 <span className="text-primary">상황</span>인가요?
            </h1>
            <p className="text-neutral-400 text-sm">상황에 맞는 맛집을 추천해드릴게요.</p>
          </div>
          <img
            src={findyStep1Url}
            alt="핀디 캐릭터"
            className="h-28 w-auto ml-4 shrink-0 select-none"
          />
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {SITUATION_OPTIONS.map(({ value, label, description, Icon }) => {
            const isSelected = selected === value;
            return (
              <button
                key={value}
                onClick={() => onSelect(isSelected ? "" : value)}
                className={`flex items-start gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-orange-100 shadow-sm"
                    : "border-neutral-200 bg-white hover:border-orange-300 hover:shadow-sm"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center shrink-0">
                  <Icon />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="font-bold text-neutral-900 text-sm mb-1">{label}</p>
                  <p className="text-neutral-400 text-xs leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-neutral-300 bg-white"
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Hint */}
        <div className="bg-orange-100 rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-sm text-neutral-600">
          <span>💡</span>
          선택한 상황을 바탕으로 더 정확한 맛집을 추천해드려요!
        </div>
      </div>

      {/* Next Button */}
      <div className="px-10 pb-8 pt-3 max-w-5xl mx-auto w-full">
        <button
          onClick={onNext}
          disabled={!selected}
          className="w-full h-14 bg-primary text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 hover:bg-[#F54900] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          다음으로
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M6 3l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
