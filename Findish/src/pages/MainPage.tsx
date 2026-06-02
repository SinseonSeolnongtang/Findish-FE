import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import IMG_BIBIMBAP from "@/assets/images/bibimbap.png";
import IMG_HAMBURGER from "@/assets/images/hamburger.png";
import IMG_DISH from "@/assets/images/dish.png";

// ──────────────────────────────────────────────
// 스크롤 진입 시 한 번만 트리거되는 InView 훅
// ──────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// 스크롤 reveal 래퍼 (섹션 헤더, 단일 블록용)
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ──────────────────────────────────────────────
// 섹션 데이터
// ──────────────────────────────────────────────
const PAIN_POINTS = [
  {
    label: "검색 과부하",
    title: "검색 결과는 넘치는데,\n정작 고르기가 어렵다",
    desc: "수백 개의 검색 결과 속에서 내가 원하는 곳을 고르는 것 자체가 피로한 일이 됩니다.",
    // 🖼 이미지 필요: '선택 고민' 3D 일러스트 — 여러 그릇/메뉴가 쏟아지는 혼란스러운 느낌
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-12 h-12"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 9.75h.008v.008H9.75V9.75ZM14.25 9.75h.008v.008h-.008V9.75ZM9 14.25a3 3 0 0 0 6 0"
        />
      </svg>
    ),
  },
  {
    label: "리뷰 노이즈",
    title: "리뷰는 많아도 내가 원하는 정보만 추리기 힘들다",
    desc: "맛인지, 분위기인지, 서비스인지— 수백 개의 리뷰에서 원하는 기준만 골라내기가 어렵습니다.",
    // 🖼 이미지 필요: '리뷰 폭발' 3D 일러스트 — 별점·텍스트 말풍선이 가득 쌓인 느낌
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-12 h-12"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
        />
      </svg>
    ),
  },
  {
    label: "앱 분산",
    title: "탐색·비교·예약·주문이 여러 앱에 흩어져 있다",
    desc: "맛집을 찾고, 비교하고, 예약하고, 주문하는 과정이 각각 다른 앱에서 이루어져 불편합니다.",
    // 🖼 이미지 필요: '앱 분산' 3D 일러스트 — 스마트폰 여러 개 or 앱 아이콘이 흩어진 느낌
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-12 h-12"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15h.008v.008H10.5V16.5Z"
        />
      </svg>
    ),
  },
];

const JOURNEY_STEPS = [
  {
    num: "01",
    label: "탐색",
    title: "두 가지 방식으로 탐색",
    desc: "일반 검색(키워드)과 선택 모드(자연어), 내 상황에 맞는 방식을 선택하세요.",
    // 🖼 이미지 필요: 돋보기 or 지도 3D 아이콘
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
    ),
  },
  {
    num: "02",
    label: "선택",
    title: "AI 리뷰 6측면 요약",
    desc: "맛·분위기·서비스·가격·시설·웨이팅 기준으로 리뷰 인사이트를 한눈에 확인하세요.",
    // 🖼 이미지 필요: 별점 or AI 분석 3D 아이콘
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
        />
      </svg>
    ),
  },
  {
    num: "03",
    label: "비교",
    title: "AI 공통점·트레이드오프 분석",
    desc: "마음에 드는 최대 3개 가게를 저장하면 AI가 공통점과 차이점을 분석해 드립니다.",
    // 🖼 이미지 필요: 저울 or 비교 차트 3D 아이콘
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
        />
      </svg>
    ),
  },
  {
    num: "04",
    label: "예약/주문",
    title: "자연어 한 마디로 완료",
    desc: "AI 에이전트에게 말하면 예약과 주문까지 한번에 처리됩니다.",
    // 🖼 이미지 필요: 로봇/AI 챗 3D 아이콘
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
        />
      </svg>
    ),
  },
];

