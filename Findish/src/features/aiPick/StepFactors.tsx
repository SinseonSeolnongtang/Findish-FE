import Input from "@/components/common/Input";
import ToggleTag from "@/components/common/ToggleTag";
import { PRIORITY_OPTIONS } from "@/constants/aiPick";
import type { AiPickPriority } from "@/types/aiPick";
import StepLayout from "./StepLayout";

interface Props {
  selected: AiPickPriority[];
  onSelect: (v: AiPickPriority[]) => void;
  additionalNote: string;
  onNoteChange: (v: string) => void;
  onPrev: () => void;
  onNext: () => void;
  loading?: boolean;
}

export default function StepFactors({
  selected,
  onSelect,
  additionalNote,
  onNoteChange,
  onPrev,
  onNext,
  loading,
}: Props) {
  const toggle = (val: AiPickPriority) => {
    if (selected.includes(val)) onSelect(selected.filter((v) => v !== val));
    else onSelect([...selected, val]);
  };

  return (
    <StepLayout
      title="어떤걸 1순위로 생각할까요?"
      subtitle="중요하게 생각하시는게 있다면 알려주세요."
      onPrev={onPrev}
      onNext={onNext}
      loading={loading}
    >
      <div className="w-full flex flex-col items-center gap-15">
        <div className="flex flex-wrap justify-center gap-2">
          {PRIORITY_OPTIONS.map(({ label, value }) => {
            const orderIndex = selected.indexOf(value);
            return (
              <ToggleTag
                key={value}
                label={label}
                active={orderIndex !== -1}
                onClick={() => toggle(value)}
                size="sm"
                order={orderIndex !== -1 ? orderIndex + 1 : undefined}
              />
            );
          })}
        </div>

        <div
          className={`grid transition-all duration-300 ease-in-out w-full ${
            selected.length > 0
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden flex flex-col gap-2">
            <p className="typo-body-sm text-neutral-900">
              (선택) 추가적으로 고려해야 할 사항이 있다면 알려주세요.
            </p>
            <Input
              type="text"
              value={additionalNote}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="조용하고 사람이 적은 곳이면 좋겠다."
              className="h-10 px-4 bg-orange-100 border-primary rounded-lg typo-body-sm text-neutral-900 placeholder:text-neutral-400"
            />
          </div>
        </div>
      </div>
    </StepLayout>
  );
}
