import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/common/Pagination";
import Button from "@/components/common/Button";
import { getMyOrders } from "@/api/myPage";
import type { OrderItem } from "@/types/myPage";

const ITEMS_PER_PAGE = 10;

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  CONFIRMED: { label: "주문 완료", className: "bg-orange-100 text-primary" },
  COMPLETED: { label: "주문 완료", className: "bg-orange-100 text-primary" },
  PENDING: { label: "처리중", className: "bg-blue-100 text-blue-600" },
  CANCELLED: { label: "취소됨", className: "bg-gray-100 text-gray-500" },
};

function formatDate(isoString: string) {
  const d = new Date(isoString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}


function OrderCard({ order }: { order: OrderItem }) {
  const [expanded, setExpanded] = useState(false);
  const items = order.items ?? [];
  const PREVIEW_COUNT = 2;
  const visibleItems = expanded ? items : items.slice(0, PREVIEW_COUNT);
  const hiddenCount = items.length - PREVIEW_COUNT;
  const badge = STATUS_BADGE[order.status ?? ""] ?? {
    label: order.status ?? "",
    className: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-300 flex gap-4 p-4 overflow-hidden">
      {order.thumbnailUrl ? (
        <img
          src={order.thumbnailUrl}
          alt={order.storeName ?? ""}
          className="w-24 h-28 rounded-xl object-cover shrink-0"
        />
      ) : (
        <div className="w-24 h-28 rounded-xl bg-neutral-100 shrink-0" />
      )}

      <div className="flex-1 flex flex-col gap-2.5 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`typo-micro px-1.5 py-0.5 rounded-sm font-medium ${badge.className}`}
          >
            {badge.label}
          </span>
          <p className="typo-micro text-neutral-400">
            {order.orderedAt ? formatDate(order.orderedAt) : ""}
          </p>
        </div>

        <p className="typo-body-lg font-bold text-neutral-900 truncate">
          {order.storeName ?? order.naverPlaceId ?? ""}
        </p>

        <div className="flex flex-col gap-0.5">
          {visibleItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-neutral-400 typo-caption">•</span>
              <p className="typo-caption text-neutral-900 flex-1 min-w-0 truncate">
                {item.menuName}
              </p>
              <p className="typo-caption text-neutral-400 w-6 text-center shrink-0">
                {item.quantity}
              </p>
              <p className="typo-caption text-neutral-900 w-20 text-right shrink-0">
                {((item.price ?? 0) * (item.quantity ?? 0)).toLocaleString()}원
              </p>
            </div>
          ))}
          {!expanded && hiddenCount > 0 && (
            <p className="typo-caption text-neutral-400 mt-0.5">
              ... 외 {hiddenCount}개
            </p>
          )}
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full bg-orange-50 text-primary typo-caption py-1.5 rounded-[10px] hover:bg-orange-100 transition-colors cursor-pointer font-medium"
        >
          {expanded ? "접기 ∧" : "모든 메뉴 보기 ∨"}
        </button>

        <div className="flex justify-between items-center pt-1.5 border-t border-neutral-300">
          <span className="typo-body-md text-neutral-900">결제금액</span>
          <span className="typo-body-md font-semibold text-neutral-900">
            {(order.totalPrice ?? 0).toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}

export default function OrderTab() {
  const [page, setPage] = useState(1);

  const { data } = useQuery({
    queryKey: ["my-orders", page, ITEMS_PER_PAGE],
    queryFn: ({ signal }) =>
      getMyOrders({ page: page - 1, size: ITEMS_PER_PAGE }, signal),
  });

  const orders = data?.data?.content ?? [];
  const totalPages = data?.data?.totalElements
    ? Math.ceil(data.data.totalElements / ITEMS_PER_PAGE)
    : 1;

  return (
    <>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-5 py-16">
          <p className="typo-h1-medium text-neutral-900 text-center leading-tight">
            내역이 존재하지 않습니다.
          </p>
          <Button>맛집 찾으러 가기</Button>
        </div>
      ) : (
        <>
          <div className="mb-5">
            <h2 className="typo-t2-medium text-neutral-900 font-bold">주문 내역</h2>
            <p className="typo-body-sm text-neutral-400 mt-1">
              최근 주문한 내역을 확인해 보세요.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
              />
            ))}
          </div>
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
}
