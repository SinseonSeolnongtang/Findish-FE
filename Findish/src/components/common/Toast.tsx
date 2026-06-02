import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  const [mounted, setMounted] = useState(visible);
  const navigate = useNavigate();

  if (visible && !mounted) setMounted(true);

  if (!mounted) return null;

  return (
    <div
      onTransitionEnd={() => { if (!visible) setMounted(false); }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-neutral-800 text-white shadow-lg transition-all duration-300 flex flex-col items-center gap-1 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <span className="typo-caption whitespace-nowrap">{message}</span>
      <button
        onClick={() => navigate("/cart")}
        className="typo-caption font-semibold text-orange-350 whitespace-nowrap underline underline-offset-2"
      >
        장바구니 보러가기
      </button>
    </div>
  );
}
