import { useState } from "react";
import HamburgerIcon from "@/assets/icons/AIPick/hamburger.svg?react";
import UserIcon from "@/assets/icons/AIPick/user.svg?react";
import SettingsIcon from "@/assets/icons/common/settings.svg?react";
import SearchField from "@/components/common/SearchField";

const CHAT_HISTORY = [
  "다원님과 함께하는 식사",
  "다원, 석우님과 함께하는 식사",
  "한성대 근처에서 동아리 단체 회식",
];

interface AISidebarProps {
  open: boolean;
  onToggle: () => void;
  onFriendClick?: () => void;
}

export default function AISidebar({
  open,
  onToggle,
  onFriendClick,
}: AISidebarProps) {
  const [hovered, setHovered] = useState(false);
  const effectiveOpen = open || hovered;

  return (
    <aside
      className={`${effectiveOpen ? "w-62" : "w-16.5"} bg-white-50 border-r-[1.5px] border-neutral-100 flex flex-col shrink-0 transition-all duration-200 overflow-hidden`}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 상단: 햄버거 + 유저 */}
      <div className="flex flex-col gap-5 pl-5 pt-6">
        <button
          onClick={onToggle}
          onMouseEnter={() => setHovered(true)}
          className="text-neutral-800 hover:text-primary transition-colors self-start cursor-pointer"
        >
          <HamburgerIcon width="26" height="26" />
        </button>

        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={onFriendClick}
        >
          <UserIcon width="24" height="24" className="shrink-0" />
          {effectiveOpen && (
            <span className="typo-body-sm text-neutral-900 whitespace-nowrap">
              친구
            </span>
          )}
        </div>
      </div>

      {/* 중단: 채팅 내역  */}
      {effectiveOpen && (
        <div className="flex flex-col gap-3 px-5 mt-8 flex-1 overflow-y-auto">
          <p className="typo-body-md font-bold text-neutral-900">채팅 내역</p>

          {/* 검색바 */}
          <SearchField
            placeholder="채팅 검색"
            iconSize={16}
            className="px-3 py-1.5 rounded-full"
          />

          {/* 채팅 목록 */}
          <ul className="flex flex-col gap-2.5 mt-1">
            {CHAT_HISTORY.map((item) => (
              <li
                key={item}
                className="typo-caption text-neutral-900 cursor-pointer hover:text-primary transition-colors truncate"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 하단: 설정 */}
      <div className="pl-5 pb-6 mt-auto">
        <div className="flex items-center gap-3">
          <SettingsIcon width="24" height="24" className="shrink-0" />
          {effectiveOpen && (
            <span className="typo-body-sm text-neutral-900 whitespace-nowrap">
              설정
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
