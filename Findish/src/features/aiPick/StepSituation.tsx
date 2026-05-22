import ToggleTag from "@/components/common/ToggleTag";
import type { AiPickSituation } from "@/types/aiPick";
import StepLayout from "./StepLayout";

const SITUATIONS: { label: string; value: AiPickSituation }[] = [
  { label: "데이트", value: "DATE" },
  { label: "친구", value: "FRIEND" },
  { label: "혼자", value: "ALONE" },
  { label: "회식", value: "MEETING" },
  { label: "가족", value: "FAMILY" },
];

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
        {SITUATIONS.map(({ label, value }) => (
          <ToggleTag
            key={value}
            label={label}
            active={selected === value}
            onClick={() => onSelect(selected === value ? "" : value)}
            size="md"
          />
        ))}
      </div>
    </StepLayout>
  );
}
