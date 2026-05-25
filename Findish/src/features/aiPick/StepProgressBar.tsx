import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Props {
  currentStep: number;
  totalSteps: number;
  direction?: "forward" | "backward";
}

export default function StepProgressBar({
  currentStep,
  totalSteps,
  direction = "forward",
}: Props) {
  const initialStep =
    direction === "backward" ? currentStep + 1 : currentStep - 1;
  const [animatedStep, setAnimatedStep] = useState(initialStep);

  useEffect(() => {
    const id = setTimeout(() => setAnimatedStep(currentStep), 50);
    return () => clearTimeout(id);
  }, [currentStep]);

  return (
    <div className="flex gap-2 w-full px-14 pt-12">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className="flex-1 h-1 rounded-full bg-orange-200 overflow-hidden">
          <div
            className={cn(
              "h-full bg-primary rounded-full transition-all duration-500 ease-out",
              i < animatedStep ? "w-full" : "w-0",
            )}
          />
        </div>
      ))}
    </div>
  );
}
