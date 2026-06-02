import { useState } from 'react';
import HamburgerIcon from '@/assets/icons/AIPick/hamburger.svg?react';
import UserIcon from '@/assets/icons/AIPick/user.svg?react';
import NewChatIcon from '@/assets/icons/AIPick/new_chat.svg?react';
import SettingsIcon from '@/assets/icons/common/settings.svg?react';
import SearchField from '@/components/common/SearchField';
import { usePresetHistoryQuery } from '@/hooks/useAiPick';

interface AISidebarProps {
  open: boolean;
  onToggle: () => void;
  onFriendClick?: () => void;
  onNewChat?: () => void;
  onPresetSelect?: (presetId: string) => void;
  onPresetDelete?: (presetId: string) => void;
}

export default function AISidebar({ open, onToggle, onFriendClick, onNewChat, onPresetSelect, onPresetDelete }: AISidebarProps) {
  const [hovered, setHovered] = useState(false);
  const [search, setSearch] = useState('');
  const effectiveOpen = open || hovered;

  const { data } = usePresetHistoryQuery();
  const presets = data ?? [];
  const filtered = search
    ? presets.filter((p) => p.title?.includes(search))
    : presets;

  return (
    <aside
      className={`${effectiveOpen ? 'w-62' : 'w-16.5'} bg-white-50 border-r-[1.5px] border-neutral-100 flex flex-col shrink-0 transition-all duration-200 overflow-hidden`}
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
            <span className="typo-body-sm text-neutral-900 whitespace-nowrap">친구</span>
          )}
        </div>

        <div
          className="flex items-center gap-3 cursor-pointer text-neutral-800 hover:text-primary transition-colors"
          onClick={onNewChat}
        >
          <NewChatIcon width="24" height="24" className="shrink-0" />
          {effectiveOpen && (
            <span className="typo-body-sm whitespace-nowrap">새로운 채팅</span>
          )}
        </div>
      </div>

      {/* 중단: 채팅 내역 */}
      {effectiveOpen && (
        <div className="flex flex-col gap-3 px-5 mt-8 flex-1 overflow-y-auto">
          <p className="typo-body-md font-bold text-neutral-900">채팅 내역</p>

          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="채팅 검색"
            iconSize={16}
            className="px-3 py-1.5 rounded-full"
          />

          <ul className="flex flex-col gap-2.5 mt-1">
            {filtered.map((preset) => (
              <li
                key={preset.presetId}
                className="flex items-center justify-between group/item"
              >
                <span
                  onClick={() => preset.presetId && onPresetSelect?.(preset.presetId)}
                  className="typo-caption text-neutral-900 cursor-pointer hover:text-primary transition-colors truncate flex-1 min-w-0"
                >
                  {preset.title}
                </span>
                {preset.presetId && onPresetDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPresetDelete(preset.presetId!);
                    }}
                    className="typo-caption text-neutral-400 hover:text-red-400 transition-colors ml-2 shrink-0 opacity-0 group-hover/item:opacity-100"
                  >
                    삭제
                  </button>
                )}
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="typo-caption text-neutral-400">채팅 내역이 없습니다.</li>
            )}
          </ul>
        </div>
      )}

      {/* 하단: 설정 */}
      <div className="pl-5 pb-6 mt-auto">
        <div className="flex items-center gap-3">
          <SettingsIcon width="24" height="24" className="shrink-0" />
          {effectiveOpen && (
            <span className="typo-body-sm text-neutral-900 whitespace-nowrap">설정</span>
          )}
        </div>
      </div>
    </aside>
  );
}
