import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import TrashIcon from "@/assets/icons/common/trash.svg?react";
import RightIcon from "@/assets/icons/common/right.svg?react";
import Header from "@/components/common/Header";
import Checkbox from "@/components/common/Checkbox";
import Button from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  useCartQuery,
  useUpdateCartQuantityMutation,
  useDeleteCartItemMutation,
  useOrderCartMutation,
} from "@/hooks/useCart";
import { useRestaurantBasicQuery } from "@/hooks/useRestaurant";
import type { StoreCardData } from "@/components/common/StoreCard";

export default function CartPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useCartQuery();
  const { mutate: updateQuantity } = useUpdateCartQuantityMutation();
  const { mutate: deleteItem } = useDeleteCartItemMutation();
  const { mutate: order, isPending: isOrdering } = useOrderCartMutation();

  const items = data?.items ?? [];
  const naverPlaceId = data?.naverPlaceId ?? "";
  const { data: restaurantData } = useRestaurantBasicQuery(naverPlaceId);
  const restaurantName =
    data?.restaurantName ?? restaurantData?.data?.name ?? "";

  const handleGoToDetail = () => {
    if (!naverPlaceId) return;
    const rd = restaurantData?.data;
    const preSelectedStore: StoreCardData = {
      id: naverPlaceId,
      name: rd?.name ?? "",
      category: rd?.category ?? "",
      isOpen: rd?.isOpen ?? false,
      reviewCount: String(rd?.reviewCount ?? 0),
      keywords: rd?.tags ?? [],
      imageUrl: rd?.thumbnailUrl,
      lat: rd?.lat,
      lng: rd?.lng,
    };
    navigate("/normal", { state: { preSelectedStore } });
  };

  const [orderDone, setOrderDone] = useState<{ totalPrice: number } | null>(null);
  const [deselectedIds, setDeselectedIds] = useState<Set<string>>(new Set());

  const selectedIds = new Set(
    items.map((i) => i.cartItemId).filter((id) => !deselectedIds.has(id)),
  );

  const allSelected =
    items.length > 0 && items.every((i) => !deselectedIds.has(i.cartItemId));

  const handleToggleAll = () => {
    if (allSelected) {
      setDeselectedIds(new Set(items.map((i) => i.cartItemId)));
    } else {
      setDeselectedIds(new Set());
    }
  };

  const handleToggleItem = (id: string) => {
    setDeselectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleQuantityChange = (
    cartItemId: string,
    currentQty: number,
    delta: number,
  ) => {
    const next = currentQty + delta;
    if (next < 1) {
      deleteItem(cartItemId);
      return;
    }
    updateQuantity({ cartItemId, body: { quantity: next } });
  };

  const handleOrder = () => {
    order(undefined, {
      onSuccess: (res) => {
        setOrderDone({ totalPrice: res.totalPrice ?? 0 });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <p className="typo-body-lg text-neutral-400">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <p className="typo-body-lg text-red-400">
            장바구니를 불러오지 못했습니다.
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <p className="text-[20px] font-medium text-neutral-500">
            장바구니가 비어있습니다.
          </p>
          <button
            onClick={() => navigate("/normal")}
            className="w-50 h-12 bg-primary text-white text-[16px] font-bold rounded-[26px] hover:bg-[#e55e00] transition-colors"
          >
            맛집 찾으러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white flex flex-col">
      <Header />

      <main className="pt-18 flex-1 max-w-195 w-full mx-auto px-6 pb-28">
        {/* 가게명 + 전체선택 */}
        <div className="flex items-center justify-between mt-8 mb-5">
          <button
            onClick={handleGoToDetail}
            className="flex items-center gap-0.5 group cursor-pointer"
          >
            <span className="text-[18px] font-semibold text-neutral-700 group-hover:text-primary transition-colors">
              {restaurantName}
            </span>
            <RightIcon
              width={18}
              height={18}
              className="text-neutral-600 group-hover:text-primary transition-colors mt-px"
            />
          </button>
          <div className="flex items-center gap-1.5">
            <Checkbox
              checked={allSelected}
              onChange={handleToggleAll}
              size={22}
            />
            <span
              onClick={handleToggleAll}
              className="text-[16px] text-neutral-500 hover:text-primary transition-colors cursor-pointer"
            >
              전체 선택
            </span>
          </div>
        </div>

        {/* 아이템 목록 */}
        <div className="flex flex-col divide-y divide-neutral-100">
          {items.map((item) => {
            const isSelected = selectedIds.has(item.cartItemId);
            return (
              <div
                key={item.cartItemId}
                className="flex items-center gap-4 py-5"
              >
                {/* 체크박스 */}
                <Checkbox
                  checked={isSelected}
                  onChange={() => handleToggleItem(item.cartItemId)}
                  size={24}
                />

                {/* 음식 이미지 */}
                <div className="w-16 h-16 rounded-xl shrink-0 overflow-hidden bg-neutral-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.menuName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-[#8B6914] to-[#5C3A1E]" />
                  )}
                </div>

                {/* 텍스트 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-neutral-800 truncate">
                    {item.menuName}
                  </p>
                </div>

                {/* 가격 + 수량 조절 */}
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[15px] font-semibold text-neutral-800">
                    {(item.price * item.quantity).toLocaleString()}원
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.cartItemId, item.quantity, -1)
                      }
                      className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-primary hover:text-primary transition-colors text-[16px] font-medium"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-[15px] font-medium text-neutral-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.cartItemId, item.quantity, 1)
                      }
                      className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-primary hover:text-primary transition-colors text-[16px] font-medium"
                    >
                      +
                    </button>
                    <button
                      onClick={() => deleteItem(item.cartItemId)}
                      className="text-neutral-400 hover:text-red-400 transition-colors ml-1"
                    >
                      <TrashIcon width={20} height={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {orderDone && (
        <ConfirmModal
          title="주문이 완료되었습니다!"
          message={`총 금액 ${orderDone.totalPrice.toLocaleString()}원`}
          confirmLabel="홈으로"
          cancelLabel="닫기"
          onConfirm={() => { queryClient.invalidateQueries({ queryKey: ['cart'] }); setOrderDone(null); navigate("/"); }}
          onClose={() => { queryClient.invalidateQueries({ queryKey: ['cart'] }); setOrderDone(null); }}
        />
      )}

      {/* 주문하기 버튼 (하단 고정) */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 bg-white">
        <Button
          onClick={handleOrder}
          disabled={isOrdering || selectedIds.size === 0}
          variant="primary"
          size="md"
          shape="pill"
          className="w-full max-w-195 mx-auto h-14"
        >
          {isOrdering ? "주문 중..." : "주문하기"}
        </Button>
      </div>
    </div>
  );
}
