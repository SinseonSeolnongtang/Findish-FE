import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { type StoreCardData } from "@/components/common/StoreCard";
import MainMenuCard from "@/components/common/MainMenuCard";
import { useRestaurantAiSummaryQuery, useRestaurantMenusQuery, useRestaurantKeywordReviewsInfiniteQuery } from "@/hooks/useRestaurant";
import type { AiKeyword } from "@/types/restaurant";

interface AiTabProps {
  store: StoreCardData;
  restaurantId: string;
  onMoreClick?: () => void;
}

type SummaryKey =
  | "tasteSummary"
  | "ambianceSummary"
  | "serviceSummary"
  | "priceSummary"
  | "facilitySummary"
  | "waitingSummary";

const ASPECT_LABELS: { key: SummaryKey; label: string }[] = [
  { key: "tasteSummary", label: "맛" },
  { key: "ambianceSummary", label: "공간" },
  { key: "serviceSummary", label: "서비스" },
  { key: "priceSummary", label: "가격" },
  { key: "facilitySummary", label: "시설" },
  { key: "waitingSummary", label: "대기" },
];

function isNegativeDominant(kw: AiKeyword): boolean {
  const neg = kw.negativeCount ?? 0;
  const total = kw.sentenceCount ?? 1;
  return neg > 0 && neg / total >= 0.1;
}

