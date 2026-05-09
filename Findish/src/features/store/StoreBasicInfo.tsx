import { useState } from "react";
import { cn } from "@/lib/utils";
import { type StoreCardData } from "@/components/common/StoreCard";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;

interface StoreBasicInfoProps {
  store: StoreCardData;
}

export default function StoreBasicInfo({ store }: StoreBasicInfoProps) {
  const [hoursOpen, setHoursOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(2);

  return (
    <div className="px-4 pt-4 pb-2">
      <h2 className="text-[28px] font-bold text-black mb-1">{store.name}</h2>
      <p className="text-[16px] text-[#99A1AF] mb-3">{store.summary}</p>

      <div className="flex flex-col gap-1.5">
        {/* 영업 시간 */}
        <div>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <circle cx="8" cy="8" r="6.5" stroke="#6A7282" strokeWidth="1.2" />
              <path d="M8 5v3l2 1.5" stroke="#6A7282" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={cn("text-[12px] font-bold", store.isOpen ? "text-[#00A63E]" : "text-[#FF4500]")}>
              {store.isOpen ? "영업중" : "영업전"}
            </span>
            <div className="w-px h-3 bg-[#D1D5DC]" />
            <span className="text-[12px] text-black">수요일 16:00 - 24:00</span>
            <button
              onClick={() => setHoursOpen((v) => !v)}
              className="text-[#6A7282] ml-0.5"
              aria-label="영업시간 상세"
            >
              <svg
                width="8" height="5" viewBox="0 0 8 5" fill="currentColor"
                className={cn("transition-transform", hoursOpen && "rotate-180")}
              >
                <path d="M0 0.5L4 4.5L8 0.5H0Z" />
              </svg>
            </button>
          </div>
          {hoursOpen && (
            <div className="mt-1 bg-white border border-[#F3F1EF] rounded-md shadow-[0px_2px_4px_rgba(0,0,0,0.1)] p-2 w-[181px]">
              <div className="flex gap-1 mb-2">
                {DAYS.map((day, i) => (
                  <button
                    key={day}
                    onClick={() => setActiveDay(i)}
                    className={cn(
                      "w-5 h-5 rounded-full text-[10px] flex items-center justify-center shrink-0",
                      activeDay === i
                        ? "bg-primary text-white font-bold"
                        : "bg-[#FFF1DF] text-primary",
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-black">
                <p className="font-bold">16:00 - 24:00</p>
                <p className="text-[#6A7282]">라스트 오더 23:00</p>
              </div>
            </div>
          )}
        </div>

        {/* 리뷰 수 */}
        <div className="flex items-center gap-1.5">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" className="shrink-0">
            <rect x="2.5" y="1.5" width="12" height="14" rx="1.5" stroke="#6A7282" strokeWidth="1.2" />
            <path d="M5 6h7M5 9h7M5 12h4" stroke="#6A7282" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className="text-[12px] text-[#6A7282]">리뷰 {store.reviewCount}</span>
        </div>

        {/* 주차 */}
        <div className="flex items-center gap-1.5">
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none" className="shrink-0">
            <path d="M2 6L3.5 2.5H10.5L12 6V10H2V6Z" stroke="#6A7282" strokeWidth="1.1" strokeLinejoin="round" />
            <circle cx="4" cy="10" r="1.5" fill="#6A7282" />
            <circle cx="10" cy="10" r="1.5" fill="#6A7282" />
          </svg>
          <span className="text-[12px] font-bold text-[#E60000]">주차 불가능</span>
        </div>
      </div>
    </div>
  );
}
