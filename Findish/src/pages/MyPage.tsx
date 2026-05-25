import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import { cn } from "@/lib/utils";
import LikedTab from "@/features/myPage/LikedTab";
import ReservationTab from "@/features/myPage/ReservationTab";
import OrderTab from "@/features/myPage/OrderTab";
import EditProfileTab from "@/features/myPage/EditProfileTab";
import { useGetMeQuery } from "@/hooks/useAuth";

type Tab = "좋아요 내역" | "예약 내역" | "주문 내역";
const TABS: Tab[] = ["좋아요 내역", "예약 내역", "주문 내역"];

const TAB_PARAM_MAP: Record<string, Tab> = {
  reservation: "예약 내역",
  order: "주문 내역",
  liked: "좋아요 내역",
};

type ReservationFilter = "방문예정" | "방문완료" | "취소/노쇼";
const SUB_TAB_PARAM_MAP: Record<string, ReservationFilter> = {
  cancelled: "취소/노쇼",
  completed: "방문완료",
  upcoming: "방문예정",
};

export default function MyPage() {
  const [searchParams] = useSearchParams();
  const initialTab =
    TAB_PARAM_MAP[searchParams.get("tab") ?? ""] ?? "좋아요 내역";
  const initialReservationFilter =
    SUB_TAB_PARAM_MAP[searchParams.get("subTab") ?? ""] ?? "방문예정";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const { data, isLoading, isError } = useGetMeQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-100">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <p className="typo-body-lg text-neutral-400">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-neutral-100">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <p className="typo-body-lg text-error">정보를 불러오지 못했습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />

      <div className="pt-17 flex min-h-screen">
        <aside className="w-44 bg-white border-r border-neutral-300 py-8 px-4 shrink-0">
          <nav className="flex flex-col gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "text-left typo-body-md py-2 px-2 rounded-lg transition-colors cursor-pointer",
                  activeTab === tab
                    ? "text-primary font-medium"
                    : "text-neutral-900 hover:text-neutral-500",
                )}
              >
                {tab}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 px-8 py-8">
          {isEditingProfile && data ? (
            <EditProfileTab
              user={data}
              onBack={() => setIsEditingProfile(false)}
            />
          ) : (
            <>
              <div className="bg-white border border-neutral-300 rounded-6 p-5 flex items-center gap-5 mb-8">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center shrink-0">
                  사람아이콘
                </div>
                <div className="flex-1">
                  <p className="typo-t2-medium leading-9 text-neutral-900">
                    {data?.name} 님, 안녕하세요
                  </p>
                  <p className="typo-body-sm text-neutral-400">{data?.email}</p>
                </div>
                <Button onClick={() => setIsEditingProfile(true)} size="sm">
                  수정하기
                </Button>
              </div>

              {activeTab === "좋아요 내역" && <LikedTab />}
              {activeTab === "예약 내역" && (
                <ReservationTab initialFilter={initialReservationFilter} />
              )}
              {activeTab === "주문 내역" && <OrderTab />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
