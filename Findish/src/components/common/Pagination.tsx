import { cn } from '@/lib/utils';

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

export default function Pagination({ current, total, onChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-600 hover:bg-gray-100 disabled:opacity-30 transition-colors cursor-pointer"
      >
        &lt;
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded-full text-[14px] font-medium transition-colors cursor-pointer',
            current === p ? 'bg-primary text-white' : 'text-neutral-400 hover:bg-gray-100',
          )}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-600 hover:bg-gray-100 disabled:opacity-30 transition-colors cursor-pointer"
      >
        &gt;
      </button>
    </div>
  );
}
