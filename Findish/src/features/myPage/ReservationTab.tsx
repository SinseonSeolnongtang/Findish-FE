import { useState } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/common/Button";

type ReservationFilter = "방문예정" | "방문완료" | "취소/노쇼";
const RESERVATION_FILTERS: ReservationFilter[] = [
  "방문예정",
  "방문완료",
  "취소/노쇼",
];

interface ReservationTabProps {
  initialFilter?: ReservationFilter;
}

export default function ReservationTab({ initialFilter = "방문예정" }: ReservationTabProps) {
  const [filter, setFilter] = useState<ReservationFilter>(initialFilter);

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="typo-h2 text-neutral-900">예약 내역</h2>
        <Button
          variant="outline"
          size="sm"
          className="text-primary border-primary hover:bg-orange-100 text-[18px] h-auto py-2"
        >
          예약 일자 ∨
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-10">
        {RESERVATION_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "bg-orange-100 text-primary typo-body-lg px-7 py-2.5 rounded-3xl transition-colors cursor-pointer",
              filter === f
                ? "border border-primary"
                : "border border-transparent",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-5 py-16">
        <p className="typo-h1-medium text-neutral-900 text-center leading-tight">
          예약한 매장이 없습니다.
          <br />
          가까운 맛집을 지금 찾아보세요!
        </p>
        <Button>맛집 찾으러 가기</Button>
      </div>
    </>
  );
}
