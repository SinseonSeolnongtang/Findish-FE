import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";
import { getMyReservations, cancelMyReservation } from "@/api/myPage";
import type { ReservationItem } from "@/types/myPage";

type ReservationFilter = "방문예정" | "방문완료" | "취소/노쇼";
const RESERVATION_FILTERS: ReservationFilter[] = [
  "방문예정",
  "방문완료",
  "취소/노쇼",
];

const FILTER_TO_STATUS: Record<ReservationFilter, string> = {
  방문예정: "PENDING",
  방문완료: "COMPLETED",
  "취소/노쇼": "CANCELLED",
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
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="typo-body-lg font-bold text-neutral-900">
            {item.naverPlaceId ?? ""}
          </p>
          {item.status === "PENDING" && item.reservationId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancelClick(item.reservationId!)}
              className="shrink-0 typo-caption px-3 h-auto py-1 rounded-lg text-primary border-primary hover:bg-orange-100"
            >
              예약 취소
            </Button>
          )}
        </div>

        <p className="typo-micro text-neutral-400">
          {item.date} {item.time} · {item.partySize}명
        </p>
      </div>
    </div>
  );
}

export default function ReservationTab({
  initialFilter = "방문예정",
}: ReservationTabProps) {
  const [filter, setFilter] = useState<ReservationFilter>(initialFilter);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const status = FILTER_TO_STATUS[filter];

  const { data } = useQuery({
    queryKey: ["my-reservations", status],
    queryFn: ({ signal }) => getMyReservations({ status }, signal),
  });

  const { mutate: cancelReservation } = useMutation({
    mutationFn: (reservationId: string) => cancelMyReservation(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reservations"] });
      setCancelTargetId(null);
    },
  });

  const reservations = data?.data?.content ?? [];

  return (
    <div className="relative">
      {cancelTargetId !== null && (
        <ConfirmModal
          title="예약 취소"
          message="해당 예약을 취소하시겠습니까?"
          confirmLabel="취소하기"
          cancelLabel="돌아가기"
          onConfirm={() => cancelReservation(cancelTargetId)}
          onClose={() => setCancelTargetId(null)}
        />
      )}

      <div className="flex items-center gap-4 mb-10">
        {RESERVATION_FILTERS.map((f) => (
          <Button
            key={f}
            shape="pill"
            size="sm"
            variant={filter === f ? "primary" : "outline"}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      {reservations.length === 0 ? (
        <div className="flex flex-col items-center gap-5 py-16">
          <p className="typo-h1-medium text-neutral-900 text-center leading-tight">
            내역이 존재하지 않습니다.
          </p>
          <Button onClick={() => navigate("/normal")}>맛집 찾으러 가기</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reservations.map((item) => (
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
