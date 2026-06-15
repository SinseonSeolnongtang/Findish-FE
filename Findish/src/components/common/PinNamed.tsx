import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Skeleton from "./Skeleton";

interface PinNamedProps {
  name: string;
  imageUrl?: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function PinNamed({
  name,
  imageUrl,
  isSelected = false,
  onClick,
  className,
  style,
}: PinNamedProps) {
  const nameBg = isSelected ? "#FF6900" : "white";
  const textColor = isSelected ? "white" : "#1a1a1a";
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute cursor-pointer transition-transform hover:-translate-y-1",
        isSelected && "-translate-y-2",
        className,
      )}
      style={{
        transform: "translate(-50%, -100%)",
        ...style,
      }}
    >
      {/* drop-shadow가 카드+삼각형 전체 외형에 적용되도록 래퍼에 filter 설정 */}
      <div
        className="flex flex-col items-center"
        style={{ filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.28))" }}
      >
        {/* 카드: 상단 이미지 + 하단 식당명 */}
        <div
          className="rounded-[10px] overflow-hidden"
          style={{ width: 96, background: nameBg }}
        >
          {/* 상단: 식당 대표 이미지 썸네일 */}
          <div className="relative w-full overflow-hidden bg-neutral-200" style={{ height: 82 }}>
            {imageUrl ? (
              <>
                {!imgLoaded && <Skeleton className="absolute inset-0 rounded-none" />}
                <img
                  src={imageUrl}
                  alt={name}
                  className={cn("w-full h-full object-cover", !imgLoaded && "invisible")}
                  onLoad={() => setImgLoaded(true)}
                />
              </>
            ) : (
              <div className="w-full h-full bg-neutral-200" />
            )}
          </div>

          {/* 하단: 식당명 — 선택 시 주황 배경·흰 텍스트 */}
          <div
            className="px-2 py-0.5 text-center transition-colors duration-200"
            style={{ background: nameBg }}
          >
            <span
              className="typo-caption font-bold whitespace-nowrap transition-colors duration-200"
              style={{ color: textColor }}
            >
              {name}
            </span>
          </div>
        </div>

        {/* 최하단 삼각형 포인터 — 식당명 영역 색상과 동일 */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "9px solid transparent",
            borderRight: "9px solid transparent",
            borderTop: `11px solid ${nameBg}`,
            transition: "border-top-color 0.2s",
          }}
        />
      </div>
    </button>
  );
}
