import { useState } from "react";
import SearchIcon from "@/assets/icons/common/search.svg?react";
import { cn } from "@/lib/utils";

type Mode = "normal" | "pick";

interface SearchBarProps {
  mode: Mode;
  onModeChange?: (mode: Mode) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
}

import Button from "./Button";

export default function SearchBar({
  mode,
  onModeChange,
  onSearch,
  placeholder,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const defaultPlaceholder = "검색어를 입력해주세요 (가게명, 음식명 등)";

  return (
    <div className="flex flex-row items-center w-167.5 h-12.5 bg-white rounded-[30px] shadow-sm px-2 pl-4 gap-3">
      <SearchIcon className="w-5 h-5 text-neutral-400 shrink-0" />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch?.(query)}
        placeholder={placeholder ?? defaultPlaceholder}
        className="flex-1 text-[14px] font-normal text-neutral-800 placeholder:text-neutral-400 outline-none bg-transparent"
      />

      <div
        onClick={() => onModeChange?.(mode === "normal" ? "pick" : "normal")}
        className={cn(
          "relative flex items-center rounded-full w-21.5 h-8 shrink-0 cursor-pointer",
          mode === "normal" ? "bg-neutral-300" : "bg-primary",
        )}
      >
        {/* 슬라이딩 thumb */}
        <div
          className={cn(
            "absolute left-0.5 top-0.5 w-10 h-7 bg-white rounded-full shadow-sm",
            mode === "pick" ? "translate-x-11" : "translate-x-0",
          )}
        />
        {/* 레이블 */}
        <span
          className={cn(
            "relative z-10 flex-1 text-center text-[12px] font-medium select-none",
            mode === "normal" ? "text-neutral-800" : "text-transparent",
          )}
        >
          일반
        </span>
        <span
          className={cn(
            "relative z-10 flex-1 text-center text-[12px] font-medium select-none",
            mode === "pick" ? "text-neutral-800" : "text-transparent",
          )}
        >
          선택
        </span>
      </div>

      <Button
        size="sm"
        shape="pill"
        className="w-17.75 h-9.25 text-[14px] shrink-0"
        onClick={() => onSearch?.(query)}
      >
        검색
      </Button>
    </div>
  );
}
