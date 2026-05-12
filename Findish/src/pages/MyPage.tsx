import { useState } from "react";
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

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("좋아요 내역");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const { data, isLoading, isError } = useGetMeQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <p className="typo-body-lg text-neutral-400">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <p className="typo-body-lg text-red-400">정보를 불러오지 못했습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />

      <div className="pt-17 flex min-h-screen">
        <aside className="w-44 bg-white border-r border-[#E5E7EB] py-8 px-4 shrink-0">
          <nav className="flex flex-col gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "text-left text-[16px] py-2 px-2 rounded-lg transition-colors cursor-pointer",
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
            <EditProfileTab user={data} onBack={() => setIsEditingProfile(false)} />
          ) : (
            <>
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-center gap-5 mb-8">
                <div className="w-21.25 h-21.25 bg-[#F3F1EF] rounded-full flex items-center justify-center shrink-0">
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#99A1AF"
                    strokeWidth="1.5"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="typo-t1-medium leading-9 text-neutral-900">
                    {data?.name} 님, 안녕하세요
                  </p>
                  <p className="typo-body-sm text-neutral-400">{data?.email}</p>
                </div>
                <Button onClick={() => setIsEditingProfile(true)}>개인정보 수정</Button>
              </div>

              {activeTab === "좋아요 내역" && <LikedTab />}
              {activeTab === "예약 내역" && <ReservationTab />}
              {activeTab === "주문 내역" && <OrderTab />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
