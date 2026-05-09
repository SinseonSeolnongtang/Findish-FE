interface Props {
  title: string;
  options: string[];
  selected: string[];
  onSelect: (v: string[]) => void;
  onNext: () => void;
  buttonLabel?: string;
  singleSelect?: boolean;
  loading?: boolean;
}

export default function StepTemplate({
  title,
  options,
  selected,
  onSelect,
  onNext,
  buttonLabel = "다음으로",
  singleSelect,
  loading,
}: Props) {
  const toggle = (val: string) => {
    if (singleSelect) {
      onSelect(selected.includes(val) ? [] : [val]);
    } else {
      if (selected.includes(val)) onSelect(selected.filter((v) => v !== val));
      else onSelect([...selected, val]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-150">
        <h1 className="typo-d1 font-bold text-neutral-900 mb-10">{title}</h1>
        <ul>
          {options.map((opt, i) => (
            <li key={opt}>
              <button
                onClick={() => toggle(opt)}
                className="flex items-center justify-between w-full py-4.25 cursor-pointer"
              >
                <span className="typo-h2 text-neutral-900">{opt}</span>
                <div
                  className={`w-9.75 h-9.75 rounded-lg flex items-center justify-center border shrink-0 transition-colors ${
                    selected.includes(opt)
                      ? "bg-primary border-primary"
                      : "bg-orange-100 border-orange-300"
                  }`}
                >
                  {selected.includes(opt) && (
                    <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                      <path
                        d="M1.5 7L6.5 12L16.5 1.5"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </button>
              {i < options.length - 1 && <div className="h-px bg-primary" />}
            </li>
          ))}
        </ul>
        <div className="flex justify-center mt-8">
          <button
            onClick={onNext}
            disabled={loading}
            className="w-87.5 h-16.25 bg-primary text-white typo-t2 rounded-2xl hover:bg-[#e55e00] disabled:opacity-70 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                AI가 분석중이에요...
              </>
            ) : (
              buttonLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
