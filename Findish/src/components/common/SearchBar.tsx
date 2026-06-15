import { useState } from "react";
import SearchIcon from "@/assets/icons/common/search.svg?react";
import { cn } from "@/lib/utils";
import Button from "./Button";

type Mode = "normal" | "pick";

interface SearchBarProps {
  mode: Mode;
  onModeChange?: (mode: Mode) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
}

const NORMAL_EXAMPLES = ["삼겹살", "파스타", "삼삼뼈국", "쿄코코"];

const PICK_EXAMPLES = [
  "혜화에 가성비 좋은 양식집 찾아줘",
  "조용하고 분위기 좋은 일식집 추천해줘",
];

export default function SearchBar({
  mode,
  onModeChange,
  onSearch,
  placeholder,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const defaultPlaceholder =
    mode === "pick"
      ? "혜화에 가성비 좋은 일식집 찾아줘."
      : "검색어를 입력해주세요 (가게명, 음식명 등)";

  const handleExampleClick = (example: string) => {
    setQuery(example);
    onSearch?.(example);
  };

  return (
    <div className="flex flex-col items-center gap-2">
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
          "relative flex items-center rounded-full w-21.5 h-8 shrink-0 cursor-pointer transition-colors duration-300",
          mode === "normal" ? "bg-neutral-300" : "bg-primary",
        )}
      >
        {/* 슬라이딩 thumb */}
        <div
          className="absolute left-0.5 top-0.5 w-10 h-7 bg-white rounded-full shadow-sm"
          style={{
            transform: mode === "pick" ? "translateX(2.75rem)" : "translateX(0)",
            transition: "transform 300ms ease-in-out",
          }}
        />
        {/* 레이블 */}
        <span
          className={cn(
            "relative z-10 flex-1 text-center text-[12px] font-medium select-none transition-colors duration-300",
            mode === "normal" ? "text-neutral-800" : "text-transparent",
          )}
        >
          일반
        </span>
        <span
          className={cn(
            "relative z-10 flex-1 text-center text-[12px] font-medium select-none transition-colors duration-300",
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

    {(mode === "normal" || mode === "pick") && (
      <div className="flex gap-2">
        {(mode === "normal" ? NORMAL_EXAMPLES : PICK_EXAMPLES).map((example) => (
          <button
            key={example}
            onClick={() => handleExampleClick(example)}
            className="px-3.5 py-1.5 rounded-full bg-[#fff3e8] border border-[#ffd9b3] text-[12px] text-neutral-600 hover:bg-[#ffe8cc] transition-colors duration-200 cursor-pointer"
          >
            {example}
          </button>
        ))}
      </div>
    )}
    </div>
  );
}
