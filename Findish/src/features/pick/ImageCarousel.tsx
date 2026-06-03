import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import RightIcon from "@/assets/icons/common/right.svg?react";

interface Props {
  images: string[];
  alt?: string;
}

export default function ImageCarousel({ images, alt = "사진" }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const isDragging = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const activeIndexRef = useRef(0);
  const wheelCooldown = useRef(false);
  const wheelAccumRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesLengthRef = useRef(images.length);

  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);
  useEffect(() => { imagesLengthRef.current = images.length; }, [images.length]);

  const n = images.length;
  const goTo = (index: number) =>
    setActiveIndex(Math.max(0, Math.min(index, imagesLengthRef.current - 1)));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      isDragging.current = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const dx = e.touches[0].clientX - touchStartX.current;
      const dy = e.touches[0].clientY - touchStartY.current;
      // 수평 이동이 지배적일 때 브라우저 뒤로가기 제스처를 막음
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
        e.preventDefault();
      }
      setDragOffset(dx);
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      isDragging.current = false;
      setDragOffset(0);
      const cur = activeIndexRef.current;
      const len = imagesLengthRef.current;
      if (diff > 40) setActiveIndex(Math.min(cur + 1, len - 1));      // 좌측 스와이프(다음): 40px
      else if (diff < -80) setActiveIndex(Math.max(cur - 1, 0));      // 우측 스와이프(이전): 80px
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (wheelCooldown.current) return;
      wheelAccumRef.current += e.deltaX;
      if (Math.abs(wheelAccumRef.current) < 120) return;
      if (wheelAccumRef.current > 0) {
        setActiveIndex((i) => Math.min(i + 1, imagesLengthRef.current - 1));
      } else {
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      wheelAccumRef.current = 0;
      wheelCooldown.current = true;
      setTimeout(() => { wheelCooldown.current = false; }, 600);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false }); // preventDefault를 위해 non-passive
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  const isSliding = dragOffset !== 0;
  const stripTranslate = `calc(${-(activeIndex * 100) / n}% + ${dragOffset}px)`;

  return (
    <div
      ref={containerRef}
      className="relative w-90 h-90 rounded-[10px] overflow-hidden group"
    >
      <div
        className="flex h-full"
        style={{
          width: `${n * 100}%`,
          transform: `translateX(${stripTranslate})`,
          transition: isSliding ? "none" : "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {images.map((src, i) => (
          <div key={i} className="h-full shrink-0" style={{ width: `${100 / n}%` }}>
            <img src={src} className="w-full h-full object-cover" alt={`${alt} ${i + 1}`} />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 shadow-[inset_0px_-30px_20px_0px_rgba(0,0,0,0.4)]" />

      {n > 1 && (
        <div className="absolute top-3 left-3 bg-black/40 text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
          {activeIndex + 1} / {n}
        </div>
      )}

      <button
        onClick={() => goTo(activeIndex - 1)}
        disabled={activeIndex === 0}
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-orange-200 cursor-pointer shadow-md flex items-center justify-center transition-opacity hover:bg-orange-300 duration-400 ease-in-out",
          activeIndex === 0 ? "opacity-0 group-hover:opacity-30" : "opacity-0 group-hover:opacity-100",
        )}
      >
        <RightIcon width={10} height={10} className="text-primary rotate-180" />
      </button>

      <button
        onClick={() => goTo(activeIndex + 1)}
        disabled={activeIndex === n - 1}
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-orange-200 shadow-md flex items-center justify-center transition-opacity cursor-pointer hover:bg-orange-300 duration-400 ease-in-out",
          activeIndex === n - 1 ? "opacity-0 group-hover:opacity-30" : "opacity-0 group-hover:opacity-100",
        )}
      >
        <RightIcon width={10} height={10} className="text-primary" />
      </button>

      {n > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 items-center">
          {images.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-[10px] transition-all duration-300",
                i === activeIndex ? "w-4 bg-[#ff6900]" : "w-2 bg-[#ffd9c4]",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
