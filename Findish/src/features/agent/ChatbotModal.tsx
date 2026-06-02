import { useState, useRef, useEffect, useId, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import chatbotUrl from "@/assets/icons/Findy/findy_ai2.svg?url";
import CloseIcon from "@/assets/icons/common/close_lg.svg?react";
import ReviewIcon from "@/assets/icons/common/review.svg?react";
import MainMenuCard from "@/components/common/MainMenuCard";
import { useSendMessageMutation, useChatHistoryQuery } from "@/hooks/useAgent";
import { useAuthStore } from "@/stores/authStore";
import type {
  AgentIntent,
  AgentStep,
  AgentReservationInfo,
  AgentMenuInfo,
  AgentRestaurantInfo,
  ChatResponse,
} from "@/types/agent";

interface LocalMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  intent?: AgentIntent;
  step?: AgentStep;
  targetId?: string | null;
  reservation?: AgentReservationInfo | null;
  thumbnailUrl?: string | null;
  menus?: AgentMenuInfo[] | null;
  restaurants?: AgentRestaurantInfo[] | null;
  confirmed?: boolean;
  messageType?:
    | "login_required"
    | "reservation_complete"
    | "reservation_cancelled"
    | "order_complete";
}

interface ChatbotModalProps {
  onClose: () => void;
}

function CompletionLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="typo-body-sm text-neutral-500 mt-1.5 block hover:underline"
    >
      {label} &gt;
    </Link>
  );
}

