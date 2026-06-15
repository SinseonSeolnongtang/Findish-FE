import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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

interface Lightbox {
  images: string[];
  index: number;
}

function ImageLightbox({ lightbox, onClose, onPrev, onNext }: {
  lightbox: Lightbox;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  const { images, index } = lightbox;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/85"
      onClick={onClose}
    >
      {/* 닫기 버튼 */}
      <button
        className="absolute top-4 right-4 text-white p-2"
        onClick={onClose}
        aria-label="닫기"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* 이미지 */}
      <img
        src={images[index]}
        alt={`이미지 ${index + 1}`}
        className="max-w-[92vw] max-h-[80vh] object-contain rounded-lg select-none"
        onClick={(e) => e.stopPropagation()}
      />

      {/* 이전 버튼 */}
      {images.length > 1 && (
        <button
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white p-2 disabled:opacity-30"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          disabled={index === 0}
          aria-label="이전 이미지"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* 다음 버튼 */}
      {images.length > 1 && (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white p-2 disabled:opacity-30"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          disabled={index === images.length - 1}
          aria-label="다음 이미지"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* 페이지 인디케이터 */}
      {images.length > 1 && (
        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white typo-caption">
          {index + 1} / {images.length}
        </span>
      )}
    </div>,
    document.body,
  );
}

export default function ReviewTab({ restaurantId }: ReviewTabProps) {
  const [reviewSearch, setReviewSearch] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");
  const [photoOnly, setPhotoOnly] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortType, setSortType] = useState<SortOption>("최신순");
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);

  const openLightbox = (images: string[], index: number) =>
    setLightbox({ images, index });
  const closeLightbox = () => setLightbox(null);
  const prevImage = () =>
    setLightbox((lb) => lb && lb.index > 0 ? { ...lb, index: lb.index - 1 } : lb);
  const nextImage = () =>
    setLightbox((lb) => lb && lb.index < lb.images.length - 1 ? { ...lb, index: lb.index + 1 } : lb);

  const { data, isLoading, isError } = useRestaurantReviewsQuery(restaurantId, {
    page: 0,
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
          {submittedKeyword ? "검색된 리뷰" : "전체 리뷰"}{" "}
          <span className="font-bold text-primary">
            {submittedKeyword
              ? (data?.data?.content?.length ?? "…")
              : (data?.data?.totalElements ?? "…")}
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
            <button
              key={i}
              type="button"
              className="shrink-0 w-24.5 h-24.5 rounded-[10px] overflow-hidden bg-[#E5E7EB] cursor-pointer"
              onClick={() => openLightbox(reviewImages, i)}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
          {reviewImages.length > 3 && (
            <button
              type="button"
              className="shrink-0 w-24.5 h-24.5 rounded-[10px] overflow-hidden bg-[#E5E7EB] relative cursor-pointer"
              onClick={() => openLightbox(reviewImages, 3)}
            >
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
            </button>
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
                        <button
                          key={i}
                          type="button"
                          className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 cursor-pointer"
                          onClick={() => openLightbox(images, i)}
                        >
                          <img
                            src={url}
                            alt={`리뷰 이미지 ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 원문 보기 링크 */}
                </div>
              );
            })
          )}
        </div>
      )}

      {lightbox && (
        <ImageLightbox
          lightbox={lightbox}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  );
}
