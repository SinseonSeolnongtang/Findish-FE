import { useState } from "react";
import { type StoreCardData } from "@/components/common/StoreCard";
import ReviewTag from "@/components/common/ReviewTag";
import MainMenuCard from "@/components/common/MainMenuCard";
import { MOCK_MENUS, AI_REVIEW_TAGS } from "@/mocks/storeDetail";

interface AiTabProps {
  store: StoreCardData;
  onMoreClick?: () => void;
}

export default function AiTab({ store, onMoreClick }: AiTabProps) {
  const [selectedLabel, setSelectedLabel] = useState(AI_REVIEW_TAGS[0].label);
  const selectedTag =
    AI_REVIEW_TAGS.find((t) => t.label === selectedLabel) ?? AI_REVIEW_TAGS[0];

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
        <div className="flex gap-2 overflow-x-auto">
          {MOCK_MENUS.map((item) => (
            <MainMenuCard
              key={item.name}
              name={item.name}
              price={item.price}
              imageUrl={store.imageUrl}
              className="shrink-0 w-30 h-25"
            />
          ))}
        </div>
      </div>

      {/* AI 리뷰 요약 */}
      <div>
        <h3 className="typo-body-md font-bold text-black mb-3">AI 리뷰 요약</h3>
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {AI_REVIEW_TAGS.map((tag) => (
            <ReviewTag
              key={tag.label}
              label={tag.label}
              type={tag.label === selectedLabel ? "choosed" : tag.sentiment}
              onClick={() => setSelectedLabel(tag.label)}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="typo-caption font-bold text-black">긍정</span>
          <div className="w-px h-3 bg-neutral-300" />
          <span className="typo-caption text-neutral-500">부정</span>
        </div>

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

      {/* 리뷰 코멘트 */}
      <div className="flex flex-col gap-4">
        {selectedTag.reviews.map((review, i) => (
          <div key={i}>
            <p className="typo-caption text-black leading-relaxed">
              {review.text}
            </p>
            <p className="typo-micro text-neutral-500 text-right mt-1">
              {review.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
