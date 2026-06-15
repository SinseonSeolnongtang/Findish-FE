import starFilledIcon from "@/assets/icons/common/star_filled.svg";

interface MainMenuCardProps {
  name: string;
  price: number;
  imageUrl?: string;
  className?: string;
  isSignature?: boolean;
}

export default function MainMenuCard({
  name,
  price,
  imageUrl,
  className,
  isSignature,
}: MainMenuCardProps) {
  return (
    <div className={className ?? "w-30 h-25"} style={{ position: "relative" }}>
      {/* 음식 사진 */}
      <div className="absolute inset-0 rounded-[10px] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-200" />
        )}
        {/* 상단 dark inset shadow — Figma: inset 0px 40px 30px rgba(0,0,0,0.8) */}
        <div className="absolute inset-0 rounded-[10px] shadow-[inset_0px_40px_30px_0px_rgba(0,0,0,0.8)]" />
      </div>

      {/* 시그니처 별 아이콘 — 좌측 상단 */}
      {isSignature && (
        <div className="absolute top-1.5 left-1.5 z-10">
          <img src={starFilledIcon} alt="시그니처" width={14} height={14} />
        </div>
      )}

      {/* 메뉴명 — 상단 중앙 */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[calc(50%-34.5px)] -translate-y-1/2 w-full text-center px-1">
        <p className="text-white text-[10px] font-bold leading-tight whitespace-nowrap">
          {name}
        </p>
      </div>

      {/* 가격 배지 — 하단 중앙 */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-2.5 bg-white px-2.5 py-0.5 rounded-[10px]">
        <p className="text-black text-[10px] font-bold whitespace-nowrap">
          {price.toLocaleString()}원
        </p>
      </div>
    </div>
  );
}
