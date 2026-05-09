import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  images: string[];
  alt?: string;
}

export default function ImageCarousel({ images, alt = '사진' }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const handlePrev = () => setActiveIndex((i) => Math.max(i - 1, 0));
  const handleNext = () => setActiveIndex((i) => Math.min(i + 1, images.length - 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 30) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-75 h-75 rounded-[10px] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img src={images[activeIndex]} className="w-full h-full object-cover" alt={alt} />
      <div className="absolute inset-0 shadow-[inset_0px_-30px_20px_0px_rgba(0,0,0,0.4)]" />
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white opacity-70 disabled:opacity-0 text-xl"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            disabled={activeIndex === images.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white opacity-70 disabled:opacity-0 text-xl"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 items-center">
            {images.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 rounded-[10px]',
                  i === activeIndex ? 'w-4 bg-[#ff6900]' : 'w-2 bg-[#ffd9c4]',
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
