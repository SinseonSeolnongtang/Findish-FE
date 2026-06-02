import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import IMG_BIBIMBAP from "@/assets/images/bibimbap.png";
import IMG_HAMBURGER from "@/assets/images/hamburger.png";
import IMG_DISH from "@/assets/images/dish.png";

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
      </svg>
    ),
    label: "일반 모드",
    title: "지도로 한눈에 탐색",
    desc: "키워드 검색으로 찾은 맛집을 네이버 지도 위에서 확인하세요. AI가 리뷰를 분석해 긍정/부정 키워드, 대표 메뉴까지 한 번에 요약해 드려요.",
    color: "bg-orange-100",
    textColor: "text-primary",
    link: "/normal",
    linkLabel: "검색하러 가기",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    label: "픽 모드",
    title: "카드를 넘겨 픽하기",
    desc: "맛집을 틴더처럼 카드 한 장씩 넘겨 보세요. 홈·맛·분위기·서비스 4개 섹션으로 구성된 카드에서 마음에 드는 곳을 최대 3곳 픽할 수 있어요.",
    color: "bg-orange-100",
    textColor: "text-primary",
    link: "/pick",
    linkLabel: "카드 탐색하기",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    label: "AI 비교 분석",
    title: "픽한 3곳을 비교",
    desc: "픽한 최대 3곳의 리뷰 키워드를 막대 그래프로 시각화해 비교해 드려요. 공통점과 트레이드오프를 분석해 최선의 선택을 도와드립니다.",
    color: "bg-orange-100",
    textColor: "text-primary",
    link: "/compare",
    linkLabel: "비교 분석 보기",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
      </svg>
    ),
    label: "AI 픽",
    title: "그룹 취향 맞춤 추천",
    desc: "동행자·상황·예산·우선순위 4단계 설문을 입력하면 AI가 친구들의 취향까지 반영해 딱 한 곳을 추천해 드려요.",
    color: "bg-orange-100",
    textColor: "text-primary",
    link: "/ai-pick",
    linkLabel: "AI 픽 시작하기",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
    label: "다이닝 에이전트",
    title: "AI 챗봇으로 간편하게",
    desc: "자연어로 예약, 주문, 취소, 메뉴 추천까지 처리해요. 모든 페이지 어디서나 플로팅 버튼을 눌러 바로 대화할 수 있어요.",
    color: "bg-orange-100",
    textColor: "text-primary",
    link: null,
    linkLabel: null,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
    ),
    label: "장바구니 & 주문",
    title: "담고 바로 주문",
    desc: "마음에 드는 메뉴를 장바구니에 담고 수량을 조절한 뒤 바로 주문하세요. 주문 및 예약 내역은 마이페이지에서 언제든 확인할 수 있어요.",
    color: "bg-orange-100",
    textColor: "text-primary",
    link: "/cart",
    linkLabel: "장바구니 보기",
  },
];

const HOW_TO_STEPS = [
  {
    step: "01",
    title: "검색하기",
    desc: "원하는 키워드로 맛집을 검색하거나, AI 픽으로 동행자·상황·예산 조건을 입력하세요.",
  },
  {
    step: "02",
    title: "탐색하기",
    desc: "지도 뷰 또는 카드 스와이프로 맛집을 탐색하고 AI 요약으로 빠르게 핵심을 파악하세요.",
  },
  {
    step: "03",
    title: "결정하기",
    desc: "AI 비교 분석으로 최선의 한 곳을 고르고, 바로 예약 또는 주문까지 완료하세요.",
  },
];

export default function MainPage() {
  const navigate = useNavigate();
  const serviceIntroRef = useRef<HTMLElement>(null);

  const scrollToIntro = () => {
    serviceIntroRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-brand">
      <Header />

      {/* 히어로 섹션 */}
      <section className="relative flex flex-col items-center justify-center min-h-screen pt-17 overflow-hidden">
        {/* 배경 푸드 이미지 */}
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

        {/* 히어로 텍스트 */}
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

        {/* 스크롤 유도 화살표 */}
        <button
          onClick={scrollToIntro}
          aria-label="서비스 소개로 이동"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-neutral-400 hover:text-primary transition-colors cursor-pointer"
        >
          <span className="typo-caption">서비스 소개 보기</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 animate-bounce">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
          </svg>
        </button>
      </section>

      {/* 서비스 소개 섹션 */}
      <section ref={serviceIntroRef} className="bg-white">
        {/* 인트로 */}
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
          <span className="inline-block typo-body-sm font-semibold text-primary bg-orange-100 px-4 py-1.5 rounded-full mb-5">
            서비스 소개
          </span>
          <h2 className="typo-h1 font-bold text-neutral-800 mb-5">
            FINDISH, 어떤 서비스인가요?
          </h2>
          <p className="typo-body-lg text-neutral-500 leading-relaxed max-w-2xl mx-auto">
            Findish는 수많은 맛집 검색 결과 속에서 피로감을 느끼는 사용자를 위한{" "}
            <span className="text-primary font-semibold">AI 기반 맛집 추천 서비스</span>입니다.
            <br />
            단순 검색을 넘어 AI 리뷰 분석, 카드 탐색 UI, 그룹 취향 기반 추천까지 제공해
            "오늘 뭐 먹지?"라는 고민을 해결해 드려요.
          </p>
        </div>

        {/* 기능 카드 그리드 */}
        <div className="max-w-5xl mx-auto px-6 pb-24">
          <h3 className="typo-t1 font-bold text-neutral-800 mb-10 text-center">주요 기능</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.label}
                className="group bg-white border border-neutral-200 rounded-2xl p-7 flex flex-col gap-4 hover:border-primary hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-primary shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <p className="typo-caption text-primary font-semibold">{feature.label}</p>
                    <p className="typo-t2 font-bold text-neutral-800 leading-snug">{feature.title}</p>
                  </div>
                </div>
                <p className="typo-body-sm text-neutral-500 leading-relaxed flex-1">{feature.desc}</p>
                {feature.link && (
                  <button
                    onClick={() => navigate(feature.link!)}
                    className="self-start typo-body-sm text-primary font-semibold hover:underline flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    {feature.linkLabel}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 이용 방법 */}
        <div className="bg-neutral-100 py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-block typo-body-sm font-semibold text-primary bg-orange-100 px-4 py-1.5 rounded-full mb-5">
                이용 방법
              </span>
              <h3 className="typo-h2 font-bold text-neutral-800">
                3단계로 맛집 고민 끝
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {HOW_TO_STEPS.map((item, idx) => (
                <div key={item.step} className="relative flex flex-col items-center text-center">
                  {idx < HOW_TO_STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] right-0 h-0.5 bg-neutral-300" />
                  )}
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-5 relative z-10">
                    <span className="font-logo text-white text-lg">{item.step}</span>
                  </div>
                  <h4 className="typo-t2 font-bold text-neutral-800 mb-2">{item.title}</h4>
                  <p className="typo-body-sm text-neutral-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-24 text-center">
          <div className="max-w-2xl mx-auto px-6">
            <h3 className="typo-h2 font-bold text-neutral-800 mb-4">
              지금 바로 시작해 보세요
            </h3>
            <p className="typo-body-lg text-neutral-500 mb-10">
              Findish와 함께라면 "오늘 뭐 먹지?" 고민은 이제 끝이에요.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/normal")} className="w-52">
                맛집 검색하기
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate("/ai-pick")} className="w-52">
                AI 픽 해보기
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
