import { useState, type ReactElement } from "react";
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

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ReceiptIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="2" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );
}

function PersonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

const TAB_ICONS: Record<Tab, (props: { className?: string }) => ReactElement> = {
  "좋아요 내역": HeartIcon,
  "예약 내역": CalendarIcon,
  "주문 내역": ReceiptIcon,
};

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
        <aside className="w-52 bg-white border-r border-neutral-300 py-8 px-4 shrink-0">
          <nav className="flex flex-col gap-1">
            {TABS.map((tab) => {
              const Icon = TAB_ICONS[tab];
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex items-center gap-2.5 text-left typo-body-md py-2.5 px-3 rounded-xl transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary text-white font-medium"
                      : "text-neutral-600 hover:bg-neutral-100",
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {tab}
                </button>
              );
            })}
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
                  <PersonIcon className="w-10 h-10 text-neutral-400" />
                </div>
                <div className="flex-1">
                  <p className="typo-t2-medium leading-9 text-neutral-900">
                    {data?.name} 님, 안녕하세요
                  </p>
                  <p className="typo-body-sm text-neutral-400">{data?.email}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditingProfile(true)}
                  size="sm"
                  className="flex items-center gap-1.5 text-primary border-primary hover:bg-orange-50"
                >
                  <EditIcon className="w-4 h-4" />
                  정보 수정하기
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
