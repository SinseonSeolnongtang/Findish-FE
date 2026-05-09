import { useState, useRef, useEffect, useId } from "react";
import chatbotUrl from "@/assets/chatbot.svg?url";
import CloseIcon from "@/assets/icons/common/close_lg.svg?react";
import { sendChatbotMessage, type ChatbotLink } from "@/api/chatbot";

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  links?: ChatbotLink[];
}

interface ChatbotModalProps {
  onClose: () => void;
}

function AgentText({ text }: { text: string }) {
  return (
    <div className="typo-body-sm text-neutral-900 leading-relaxed">
      {text.split("\n").map((line, lineIdx) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={lineIdx} className={lineIdx > 0 ? "mt-1" : ""}>
            {parts.map((part, i) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={i}>{part.slice(2, -2)}</strong>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>
        );
      })}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export default function ChatbotModal({ onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idPrefix = useId();
  const nextId = useRef(0);
  const makeId = () => `${idPrefix}-${nextId.current++}`;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { id: makeId(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await sendChatbotMessage(text);
      const agentMsg: ChatMessage = {
        id: makeId(),
        role: "agent",
        text: res.text,
        links: res.links,
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch {
      setError("응답을 받지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="fixed bottom-8 right-8 z-50 w-140 h-150 bg-white-50 rounded-3xl shadow-[0px_4px_8px_0px_rgba(0,0,0,0.25)] flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-8 pt-8 pb-5 shrink-0">
        <h2 className="typo-t1 font-bold text-neutral-900">
          Findish 다이닝 에이전트
        </h2>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          aria-label="챗봇 닫기"
        >
          <CloseIcon width="24" height="24" />
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-8 flex flex-col gap-4">
        {/* 초기 인사 (메시지 없을 때) */}
        {isEmpty && (
          <div className="flex items-start gap-2">
            <img src={chatbotUrl} alt="" className="w-8 h-8 shrink-0 mt-0.5" />
            <p className="typo-body-lg font-bold text-neutral-900">
              무엇을 도와드릴까요?
            </p>
          </div>
        )}

        {/* 대화 메시지 */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start items-start gap-2"}`}
          >
            {msg.role === "agent" && (
              <img
                src={chatbotUrl}
                alt=""
                className="w-8 h-8 shrink-0 mt-0.5"
              />
            )}

            {msg.role === "user" ? (
              <div className="max-w-[75%] px-5 py-2.5 rounded-[18px] bg-orange-100 border border-orange-200 typo-body-sm text-neutral-900">
                {msg.text}
              </div>
            ) : (
              <div className="max-w-[80%]">
                <AgentText text={msg.text} />
                {msg.links && msg.links.length > 0 && (
                  <div className="flex flex-col gap-0.5 mt-2">
                    {msg.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="typo-caption text-neutral-500 underline hover:text-neutral-700 transition-colors"
                      >
                        {link.label} {">"}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* 로딩 인디케이터 */}
        {loading && (
          <div className="flex items-start gap-2">
            <img src={chatbotUrl} alt="" className="w-8 h-8 shrink-0 mt-0.5" />
            <TypingIndicator />
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <p className="typo-caption text-error text-center">{error}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div className="px-8 py-5 shrink-0">
        <div className="relative flex items-center h-11 rounded-[20px] border border-primary bg-white-50 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder='"6/5 20시에 방목 2호점으로 5명 예약해줘."라고 말해보세요.'
            className="flex-1 h-full px-5 bg-transparent outline-none typo-body-sm text-neutral-800 placeholder:text-neutral-400 disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
