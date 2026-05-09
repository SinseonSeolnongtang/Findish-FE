import { cn } from "@/lib/utils";
import Rating from "./Rating";
import Keyword from "./Keyword";
import Button from "./Button";
import ReviewIcon from "@/assets/icons/common/review.svg?react";
import ClockIcon from "@/assets/icons/common/clock.svg?react";

export interface StoreCardData {
  id: number;
  name: string;
  category: string;
  summary: string;
  isOpen: boolean;
  reviewCount: string;
  rating: number;
  keywords: string[];
  imageUrl?: string;
}

interface StoreCardProps {
  store: StoreCardData;
  isActive?: boolean;
  onClick?: () => void;
  onReserve?: () => void;
  className?: string;
}

export default function StoreCard({
  store,
  isActive,
  onClick,
  onReserve,
  className,
}: StoreCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer transition-colors",
        isActive ? "bg-orange-100" : "bg-white hover:bg-orange-100",
        className,
      )}
      style={{ padding: "10px 22px" }}
    >
      {/* 가게 대표 이미지 */}
      <div className="relative shrink-0 w-31.5 h-31.5">
        <div className="w-full h-full rounded-2xl overflow-hidden bg-neutral-200">
          {store.imageUrl ? (
            <img
              src={store.imageUrl}
              alt={store.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-[#FFE4CC] to-[#FFD0A8]" />
          )}
        </div>
        {/* Rating badge — bottom-left of image */}
        <div className="absolute bottom-2 left-1.5">
          <Rating value={store.rating} />
        </div>
      </div>

      {/* 정보 */}
      <div className="flex flex-col pl-3.25 flex-1 min-w-0 pt-3">
        {/* 가게명 + 카테고리 + 예약하기 */}
        <div className="flex items-start justify-between gap-1">
          <div className="flex items-center gap-1.25 min-w-0">
            <span className="text-[18px] font-bold text-black leading-none shrink-0">
              {store.name}
            </span>
            <span className="typo-micro text-neutral-400 shrink-0">
              {store.category}
            </span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onReserve?.();
            }}
            className="shrink-0 w-12.5 h-6.25 typo-micro rounded-md px-0 whitespace-nowrap"
          >
            예약하기
          </Button>
        </div>

        {/* 요약 */}
        <p className="typo-caption text-neutral-600 mt-1.5 overflow-hidden whitespace-nowrap text-ellipsis">
          {store.summary}
        </p>

        {/* 영업상태 + 리뷰 수 */}
        <div className="flex items-center gap-3 mt-1.5">
          <div className="flex items-center gap-1">
            <ClockIcon
              width={16}
              height={16}
              stroke={store.isOpen ? "var(--color-success)" : "var(--color-neutral-400)"}
            />
            <span
              className={cn(
                "text-[12px] font-bold",
                store.isOpen ? "text-success" : "text-neutral-400",
              )}
            >
              {store.isOpen ? "영업중" : "영업종료"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ReviewIcon width={17} height={17} />
            <span className="typo-caption text-neutral-500">
              리뷰 {store.reviewCount}
            </span>
          </div>
        </div>

        {/* 키워드 */}
        <div className="flex items-center gap-1.25 mt-1.5 overflow-hidden flex-nowrap">
          {store.keywords.slice(0, 3).map((k) => (
            <Keyword key={k} label={k} />
          ))}
        </div>
      </div>
    </div>
  );
}