function HighlightedText({ text, keyword }: { text: string; keyword: string }) {
  if (!keyword) return <>{text}</>;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "g"));
  return (
    <>
      {parts.map((part, i) =>
        part === keyword ? (
          <mark key={i} className="bg-[#FFF1DF] text-primary font-semibold not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke={color} strokeWidth="1.2" />
      <path d="M3.5 6L5.5 8L8.5 4.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1.5L10.5 9.5H1.5L6 1.5Z" stroke={color} strokeWidth="1.2" fill="none" strokeLinejoin="round" />
      <path d="M6 5v2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="6" cy="8.2" r="0.5" fill={color} />
    </svg>
  );
}


export default function AiTab({ store, restaurantId, onMoreClick }: AiTabProps) {
  const { data: aiData, isLoading: aiLoading } = useRestaurantAiSummaryQuery(restaurantId);
  const { data: menuData, isLoading: menuLoading } = useRestaurantMenusQuery(restaurantId);

  const ai = aiData?.data;
  const menus = menuData?.data?.slice(0, 3) ?? [];
  const keywords = ai?.keywords ?? [];
  const photos = ai?.photos ?? [];

  const [selectedKeywordIdx, setSelectedKeywordIdx] = useState(0);
  const [sentimentTab, setSentimentTab] = useState<"positive" | "negative">("positive");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const selectedKeyword = keywords[selectedKeywordIdx];

  // 긍정 탭: /reviews API에서 keyword로 페이지네이션 (ai-summary는 ~3개 샘플만 내려줌)
  const {
    data: reviewPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRestaurantKeywordReviewsInfiniteQuery(restaurantId, selectedKeyword?.key);

  const positiveReviews = reviewPages?.pages.flatMap((p) => p.data?.content ?? []) ?? [];

  // 부정 탭: ai-summary의 negativeSentences (개수가 적어 전체 표시)
  const negativeItems = selectedKeyword?.negativeSentences ?? [];

  const displayItems: string[] =
    sentimentTab === "positive"
      ? positiveReviews.map((r) => r.content ?? "").filter(Boolean)
      : negativeItems;

  const showSentinel = sentimentTab === "positive" && !!hasNextPage;

  const fetchMore = useCallback(() => {
    if (!isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, isFetchingNextPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !showSentinel) return;

    // overflow-y: auto/scroll 인 가장 가까운 조상을 root로 지정해야
    // 패널 내부 스크롤 컨테이너 기준으로 교차를 감지함
    let scrollParent: Element | null = null;
    let el: Element | null = sentinel.parentElement;
    while (el) {
      const { overflowY } = getComputedStyle(el);
      if (overflowY === "auto" || overflowY === "scroll") {
        scrollParent = el;
        break;
      }
      el = el.parentElement;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchMore();
      },
      { root: scrollParent, threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchMore, showSentinel]);

  const aspectSummaries = ASPECT_LABELS.map(({ key, label }) => ({
    label,
    value: ai?.[key],
  })).filter((s): s is { label: string; value: string } => !!s.value);

  return (
    <div className="p-4 flex flex-col gap-5">
      {/* 대표 메뉴 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="typo-body-md font-bold text-black">대표 메뉴</h3>
          <button
            className="typo-caption text-neutral-400 cursor-pointer"
            onClick={onMoreClick}
          >
            더보기
          </button>
        </div>
        {menuLoading ? (
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="shrink-0 w-30 h-25 rounded-[10px] bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto">
            {menus.map((item, i) => (
              <MainMenuCard
                key={item.name ?? i}
                name={item.name ?? ""}
                price={Number(String(item.price ?? "").replace(/[^0-9]/g, "") || 0)}
                imageUrl={item.imageUrl || store.imageUrl}
                className="shrink-0 w-30 h-25"
              />
            ))}
          </div>
        )}
      </div>

      {/* AI 리뷰 요약 */}
      <div>
        <h3 className="typo-body-md font-bold text-black mb-3">AI 리뷰 요약</h3>

        {aiLoading ? (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 w-20 rounded-full bg-neutral-100 animate-pulse shrink-0" />
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 w-24 rounded-lg bg-neutral-100 animate-pulse shrink-0" />
              ))}
            </div>
            <div className="flex flex-col gap-2 mt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-4 rounded bg-neutral-100 animate-pulse" />
              ))}
            </div>
          </div>
        ) : keywords.length === 0 ? (
          <p className="typo-caption text-neutral-400 text-center py-4">
            AI 요약 정보가 없습니다.
          </p>
        ) : (
          <>
            {/* 키워드 pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {keywords.slice(0, 8).map((kw, i) => {
                const isSelected = selectedKeywordIdx === i;
                const isNeg = isNegativeDominant(kw);
                const iconColor = isSelected ? "white" : isNeg ? "#F59E0B" : "#00A63E";
                return (
                  <button
                    key={kw.key ?? i}
                    onClick={() => {
                      setSelectedKeywordIdx(i);
                      setSentimentTab("positive");
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full border typo-caption font-medium cursor-pointer transition-colors",
                      isSelected
                        ? "bg-primary border-primary text-white"
                        : "bg-white border-neutral-200 text-neutral-700",
                    )}
                  >
                    {isNeg ? <WarningIcon color={iconColor} /> : <CheckIcon color={iconColor} />}
                    {kw.key}
                  </button>
                );
              })}
            </div>

            {/* 긍정 | 부정 toggle */}
            {selectedKeyword && (
              <div className="flex items-center w-fit bg-neutral-100 rounded-lg p-0.5 mb-4">
                <button
                  onClick={() => setSentimentTab("positive")}
                  className={cn(
                    "px-4 py-1.5 typo-caption font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap",
                    sentimentTab === "positive"
                      ? "bg-white text-neutral-800 shadow-sm"
                      : "text-neutral-500",
                  )}
                >
                  긍정 {selectedKeyword.positiveCount ?? 0}
                </button>
                <button
                  onClick={() => setSentimentTab("negative")}
                  className={cn(
                    "px-4 py-1.5 typo-caption font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap",
                    sentimentTab === "negative"
                      ? "bg-white text-neutral-800 shadow-sm"
                      : "text-neutral-500",
                  )}
                >
                  부정 {selectedKeyword.negativeCount ?? 0}
                </button>
              </div>
            )}

            {/* 사진 strip */}
            {photos.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
                {photos.slice(0, 6).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="shrink-0 w-24 h-24 rounded-lg object-cover bg-neutral-100"
                  />
                ))}
              </div>
            )}

            {/* 리뷰 문장 */}
            <div className="flex flex-col divide-y divide-neutral-100">
              {displayItems.length > 0 ? (
                <>
                  {displayItems.map((sentence, i) => (
                    <p key={i} className="typo-caption text-neutral-700 leading-relaxed py-3 first:pt-0">
                      <HighlightedText text={sentence} keyword={selectedKeyword?.key ?? ""} />
                    </p>
                  ))}
                  {showSentinel && (
                    <div ref={sentinelRef} className="py-4 flex justify-center">
                      <div className="flex gap-1.5 items-center">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce"
                            style={{ animationDelay: `${i * 120}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : isFetchingNextPage || (!reviewPages && sentimentTab === "positive") ? (
                <div className="py-4 flex justify-center">
                  <div className="flex gap-1.5 items-center">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce"
                        style={{ animationDelay: `${i * 120}ms` }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="typo-caption text-neutral-400 text-center py-4">
                  {sentimentTab === "positive" ? "긍정" : "부정"} 리뷰가 없습니다.
                </p>
              )}
            </div>

          </>
        )}
      </div>
    </div>
  );
}
