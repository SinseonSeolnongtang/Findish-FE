import Keyword from '@/components/common/Keyword';
import ImageCarousel from './ImageCarousel';
import type { CategorySummary } from '@/types/explore';
import type { Restaurant } from './types';

interface Props {
  restaurant: Restaurant;
  service?: CategorySummary;
}

export default function ServiceSection({ restaurant, service }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-3.75 pt-5 shrink-0 flex justify-center">
        <ImageCarousel images={[restaurant.serviceImage]} alt="서비스 사진" />
      </div>

      <div className="flex-1 overflow-y-auto px-3.75 py-4 flex flex-col gap-4">
        <div>
          <p className="typo-t2 font-bold text-neutral-900 mb-2">서비스</p>
          <p className="typo-body-md text-neutral-600">{restaurant.serviceSummary}</p>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="typo-body-sm font-bold text-neutral-500 mb-1.5">좋아요</p>
            <div className="flex flex-wrap gap-1">
              {(service?.positiveKeywords ?? []).map((k) => (
                <Keyword key={k} label={k} colored />
              ))}
            </div>
          </div>
          <div>
            <p className="typo-body-sm font-bold text-neutral-500 mb-1.5">아쉬워요</p>
            <div className="flex flex-wrap gap-1">
              {(service?.negativeKeywords ?? []).map((k) => (
                <Keyword key={k} label={k} colored />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
