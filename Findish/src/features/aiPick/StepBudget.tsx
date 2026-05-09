import { useRef, useCallback } from 'react';

const MAX = 100000;
const STEP = 1000;

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
      const which: 'min' | 'max' =
        Math.abs(clickVal - minBudget) <= Math.abs(clickVal - maxBudget)
          ? 'min'
          : 'max';

      // Apply initial click position
      if (which === 'min') {
        onMinChange(Math.min(clickVal, maxBudget - STEP));
      } else {
        onMaxChange(Math.max(clickVal, minBudget + STEP));
      }

      track.setPointerCapture(e.pointerId);

      const onMove = (ev: PointerEvent) => {
        const v = valueFromX(ev.clientX);
        if (which === 'min') {
          onMinChange(Math.min(v, maxBudget - STEP));
        } else {
          onMaxChange(Math.max(v, minBudget + STEP));
        }
      };

      const onUp = () => {
        track.removeEventListener('pointermove', onMove);
        track.removeEventListener('pointerup', onUp);
      };

      track.addEventListener('pointermove', onMove);
      track.addEventListener('pointerup', onUp);
    },
    [minBudget, maxBudget, onMinChange, onMaxChange],
  );

  return (
    <div className="flex flex-col items-center justify-between h-full py-20">
      <div className="w-130 text-center">
        <h1 className="typo-h1 font-bold text-neutral-900">
          얼마정도 사용하실 계획인가요?
        </h1>
        <p className="typo-t2 text-neutral-500 mt-2 tracking-[0.4px]">
          1인당 사용하실 예상 금액이 있다면 알려주세요.
        </p>
      </div>

      <div className="w-119 flex flex-col gap-2">
        <p className="typo-body-lg text-neutral-900 text-center">1인당 금액</p>

        <div
          ref={trackRef}
          className="relative h-8 flex items-center cursor-pointer"
          style={{ touchAction: 'none' }}
          onPointerDown={startDrag}
        >
          {/* Visual track */}
          <div className="relative w-full h-1.75 rounded-full pointer-events-none">
            <div className="absolute inset-0 bg-orange-200 rounded-full" />
            <div
              className="absolute h-full bg-primary rounded-full"
              style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
            />
          </div>
          {/* Visual thumbs */}
          <div
            className="absolute -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-primary pointer-events-none shadow"
            style={{ left: `${minPct}%` }}
          />
          <div
            className="absolute -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-primary pointer-events-none shadow"
            style={{ left: `${maxPct}%` }}
          />
        </div>

        {/* Dynamic labels below thumbs */}
        <div className="relative h-6">
          <span
            className="absolute typo-body-md text-neutral-900 -translate-x-1/2"
            style={{ left: `${minPct}%` }}
          >
            {minBudget.toLocaleString("ko-KR")}
          </span>
          <span
            className="absolute typo-body-md text-neutral-900 -translate-x-1/2"
            style={{ left: `${maxPct}%` }}
          >
            {maxBudget.toLocaleString("ko-KR")}
          </span>
        </div>
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