function AgentText({ text }: { text: string }) {
  return (
    <div className="typo-body-sm text-neutral-900 leading-relaxed">
      {(text ?? "").split("\n").map((line, lineIdx) => {
        const parts = line.split(/(\*\*[^*]+\*\*|"[^"]+")/g);
        return (
          <p key={lineIdx} className={lineIdx > 0 ? "mt-1" : ""}>
            {parts.map((part, i) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
              }
              if (part.startsWith('"') && part.endsWith('"')) {
                return (
                  <strong key={i} className="text-primary">
                    {part.slice(1, -1)}
                  </strong>
                );
              }
              return <span key={i}>{part}</span>;
            })}
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

function RestaurantSlider({
  restaurants,
}: {
  restaurants: AgentRestaurantInfo[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative mt-3">
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide"
      >
        {restaurants.map((r) => (
          <Link
            key={r.restaurantId}
            to={`/store/${r.restaurantId}`}
            className="shrink-0 w-40 rounded-xl overflow-hidden border border-neutral-100 bg-white shadow-sm hover:shadow-md hover:bg-orange-100 transition-colors"
          >
            <div className="w-full h-24 bg-neutral-200 overflow-hidden">
              {r.thumbnailUrl ? (
                <img
                  src={r.thumbnailUrl}
                  alt={r.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-orange-100 to-orange-200" />
              )}
            </div>
            <div className="p-2.5">
              <p className="typo-body-sm font-bold text-neutral-900 truncate">
                {r.name}
              </p>
              <p className="typo-caption text-neutral-500 mt-0.5 truncate">
                {r.category}
              </p>
              <p className="typo-caption text-neutral-400 mt-1 leading-tight line-clamp-2">
                {r.address}
              </p>
              {r.reviewCount != null && (
                <div className="flex items-center gap-1 mt-1.5">
                  <ReviewIcon width={13} height={13} />
                  <span className="typo-caption text-neutral-500">
                    리뷰 {r.reviewCount}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      {restaurants.length > 2 && (
        <button
          onClick={() =>
            scrollRef.current?.scrollBy({ left: 170, behavior: "smooth" })
          }
          className="absolute right-0 top-12 -translate-y-1/2 w-5.25 h-5.25 bg-white-50 rounded-full shadow-md flex items-center justify-center z-10"
          aria-label="더 보기"
        >
          <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
            <path
              d="M1 1L6 5.5L1 10"
              stroke="#364153"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

function MenuSlider({
  menus,
  restaurantId,
  thumbnailUrl,
  onNavigate,
}: {
  menus: AgentMenuInfo[];
  restaurantId?: string | null;
  thumbnailUrl?: string | null;
  onNavigate?: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleMenuTabClick = () => {
    if (restaurantId) {
      navigate("/normal", {
        state: {
          preSelectedStore: {
            id: restaurantId,
            name: "",
            category: "",
            isOpen: false,
            reviewCount: "",
            keywords: [],
          },
          openMenuTab: true,
        },
      });
    }
    onNavigate?.();
  };

  return (
    <div className="relative mt-3">
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt="가게 썸네일"
          className="w-full h-28 object-cover rounded-xl mb-2"
        />
      )}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      >
        {menus.map((menu, idx) => (
          <MainMenuCard
            key={menu.menuId ?? idx}
            name={menu.name ?? ""}
            price={menu.price ?? 0}
            imageUrl={menu.imageUrl ?? undefined}
            isSignature={menu.isSignature}
            className="shrink-0 w-30 h-25"
          />
        ))}
      </div>
      <button
        onClick={() =>
          scrollRef.current?.scrollBy({ left: 130, behavior: "smooth" })
        }
        className="absolute right-0 top-10.5 -translate-y-1/2 w-5.25 h-5.25 bg-white-50 rounded-full shadow-md flex items-center justify-center z-10"
        aria-label="더 보기"
      >
        <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
          <path
            d="M1 1L6 5.5L1 10"
            stroke="#364153"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {restaurantId && (
        <button
          onClick={handleMenuTabClick}
          className="typo-body-sm text-neutral-500 mt-1.5 block hover:underline cursor-pointer"
        >
          메뉴 보러가기 &gt;
        </button>
      )}
    </div>
  );
}

function buildMessageType(
  intent?: AgentIntent,
  step?: AgentStep,
): LocalMessage["messageType"] | undefined {
  if (step !== "COMPLETED") return undefined;
  if (intent === "RESERVATION") return "reservation_complete";
  if (intent === "ORDER") return "order_complete";
  if (intent === "CANCEL_RESERVATION") return "reservation_cancelled";
  return undefined;
}

export default function ChatbotModal({ onClose }: ChatbotModalProps) {
  const [liveMessages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const idPrefix = useId();
  const nextId = useRef(0);
  const makeId = () => `${idPrefix}-${nextId.current++}`;
  const activeRestaurantId = useRef<string>("");

  const sendMutation = useSendMessageMutation();
  const isPending = sendMutation.isPending;
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const { data: historyData, isLoading: historyLoading } =
    useChatHistoryQuery();

  const historyMessages = useMemo((): LocalMessage[] => {
    if (historyLoading) return [];
    const msgs = historyData?.data?.messages;
    if (!msgs?.length) return [];
    return msgs.map((msg, idx) => ({
      id: `history-${idx}`,
      role: (msg.role === "USER" ? "user" : "agent") as "user" | "agent",
      text: msg.content,
      intent: msg.intent,
      step: msg.step,
      targetId: msg.restaurantId,
      menus: msg.menus,
      restaurants: msg.restaurants,
      messageType: buildMessageType(msg.intent, msg.step),
      confirmed: true,
    }));
  }, [historyLoading, historyData]);

  const messages = useMemo(
    () => [...historyMessages, ...liveMessages],
    [historyMessages, liveMessages],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  const addAgentMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: makeId(), role: "agent", text }]);
  };

  const appendAgentResponse = (res: ChatResponse) => {
    setMessages((prev) => [
      ...prev,
      {
        id: makeId(),
        role: "agent",
        text: res.message ?? "",
        intent: res.intent,
        step: res.step,
        targetId: res.restaurantId ?? res.targetId,
        thumbnailUrl: res.thumbnailUrl,
        reservation: res.reservation,
        menus: res.menus,
        restaurants: res.restaurants,
        messageType: buildMessageType(res.intent, res.step),
      },
    ]);
  };

  const markConfirmed = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, confirmed: true } : m)),
    );
  };

  const sendText = (text: string) => {
    setMessages((prev) => [...prev, { id: makeId(), role: "user", text }]);
    sendMutation.mutate(
      { message: text, restaurantId: activeRestaurantId.current || undefined },
      {
        onSuccess: (res) => appendAgentResponse(res.data),
        onError: () =>
          addAgentMessage("응답을 받지 못했습니다. 다시 시도해 주세요."),
      },
    );
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || isPending) return;
    setInput("");
    sendText(text);
  };

  // 에이전트가 CONFIRMING 단계에서 보여주는 "확인" 버튼:
  // "네"를 메시지로 전송해 에이전트가 예약/주문/취소를 처리하도록 위임
  const handleConfirm = (msg: LocalMessage) => {
    markConfirmed(msg.id);

    if (!isLoggedIn) {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "agent",
          text: "",
          messageType: "login_required",
        },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      { id: makeId(), role: "user", text: "네" },
    ]);

    sendMutation.mutate(
      { message: "네", restaurantId: activeRestaurantId.current || undefined },
      {
        onSuccess: (res) => appendAgentResponse(res.data),
        onError: () =>
          addAgentMessage("응답을 받지 못했습니다. 다시 시도해 주세요."),
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const isConfirmIntent = (intent?: AgentIntent) =>
    intent === "RESERVATION" ||
    intent === "ORDER" ||
    intent === "CANCEL_RESERVATION";

  const isEmpty = messages.length === 0;

  return (
    <div className="fixed bottom-8 right-8 z-50 w-140 h-150 bg-white-50 rounded-3xl shadow-[0px_4px_8px_0px_rgba(0,0,0,0.25)] flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-8 pt-8 pb-5 shrink-0">
        <h2 className="typo-t1 font-bold text-neutral-900">
          <span className="font-logo text-primary mr-1">
            Findy <span className="text-neutral-500">AI Agent</span>
          </span>{" "}
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
        {historyLoading ? (
          <div className="flex items-center justify-center gap-2 py-4">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        ) : (
          isEmpty && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <img src={chatbotUrl} alt="" className="w-9 h-9" />
                </div>
                <p className="typo-body-md font-bold text-neutral-800">
                  무엇을 도와드릴까요?
                </p>
              </div>
              <div className="pl-12 flex flex-col gap-1">
                <p className="typo-body-sm text-neutral-600">
                  Findy는 AI Agent에요.
                </p>
                <p className="typo-body-sm text-neutral-600">
                  대표메뉴 조회부터 리뷰 요약, 주문, 예약 모두 Findy가
                  도와드릴게요.
                </p>
              </div>
              <div className="flex flex-row gap-2 pl-12 pt-3">
                {[
                  "한성대 근처 회식하기 좋은 고깃집 알려줘",
                  "삼삼뼈국 리뷰 요약해줘",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => !isPending && sendText(suggestion)}
                    className="self-start px-4 py-2 rounded-full border border-orange-300 bg-orange-50 typo-body-sm text-orange-500 hover:bg-orange-100 transition-colors cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start items-start gap-2"}`}
          >
            {msg.role === "agent" && (
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
                <img src={chatbotUrl} alt="" className="w-7 h-7" />
              </div>
            )}

            {msg.role === "user" ? (
              <div className="max-w-[75%] px-5 py-2.5 rounded-[18px] bg-orange-100 border border-orange-200 typo-body-sm text-neutral-900">
                {msg.text}
              </div>
            ) : (
              <div className="max-w-[80%] mt-3">
                {msg.messageType === "login_required" ? (
                  <div className="typo-body-sm text-neutral-900">
                    <p>주문/예약을 원하신다면 로그인을 먼저 진행해주세요!</p>
                    <CompletionLink
                      to="/login"
                      label="로그인/회원가입 바로가기"
                    />
                  </div>
                ) : (
                  <>
                    <AgentText text={msg.text} />

                    {/* 완료 시 마이페이지 바로가기 링크 */}
                    {msg.messageType === "reservation_complete" && (
                      <CompletionLink
                        to="/mypage?tab=reservation"
                        label="예약 내역 보러가기"
                      />
                    )}
                    {msg.messageType === "reservation_cancelled" && (
                      <CompletionLink
                        to="/mypage?tab=reservation&subTab=cancelled"
                        label="예약 내역 바로가기"
                      />
                    )}
                    {msg.messageType === "order_complete" && (
                      <CompletionLink
                        to="/mypage?tab=order"
                        label="주문 내역 보러가기"
                      />
                    )}

                    {/* 가게 슬라이더: 검색/추천 결과 */}
                    {msg.restaurants && msg.restaurants.length > 0 && (
                      <RestaurantSlider restaurants={msg.restaurants} />
                    )}

                    {/* 메뉴 슬라이더: 추천 또는 주문 요청 */}
                    {(msg.intent === "MENU_RECOMMEND" ||
                      msg.intent === "ORDER") &&
                      msg.menus &&
                      msg.menus.length > 0 && (
                        <MenuSlider
                          menus={msg.menus}
                          restaurantId={
                            msg.intent === "MENU_RECOMMEND"
                              ? msg.targetId
                              : undefined
                          }
                          thumbnailUrl={msg.thumbnailUrl}
                          onNavigate={onClose}
                        />
                      )}

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
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
              <img src={chatbotUrl} alt="" className="w-7 h-7" />
            </div>
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
