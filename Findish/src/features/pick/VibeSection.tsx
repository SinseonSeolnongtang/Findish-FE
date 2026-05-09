import Keyword from '@/components/common/Keyword';
import type { Restaurant } from './types';

const VIBE_POSITIVE = ['#운치있어요', '#뷰맛집'];
const VIBE_NEGATIVE = ['#소음많음'];

interface Props {
  restaurant: Restaurant;
}

export default function VibeSection({ restaurant }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-3.75 pt-5 shrink-0 flex justify-center">
        <div className="relative w-75 h-75 rounded-[10px] overflow-hidden">
          <img src={restaurant.vibeImage} className="w-full h-full object-cover" alt="분위기 사진" />
          <div className="absolute inset-0 shadow-[inset_0px_-30px_20px_0px_rgba(0,0,0,0.4)]" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3.75 py-4 flex flex-col gap-4">
        <div>
          <p className="typo-t2 font-bold text-neutral-900 mb-2">분위기</p>
          <p className="typo-body-md text-neutral-600">{restaurant.vibeSummary}</p>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="typo-body-sm font-bold text-neutral-500 mb-1.5">좋아요</p>
            <div className="flex flex-wrap gap-1">
              {VIBE_POSITIVE.map((k) => (
                <Keyword key={k} label={k} colored />
              ))}
            </div>
          </div>
          <div>
            <p className="typo-body-sm font-bold text-neutral-500 mb-1.5">아쉬워요</p>
            <div className="flex flex-wrap gap-1">
              {VIBE_NEGATIVE.map((k) => (
                <Keyword key={k} label={k} colored />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
