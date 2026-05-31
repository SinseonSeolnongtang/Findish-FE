import { useState, useRef, useEffect, useId } from "react";
import { Link } from "react-router-dom";
import chatbotUrl from "@/assets/chatbot.svg?url";
import CloseIcon from "@/assets/icons/common/close_lg.svg?react";
import MainMenuCard from "@/components/common/MainMenuCard";
import {
  useSendMessageMutation,
  useConfirmReservationMutation,
  useConfirmOrderMutation,
  useCancelReservationMutation,
  useCancelOrderMutation,
} from "@/hooks/useAgent";
import { useAuthStore } from "@/stores/authStore";
import type {
  AgentIntent,
  AgentStep,
  AgentReservationInfo,
  AgentMenuInfo,
} from "@/types/agent";

interface LocalMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  intent?: AgentIntent;
  step?: AgentStep;
  targetId?: string | null;
  reservation?: AgentReservationInfo | null;
  menus?: AgentMenuInfo[] | null;
  confirmed?: boolean;
  messageType?: "login_required" | "reservation_complete" | "reservation_cancelled" | "order_complete";
}

interface ChatbotModalProps {
  onClose: () => void;
}

function AgentLinkMessage({ message, to, linkText }: { message: string; to: string; linkText: string }) {
  return (
    <div className="typo-body-sm text-neutral-900">
      <p>{message}</p>
      <Link to={to} className="typo-body-sm text-neutral-500 mt-1 block hover:underline">
        {linkText} &gt;
      </Link>
    </div>
  );
}

