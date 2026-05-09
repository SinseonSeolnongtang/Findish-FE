import { cn } from "@/lib/utils";
import CheckFilled from "@/assets/icons/common/check_filled.svg?react";

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
}

export default function Checkbox({
  checked,
  onChange,
  className,
}: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn("shrink-0 transition-opacity", !checked && "opacity-40", className)}
    >
      <CheckFilled />
    </button>
  );
}
