import { useState } from "react";
import chatbotUrl from "@/assets/chatbot.svg?url";
import ChatbotModal from "./ChatbotModal";

export default function ChatbotFAB() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <ChatbotModal onClose={() => setOpen(false)} />}
      <img
        src={chatbotUrl}
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-8 right-8 w-24 h-24 cursor-pointer active:scale-95 transition-all z-40"
        alt="다이닝 에이전트 열기"
      />
    </>
  );
}
