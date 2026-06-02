import StoreCard, { type StoreCardData } from "@/components/common/StoreCard";

interface SearchResultPanelProps {
  restaurants: StoreCardData[];
  totalCount: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReserve?: (id: string) => void;
  likedIds?: Set<string>;
  onToggleLike?: (id: string) => void;
}

export default function SearchResultPanel({
  restaurants,
  totalCount,
  selectedId,
  onSelect,
  onReserve,
  likedIds,
  onToggleLike,
}: SearchResultPanelProps) {
  return (
    <div className="absolute left-0 top-17 bottom-0 w-120 bg-white shadow-[4px_0px_12px_rgba(0,0,0,0.08)] flex flex-col z-20">
      <div className="px-5.5 py-2.5 border-b border-[#F3F4F6] pt-8">
        <p className="typo-body-md text-neutral-600">
          검색 결과 &nbsp;
          <span className="font-bold text-primary">{totalCount}개</span>
        </p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-[#F3F4F6]">
        {restaurants.map((r) => (
          <StoreCard
            key={r.id}
            store={r}
            isActive={selectedId === r.id}
            onClick={() => onSelect(r.id)}
            onReserve={() => onReserve?.(r.id)}
            isFavorited={likedIds?.has(r.id) ?? false}
            onFavorite={() => onToggleLike?.(r.id)}
          />
        ))}
      </div>
    </div>
  );
}
