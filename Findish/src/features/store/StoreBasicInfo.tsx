import { useState } from "react";
import { cn } from "@/lib/utils";
import { type StoreCardData } from "@/components/common/StoreCard";
import { useRestaurantBasicQuery, useRestaurantInfoQuery, useToggleLikeMutation } from "@/hooks/useRestaurant";
import { getBusinessStatus } from "@/lib/businessHours";
import FavoriteIcon from "@/assets/icons/common/favorite.svg?react";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;

interface BusinessHour {
  day: string;
  hours: string;
  is_24h: boolean;
  breaktime: string | null;
  is_closed: boolean;
}

function parseBusinessHours(raw: string): BusinessHour[] {
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function formatHours(hour: BusinessHour): string {
  if (hour.is_closed) return "휴무";
  if (hour.is_24h) return "24시간";
  return hour.hours;
}

interface StoreBasicInfoProps {
  store: StoreCardData;
  restaurantId: string;
}

export default function StoreBasicInfo({ store, restaurantId }: StoreBasicInfoProps) {
  const todayIndex = (new Date().getDay() + 6) % 7;
  const [hoursOpen, setHoursOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(todayIndex);

  const { data: basicData } = useRestaurantBasicQuery(restaurantId);
  const { data: infoData } = useRestaurantInfoQuery(restaurantId);
  const { mutate: toggleLikeMutate } = useToggleLikeMutation();
  const [liked, setLiked] = useState<boolean | null>(null);

  const isLiked = liked ?? basicData?.data?.isLiked ?? false;

  const handleLike = () => {
    setLiked((prev) => !(prev ?? basicData?.data?.isLiked ?? false));
    toggleLikeMutate(restaurantId);
  };

  const businessStatus = infoData?.data?.businessHours
    ? getBusinessStatus(infoData.data.businessHours)
    : ((infoData?.data?.isOpen ?? basicData?.data?.isOpen ?? store.isOpen) ? "영업중" : "영업 종료");
  const isOpen = businessStatus === "영업중";
  const reviewCount = infoData?.data?.reviewCount ?? basicData?.data?.reviewCount ?? store.reviewCount;
  const priceRange = basicData?.data?.priceRange;

  const businessHoursList = infoData?.data?.businessHours
    ? parseBusinessHours(infoData.data.businessHours)
    : [];

  const todayHoursStr = businessHoursList[todayIndex]
    ? formatHours(businessHoursList[todayIndex])
    : null;

  const selectedHoursStr = businessHoursList[activeDay]
    ? formatHours(businessHoursList[activeDay])
    : null;

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-[28px] font-bold text-black">{store.name}</h2>
        <button
          onClick={handleLike}
          className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-neutral-100 transition-colors shrink-0"
          aria-label={isLiked ? "좋아요 취소" : "좋아요"}
        >
          <FavoriteIcon
            width={24}
            height={24}
            stroke={isLiked ? "var(--color-primary)" : "#99A1AF"}
            fill={isLiked ? "var(--color-primary)" : "none"}
          />
        </button>
      </div>
      <p className="text-[16px] text-[#99A1AF] mb-3">{store.summary}</p>

      <div className="flex flex-col gap-1.5">
        {/* 영업 시간 */}
        <div>
          <div className="flex items-center gap-1.5">
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              className={cn("shrink-0", isOpen ? "text-[#00A63E]" : "text-[#FF4500]")}
            >
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={cn("text-[12px] font-bold", isOpen ? "text-[#00A63E]" : "text-[#FF4500]")}>
              {businessStatus}
            </span>
            {todayHoursStr && (
              <>
                <div className="w-px h-3 bg-[#D1D5DC]" />
                <span className="text-[12px] text-black">{todayHoursStr}</span>
              </>
            )}
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
            <div className="mt-1 bg-white border border-[#F3F1EF] rounded-md shadow-[0px_2px_4px_rgba(0,0,0,0.1)] p-2 w-45.25">
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
                {selectedHoursStr ? (
                  <p className="font-bold">{selectedHoursStr}</p>
                ) : (
                  <p className="text-neutral-400">영업시간 정보 없음</p>
                )}
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
          <span className="text-[12px] text-[#6A7282]">리뷰 {reviewCount ?? 0}</span>
        </div>

        {/* 가격대 */}
        {priceRange && (
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
              <circle cx="7" cy="7" r="5.5" stroke="#6A7282" strokeWidth="1.1" />
              <path d="M7 4v6M5 8.5c0 .828.895 1.5 2 1.5s2-.672 2-1.5S8.105 7 7 7s-2-.672-2-1.5S5.895 4 7 4s2 .672 2 1.5" stroke="#6A7282" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
            <span className="text-[12px] text-[#6A7282]">{priceRange}</span>
          </div>
        )}
      </div>
    </div>
  );
}
