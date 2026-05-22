import type { ReactNode } from "react";
import Button from "@/components/common/Button";

interface Props {
  title: string;
  subtitle?: string;
  onPrev?: () => void;
  onNext: () => void;
  nextLabel?: string;
  loading?: boolean;
  children: ReactNode;
}

export default function StepLayout({
  title,
  subtitle,
  onPrev,
  onNext,
  nextLabel = "다음으로",
  loading,
  children,
}: Props) {
  return (
    <div className="flex flex-col items-center h-full pt-35 pb-20">
      <div className="flex flex-col items-center gap-30">
        <div className="text-center">
          <h1 className="typo-h2 font-bold text-neutral-900">{title}</h1>
          {subtitle && (
            <p className="typo-t3 text-neutral-400 mt-2 tracking-[0.4px]">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>

      <div className="flex-1" />

      <div className="flex gap-3">
        {onPrev && (
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={loading}
            className="w-35"
          >
            이전으로
          </Button>
        )}
        <Button
          onClick={onNext}
          disabled={loading}
          className={onPrev ? "w-35" : "w-70"}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              AI가 분석중이에요...
            </>
          ) : (
            nextLabel
          )}
        </Button>
      </div>
    </div>
  );
}
