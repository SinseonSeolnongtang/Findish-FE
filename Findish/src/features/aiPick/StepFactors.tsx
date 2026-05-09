const FACTORS = ['맛', '분위기', '가성비', '청결도', '서비스', '웨이팅', '주차'];

interface Props {
  selected: string[];
  onSelect: (v: string[]) => void;
  additionalNote: string;
  onNoteChange: (v: string) => void;
  onPrev: () => void;
  onNext: () => void;
  loading?: boolean;
}

export default function StepFactors({ selected, onSelect, additionalNote, onNoteChange, onPrev, onNext, loading }: Props) {
  const toggle = (val: string) => {
    if (selected.includes(val)) onSelect(selected.filter(v => v !== val));
    else onSelect([...selected, val]);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full py-20">
      <div className="w-119 text-center">
        <h1 className="typo-h1 font-bold text-neutral-900">
          어떤걸 1순위로 생각할까요?
        </h1>
        <p className="typo-t2 text-neutral-500 mt-2 tracking-[0.4px]">
          중요하게 생각하시는게 있다면 알려주세요.
        </p>
      </div>

      <div className="w-119 flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-2">
          {FACTORS.map(f => (
            <button
              key={f}
              onClick={() => toggle(f)}
              className={`px-5 py-1.75 rounded-[17px] typo-body-lg cursor-pointer transition-colors ${
                selected.includes(f)
                  ? 'bg-primary text-white font-bold'
                  : 'bg-orange-100 text-primary-dark'
              }`}
            >
              {f}
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
              onChange={e => onNoteChange(e.target.value)}
              placeholder="조용하고 사람이 적은 곳이면 좋겠다."
              className="w-full h-9.5 px-3.5 bg-orange-100 border border-primary rounded-lg typo-body-sm text-neutral-900 placeholder:text-neutral-400 outline-none"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPrev}
          disabled={loading}
          className="w-27.5 h-11.5 border border-neutral-300 text-neutral-600 typo-body-sm rounded-[11px] hover:bg-gray-50 disabled:opacity-70 transition-colors cursor-pointer"
        >
          이전으로
        </button>
        <button
          onClick={onNext}
          disabled={loading}
          className="w-38.75 h-11.5 bg-primary text-white typo-body-sm rounded-[11px] hover:bg-[#e55e00] disabled:opacity-70 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              AI가 분석중이에요...
            </>
          ) : '다음으로'}
        </button>
      </div>
    </div>
  );
}
