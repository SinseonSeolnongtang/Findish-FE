import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  rightElement?: React.ReactNode;
}

export default function Input({
  label,
  required,
  rightElement,
  className,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="typo-body-md font-medium text-neutral-800 flex gap-0.5">
          {required && <span className="text-primary">*</span>}
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        <input
          className={cn(
            "w-full h-14 px-4 rounded-[10px] border border-neutral-400 bg-white",
            "typo-body-lg text-neutral-800 placeholder:text-neutral-400",
            "outline-none focus:border-primary transition-colors",
            rightElement && "pr-32",
            className,
          )}
          {...props}
        />
        {rightElement && <div className="absolute right-2">{rightElement}</div>}
      </div>
    </div>
  );
}
