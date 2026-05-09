import { cn } from "@/lib/utils";
import StarOutline from "@/assets/icons/common/star.svg?react";
import StarFilled from "@/assets/icons/common/star_filled.svg?react";

interface RatingProps {
  value: number;
  colored?: boolean;
  className?: string;
}

export default function Rating({
  value,
  colored = false,
  className,
}: RatingProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-12 h-5.25 gap-1.25 px-2.5 py-0.75 rounded-[20px] text-[12px] leading-none whitespace-nowrap",
        colored
          ? "bg-primary text-white"
          : "bg-white border border-neutral-100 text-black",
        className,
      )}
    >
      <span className="relative shrink-0 w-2.5 h-[9.536px]">
        <span className="absolute inset-[-5.24%_-5%]">
          {colored ? (
            <StarOutline className="block size-full max-w-none" />
          ) : (
            <StarFilled className="block size-full max-w-none" />
          )}
        </span>
      </span>
      <span>{value.toFixed(1)}</span>
    </span>
  );
}
