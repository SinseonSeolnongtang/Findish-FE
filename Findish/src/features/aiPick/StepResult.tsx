interface ResultStore {
  name: string;
  category: string;
  tagline: string;
  image: string;
  isOpen: boolean;
  reviewCount: string;
  keywords: string[];
  reason: string;
}

interface Props {
  store: ResultStore;
  onReset: () => void;
}

export default function StepResult({ store, onReset }: Props) {
  const {
    name,
    category,
    tagline,
    image,
    isOpen,
    reviewCount,
    keywords,
    reason,
  } = store;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 px-8">
      <p className="typo-body-md text-neutral-500">AI가 선택한 가게는</p>

      <div className="w-full max-w-130 bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        {/* Hero image with gradient overlay */}
        <div className="relative h-52">
          <img src={image} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />

          {/* AI Pick badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#ff6900">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="typo-caption font-semibold text-primary">
              AI Pick
            </span>
          </div>

          {/* Name + tagline on image bottom */}
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-end gap-2">
              <h2 className="typo-h3 font-bold text-white leading-tight">
                {name}
              </h2>
              <span className="typo-caption text-white/75 mb-0.5">
                {category}
              </span>
            </div>
            <p className="typo-caption text-white/70 mt-0.5">{tagline}</p>
          </div>
        </div>

        {/* Quick info bar */}
        <div className="px-5 py-3 flex items-center gap-4 border-b border-neutral-100 flex-wrap">
          <div className="flex items-center gap-1">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isOpen ? "#00a63e" : "#6a7282"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span
              className={`typo-caption font-semibold ${isOpen ? "text-success" : "text-neutral-500"}`}
            >
              {isOpen ? "영업중" : "영업종료"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6a7282"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span className="typo-caption text-neutral-500">
              리뷰 {reviewCount}
            </span>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {keywords.map((k) => (
              <span
                key={k}
                className="bg-orange-200 text-primary-dark typo-micro px-2 py-0.5 rounded-full"
              >
                {k}
              </span>
            ))}
          </div>
        </div>

        {/* AI reasoning */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#ff6900">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="typo-caption font-bold text-primary">
              AI 선정 이유
            </span>
          </div>
          <p className="typo-body-sm text-neutral-600 leading-relaxed whitespace-pre-line">
            {reason}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="px-6 py-2.5 border border-neutral-300 rounded-xl typo-body-sm text-neutral-600 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          다시 설정
        </button>
        <button className="px-6 py-2.5 bg-primary text-white typo-body-sm font-bold rounded-xl hover:bg-[#e55e00] transition-colors cursor-pointer">
          가게 보러가기
        </button>
      </div>
    </div>
  );
}
