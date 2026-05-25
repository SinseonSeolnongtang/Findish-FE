import { useState } from "react";
import Pagination from "@/components/common/Pagination";
import Button from "@/components/common/Button";
import { useMyOrdersQuery } from "@/hooks/useMyPage";
import type { OrderItem, OrderType } from "@/types/myPage";

const ITEMS_PER_PAGE = 10;

const ORDER_TYPE_BADGE: Record<
  OrderType,
  { label: string; className: string }
> = {
  CART: { label: "장바구니", className: "bg-orange-100 text-primary" },
  AGENT: { label: "AI 에이전트", className: "bg-blue-100 text-blue-600" },
};

function formatDate(isoString: string) {
  const d = new Date(isoString);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

function OrderDetailView({
  order,
  onBack,
}: {
  order: OrderItem;
  onBack: () => void;
}) {
  return (
    <>
      <div className="mb-5">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-auto p-1 mb-5 text-neutral-500 hover:text-neutral-900"
        >
          ← 뒤로
        </Button>
        <h2 className="typo-body-lg text-neutral-900 mt-1">주문 상세</h2>
      </div>

      <div className="border border-primary rounded-[10px] overflow-hidden">
        {order.items.map((item, i) => (
          <div key={i}>
            <div className="flex items-center px-5 py-4 gap-3">
              <p className="typo-body-md text-neutral-900 flex-1">
                {item.name}
              </p>
              <p className="typo-body-md text-neutral-400 w-8 text-center shrink-0">
                {item.quantity}
              </p>
              <p className="typo-body-md text-neutral-900 w-20 text-right shrink-0">
                {(item.price * item.quantity).toLocaleString()}원
              </p>
            </div>
            {i < order.items.length - 1 && (
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
  order: OrderItem;
  onDetailClick: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? order.items : order.items.slice(0, 2);
  const badge = ORDER_TYPE_BADGE[order.orderType];

  return (
    <div className="bg-white rounded-xl border border-neutral-300 flex gap-3 px-3 py-4">
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`typo-micro px-1.5 py-0.5 rounded-full font-medium ${badge.className}`}
          >
            {badge.label}
          </span>
          <p className="typo-micro text-neutral-400">
            {formatDate(order.orderedAt)}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={onDetailClick}
            className="ml-auto shrink-0 typo-caption px-3 h-auto py-1 rounded-lg"
          >
            주문 상세
          </Button>
        </div>
        <div className="flex items-start justify-between gap-2">
          <p className="typo-body-lg font-bold text-neutral-900">
            {order.restaurantName}
          </p>
        </div>

        <div className="flex flex-col gap-0.5">
          {visibleItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <p className="typo-caption text-neutral-900 flex-1 min-w-0 truncate">
                {item.name}
              </p>
              <p className="typo-caption text-neutral-400 w-6 text-center shrink-0">
                {item.quantity}
              </p>
              <p className="typo-caption text-neutral-900 w-20 text-right shrink-0">
                {(item.price * item.quantity).toLocaleString()}원
              </p>
            </div>
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
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const { data } = useMyOrdersQuery(page, ITEMS_PER_PAGE);

  const totalPages = data ? Math.ceil(data.totalCount / ITEMS_PER_PAGE) : 1;

  if (selectedOrderId !== null && data) {
    const selected = data.orders.find((o) => o.orderId === selectedOrderId);
    if (selected) {
      return (
        <OrderDetailView
          order={selected}
          onBack={() => setSelectedOrderId(null)}
        />
      );
    }
  }

  return (
    <>
      {!data || data.totalCount === 0 ? (
        <div className="flex flex-col items-center gap-5 py-16">
          <p className="typo-h1-medium text-neutral-900 text-center leading-tight">
            내역이 존재하지 않습니다.
          </p>
          <Button>맛집 찾으러 가기</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {data.orders.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                onDetailClick={() => setSelectedOrderId(order.orderId)}
              />
            ))}
          </div>
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
}
