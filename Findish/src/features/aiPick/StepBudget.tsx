import { useRef, useCallback } from "react";
import findyStep3Url from "@/assets/icons/Findy/findy_ai2.svg?url";
import StepLayout from "./StepLayout";

const MAX = 100000;
const STEP = 1000;

const PRICE_PRESETS = [
  { label: "~1만원", min: 0, max: 10000 },
  { label: "1~2만원", min: 10000, max: 20000 },
  { label: "2~3만원", min: 20000, max: 30000 },
  { label: "3만원~", min: 30000, max: 100000 },
];

interface Props {
  minBudget: number;
  maxBudget: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function StepBudget({
  minBudget,
  maxBudget,
  onMinChange,
  onMaxChange,
  onPrev,
  onNext,
}: Props) {
  const minPct = (minBudget / MAX) * 100;
  const maxPct = (maxBudget / MAX) * 100;
  const trackRef = useRef<HTMLDivElement>(null);

  const startDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const track = trackRef.current!;
      const rect = track.getBoundingClientRect();

      const valueFromX = (clientX: number) => {
        const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return Math.round((pct * MAX) / STEP) * STEP;
      };

      const clickVal = valueFromX(e.clientX);
      const which: "min" | "max" =
        Math.abs(clickVal - minBudget) <= Math.abs(clickVal - maxBudget) ? "min" : "max";

      if (which === "min") {
        onMinChange(Math.min(clickVal, maxBudget - STEP));
      } else {
        onMaxChange(Math.max(clickVal, minBudget + STEP));
      }

      track.setPointerCapture(e.pointerId);

      const onMove = (ev: PointerEvent) => {
        const v = valueFromX(ev.clientX);
        if (which === "min") onMinChange(Math.min(v, maxBudget - STEP));
        else onMaxChange(Math.max(v, minBudget + STEP));
      };
      const onUp = () => {
        track.removeEventListener("pointermove", onMove);
        track.removeEventListener("pointerup", onUp);
      };
      track.addEventListener("pointermove", onMove);
      track.addEventListener("pointerup", onUp);
    },
    [minBudget, maxBudget, onMinChange, onMaxChange],
  );

  const minLabel = minBudget === 0 ? "0원" : `${minBudget.toLocaleString("ko-KR")}원`;
  const maxLabel = maxBudget >= MAX ? "10만원+" : `${maxBudget.toLocaleString("ko-KR")}원`;

  return (
    <StepLayout
      stepNumber={3}
      stepEmoji="💰"
      title={<>1인당 <span className="text-primary">예산</span>은요?</>}
      subtitle="예산 범위를 설정하면 딱 맞는 맛집을 추천해드려요."
      characterSrc={findyStep3Url}
      hint="예산에 딱 맞는 가성비 맛집을 찾아드릴게요!"
      onPrev={onPrev}
      onNext={onNext}
    >
      <div className="flex flex-col gap-5">
        {/* 빠른 선택 */}
        <div className="grid grid-cols-4 gap-2.5">
          {PRICE_PRESETS.map((preset) => {
            const isActive = minBudget === preset.min && maxBudget === preset.max;
            return (
              <button
                key={preset.label}
                onClick={() => {
                  onMinChange(preset.min);
                  onMaxChange(preset.max);
                }}
                className={`py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                  isActive
                    ? "border-primary bg-orange-100 text-primary shadow-sm"
                    : "border-neutral-200 bg-white text-neutral-500 hover:border-orange-300 hover:shadow-sm"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* 선택된 범위 표시 */}
        <div className="bg-orange-100 rounded-2xl px-6 py-4 text-center">
          <p className="text-neutral-400 text-xs mb-1">선택된 예산 범위</p>
          <p className="text-primary font-bold text-2xl">
            {minLabel} ~ {maxLabel}
          </p>
        </div>

        {/* 슬라이더 */}
        <div className="px-2">
          <div
            ref={trackRef}
            className="relative h-8 flex items-center cursor-pointer"
            style={{ touchAction: "none" }}
            onPointerDown={startDrag}
          >
            <div className="relative w-full h-2 rounded-full pointer-events-none">
              <div className="absolute inset-0 bg-orange-200 rounded-full" />
              <div
                className="absolute h-full bg-primary rounded-full"
                style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
              />
            </div>
            <div
              className="absolute -translate-x-1/2 w-5 h-5 rounded-full bg-primary pointer-events-none shadow-md border-2 border-white"
              style={{ left: `${minPct}%` }}
            />
            <div
              className="absolute -translate-x-1/2 w-5 h-5 rounded-full bg-primary pointer-events-none shadow-md border-2 border-white"
              style={{ left: `${maxPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-neutral-400">0원</span>
            <span className="text-xs text-neutral-400">100,000원</span>
          </div>
        </div>
      </div>
    </StepLayout>
  );
}
