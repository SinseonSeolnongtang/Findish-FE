import { useState } from "react";
import TrashIcon from "@/assets/icons/common/trash.svg?react";
import Header from "@/components/common/Header";
import Checkbox from "@/components/common/Checkbox";

interface CartItem {
  id: number;
  menuName: string;
  price: number;
  quantity: number;
  checked: boolean;
  imageBg: string;
}

const MOCK_ITEMS: CartItem[] = [
  {
    id: 1,
    menuName: "모듬한판 (600g)",
    price: 83800,
    quantity: 2,
    checked: true,
    imageBg: "#8B4513",
  },
  {
    id: 2,
    menuName: "김치말이국수",
    price: 25800,
    quantity: 2,
    checked: true,
    imageBg: "#A0522D",
  },
];

const RESTAURANT_NAME = "방목 2호점";

export default function CartPage() {
  const [restaurantChecked, setRestaurantChecked] = useState(true);
  const [items, setItems] = useState<CartItem[]>(MOCK_ITEMS);

  const toggleRestaurant = () => {
    const next = !restaurantChecked;
    setRestaurantChecked(next);
    setItems((prev) => prev.map((i) => ({ ...i, checked: next })));
  };

  const toggleItem = (id: number) => {
    const next = items.map((i) =>
      i.id === id ? { ...i, checked: !i.checked } : i,
    );
    setItems(next);
    setRestaurantChecked(next.every((i) => i.checked));
  };

  const changeQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i,
      ),
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const total = items
    .filter((i) => i.checked)
    .reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      <Header isLoggedIn />

      <main className="pt-17 max-w-195 mx-auto px-8 py-10">
        {/* 레스토랑 그룹 헤더 */}
        <div className="flex items-center gap-3 mb-4">
          <Checkbox checked={restaurantChecked} onChange={toggleRestaurant} />
          <span className="text-[20px] font-bold text-neutral-800">
            {RESTAURANT_NAME}
          </span>
        </div>

        {/* 아이템 목록 */}
        <div className="flex flex-col gap-5">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <Checkbox
                checked={item.checked}
                onChange={() => toggleItem(item.id)}
              />

              {/* 음식 이미지 */}
              <div
                className="w-18 h-18 rounded-lg shrink-0 overflow-hidden"
                style={{ backgroundColor: item.imageBg }}
              >
                <div className="w-full h-full bg-linear-to-br from-[#8B6914] to-[#5C3A1E]" />
              </div>

              {/* 메뉴명 */}
              <span className="flex-1 text-[18px] font-medium text-neutral-800">
                {item.menuName}
              </span>

              {/* 우측 컨트롤 */}
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-3">
                  {/* 삭제 아이콘 */}
                  <button
                    onClick={() => removeItem(item.id)}
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
                    onClick={() => changeQty(item.id, -1)}
                    className="text-primary font-bold w-5 text-center hover:opacity-70 transition-opacity"
                  >
                    -
                  </button>
                  <span className="text-neutral-800 font-medium w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => changeQty(item.id, 1)}
                    className="text-primary font-bold w-5 text-center hover:opacity-70 transition-opacity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 구분선 */}
        <div className="border-t border-[#E5E7EB] mt-12 pt-4 flex justify-end">
          <span className="text-[18px] font-bold text-neutral-800">
            총합 {total.toLocaleString()}원
          </span>
        </div>

        {/* 주문하기 버튼 */}
        <div className="flex justify-center mt-6">
          <button className="w-70 h-13 bg-primary text-white text-[18px] font-bold rounded-[26px] hover:bg-[#e55e00] transition-colors">
            주문하기
          </button>
        </div>
      </main>
    </div>
  );
}
