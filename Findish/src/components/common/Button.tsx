import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg" | "xl";
type Shape = "default" | "pill";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  shape?: Shape;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-primary text-white-50 hover:bg-[#e55e00] active:bg-[#cc5400]",
  secondary:
    "bg-white text-neutral-600 shadow-[0px_2px_5px_rgba(0,0,0,0.15)] hover:bg-gray-50",
  outline:
    "bg-white text-neutral-600 border border-neutral-400 hover:bg-gray-50",
  ghost: "bg-transparent text-neutral-600 hover:bg-gray-100",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-[18px] text-[16px] h-[40px]",
  md: "px-[18px] text-[18px] h-[50px]",
  lg: "px-[18px] text-[22px] h-[65px]",
  xl: "px-[18px] text-[28px] h-[75px]",
};

const shapeStyles: Record<Size, Record<Shape, string>> = {
  sm: { default: "rounded-[12px]", pill: "rounded-[40px] px-[11px]" },
  md: { default: "rounded-[14px]", pill: "rounded-[40px] px-[11px]" },
  lg: { default: "rounded-[16px]", pill: "rounded-[40px] px-[11px]" },
  xl: { default: "rounded-[16px]", pill: "rounded-[40px] px-[11px]" },
};

export default function Button({
  variant = "primary",
  size = "md",
  shape = "default",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "flex flex-row items-center justify-center font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed gap-2.5",
        variantStyles[variant],
        sizeStyles[size],
        shapeStyles[size][shape],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
