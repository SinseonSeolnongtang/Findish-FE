import { cn } from "@/lib/utils";

type ToggleTagSize = "sm" | "md" | "lg";

const SIZE_CLASS: Record<ToggleTagSize, string> = {
  sm: "min-w-20 h-9  px-2 py-1.5 typo-body-md",
  md: "min-w-30 h-12 px-4 py-2.5   typo-t2",
  lg: "min-w-40 h-13 px-7 py-2.5 typo-toggle",
};

interface ToggleTagProps {
  label: string;
  active: boolean;
  onClick: () => void;
  size?: ToggleTagSize;
  order?: number;
  className?: string;
}

export default function ToggleTag({
  label,
  active,
  onClick,
  size = "lg",
  order,
  className,
}: ToggleTagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-6 transition-colors whitespace-nowrap cursor-pointer hover:bg-orange-300",
        SIZE_CLASS[size],
        active ? "bg-primary text-white" : "bg-orange-100 text-primary-dark",
        className,
      )}
    >
      {active && order !== undefined && (
        <span className="w-5 h-5 bg-white text-primary rounded-full typo-caption font-bold flex items-center justify-center shrink-0">
          {order}
        </span>
      )}
      {label}
    </button>
  );
}
