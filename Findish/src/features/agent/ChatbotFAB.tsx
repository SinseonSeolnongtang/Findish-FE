import { useState } from "react";
import chatbotUrl from "@/assets/icons/Findy/findy_ai2.svg?url";
import ChatbotModal from "./ChatbotModal";

export default function ChatbotFAB() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <ChatbotModal onClose={() => setOpen(false)} />}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-8 right-8 w-24 h-24 bg-primary rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-all z-40 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.25)]"
        role="button"
        aria-label="다이닝 에이전트 열기"
      >
        <img src={chatbotUrl} alt="" className="w-16 h-16" />
      </div>
    </>
  );
}
