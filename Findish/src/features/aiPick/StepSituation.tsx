import type { AiPickSituation } from '@/types/aiPick';

const SITUATIONS: { label: string; value: AiPickSituation }[] = [
  { label: '데이트', value: 'DATE' },
  { label: '친구', value: 'FRIEND' },
  { label: '혼자', value: 'ALONE' },
  { label: '회식', value: 'MEETING' },
  { label: '가족', value: 'FAMILY' },
];

interface Props {
  selected: AiPickSituation | '';
  onSelect: (v: AiPickSituation | '') => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function StepSituation({ selected, onSelect, onPrev, onNext }: Props) {
  return (
    <div className="flex flex-col items-center justify-between h-full py-20">
      <div className="w-119 text-center">
        <h1 className="typo-h1 font-bold text-neutral-900">
          어떤 상황인가요?
        </h1>
      </div>

      <div className="flex flex-wrap justify-center gap-2 w-119">
        {SITUATIONS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onSelect(selected === value ? '' : value)}
            className={`px-5 py-1.75 rounded-[17px] typo-body-lg cursor-pointer transition-colors ${
              selected === value
                ? 'bg-primary text-white font-bold'
                : 'bg-orange-100 text-primary-dark'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPrev}
          className="w-27.5 h-11.5 border border-neutral-300 text-neutral-600 typo-body-sm rounded-[11px] hover:bg-gray-50 transition-colors cursor-pointer"
        >
          이전으로
        </button>
        <button
          onClick={onNext}
          className="w-38.75 h-11.5 bg-primary text-white typo-body-sm rounded-[11px] hover:bg-[#e55e00] transition-colors cursor-pointer"
        >
          다음으로
        </button>
      </div>
    </div>
  );
}