function AgentText({ text }: { text: string }) {
  return (
    <div className="typo-body-sm text-neutral-900 leading-relaxed">
      {(text ?? "").split("\n").map((line, lineIdx) => {
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

function MenuSlider({ menus }: { menus: AgentMenuInfo[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative mt-3">
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {menus.map((menu) => (
          <MainMenuCard
            key={menu.menuId}
            name={menu.name}
            price={menu.price}
            imageUrl={menu.imageUrl}
            className="shrink-0 w-30 h-25"
          />
        ))}
      </div>
      <button
        onClick={() => scrollRef.current?.scrollBy({ left: 130, behavior: "smooth" })}
        className="absolute right-0 top-10.5 -translate-y-1/2 w-5.25 h-5.25 bg-white-50 rounded-full shadow-md flex items-center justify-center z-10"
        aria-label="더 보기"
      >
        <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
          <path d="M1 1L6 5.5L1 10" stroke="#364153" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export default function ChatbotModal({ onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const idPrefix = useId();
  const nextId = useRef(0);
  const makeId = () => `${idPrefix}-${nextId.current++}`;
  const activeRestaurantId = useRef<string>('');

  const sendMutation = useSendMessageMutation();
  const confirmReservationMutation = useConfirmReservationMutation();
  const confirmOrderMutation = useConfirmOrderMutation();
  const cancelReservationMutation = useCancelReservationMutation();
  const cancelOrderMutation = useCancelOrderMutation();

  const isPending = sendMutation.isPending;
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  // 새 메시지마다 하단 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  const addAgentMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: makeId(), role: "agent", text }]);
  };

  const markConfirmed = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, confirmed: true } : m)),
    );
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || isPending) return;

    setMessages((prev) => [...prev, { id: makeId(), role: "user", text }]);
    setInput("");

    sendMutation.mutate(
      { message: text, restaurantId: activeRestaurantId.current || undefined },
      {
        onSuccess: (res) => {
          setMessages((prev) => [
            ...prev,
            {
              id: makeId(),
              role: "agent",
              text: res.data.message ?? "",
              intent: res.data.intent as AgentIntent | undefined,
              step: res.data.step as AgentStep | undefined,
              targetId: res.data.targetId,
              reservation: res.data.reservation,
              menus: res.data.menus,
            },
          ]);
        },
        onError: () =>
          addAgentMessage("응답을 받지 못했습니다. 다시 시도해 주세요."),
      },
    );
  };

  const handleConfirm = (msg: LocalMessage) => {
    markConfirmed(msg.id);

    if (!isLoggedIn) {
      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "agent", text: "", messageType: "login_required" },
      ]);
      return;
    }

    if (msg.intent === "RESERVATION" && msg.reservation) {
      confirmReservationMutation.mutate(
        {
          restaurantId: activeRestaurantId.current,
          date: msg.reservation.date,
          time: msg.reservation.time,
          partySize: msg.reservation.partySize,
          saveToCalendar: false,
        },
        {
          onSuccess: () =>
            setMessages((prev) => [
              ...prev,
              { id: makeId(), role: "agent", text: "", messageType: "reservation_complete" },
            ]),
          onError: () => addAgentMessage("예약 처리 중 오류가 발생했습니다."),
        },
      );
      return;
    }

    if (msg.intent === "ORDER" && msg.menus) {
      confirmOrderMutation.mutate(
        {
          restaurantId: activeRestaurantId.current,
          items: msg.menus.filter((m): m is typeof m & { menuId: string } => m.menuId !== null).map((m) => ({ menuId: m.menuId, quantity: 1 })),
        },
        {
          onSuccess: () =>
            setMessages((prev) => [
              ...prev,
              { id: makeId(), role: "agent", text: "", messageType: "order_complete" },
            ]),
          onError: () => addAgentMessage("주문 처리 중 오류가 발생했습니다."),
        },
      );
      return;
    }

    if (msg.intent === "CANCEL_RESERVATION" && msg.targetId != null) {
      cancelReservationMutation.mutate(msg.targetId, {
        onSuccess: () =>
          setMessages((prev) => [
            ...prev,
            { id: makeId(), role: "agent", text: "", messageType: "reservation_cancelled" },
          ]),
        onError: () => addAgentMessage("취소 처리 중 오류가 발생했습니다."),
      });
      return;
    }

    if (msg.intent === "CANCEL_ORDER" && msg.targetId != null) {
      cancelOrderMutation.mutate(msg.targetId, {
        onSuccess: () => addAgentMessage("주문이 취소되었습니다."),
        onError: () => addAgentMessage("취소 처리 중 오류가 발생했습니다."),
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const isConfirmIntent = (intent?: AgentIntent) =>
    intent === "RESERVATION" || intent === "ORDER" || intent === "CANCEL_ORDER" || intent === "CANCEL_RESERVATION";

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
        {isEmpty && (
          <div className="flex items-center gap-2">
            <img src={chatbotUrl} alt="" className="w-8 h-8 shrink-0" />
            <p className="typo-body-lg font-bold text-neutral-900">
              무엇을 도와드릴까요?
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start items-center gap-2"}`}
          >
            {msg.role === "agent" && (
              <img
                src={chatbotUrl}
                alt=""
                className="w-8 h-8 shrink-0"
              />
            )}

            {msg.role === "user" ? (
              <div className="max-w-[75%] px-5 py-2.5 rounded-[18px] bg-orange-100 border border-orange-200 typo-body-sm text-neutral-900">
                {msg.text}
              </div>
            ) : (
              <div className="max-w-[80%]">
                {msg.messageType === "login_required" ? (
                  <AgentLinkMessage
                    message="주문/예약을 원하신다면 로그인을 먼저 진행해주세요!"
                    to="/login"
                    linkText="로그인/회원가입 바로가기"
                  />
                ) : msg.messageType === "reservation_complete" ? (
                  <AgentLinkMessage
                    message="예약 완료했습니다!"
                    to="/mypage?tab=reservation"
                    linkText="예약 내역 보러가기"
                  />
                ) : msg.messageType === "reservation_cancelled" ? (
                  <AgentLinkMessage
                    message="예약이 취소되었습니다."
                    to="/mypage?tab=reservation&subTab=cancelled"
                    linkText="예약 내역 바로가기"
                  />
                ) : msg.messageType === "order_complete" ? (
                  <AgentLinkMessage
                    message="주문 완료했습니다!"
                    to="/mypage?tab=order"
                    linkText="주문 내역 보러가기"
                  />
                ) : (
                  <>
                    <AgentText text={msg.text} />

                    {/* 메뉴 슬라이더: 추천 또는 주문 요청 */}
                    {(msg.intent === "MENU_RECOMMEND" || msg.intent === "ORDER") &&
                      msg.menus &&
                      msg.menus.length > 0 && <MenuSlider menus={msg.menus} />}

                    {/* CONFIRMING 단계 확인 버튼 */}
                    {msg.step === "CONFIRMING" &&
                      isConfirmIntent(msg.intent) &&
                      !msg.confirmed && (
                        <button
                          onClick={() => handleConfirm(msg)}
                          className="mt-3 px-5 py-1.5 rounded-full bg-primary text-white-50 typo-body-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                        >
                          확인
                        </button>
                      )}

                  </>
                )}
              </div>
            )}
          </div>
        ))}

        {/* 전송 중 타이핑 인디케이터 */}
        {isPending && (
          <div className="flex items-center gap-2">
            <img src={chatbotUrl} alt="" className="w-8 h-8 shrink-0" />
            <TypingIndicator />
          </div>
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
            disabled={isPending}
            placeholder='"6/5 20시에 방목 2호점으로 5명 예약해줘."라고 말해보세요.'
            className="flex-1 h-full px-5 bg-transparent outline-none typo-body-sm text-neutral-800 placeholder:text-neutral-400 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isPending || !input.trim()}
            className="mr-3 px-3 py-1 rounded-full bg-primary text-white-50 typo-caption font-medium disabled:opacity-40 transition-opacity cursor-pointer"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
