import { useState } from "react";
import { cn } from "@/lib/utils";
import Keyword from "@/components/common/Keyword";
import Skeleton from "@/components/common/Skeleton";
import type { Restaurant } from "./types";

interface Props {
  restaurant: Restaurant;
}

export default function HomeSection({ restaurant }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-3 pt-3 shrink-0 flex justify-center">
        <div className="relative w-90 h-80 overflow-hidden rounded-[10px]">
          {!imgLoaded && <Skeleton className="absolute inset-0 rounded-none" />}
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className={cn("w-full h-full object-cover", !imgLoaded && "invisible")}
            onLoad={() => setImgLoaded(true)}
          />
          {imgLoaded && (
            <div className="absolute inset-0 shadow-[inset_0px_-100px_12px_0px_rgba(0,0,0,0.4)]" />
          )}
          <div className="absolute bottom-4 left-4 right-4">
            <span
              className={cn(
                "typo-body-sm leading-tight",
                imgLoaded ? "text-white" : "text-neutral-500",
              )}
            >
              {restaurant.category}
            </span>
            <h2
              className={cn(
                "typo-h1 font-bold leading-tight",
                imgLoaded ? "text-white" : "text-neutral-900",
              )}
            >
              {restaurant.name}
            </h2>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        <div className="flex flex-wrap gap-1.5">
          {restaurant.keywords.map((k) => (
            <Keyword key={k} label={k} colored />
          ))}
        </div>
        {restaurant.vibeSummary && (
          <div>
            <p className="typo-body-md font-bold text-neutral-900 mb-1.5">
              AI 한줄요약
            </p>
            <p className="typo-body-sm text-neutral-600">
              {restaurant.vibeSummary}
            </p>
          </div>
        )}
        <div>
          <p className="typo-body-md font-bold text-neutral-900 mb-1.5">위치</p>
          <p className="typo-body-sm text-neutral-600">
            현재 위치에서{" "}
            <span className="font-bold text-primary-dark">
              {restaurant.distance}
            </span>{" "}
            떨어져 있어요.
          </p>
          <p className="typo-body-sm text-neutral-500 mt-0.5">
            {restaurant.station}
          </p>
        </div>
      </div>
    </div>
  );
}
