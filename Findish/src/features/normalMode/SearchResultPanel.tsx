import StoreCard, { type StoreCardData } from "@/components/common/StoreCard";
import Skeleton from "@/components/common/Skeleton";

interface SearchResultPanelProps {
  restaurants: StoreCardData[];
  totalCount: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReserve?: (id: string) => void;
  likedIds?: Set<string>;
  onToggleLike?: (id: string) => void;
  isLoading?: boolean;
}

function StoreCardSkeleton() {
  return (
    <div className="flex" style={{ padding: "10px 10px" }}>
      <Skeleton className="shrink-0 w-31.5 h-31.5 rounded-2xl" />
      <div className="flex flex-col pl-3.25 flex-1 min-w-0 pt-3 gap-2">
        <div className="flex items-start justify-between gap-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-7 w-20 rounded-md" />
        </div>
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-1.25 mt-0.5">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function SearchResultPanel({
  restaurants,
  totalCount,
  selectedId,
  onSelect,
  onReserve,
  likedIds,
  onToggleLike,
  isLoading = false,
}: SearchResultPanelProps) {
  return (
    <div className="absolute left-0 top-17 bottom-0 w-120 bg-white shadow-[4px_0px_12px_rgba(0,0,0,0.08)] flex flex-col z-20">
      <div className="px-5.5 py-2.5 border-b border-[#F3F4F6] pt-8">
        {isLoading ? (
          <Skeleton className="h-5 w-32" />
        ) : (
          <p className="typo-body-md text-neutral-600">
            검색 결과 &nbsp;
            <span className="font-bold text-primary">{totalCount}개</span>
          </p>
        )}
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-[#F3F4F6]">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <StoreCardSkeleton key={i} />)
          : restaurants.map((r) => (
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
