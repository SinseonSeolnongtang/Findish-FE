import { useState } from "react";
import Pagination from "@/components/common/Pagination";
import Button from "@/components/common/Button";

const FOOD_IMG =
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80";
const ITEMS_PER_PAGE = 10;

interface OrderMenuItem {
  name: string;
  count: number;
  price: number;
}

interface Order {
  id: number;
  storeName: string;
  date: string;
  menus: OrderMenuItem[];
  totalPrice: number;
}

const MOCK_ORDERS: Order[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  storeName: "고기굽는마을",
  date: "5.5(월)",
  menus: [
    { name: "삼겹살", count: 6, price: 15000 },
    { name: "오겹살", count: 6, price: 17000 },
    { name: "돼지 껍데기", count: 6, price: 12000 },
  ],
  totalPrice: 345353400,
}));

function OrderDetailView({ order, onBack }: { order: Order; onBack: () => void }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-auto p-1 text-neutral-500 hover:text-neutral-900"
        >
          ← 뒤로
        </Button>
        <h2 className="typo-h1 text-neutral-900">주문 상세</h2>
      </div>
      <p className="typo-t1-medium text-neutral-900 mb-4">주문 메뉴</p>
      <div className="border border-primary rounded-[10px] overflow-hidden">
        {order.menus.map((menu, i) => (
          <div key={i}>
            <div className="px-6 py-5">
              <p className="typo-t1-medium text-neutral-900">{menu.name}</p>
              <p className="typo-t2 text-neutral-900 mt-1">
                가격: {menu.price.toLocaleString()}원
              </p>
              <p className="typo-t2 text-neutral-900 mt-1">
                {(menu.price * menu.count).toLocaleString()}원{" "}
                <span className="text-neutral-400">{menu.count}개</span>
              </p>
            </div>
            {i < order.menus.length - 1 && (
              <div className="border-t border-neutral-300" />
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function OrderCard({
  order,
  onDetailClick,
}: {
  order: Order;
  onDetailClick: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleMenus = expanded ? order.menus : order.menus.slice(0, 2);

  return (
    <div className="bg-white rounded-xl border border-neutral-300 flex gap-3 p-3">
      <div className="w-30 h-30 shrink-0">
        <img
          src={FOOD_IMG}
          alt={order.storeName}
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="typo-body-lg font-bold text-neutral-900">
            {order.storeName}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={onDetailClick}
            className="shrink-0 typo-caption px-3 h-auto py-1 rounded-lg"
          >
            주문 상세
          </Button>
        </div>

        <p className="typo-micro text-neutral-400">{order.date}</p>

        <div className="flex flex-col gap-0.5">
          {visibleMenus.map((m, i) => (
            <p key={i} className="typo-caption text-neutral-900">
              {m.name} <span className="text-neutral-400">{m.count}개</span>
            </p>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded((v) => !v)}
          className="w-full bg-orange-100 text-primary typo-caption h-auto py-1.5 rounded-[10px] hover:bg-orange-300"
        >
          {expanded ? "접기 ^" : "모든 메뉴 보기 V"}
        </Button>

        <div className="flex justify-between items-center pt-1.5 border-t border-neutral-300">
          <span className="typo-body-md text-neutral-900">결제금액</span>
          <span className="typo-body-md font-semibold text-neutral-900">
            {order.totalPrice.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}

export default function OrderTab() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("방문일자");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const totalPages = Math.ceil(MOCK_ORDERS.length / ITEMS_PER_PAGE);
  const paged = MOCK_ORDERS.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  if (selectedOrderId !== null) {
    return (
      <OrderDetailView
        order={MOCK_ORDERS.find((o) => o.id === selectedOrderId)!}
        onBack={() => setSelectedOrderId(null)}
      />
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="typo-h2 text-neutral-900">주문 내역</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSort((s) => (s === "방문일자" ? "최신순" : "방문일자"))}
          className="text-primary border-primary hover:bg-orange-100 text-[18px] h-auto py-2"
        >
          {sort} ∨
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {paged.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            onDetailClick={() => setSelectedOrderId(o.id)}
          />
        ))}
      </div>
      <Pagination current={page} total={totalPages} onChange={setPage} />
    </>
  );
}
