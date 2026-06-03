import CloseIcon from "@/assets/icons/common/close_lg.svg?react";
import Button from "@/components/common/Button";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-[0px_4px_8px_0px_rgba(0,0,0,0.25)] w-142 h-75 flex flex-col px-10 pt-8 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center justify-center mb-6">
          <h2 className="text-xl font-bold text-black">{title}</h2>
          <button
            onClick={onClose}
            className="absolute right-0 text-black hover:text-gray-500 transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <CloseIcon width="24" height="24" />
          </button>
        </div>

        <p className="text-sm text-black flex-1 flex items-center justify-center">{message}</p>

        <div className="flex gap-3 justify-center">
          <Button
            variant="primary"
            size="sm"
            className="text-sm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-sm bg-[#fff7ed] text-primary border-primary hover:bg-orange-100"
            onClick={onClose}
          >
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
