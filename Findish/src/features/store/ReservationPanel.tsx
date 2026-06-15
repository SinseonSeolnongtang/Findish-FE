import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  useAvailableSlotsQuery,
  useCreateReservationMutation,
} from "@/hooks/useRestaurant";
import Button from "@/components/common/Button";
import CloseLgIcon from "@/assets/icons/common/close_lg.svg?react";
import CalendarIcon from "@/assets/icons/common/calendar.svg?react";
import CopyIcon from "@/assets/icons/common/copy.svg?react";
import CheckCircleIcon from "@/assets/icons/review/check.svg?react";
import UserIcon from "@/assets/icons/AIPick/user.svg?react";

interface ReservationPanelProps {
  restaurantId: string;
  restaurantName: string;
  onClose: () => void;
}

export default function ReservationPanel({
  restaurantId,
  restaurantName,
  onClose,
}: ReservationPanelProps) {
  const navigate = useNavigate();
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [date, setDate] = useState(today);
  const [partySize, setPartySize] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmData, setConfirmData] = useState<{
    reservationId: string;
    time: string;
  } | null>(null);

  const isPastSlot = (slot: string) => {
    if (date !== today) return false;
    const [h, m] = slot.split(":").map(Number);
    return h * 60 + m <= currentMinutes;
  };

  const { data: slotsData, isLoading: slotsLoading } = useAvailableSlotsQuery(
    restaurantId,
    { date },
  );
  const mutation = useCreateReservationMutation(restaurantId);

  const handleConfirm = () => {
    if (!selectedSlot) return;
    mutation.mutate(
      { date, time: selectedSlot, partySize },
      {
        onSuccess: (data) => {
          setConfirmData({
            reservationId: data.data.reservationId ?? "",
            time: selectedSlot,
          });
        },
      },
    );
  };

  if (confirmData) {
    return (
      <div className="p-4 flex flex-col gap-4">
        {/* 예약 정보 카드 */}
        <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm">
          {/* 배색 헤더 */}
          <div className="bg-orange-100 px-4 py-3 border-b border-neutral-100">
            <h3 className="typo-body-md font-bold text-black">예약 정보</h3>
          </div>

          {/* 카드 내용 */}
          <div className="p-4 flex flex-col gap-3">
            <p className="typo-body-sm font-bold text-black">
              {restaurantName}
            </p>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <CalendarIcon
                  width={15}
                  height={15}
                  className="text-neutral-500 shrink-0"
                />
                <span className="typo-caption text-neutral-600">{date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UserIcon
                  width={15}
                  height={15}
                  stroke="#6B7280"
                  className="shrink-0"
                />
                <span className="typo-caption text-neutral-600">
                  {partySize}명
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <CheckCircleIcon width={15} height={15} className="shrink-0" />
              <span className="typo-caption text-success font-bold">
                예약이 확정되었습니다.
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="typo-micro text-neutral-400">
                예약 번호: #{confirmData.reservationId}
              </span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(confirmData.reservationId)
                }
                aria-label="예약번호 복사"
                className="shrink-0"
              >
                <CopyIcon width={14} height={14} className="text-neutral-400" />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/mypage?tab=reservation")}
          className="w-full text-center typo-caption text-primary font-bold underline underline-offset-2"
        >
          예약 내역 보러가기
        </button>
        <Button
          variant="primary"
          size="sm"
          className="w-full h-11 rounded-xl font-bold"
          onClick={onClose}
        >
          확인
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="typo-body-md font-bold text-black">예약하기</h3>
        <button onClick={onClose} aria-label="닫기">
          <CloseLgIcon className="w-5 h-5 text-neutral-400" />
        </button>
      </div>

      {/* 날짜 */}
      <div className="flex flex-col gap-1.5">
        <label className="typo-caption font-bold text-neutral-600">날짜</label>
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => {
            setDate(e.target.value);
            setSelectedSlot(null);
          }}
          className="border border-neutral-200 rounded-xl px-3 py-2 typo-body-sm text-black outline-none focus:border-primary"
        />
      </div>

      {/* 인원 */}
      <div className="flex flex-col gap-1.5">
        <label className="typo-caption font-bold text-neutral-600">인원</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPartySize((v) => Math.max(1, v - 1))}
            className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center typo-body-md font-bold text-neutral-600"
          >
            −
          </button>
          <span className="typo-body-sm font-bold text-black w-6 text-center">
            {partySize}
          </span>
          <button
            onClick={() =>
              setPartySize((v) =>
                Math.min(slotsData?.data?.maxPartySize ?? 8, v + 1),
              )
            }
            className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center typo-body-md font-bold text-neutral-600"
          >
            +
          </button>
          {slotsData?.data && (
            <span className="typo-micro text-neutral-400">
              최대 {slotsData.data.maxPartySize}명
            </span>
          )}
        </div>
      </div>

      {/* 시간 */}
      <div className="flex flex-col gap-2">
        <label className="typo-caption font-bold text-neutral-600">시간</label>
        {slotsLoading ? (
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-9 rounded-lg bg-neutral-100 animate-pulse"
              />
            ))}
          </div>
        ) : slotsData?.data?.isHoliday ? (
          <p className="typo-caption text-error-dark font-bold">
            해당 날짜는 휴무일입니다.
          </p>
        ) : !slotsData?.data?.slots?.length ? (
          <p className="typo-caption text-neutral-500">
            예약 가능한 시간이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {slotsData.data.slots.map((slot) => {
              const past = isPastSlot(slot);
              return (
                <button
                  key={slot}
                  onClick={() => !past && setSelectedSlot(slot)}
                  disabled={past}
                  className={cn(
                    "h-9 rounded-lg typo-caption font-bold border transition-colors",
                    past
                      ? "bg-neutral-100 text-neutral-300 border-neutral-100 cursor-not-allowed"
                      : selectedSlot === slot
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-neutral-700 border-neutral-200",
                  )}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Button
        variant="primary"
        size="sm"
        className="w-full h-11 rounded-xl font-bold"
        onClick={handleConfirm}
        disabled={!selectedSlot || mutation.isPending}
      >
        {mutation.isPending ? "처리 중..." : "예약 확정"}
      </Button>
    </div>
  );
}
