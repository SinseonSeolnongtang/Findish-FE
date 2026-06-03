import { useState } from "react";
import { cn } from "@/lib/utils";
import Rating from "./Rating";
import Keyword from "./Keyword";
import Button from "./Button";
import ReviewIcon from "@/assets/icons/common/review.svg?react";
import ClockIcon from "@/assets/icons/common/clock.svg?react";
import FavoriteIcon from "@/assets/icons/common/favorite.svg?react";

export interface StoreCardData {
  id: string;
  name: string;
  category: string;
  summary?: string;
  isOpen: boolean;
  businessStatus?: "영업중" | "영업 전" | "영업 종료";
  reviewCount: string;
  rating?: number;
  keywords: string[];
  imageUrl?: string;
  lat?: number;
  lng?: number;
}

interface StoreCardProps {
  store: StoreCardData;
  isActive?: boolean;
  onClick?: () => void;
  onReserve?: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
  className?: string;
  hideStatus?: boolean;
  likedAt?: string;
}

function formatLikedAt(likedAt: string): string {
  const date = new Date(likedAt);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

export default function StoreCard({
  store,
  isActive,
  onClick,
  onReserve,
  onFavorite,
  isFavorited = false,
  className,
  hideStatus = false,
  likedAt,
}: StoreCardProps) {
  const isControlled = onFavorite !== undefined;
  const [localFavorited, setLocalFavorited] = useState(isFavorited);
  const favorited = isControlled ? isFavorited : localFavorited;

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer transition-colors",
        isActive ? "bg-orange-100" : "bg-white hover:bg-orange-100",
        className,
      )}
      style={{ padding: "10px 10px" }}
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
        {store.rating != null && (
          <div className="absolute bottom-2 left-1.5">
            <Rating value={store.rating} />
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="flex flex-col pl-3.25 flex-1 min-w-0 pt-3">
        {/* 가게명 + 카테고리 + 예약하기 */}
        <div className="flex items-start justify-between gap-1">
          <div className="flex items-center gap-1.25 min-w-0">
            <span className="text-[15px] font-bold text-black leading-none shrink-0">
              {store.name}
            </span>
            <span className="typo-micro text-neutral-400 shrink-0">
              {store.category}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onReserve?.();
              }}
              className="w-14 h-7 typo-micro rounded-md px-0 whitespace-nowrap"
            >
              예약하기
            </Button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isControlled) setLocalFavorited((prev) => !prev);
                onFavorite?.();
              }}
              className="flex items-center justify-center w-7 h-7 rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <FavoriteIcon
                width={16}
                height={16}
                stroke={favorited ? "var(--color-primary)" : "#99A1AF"}
                fill={favorited ? "var(--color-primary)" : "none"}
              />
            </button>
          </div>
        </div>

        {/* 요약 */}
        {store.summary && (
          <p className="typo-micro text-neutral-600 mt-1.5 overflow-hidden whitespace-nowrap text-ellipsis">
            {store.summary}
          </p>
        )}

        {/* 영업상태 + 리뷰 수 */}
        {!hideStatus && (
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1">
              {(() => {
                const status = store.businessStatus ?? (store.isOpen ? "영업중" : "영업 종료");
                const isOpen = status === "영업중";
                return (
                  <>
                    <ClockIcon
                      width={16}
                      height={16}
                      className={isOpen ? "text-success" : "text-neutral-400"}
                    />
                    <span
                      className={cn(
                        "text-[12px] font-bold",
                        isOpen ? "text-success" : "text-neutral-400",
                      )}
                    >
                      {status}
                    </span>
                  </>
                );
              })()}
            </div>
            <div className="flex items-center gap-1">
              <ReviewIcon width={17} height={17} />
              <span className="typo-caption text-neutral-500">
                리뷰 {store.reviewCount}
              </span>
            </div>
          </div>
        )}

        {/* 좋아요 날짜 */}
        {likedAt && (
          <div className="flex items-center gap-1 mt-1.5">
            <FavoriteIcon
              width={13}
              height={13}
              stroke="var(--color-primary)"
              fill="var(--color-primary)"
            />
            <span className="typo-caption text-neutral-400">
              {formatLikedAt(likedAt)}
            </span>
          </div>
        )}

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
