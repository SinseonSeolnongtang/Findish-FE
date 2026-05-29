import { useState } from "react";
import { type StoreCardData } from "@/components/common/StoreCard";
import ReviewTag from "@/components/common/ReviewTag";
import MainMenuCard from "@/components/common/MainMenuCard";
import { useRestaurantAiSummaryQuery, useRestaurantMenusQuery } from "@/hooks/useRestaurant";

interface AiTabProps {
  store: StoreCardData;
  restaurantId: string;
  onMoreClick?: () => void;
}

export default function AiTab({ store, restaurantId, onMoreClick }: AiTabProps) {
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  const { data: aiData, isLoading: aiLoading } = useRestaurantAiSummaryQuery(restaurantId);
  const { data: menuData, isLoading: menuLoading } = useRestaurantMenusQuery(restaurantId);

  const positiveKeywords = aiData?.positiveKeywords ?? [];
  const negativeKeywords = aiData?.negativeKeywords ?? [];
  const previewMenus = menuData?.menus.slice(0, 3) ?? [];

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
            {previewMenus.map((item) => (
              <MainMenuCard
                key={item.menuId}
                name={item.name}
                price={item.price}
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
          <div className="flex flex-col gap-2">
            <div className="h-4 rounded bg-neutral-100 animate-pulse w-3/4" />
            <div className="h-4 rounded bg-neutral-100 animate-pulse w-full" />
            <div className="h-4 rounded bg-neutral-100 animate-pulse w-2/3" />
          </div>
        ) : (
          <>
            {aiData?.summary && (
              <p className="typo-caption text-neutral-700 leading-relaxed mb-3">
                {aiData.summary}
              </p>
            )}

            {/* 키워드 태그 */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {positiveKeywords.map((kw) => (
                <ReviewTag
                  key={kw}
                  label={kw}
                  type={selectedKeyword === kw ? "choosed" : "positive"}
                  onClick={() =>
                    setSelectedKeyword((prev) => (prev === kw ? null : kw))
                  }
                />
              ))}
              {negativeKeywords.map((kw) => (
                <ReviewTag
                  key={kw}
                  label={kw}
                  type={selectedKeyword === kw ? "choosed" : "negative"}
                  onClick={() =>
                    setSelectedKeyword((prev) => (prev === kw ? null : kw))
                  }
                />
              ))}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="typo-caption font-bold text-black">긍정</span>
              <div className="w-px h-3 bg-neutral-300" />
              <span className="typo-caption text-neutral-500">부정</span>
            </div>
          </>
        )}

        {/* 이미지 갤러리 */}
        <div className="flex gap-2 overflow-x-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-22.5 h-22.5 rounded-lg overflow-hidden bg-[#E5E7EB]"
            >
              {store.imageUrl && (
                <img
                  src={store.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 분위기 태그 */}
      {aiData?.atmosphereTags && aiData.atmosphereTags.length > 0 && (
        <div>
          <h3 className="typo-body-md font-bold text-black mb-3">분위기</h3>
          <div className="flex flex-wrap gap-1.5">
            {aiData.atmosphereTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-[#FFF1DF] typo-caption text-primary font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
