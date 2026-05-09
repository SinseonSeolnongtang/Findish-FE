import { cn } from "@/lib/utils";
import FavoriteIcon from "@/assets/icons/common/favorite.svg?react";

interface LikeButtonProps {
  liked?: boolean;
  imageUrl?: string;
  className?: string;
}

export default function LikeButton({
  liked = false,
  imageUrl,
  className,
}: LikeButtonProps) {
  return (
    <div
      className={cn(
        "w-25 h-25 bg-neutral-100 border-[1.5px] border-dashed border-neutral-300 rounded-[10px] flex items-center justify-center overflow-hidden",
        liked && !imageUrl && "bg-orange-200 border-orange-400",
        liked && imageUrl && "border-solid border-orange-400",
        className,
      )}
    >
      {liked && imageUrl ? (
        <img src={imageUrl} alt="저장된 가게" className="w-full h-full object-cover" />
      ) : (
        <FavoriteIcon className="" />
      )}
    </div>
  );
}
