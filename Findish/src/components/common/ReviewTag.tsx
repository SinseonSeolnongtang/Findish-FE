import CheckIcon from '@/assets/icons/review/check.svg?react';
import WarnIcon from '@/assets/icons/review/warn.svg?react';
import { cn } from '@/lib/utils';

type ReviewTagType = 'positive' | 'negative' | 'choosed';

interface ReviewTagProps {
  label: string;
  type: ReviewTagType;
  className?: string;
  onClick?: () => void;
}

export default function ReviewTag({ label, type, className, onClick }: ReviewTagProps) {
  return (
    <span
      onClick={onClick}
      className={cn(
        onClick && 'cursor-pointer',
        'inline-flex items-center gap-1.5 px-2.5 py-1.25 rounded-[14px] typo-caption-medium whitespace-nowrap drop-shadow-[0px_2px_2px_rgba(0,0,0,0.15)]',
        type === 'positive' && 'bg-orange-100 text-success',
        type === 'negative' && 'bg-orange-100 text-primary-dark',
        type === 'choosed' && 'bg-primary text-white',
        className,
      )}
    >
      {type === 'positive' && <CheckIcon width={12} height={12} />}
      {type === 'choosed' && <CheckIcon width={12} height={12} className="[&_path]:stroke-white" />}
      {type === 'negative' && <WarnIcon width={12} height={12} />}
      {label}
    </span>
  );
}
