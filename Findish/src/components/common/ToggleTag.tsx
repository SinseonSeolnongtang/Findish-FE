import { cn } from "@/lib/utils";

interface ToggleTagProps {
  label: string;
  active: boolean;
  onClick: () => void;
  order?: number;
  className?: string;
}

export default function ToggleTag({
  label,
  active,
  onClick,
  order,
  className,
}: ToggleTagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 min-w-46.25 h-13.75 px-7 py-2.5 rounded-6 typo-toggle transition-colors whitespace-nowrap",
        active
          ? "bg-primary text-white font-normal"
          : "bg-[#fff7ed] text-[#f54900] font-normal",
        className,
      )}
    >
      {active && order !== undefined && (
        <span className="w-5 h-5 bg-white text-primary rounded-full text-[12px] font-bold flex items-center justify-center shrink-0">
          {order}
        </span>
      )}
      {label}
    </button>
  );
}
