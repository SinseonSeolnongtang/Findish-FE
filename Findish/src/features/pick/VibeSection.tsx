import ImageCarousel from './ImageCarousel';
import type { Restaurant } from './types';

interface Props {
  restaurant: Restaurant;
}

export default function VibeSection({ restaurant }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-3.75 pt-5 shrink-0 flex justify-center">
        <ImageCarousel images={restaurant.vibeImages} alt="분위기 사진" />
      </div>

      <div className="flex-1 overflow-y-auto px-3.75 py-4 flex flex-col gap-4">
        <div>
          <p className="typo-t2 font-bold text-neutral-900 mb-2">분위기</p>
          <p className="typo-body-md text-neutral-600">{restaurant.vibeSummary}</p>
        </div>
      </div>
    </div>
  );
}
