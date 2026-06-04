import { useState } from "react";
import { cn } from "@/lib/utils";
import Rating from "./Rating";
import Keyword from "./Keyword";
import Skeleton from "./Skeleton";
import type { StoreCardData } from "./StoreCard";
import StarIcon from "@/assets/icons/common/star.svg?react";

interface StoreCardLgProps {
  store: StoreCardData;
  images?: string[];
  showAiPickBadge?: boolean;
  onView?: () => void;
  className?: string;
}

export default function StoreCardLg({
  store,
  images = [],
  showAiPickBadge = false,
  onView,
  className,
}: StoreCardLgProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const [loadedUrls, setLoadedUrls] = useState<Set<string>>(new Set());
  const imgList =
    images.length > 0 ? images : ([store.imageUrl].filter(Boolean) as string[]);

  return (
    <div
      className={cn(
        "bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB] w-[360px]",
        className,
      )}
    >
      {/* 이미지 */}
      <div className="relative">
        <div className="relative w-full h-60.5 bg-[#E5E7EB] overflow-hidden rounded-t-2xl">
          {imgList[imgIdx] ? (
            <>
              {!loadedUrls.has(imgList[imgIdx]) && (
                <Skeleton className="absolute inset-0 rounded-none" />
              )}
              <img
                src={imgList[imgIdx]}
                alt={store.name}
                className={cn(
                  "w-full h-full object-cover",
                  !loadedUrls.has(imgList[imgIdx]) && "invisible",
                )}
                onLoad={() =>
                  setLoadedUrls((prev) => new Set(prev).add(imgList[imgIdx]))
                }
              />
            </>
          ) : (
            <div className="w-full h-full bg-linear-to-br from-[#FFE4CC] to-[#FFD0A8]" />
          )}
        </div>

        {/* AI Pick 배지 */}
        {showAiPickBadge && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-primary text-white text-[11px] font-bold px-2 py-1 rounded-full">
            <StarIcon width={10} height={10} />
            AI Pick
          </div>
        )}

        {/* 별점 배지 */}
        {store.rating != null && (
          <div className="absolute bottom-3 left-3">
            <Rating value={store.rating} />
          </div>
        )}

        {/* 이미지 인디케이터 */}
        {imgList.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {imgList.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors",
                  i === imgIdx ? "bg-primary" : "bg-white/60",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="px-5 py-4 flex flex-col gap-2">
        {/* 가게명 + 카테고리 */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-[18px] font-bold text-black">{store.name}</span>
          <span className="typo-micro text-neutral-400">{store.category}</span>
        </div>

        {/* 한줄 요약 */}
        <p className="typo-caption text-neutral-600 line-clamp-2">
          {store.summary}
        </p>

        {/* 영업상태 + 리뷰 */}
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "text-[12px] font-bold",
              store.isOpen ? "text-success" : "text-neutral-400",
            )}
          >
            {store.isOpen ? "영업중" : "영업 종료"}
          </span>
          <span className="typo-caption text-neutral-500">
            리뷰 {store.reviewCount}
          </span>
        </div>

        {/* 키워드 */}
        <div className="flex gap-1.5 flex-wrap">
          {store.keywords.map((k) => (
            <Keyword key={k} label={k} />
          ))}
        </div>
      </div>

      {/* 가게 보러가기 버튼 */}
      <div className="px-5 pb-5">
        <button
          onClick={onView}
          className="w-full h-10 bg-primary text-white-50 text-[16px] font-bold rounded-full hover:bg-[#e55e00] transition-colors"
        >
          가게 보러가기
        </button>
      </div>
    </div>
  );
}
