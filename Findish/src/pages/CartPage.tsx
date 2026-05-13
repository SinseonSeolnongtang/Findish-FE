import { useNavigate } from "react-router-dom";
import TrashIcon from "@/assets/icons/common/trash.svg?react";
import Header from "@/components/common/Header";
import {
  useCartQuery,
  useUpdateCartQuantityMutation,
  useDeleteCartItemMutation,
  useOrderCartMutation,
} from "@/hooks/useCart";

export default function CartPage() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useCartQuery();
  const { mutate: updateQuantity } = useUpdateCartQuantityMutation();
  const { mutate: deleteItem } = useDeleteCartItemMutation();
  const { mutate: order, isPending: isOrdering } = useOrderCartMutation();

  const handleQuantityChange = (
    cartItemId: number,
    currentQty: number,
    delta: number,
  ) => {
    const next = currentQty + delta;
    if (next < 1) return;
    updateQuantity({ cartItemId, body: { quantity: next } });
  };

  const handleOrder = () => {
    order(undefined, {
      onSuccess: (res) => {
        alert(
          `주문이 완료되었습니다!\n주문번호: ${res.orderId}\n총 금액: ${res.totalPrice.toLocaleString()}원`,
        );
        navigate("/");
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

  const items = data?.items ?? [];

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
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-17 max-w-195 mx-auto px-8 py-10">
        {/* 레스토랑 헤더 */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[20px] font-bold text-neutral-800">
            {data?.restaurantName}
          </span>
        </div>

        {/* 아이템 목록 */}
        <div className="flex flex-col gap-5">
          {items.map((item) => (
            <div key={item.cartItemId} className="flex items-center gap-4">
              {/* 음식 이미지 */}
              <div className="w-18 h-18 rounded-lg shrink-0 overflow-hidden bg-neutral-100">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-[#8B6914] to-[#5C3A1E]" />
                )}
              </div>

              {/* 메뉴명 */}
              <span className="flex-1 text-[18px] font-medium text-neutral-800">
                {item.name}
              </span>

              {/* 우측 컨트롤 */}
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-3">
                  {/* 삭제 아이콘 */}
                  <button
                    onClick={() => deleteItem(item.cartItemId)}
                    className="text-neutral-400 hover:text-primary transition-colors"
                  >
                    <TrashIcon width={18} height={18} />
                  </button>

                  {/* 가격 */}
                  <span className="text-[16px] font-semibold text-neutral-800">
                    {(item.price * item.quantity).toLocaleString()}원
                  </span>
                </div>

                {/* 수량 조절 */}
                <div className="flex items-center gap-3 text-[16px]">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.cartItemId, item.quantity, -1)
                    }
                    className="text-primary font-bold w-5 text-center hover:opacity-70 transition-opacity"
                  >
                    -
                  </button>
                  <span className="text-neutral-800 font-medium w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.cartItemId, item.quantity, 1)
                    }
                    className="text-primary font-bold w-5 text-center hover:opacity-70 transition-opacity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 총합 */}
        <div className="border-t border-[#E5E7EB] mt-12 pt-4 flex justify-end">
          <span className="text-[18px] font-bold text-neutral-800">
            총합 {data?.totalPrice.toLocaleString()}원
          </span>
        </div>

        {/* 주문하기 버튼 */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleOrder}
            disabled={isOrdering}
            className="w-70 h-13 bg-primary text-white text-[18px] font-bold rounded-[26px] hover:bg-[#e55e00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOrdering ? "주문 중..." : "주문하기"}
          </button>
        </div>
      </main>
    </div>
  );
}
