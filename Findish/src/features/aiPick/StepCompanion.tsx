const COMPANIONS = [
  "동행인 없음",
  "석우",
  "성재",
  "성환",
  "다원",
  "윤서",
  "민지",
];

interface Props {
  selected: string[];
  onSelect: (v: string[]) => void;
  onNext: () => void;
}

export default function StepCompanion({ selected, onSelect, onNext }: Props) {
  const toggle = (name: string) => {
    if (name === "동행인 없음") {
      onSelect(selected.includes("동행인 없음") ? [] : ["동행인 없음"]);
      return;
    }
    const withoutNone = selected.filter((v) => v !== "동행인 없음");
    if (withoutNone.includes(name))
      onSelect(withoutNone.filter((v) => v !== name));
    else onSelect([...withoutNone, name]);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full py-20">
      <div className="w-130 text-center">
        <h1 className="typo-h1 font-bold text-neutral-900">
          누구와 함께 식사하시나요?
        </h1>
      </div>

      <div className="w-130">
        <ul>
          {COMPANIONS.map((name, i) => (
            <li key={name}>
              <button
                onClick={() => toggle(name)}
                className="flex items-center justify-between w-full py-3 cursor-pointer"
              >
                <span className="typo-t2 text-neutral-900 tracking-[0.4px]">
                  {name}
                </span>
                <div
                  className={`w-6.75 h-6.75 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                    selected.includes(name)
                      ? "bg-primary border-primary"
                      : "bg-orange-100 border-orange-300"
                  }`}
                >
                  {selected.includes(name) && (
                    <svg width="13" height="10" viewBox="0 0 18 14" fill="none">
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
              {i < COMPANIONS.length - 1 && <div className="h-px bg-primary" />}
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
