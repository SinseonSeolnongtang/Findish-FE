const SITUATIONS = ['데이트', '친구', '혼자', '회식', '가족'];

interface Props {
  selected: string;
  onSelect: (v: string) => void;
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
        {SITUATIONS.map(s => (
          <button
            key={s}
            onClick={() => onSelect(selected === s ? '' : s)}
            className={`px-5 py-1.75 rounded-[17px] typo-body-lg cursor-pointer transition-colors ${
              selected === s
                ? 'bg-primary text-white font-bold'
                : 'bg-orange-100 text-primary-dark'
            }`}
          >
            {s}
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
