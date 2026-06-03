import type { ReactNode } from "react";

interface Props {
  stepNumber: number;
  stepEmoji: string;
  title: ReactNode;
  subtitle?: string;
  characterSrc: string;
  characterAlt?: string;
  hint?: string;
  onPrev?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
  children: ReactNode;
}

export default function StepLayout({
  stepNumber,
  stepEmoji,
  title,
  subtitle,
  characterSrc,
  characterAlt = "핀디 캐릭터",
  hint,
  onPrev,
  onNext,
  nextLabel = "다음으로",
  nextDisabled,
  loading,
  children,
}: Props) {
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
            이전으로
          </button>
        )}

        {/* Header */}
        <div className="flex justify-between items-start mb-7">
          <div>
            <h1 className="text-[28px] font-bold text-neutral-900 leading-tight mb-1.5">
              {title}
            </h1>
            {subtitle && (
              <p className="text-neutral-400 text-sm">{subtitle}</p>
            )}
          </div>
          <img
            src={characterSrc}
            alt={characterAlt}
            className="h-28 w-auto ml-4 shrink-0 select-none"
          />
        </div>

        {/* Content */}
        <div className="mb-4">{children}</div>

      </div>

      {/* Next Button */}
      <div className="px-10 pb-8 pt-3 max-w-5xl mx-auto w-full">
        <button
          onClick={onNext}
          disabled={loading || nextDisabled}
          className="w-full h-14 bg-primary text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 hover:bg-[#F54900] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              AI가 분석중이에요...
            </>
          ) : (
            <>
              {nextLabel}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M6 3l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
