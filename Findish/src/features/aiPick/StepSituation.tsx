import ToggleTag from "@/components/common/ToggleTag";
import { SITUATION_OPTIONS } from "@/constants/aiPick";
import type { AiPickSituation } from "@/types/aiPick";
import StepLayout from "./StepLayout";

interface Props {
  selected: AiPickSituation | "";
  onSelect: (v: AiPickSituation | "") => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function StepSituation({
  selected,
  onSelect,
  onPrev,
  onNext,
}: Props) {
  return (
    <StepLayout title="어떤 상황인가요?" onPrev={onPrev} onNext={onNext}>
      <div className="flex flex-wrap justify-center gap-2 w-120">
        {SITUATION_OPTIONS.map(({ label, value }) => (
          <ToggleTag
            key={value}
            label={label}
            active={selected === value}
            onClick={() => onSelect(selected === value ? "" : value)}
            size="sm"
          />
        ))}
      </div>
    </StepLayout>
  );
}
