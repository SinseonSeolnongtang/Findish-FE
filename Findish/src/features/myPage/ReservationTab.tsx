import { useState } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useMyReservationsQuery, useCancelReservationMutation } from "@/hooks/useMyPage";
import type { ReservationStatus, ReservationItem } from "@/types/myPage";

type ReservationFilter = "방문예정" | "방문완료" | "취소/노쇼";
const RESERVATION_FILTERS: ReservationFilter[] = ["방문예정", "방문완료", "취소/노쇼"];

const FILTER_TO_STATUS: Record<ReservationFilter, ReservationStatus> = {
  "방문예정": "PENDING",
  "방문완료": "COMPLETED",
  "취소/노쇼": "CANCELLED",
};

const CANCEL_REASON_LABEL: Record<string, string> = {
  USER_CANCEL: "직접 취소",
  NO_SHOW: "노쇼(시간 초과)",
};

interface ReservationTabProps {
  initialFilter?: ReservationFilter;
}

function ReservationCard({
  item,
  onCancelClick,
}: {
  item: ReservationItem;
  onCancelClick: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-300 flex gap-3 p-4">
      <div className="w-24 h-24 shrink-0">
        <img
          src={item.thumbnailUrl}
          alt={item.restaurantName}
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="typo-body-lg font-bold text-neutral-900">{item.restaurantName}</p>
          {item.status === "PENDING" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancelClick(item.reservationId)}
              className="shrink-0 typo-caption px-3 h-auto py-1 rounded-lg text-primary border-primary hover:bg-orange-100"
            >
              예약 취소
            </Button>
          )}
        </div>

        <p className="typo-micro text-neutral-400">
          {item.date} {item.time} · {item.partySize}명
        </p>

        {item.status === "CANCELLED" && item.cancelReason && (
          <p className="typo-caption text-red-500">
            사유: {CANCEL_REASON_LABEL[item.cancelReason] ?? item.cancelReason}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ReservationTab({ initialFilter = "방문예정" }: ReservationTabProps) {
  const [filter, setFilter] = useState<ReservationFilter>(initialFilter);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  const status = FILTER_TO_STATUS[filter];
  const { data } = useMyReservationsQuery(status);
  const { mutate: cancelReservation } = useCancelReservationMutation();

  const handleConfirmCancel = () => {
    if (cancelTargetId === null) return;
    cancelReservation(cancelTargetId, { onSuccess: () => setCancelTargetId(null) });
  };

  return (
    <div className="relative">
      {cancelTargetId !== null && (
        <ConfirmModal
          title="예약 취소"
          message="해당 예약을 취소하시겠습니까?"
          confirmLabel="취소하기"
          cancelLabel="돌아가기"
          onConfirm={handleConfirmCancel}
          onClose={() => setCancelTargetId(null)}
        />
      )}

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
              filter === f ? "border border-primary" : "border border-transparent",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {!data || data.totalCount === 0 ? (
        <div className="flex flex-col items-center gap-5 py-16">
          <p className="typo-h1-medium text-neutral-900 text-center leading-tight">
            내역이 존재하지 않습니다.
          </p>
          <Button>맛집 찾으러 가기</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data.reservations.map((item) => (
            <ReservationCard
              key={item.reservationId}
              item={item}
              onCancelClick={setCancelTargetId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
