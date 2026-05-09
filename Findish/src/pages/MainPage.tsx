import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import IMG_BIBIMBAP from "@/assets/images/bibimbap.png";
import IMG_HAMBURGER from "@/assets/images/hamburger.png";
import IMG_DISH from "@/assets/images/dish.png";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-brand overflow-hidden">
      <Header />

      <main className="relative flex flex-col items-center justify-center min-h-screen pt-17">
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
              onClick={() => navigate("/about")}
            >
              서비스 소개
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
