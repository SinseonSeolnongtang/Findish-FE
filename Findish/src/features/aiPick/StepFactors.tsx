import type { AiPickPriority } from '@/types/aiPick';
import StepLayout from './StepLayout';

const FACTORS: { label: string; value: AiPickPriority }[] = [
  { label: '맛', value: 'TASTE' },
  { label: '분위기', value: 'ATMOSPHERE' },
  { label: '가성비', value: 'PRICE' },
  { label: '청결도', value: 'CLEANLINESS' },
  { label: '서비스', value: 'SERVICE' },
  { label: '주차', value: 'PARKING' },
];

interface Props {
  selected: AiPickPriority[];
  onSelect: (v: AiPickPriority[]) => void;
  additionalNote: string;
  onNoteChange: (v: string) => void;
  onPrev: () => void;
  onNext: () => void;
  loading?: boolean;
}

export default function StepFactors({
  selected,
  onSelect,
  additionalNote,
  onNoteChange,
  onPrev,
  onNext,
  loading,
}: Props) {
  const toggle = (val: AiPickPriority) => {
    if (selected.includes(val)) onSelect(selected.filter((v) => v !== val));
    else onSelect([...selected, val]);
  };

  return (
    <StepLayout
      title="어떤걸 1순위로 생각할까요?"
      subtitle="중요하게 생각하시는게 있다면 알려주세요."
      onPrev={onPrev}
      onNext={onNext}
      loading={loading}
    >
      <div className="w-119 flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-2">
          {FACTORS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => toggle(value)}
              className={`px-5 py-1.75 rounded-[17px] typo-body-lg cursor-pointer transition-colors ${
                selected.includes(value)
                  ? 'bg-primary text-white font-bold'
                  : 'bg-orange-100 text-primary-dark'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {selected.length > 0 && (
          <div className="w-full flex flex-col gap-2">
            <p className="typo-body-sm text-neutral-900">
              (선택) 추가적으로 고려해야 할 사항이 있다면 알려주세요.
            </p>
            <input
              type="text"
              value={additionalNote}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="조용하고 사람이 적은 곳이면 좋겠다."
              className="w-full h-9.5 px-3.5 bg-orange-100 border border-primary rounded-lg typo-body-sm text-neutral-900 placeholder:text-neutral-400 outline-none"
            />
          </div>
        )}
      </div>
    </StepLayout>
  );
}
