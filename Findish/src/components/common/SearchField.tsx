import { cn } from "@/lib/utils";
import SearchIcon from "@/assets/icons/common/search.svg?react";

interface SearchFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  showButton?: boolean;
  iconSize?: number;
  className?: string;
}

export default function SearchField({
  value,
  onChange,
  onSearch,
  placeholder = "검색어를 입력하세요.",
  showButton = false,
  iconSize = 20,
  className,
}: SearchFieldProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border border-primary bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.15)]",
        className,
      )}
    >
      <SearchIcon
        width={iconSize}
        height={iconSize}
        className="shrink-0 text-neutral-400"
      />

      {onChange !== undefined ? (
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
          placeholder={placeholder}
          className="flex-1 typo-body-sm text-black placeholder-neutral-400 bg-transparent outline-none"
        />
      ) : (
        <span className="flex-1 typo-body-sm text-neutral-400">{placeholder}</span>
      )}

      {showButton && (
        <button
          onClick={onSearch}
          className="bg-primary text-white typo-body-sm px-3 py-1.5 rounded-[40px] shrink-0"
        >
          검색
        </button>
      )}
    </div>
  );
}
