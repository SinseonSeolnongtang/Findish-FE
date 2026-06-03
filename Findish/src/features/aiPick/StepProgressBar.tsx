import { useState, useEffect } from "react";
import React from "react";
import { cn } from "@/lib/utils";

const STEP_LABELS = ["상황", "친구", "1인당 예산", "추가 조건"];

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
    <div className="flex items-start w-full px-10 pt-8 pb-2">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === animatedStep;
        const isFilled = stepNum <= animatedStep;

        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-2 w-9">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-500",
                  isFilled
                    ? "bg-primary text-white"
                    : "bg-orange-100 text-orange-300",
                )}
              >
                {stepNum}
              </div>
              <span
                className={cn(
                  "text-xs whitespace-nowrap transition-all duration-500",
                  isActive
                    ? "font-bold text-neutral-700"
                    : "font-normal text-neutral-400",
                )}
              >
                {STEP_LABELS[i]}
              </span>
            </div>

            {i < totalSteps - 1 && (
              <div className="flex-1 h-0.5 mt-4.25 flex">
                <div
                  className={cn(
                    "flex-1 h-full transition-colors duration-500",
                    stepNum <= animatedStep ? "bg-primary" : "bg-orange-100",
                  )}
                />
                <div
                  className={cn(
                    "flex-1 h-full transition-colors duration-500",
                    stepNum + 1 <= animatedStep
                      ? "bg-primary"
                      : "bg-orange-100",
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
