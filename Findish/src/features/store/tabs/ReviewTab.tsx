import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRestaurantReviewsQuery } from "@/hooks/useRestaurant";
import SearchField from "@/components/common/SearchField";
import CameraIcon from "@/assets/icons/review/camera.svg?react";

const SORT_OPTIONS = ["최신순", "오래된 순"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const SORT_MAP: Record<SortOption, string> = {
  "최신순": "LATEST",
  "오래된 순": "OLDEST",
};

interface ReviewTabProps {
  restaurantId: string;
}

export default function ReviewTab({ restaurantId }: ReviewTabProps) {
  const [reviewSearch, setReviewSearch] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");
  const [photoOnly, setPhotoOnly] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortType, setSortType] = useState<SortOption>("최신순");

  const { data, isLoading, isError } = useRestaurantReviewsQuery(restaurantId, {
    page: 1,
    size: 20,
    photoOnly,
    sort: SORT_MAP[sortType],
    keyword: submittedKeyword || undefined,
  });

  const reviews = data?.data?.content ?? [];

  const parseImages = (raw?: string): string[] => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => item.image_url).filter(Boolean);
      }
    } catch {
      // ignore malformed JSON
    }
    return [];
  };

  const reviewImages = reviews.flatMap((r) => parseImages(r.images));

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* 검색바 */}
      <SearchField
        value={reviewSearch}
        onChange={setReviewSearch}
        onSearch={() => setSubmittedKeyword(reviewSearch)}
        placeholder="검색어를 입력하세요."
        showButton
        className="h-11.25 px-3 rounded-[20px]"
      />

      {/* 필터 행 */}
      <div className="flex items-center justify-between">
        <p className="typo-caption text-neutral-900">
          전체 리뷰{" "}
          <span className="font-bold text-primary">
            {data?.data?.totalElements ?? "…"}
          </span>
          개
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPhotoOnly((v) => !v)}
            className="flex items-center gap-1"
          >
            <CameraIcon
              width="18"
              height="18"
              className={cn(photoOnly ? "text-primary" : "text-neutral-900")}
            />
            <span
              className={cn(
                "typo-caption",
                photoOnly ? "text-primary font-bold" : "text-neutral-900",
              )}
            >
              사진 리뷰만
            </span>
          </button>

          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-1 typo-caption text-neutral-900"
            >
              {sortType}
              <svg
                width="8"
                height="5"
                viewBox="0 0 8 5"
                fill="currentColor"
                className={cn("transition-transform", sortOpen && "rotate-180")}
              >
                <path d="M0 0.5L4 4.5L8 0.5H0Z" />
              </svg>
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-6 bg-white border border-neutral-100 rounded-md shadow-[0px_2px_4px_rgba(0,0,0,0.1)] w-22 py-1.5 z-10">
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSortType(s);
                      setSortOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 typo-caption",
                      s === sortType
                        ? "text-primary font-bold"
                        : "text-neutral-600",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 이미지 갤러리 */}
      {reviewImages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {reviewImages.slice(0, 3).map((url, i) => (
            <div
              key={i}
              className="shrink-0 w-24.5 h-24.5 rounded-[10px] overflow-hidden bg-[#E5E7EB]"
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {reviewImages.length > 3 && (
            <div className="shrink-0 w-24.5 h-24.5 rounded-[10px] overflow-hidden bg-[#E5E7EB] relative">
              <img
                src={reviewImages[3]}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] rounded-[10px] flex items-center justify-center">
                <span className="typo-caption-medium text-white">
                  {reviewImages.length - 3}장 더보기
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 리뷰 목록 */}
      {isLoading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 rounded bg-neutral-100 animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <p className="typo-caption text-neutral-400">
          리뷰를 불러오지 못했습니다.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="flex flex-col divide-y divide-neutral-100">
          {reviews.length === 0 ? (
            <p className="typo-caption text-neutral-400">리뷰가 없습니다.</p>
          ) : (
            reviews.map((review) => {
              const images = parseImages(review.images);
              return (
                <div key={review.reviewId} className="flex flex-col gap-2 py-4 first:pt-0">
                  {/* 작성자 · 날짜 */}
                  <div className="flex items-center gap-1.5">
                    <span className="typo-caption-medium text-neutral-900 font-semibold">
                      {review.author}
                    </span>
                    {review.createdAt && (
                      <span className="typo-micro text-neutral-400">
                        · {new Date(review.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    )}
                  </div>

                  {/* 리뷰 본문 */}
                  {review.content && (
                    <p className="typo-caption text-neutral-800 leading-relaxed whitespace-pre-line">
                      {review.content}
                    </p>
                  )}

                  {/* 리뷰 이미지 */}
                  {images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-0.5">
                      {images.map((url, i) => (
                        <div
                          key={i}
                          className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-neutral-100"
                        >
                          <img
                            src={url}
                            alt={`리뷰 이미지 ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 원문 보기 링크 */}
                  {review.sourceUrl && (
                    <a
                      href={review.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="typo-micro text-primary underline-offset-2 hover:underline self-start"
                    >
                      네이버 원문 보기
                    </a>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
