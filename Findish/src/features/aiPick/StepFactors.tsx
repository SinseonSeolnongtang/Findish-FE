import Input from "@/components/common/Input";
import StepLayout from "./StepLayout";

interface Props {
  additionalNote: string;
  onNoteChange: (v: string) => void;
  onPrev: () => void;
  onNext: () => void;
  loading?: boolean;
}

export default function StepFactors({
  additionalNote,
  onNoteChange,
  onPrev,
  onNext,
  loading,
}: Props) {
  return (
    <StepLayout
      title="추가로 원하는 조건이 있나요?"
      subtitle="선호하는 분위기나 특별한 요청이 있다면 알려주세요."
      onPrev={onPrev}
      onNext={onNext}
      loading={loading}
    >
      <div className="w-full flex flex-col gap-2">
        <p className="typo-body-sm text-neutral-900">
          (선택) 추가로 고려해야 할 사항이 있다면 알려주세요.
        </p>
        <Input
          type="text"
          value={additionalNote}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="조용하고 분위기 좋은"
          className="h-10 px-4 bg-orange-100 border-primary rounded-lg typo-body-sm text-neutral-900 placeholder:text-neutral-400"
        />
      </div>
    </StepLayout>
  );
}
