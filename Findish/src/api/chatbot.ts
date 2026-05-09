export interface ChatbotLink {
  label: string;
  href: string;
}

export interface ChatbotApiResponse {
  text: string;
  links?: ChatbotLink[];
}

// TODO: 실제 API 엔드포인트 및 인증 헤더로 교체
export async function sendChatbotMessage(message: string): Promise<ChatbotApiResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("챗봇 API 요청 실패");
  return res.json() as Promise<ChatbotApiResponse>;
}
