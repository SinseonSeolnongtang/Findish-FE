import { cn } from "@/lib/utils";

interface KeywordProps {
  label: string;
  /** true = orange bg + white text (Keyword_colored), false = cream bg + orange text (Keyword) */
  colored?: boolean;
  className?: string;
}

export default function Keyword({
  label,
  colored = false,
  className,
}: KeywordProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-2.5 h-6 px-2 py-1 rounded-xl typo-caption-medium whitespace-nowrap",
        colored ? "bg-primary text-white" : "bg-orange-200 text-orange-600",
        className,
      )}
    >
      {label}
    </span>
  );
}
