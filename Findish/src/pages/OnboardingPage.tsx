import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/common/Button";
import { cn } from "@/lib/utils";
import { useRandomRestaurantsQuery, useToggleLikeMutation } from "@/hooks/useRestaurant";
import type { RandomRestaurantItem } from "@/types/restaurant";
import { getRandomRestaurants } from "@/api/restaurant";

const REQUIRED_LIKES = 5;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useRandomRestaurantsQuery(10);
  const { mutateAsync: toggleLike } = useToggleLikeMutation();

  const [queue, setQueue] = useState<RandomRestaurantItem[]>([]);
  const [likeCount, setLikeCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [actionMap, setActionMap] = useState<Record<string, "liked" | "skipped">>({});
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [done, setDone] = useState(false);

  const restaurants = useMemo<RandomRestaurantItem[]>(
    () => (queue.length > 0 ? queue : (data?.data ?? [])),
    [queue, data],
  );

  const current = restaurants[currentIndex];
  const isProcessed = current ? !!actionMap[current.restaurantId] : false;

  const advance = useCallback(
    async (liked: boolean, item: RandomRestaurantItem) => {
      const newActionMap: Record<string, "liked" | "skipped"> = { ...actionMap, [item.restaurantId]: liked ? "liked" : "skipped" };
      setActionMap(newActionMap);

      const newLikeCount = liked ? likeCount + 1 : likeCount;
      if (liked) setLikeCount(newLikeCount);

      const nextIndex = currentIndex + 1;

      // 남은 카드가 2개 이하면 추가 로드
      if (nextIndex >= restaurants.length - 2 && !isFetchingMore && newLikeCount < REQUIRED_LIKES) {
        setIsFetchingMore(true);
        try {
          const res = await getRandomRestaurants(10);
          const newItems = (res.data ?? []).filter(
            (r) => !newActionMap[r.restaurantId]
          );
          const merged = [...restaurants, ...newItems];
          setQueue(merged);
          queryClient.setQueryData(['restaurants', 'random', 10], res);
        } finally {
          setIsFetchingMore(false);
        }
      }

      if (newLikeCount >= REQUIRED_LIKES) {
        setDone(true);
        return;
      }

      setCurrentIndex(nextIndex);
    },
    [actionMap, currentIndex, isFetchingMore, likeCount, queryClient, restaurants]
  );

  const handleLike = async () => {
    if (!current || isProcessed || isLiking) return;
    setIsLiking(true);
    try {
      await toggleLike(current.restaurantId);
    } catch {
      // 좋아요 실패해도 진행
    } finally {
      setIsLiking(false);
    }
    advance(true, current);
  };

  const handleSkip = () => {
    if (!current || isProcessed || isLiking) return;
    advance(false, current);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-brand flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center gap-6 max-w-sm w-full text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-5xl">🎉</span>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="typo-h1 font-bold text-neutral-800">준비 완료!</h1>
            <p className="typo-body-md text-neutral-500">
              취향을 학습했어요. 이제 Findish를 즐겨보세요.
            </p>
          </div>
          <Button className="w-full" onClick={() => navigate("/")}>
            시작하기
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-brand flex items-center justify-center">
        <p className="typo-body-md text-neutral-500">식당을 불러오는 중...</p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="min-h-screen bg-gradient-brand flex flex-col items-center justify-center gap-4 px-4">
        <p className="typo-body-md text-neutral-500">더 이상 추천할 식당이 없어요.</p>
        <Button onClick={() => navigate("/")}>홈으로 이동</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-brand flex flex-col items-center px-4 py-8">
      {/* 헤더 */}
      <div className="w-full max-w-sm flex flex-col gap-2 mb-6">
        <h1 className="typo-h2 font-bold text-neutral-800">취향 설정</h1>
        <p className="typo-body-sm text-neutral-500">
          마음에 드는 식당에 좋아요를 눌러주세요 ({likeCount}/{REQUIRED_LIKES})
        </p>
        {/* 진행 바 */}
        <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(likeCount / REQUIRED_LIKES) * 100}%` }}
          />
        </div>
      </div>

      {/* 카드 */}
      <div className="w-full max-w-sm">
        <RestaurantCard item={current} />
      </div>

      {/* 버튼 */}
      <div className="flex gap-4 mt-6 w-full max-w-sm">
        <button
          onClick={handleSkip}
          disabled={isLiking}
          className={cn(
            "flex-1 h-14 rounded-2xl border-2 border-neutral-300 bg-white flex items-center justify-center gap-2 typo-body-md font-semibold text-neutral-500 transition-all hover:border-neutral-400 hover:bg-neutral-50 active:scale-95",
            isLiking && "opacity-50 cursor-not-allowed",
          )}
        >
          <span className="text-xl">✕</span>
          패스
        </button>
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={cn(
            "flex-1 h-14 rounded-2xl border-2 border-primary bg-primary flex items-center justify-center gap-2 typo-body-md font-semibold text-white transition-all hover:bg-[#e55e00] active:scale-95",
            isLiking && "opacity-50 cursor-not-allowed",
          )}
        >
          <span className="text-xl">♥</span>
          {isLiking ? "처리 중..." : "좋아요"}
        </button>
      </div>

    </div>
  );
}

function RestaurantCard({ item }: { item: RandomRestaurantItem }) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* 썸네일 */}
      <div className="w-full h-56 bg-neutral-100 relative">
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300 text-5xl">
            🍽️
          </div>
        )}
        {item.category && (
          <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full typo-caption text-neutral-700 font-medium">
            {item.category}
          </span>
        )}
      </div>

      {/* 정보 */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h2 className="typo-h3 font-bold text-neutral-800">{item.name ?? "이름 없음"}</h2>
          {item.address && (
            <p className="typo-body-sm text-neutral-400 mt-0.5 truncate">{item.address}</p>
          )}
        </div>

        <div className="flex items-center gap-3 text-neutral-500">
          {item.reviewCount !== undefined && (
            <span className="typo-body-sm flex items-center gap-1">
              <span>⭐</span> 리뷰 {item.reviewCount}개
            </span>
          )}
          {item.priceRange && (
            <span className="typo-body-sm flex items-center gap-1">
              <span>💰</span> {item.priceRange}
            </span>
          )}
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-orange-50 text-primary rounded-full typo-caption font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {item.parking && (
            <span className="flex items-center gap-1 typo-caption text-neutral-500">
              <span>🅿️</span> 주차 가능
            </span>
          )}
          {item.groupSeating && (
            <span className="flex items-center gap-1 typo-caption text-neutral-500">
              <span>👥</span> 단체석
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