const TECH_CARDS = [
  {
    title: "멀티모달 리뷰 분석",
    desc: "텍스트와 사진을 동시에 분석하여 더 정확한 리뷰 인사이트를 제공합니다.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
        />
      </svg>
    ),
  },
  {
    title: "6측면 구조화 분석",
    desc: "맛·분위기·서비스·가격·시설·웨이팅 기준으로 리뷰를 정량화하여 비교합니다.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
        />
      </svg>
    ),
  },
  {
    title: "개인 성향 기반 추천",
    desc: "좋아요 로그와 동행인·상황·가격대 조건을 결합한 맞춤 추천을 제공합니다.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
        />
      </svg>
    ),
  },
  {
    title: "자연어 다이닝 에이전트",
    desc: "메뉴 담기, 예약, 리뷰 요약까지 대화 한 번으로 처리하는 AI 에이전트입니다.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
        />
      </svg>
    ),
  },
];

// ──────────────────────────────────────────────
// 메인 컴포넌트
// ──────────────────────────────────────────────
export default function MainPage() {
  const navigate = useNavigate();
  const serviceIntroRef = useRef<HTMLElement>(null);

  const scrollToIntro = () => {
    serviceIntroRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-brand">
      <Header />

      {/* ─── Hero 섹션 ─── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen pt-17 overflow-hidden">
        <img
          src={IMG_DISH}
          alt=""
          aria-hidden
          className="absolute left-[6%] top-[38%] w-85 rotate-[-9deg] pointer-events-none select-none"
        />
        <img
          src={IMG_HAMBURGER}
          alt=""
          aria-hidden
          className="absolute right-[10%] top-[12%] w-55 rotate-16 pointer-events-none select-none"
        />
        <img
          src={IMG_BIBIMBAP}
          alt=""
          aria-hidden
          className="absolute right-[6%] top-[48%] w-90 rotate-[-14deg] pointer-events-none select-none"
        />

        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          <h1 className="font-logo text-[100px] font-normal text-neutral-800 leading-none tracking-tight">
            FINDISH
          </h1>
          <p className="text-[28px] font-bold text-primary tracking-wide">
            맛집 선택의 새로운 기준
          </p>
          <p className="typo-body-lg text-neutral-600 leading-relaxed">
            너무 많은 검색 결과에 지치셨나요?
            <br />
            Findish가 맛집을 하나로 추리도록 도와드려요
          </p>

          <div className="flex gap-4 mt-6">
            <Button
              size="md"
              onClick={() => navigate("/normal")}
              className="w-45"
            >
              지금 시작하기
            </Button>
            <Button
              size="md"
              variant="secondary"
              className="w-40"
              onClick={scrollToIntro}
            >
              서비스 소개
            </Button>
          </div>
        </div>

        <button
          onClick={scrollToIntro}
          aria-label="서비스 소개로 이동"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-neutral-400 hover:text-primary transition-colors cursor-pointer"
        >
          <span className="typo-caption">서비스 소개 보기</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-5 h-5 animate-bounce"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19 9-7 7-7-7"
            />
          </svg>
        </button>
      </section>

      {/* ─── Section 1: 문제 정의 ─── */}
      <section ref={serviceIntroRef} className="bg-white py-28">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <span className="inline-block typo-body-sm font-semibold text-primary bg-orange-100 px-4 py-1.5 rounded-full mb-5">
              Problem
            </span>
            <h2 className="typo-h1 font-bold text-neutral-800">
              맛집 찾다가 이런 경험, 있으신가요?
            </h2>
          </Reveal>

          <div className="grid grid-cols-3 gap-6">
            {PAIN_POINTS.map((point, i) => (
              <Reveal key={point.label} delay={i * 130}>
                <div className="flex flex-col bg-orange-100 rounded-3xl p-8 h-full gap-5">
                  {/* 3D 이미지 영역 — 이미지 제공 시 <img> 태그로 교체 */}
                  <div className="w-full h-44 bg-orange-200 rounded-2xl flex items-center justify-center text-primary">
                    {point.icon}
                  </div>

                  <div className="flex flex-col gap-3">
                    <span className="self-start typo-caption font-semibold text-primary bg-white px-3 py-1 rounded-full">
                      {point.label}
                    </span>
                    <h3 className="typo-t2 font-bold text-neutral-800 leading-snug whitespace-pre-line">
                      {point.title}
                    </h3>
                    <p className="typo-body-sm text-neutral-500 leading-relaxed">
                      {point.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 2: 솔루션 한 줄 소개 ─── */}
      <section className="bg-neutral-800 py-36">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <p className="typo-body-sm font-semibold text-primary mb-6 tracking-widest uppercase">
              Solution
            </p>
            <h2 className="typo-d2 font-bold text-white leading-tight mb-8">
              Findish가
              <br />
              탐색부터 주문까지,
              <br />
              <span className="text-primary">하나로 해결합니다</span>
            </h2>
            <p className="typo-body-lg text-neutral-400 leading-relaxed max-w-xl mx-auto">
              복잡한 맛집 탐색 과정을 하나의 플랫폼에서 end-to-end로
              경험하세요.
              <br />
              AI가 처음부터 끝까지 함께합니다.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Section 3: 핵심 기능 (사용자 여정) ─── */}
      <section className="bg-white py-28">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <span className="inline-block typo-body-sm font-semibold text-primary bg-orange-100 px-4 py-1.5 rounded-full mb-5">
              핵심 기능
            </span>
            <h2 className="typo-h1 font-bold text-neutral-800">
              탐색부터 주문까지, 한 흐름으로
            </h2>
          </Reveal>

          <div className="grid grid-cols-4 gap-5">
            {JOURNEY_STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 130} className="relative">
                {/* 단계 연결 화살표 */}
                {i < JOURNEY_STEPS.length - 1 && (
                  <div className="absolute top-[5.5rem] -right-3.5 z-10">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-7 h-7 text-neutral-300"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9 18 6-6-6-6"
                      />
                    </svg>
                  </div>
                )}

                <div className="flex flex-col gap-5 h-full">
                  {/* 3D 이미지 영역 — 이미지 제공 시 <img> 태그로 교체 */}
                  <div className="w-full aspect-square bg-orange-100 rounded-2xl flex flex-col items-center justify-center text-primary gap-3 relative overflow-hidden">
                    <span className="absolute top-3 left-4 font-logo text-5xl font-normal text-orange-200 leading-none select-none">
                      {step.num}
                    </span>
                    <div className="mt-6">{step.icon}</div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="inline-flex items-center gap-1.5 self-start">
                      <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <span className="typo-micro text-white font-bold leading-none">
                          {i + 1}
                        </span>
                      </span>
                      <span className="typo-body-sm font-bold text-primary">
                        {step.label}
                      </span>
                    </span>
                    <h3 className="typo-t2 font-bold text-neutral-800 leading-snug">
                      {step.title}
                    </h3>
                    <p className="typo-body-sm text-neutral-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 4: 기술 차별화 ─── */}
      <section className="bg-neutral-100 py-28">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <span className="inline-block typo-body-sm font-semibold text-primary bg-orange-100 px-4 py-1.5 rounded-full mb-5">
              기술 차별화
            </span>
            <h2 className="typo-h1 font-bold text-neutral-800">
              Findish만의 기술 강점
            </h2>
            <p className="typo-body-lg text-neutral-500 mt-4">
              AI 기술을 활용한 차별화된 맛집 탐색 경험을 제공합니다.
            </p>
          </Reveal>

          <div className="grid grid-cols-4 gap-5">
            {TECH_CARDS.map((card, i) => (
              <Reveal key={card.title} delay={i * 110}>
                <div className="bg-white rounded-2xl p-7 flex flex-col gap-4 h-full border border-neutral-200 hover:border-primary hover:shadow-md transition-all duration-200 cursor-default">
                  <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center text-primary shrink-0">
                    {card.icon}
                  </div>
                  <h3 className="typo-t2 font-bold text-neutral-800 leading-snug">
                    {card.title}
                  </h3>
                  <p className="typo-body-sm text-neutral-500 leading-relaxed flex-1">
                    {card.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 5: CTA ─── */}
      <section className="bg-primary py-36">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <p className="typo-body-sm font-semibold text-orange-200 mb-6 tracking-widest uppercase">
              Get Started
            </p>
            <h2 className="typo-d2 font-bold text-white leading-tight mb-5">
              오늘 저녁,
              <br />
              Findish로 골라보세요
            </h2>
            <p className="typo-body-lg text-orange-200 mb-12 leading-relaxed">
              맛집 선택의 새로운 기준, Findish와 함께하세요.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/normal")}
              className="w-64"
            >
              맛집 탐색 시작하기
            </Button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
