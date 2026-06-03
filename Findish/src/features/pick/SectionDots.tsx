import { cn } from '@/lib/utils';
import { SECTIONS } from './types';

interface Props {
  active: number;
}

export default function SectionDots({ active }: Props) {
  return (
    <div className="flex items-center gap-1 justify-center">
      {SECTIONS.map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-1.5 rounded-[10px] transition-all',
            i === active ? 'w-[42px] bg-[#ff6900]' : 'w-4 bg-[#ffd9c4]',
          )}
        />
      ))}
    </div>
  );
}
