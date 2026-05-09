import { cn } from "@/lib/utils";
import Button from "@/components/common/Button";

interface MenuItemProps {
  name: string;
  price: number;
  imageUrl?: string;
  onAdd?: () => void;
  className?: string;
}

export default function MenuItem({
  name,
  price,
  imageUrl,
  onAdd,
  className,
}: MenuItemProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* 음식 이미지 */}
      <div className="w-24 h-24 rounded-[10px] overflow-hidden shrink-0 bg-[#E5E7EB]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-[#FFE4CC] to-[#FFD0A8]" />
        )}
      </div>

      {/* 텍스트 */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="text-[16px] font-bold text-black leading-tight">
          {name}
        </span>
        <span className="text-[16px] font-bold text-primary-dark">
          {price.toLocaleString()}원
        </span>
      </div>

      {/* 담기 버튼 */}
      <Button
        onClick={onAdd}
        variant="primary"
        className="shrink-0 h-6.25 px-2 typo-micro rounded-md whitespace-nowrap"
      >
        +1 담기
      </Button>
    </div>
  );
}
