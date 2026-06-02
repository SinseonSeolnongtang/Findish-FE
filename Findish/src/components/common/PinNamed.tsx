import React from "react";
import { cn } from "@/lib/utils";

interface PinNamedProps {
  name: string;
  rating?: number;
  imageUrl?: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function PinNamed({
  name,
  rating,
  imageUrl,
  isSelected = false,
  onClick,
  className,
  style,
}: PinNamedProps) {
  const pinBg = isSelected ? "#FF6900" : "white";

  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute cursor-pointer transition-transform hover:-translate-y-1",
        isSelected && "-translate-y-2",
        className,
      )}
      style={{
        width: 108,
        height: 130,
        transform: "translate(-50%, -100%)",
        ...style,
      }}
    >
      {/* 핀 바디: 음식 사진 */}
      <div
        className="absolute"
        style={{ top: 8, left: 0, right: 0, bottom: 22 }}
      >
        <div
          className="absolute inset-0 rounded-[10px]"
          style={{ background: pinBg, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
        />
        <div className="absolute inset-1.5 rounded-lg overflow-hidden bg-[#E5E7EB]">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      <div
        className="absolute"
        style={{
          top: 108,
          left: 46,
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: `12px solid ${pinBg}`,
        }}
      />

      {/* 식당명 라벨 — 하단 중앙 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-[10px] whitespace-nowrap shadow-[0px_2px_2px_rgba(0,0,0,0.2)]">
        <span className="typo-caption font-bold text-black">{name}</span>
      </div>
    </button>
  );
}
