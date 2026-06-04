import { useState, useEffect, useRef } from "react";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import findyAiPickUrl from "@/assets/icons/Findy/findy_ai_pick.svg?url";
import smileUrl from "@/assets/icons/Findy/smile.svg?url";
import { useMePreferenceQuery } from "@/hooks/useAiPick";
import type { GetMePreferenceResponse } from "@/types/aiPick";

type View = "intro" | "analyzing" | "result";

type AspectKey = "미" | "감" | "귀" | "알" | "쾌" | "노";

interface AspectInfo {
  key: AspectKey;
  apiKey: string;
  code: string;
  userLabel: string;
  restaurantLabel: string;
  aspect: string;
  emoji: string;
  restaurantDesc: string;
  bgClass: string;
  textClass: string;
}

const ASPECTS: AspectInfo[] = [
  {
    key: "미", apiKey: "taste", code: "T",
    userLabel: "미식가", restaurantLabel: "맛집", aspect: "맛", emoji: "🍽️",
    restaurantDesc: "맛으로 증명된, 음식 평가가 압도적인 집",
    bgClass: "bg-orange-100", textClass: "text-primary",
  },
  {
    key: "감", apiKey: "mood", code: "M",
    userLabel: "감성파", restaurantLabel: "감성", aspect: "분위기", emoji: "✨",
    restaurantDesc: "무드와 공간감이 살아있는 분위기 맛집",
    bgClass: "bg-pink-100", textClass: "text-pink-600",
  },
  {
    key: "귀", apiKey: "service", code: "S",
    userLabel: "귀족", restaurantLabel: "친절", aspect: "서비스", emoji: "👑",
    restaurantDesc: "응대가 따뜻한, 서비스 칭찬 많은 집",
    bgClass: "bg-purple-100", textClass: "text-purple-600",
  },
  {
    key: "알", apiKey: "value", code: "V",
    userLabel: "알뜰파", restaurantLabel: "가성비", aspect: "가성비", emoji: "💡",
    restaurantDesc: "가격 대비 만족이 높은, 지갑이 가벼운 집",
    bgClass: "bg-green-100", textClass: "text-green-600",
  },
  {
    key: "쾌", apiKey: "facility", code: "F",
    userLabel: "쾌적파", restaurantLabel: "깔끔", aspect: "청결", emoji: "🧼",
    restaurantDesc: "깔끔하고 쾌적한 공간, 시설 평이 좋은 집",
    bgClass: "bg-sky-100", textClass: "text-sky-600",
  },
  {
    key: "노", apiKey: "waiting", code: "W",
    userLabel: "노웨이팅", restaurantLabel: "노웨이팅", aspect: "대기", emoji: "⚡",
    restaurantDesc: "웨이팅 부담 없이 편하게 즐기는 집",
    bgClass: "bg-yellow-100", textClass: "text-yellow-600",
  },
];

const CODE_TO_ASPECT: Record<string, AspectInfo> = Object.fromEntries(
  ASPECTS.map((a) => [a.code, a]),
);

const ANALYZE_STEPS = [
  "좋아요 기록을 불러오고 있어요...",
  "취향 패턴을 분석하고 있어요...",
  "미식코드를 생성하고 있어요...",
];

function HexRadarChart({ aspectScores }: { aspectScores: Record<string, number> }) {
  const cx = 140;
  const cy = 140;
  const radius = 78;
  const levels = 4;

  const axes = ASPECTS.map((a, i) => ({
    ...a,
    angle: (Math.PI * 2 * i) / 6 - Math.PI / 2,
    score: aspectScores[a.apiKey] ?? 0,
  }));

  const pt = (angle: number, r: number) =>
    `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;

  const grids = Array.from({ length: levels }, (_, l) => {
    const r = radius * ((l + 1) / levels);
    return axes.map(({ angle }) => pt(angle, r)).join(" ");
  });

  const dataPolygon = axes.map(({ angle, score }) => pt(angle, radius * score)).join(" ");

  return (
    <svg viewBox="0 0 280 280" className="w-full">
      {grids.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="none"
          stroke={i === levels - 1 ? "#d1d5db" : "#f3f4f6"}
          strokeWidth={i === levels - 1 ? "1.5" : "1"}
        />
      ))}
      {axes.map(({ angle }, i) => (
        <line
          key={i}
          x1={cx} y1={cy}
          x2={cx + radius * Math.cos(angle)}
          y2={cy + radius * Math.sin(angle)}
          stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,2"
        />
      ))}
      <polygon
        points={dataPolygon}
        fill="rgba(249,115,22,0.18)"
        stroke="#f97316"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {axes.map(({ angle, score }, i) => (
        <circle
          key={i}
          cx={cx + radius * score * Math.cos(angle)}
          cy={cy + radius * score * Math.sin(angle)}
          r="4" fill="#f97316" stroke="white" strokeWidth="1.5"
        />
      ))}
      {/* 레벨 표시 */}
      {[25, 50, 75].map((pct, i) => (
        <text key={i} x={cx + 2} y={cy - radius * (pct / 100) + 4}
          fontSize="7" fill="#d1d5db" textAnchor="start">
          {pct}
        </text>
      ))}
      {/* 축 레이블 */}
      {axes.map(({ angle, userLabel }, i) => {
        const lr = radius + 26;
        const lx = cx + lr * Math.cos(angle);
        const ly = cy + lr * Math.sin(angle);
        const cosA = Math.cos(angle);
        const anchor: "middle" | "start" | "end" =
          Math.abs(cosA) < 0.15 ? "middle" : cosA > 0 ? "start" : "end";
        return (
          <text
            key={i} x={lx} y={ly}
            textAnchor={anchor} dominantBaseline="middle"
            fontSize="11" fill="#374151" fontWeight="600"
          >
            {userLabel}
          </text>
        );
      })}
    </svg>
  );
}

export default function FindyCodePage() {
  const [view, setView] = useState<View>("intro");
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [result, setResult] = useState<GetMePreferenceResponse | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { refetch: fetchPreference } = useMePreferenceQuery();

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleAnalyze = async () => {
    setView("analyzing");
    setAnalyzeStep(0);

    const animationPromise = new Promise<void>((resolve) => {
      let step = 0;
      intervalRef.current = setInterval(() => {
        step += 1;
        if (step < ANALYZE_STEPS.length) {
          setAnalyzeStep(step);
        } else {
          clearInterval(intervalRef.current!);
          resolve();
        }
      }, 900);
    });

    try {
      const [, apiResult] = await Promise.all([animationPromise, fetchPreference()]);
      if (apiResult.data) {
        setResult(apiResult.data);
        setView("result");
      } else {
        setView("intro");
      }
    } catch {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setView("intro");
    }
  };

  const handleReset = () => {
    setResult(null);
    setView("intro");
  };

  const aspectScores = result?.aspectScores ?? {};
  const topAspects = result?.topAspects ?? [];
  const personaCode = result?.personaCode ?? "";
  const personaLabel = result?.personaLabel ?? "";
  const interactionCount = result?.interactionCount ?? 0;
  const keywordWeights = result?.keywordWeights ?? {};

  const sortedAspects = [...ASPECTS].sort(
    (a, b) => (aspectScores[b.apiKey] ?? 0) - (aspectScores[a.apiKey] ?? 0),
  );

  const personaLetters = personaCode
    .split("")
    .map((letter) => CODE_TO_ASPECT[letter])
    .filter((a): a is AspectInfo => Boolean(a));

  const sortedKeywords = Object.entries(keywordWeights)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15);

  const maxKw = sortedKeywords[0]?.[1] ?? 1;

  return (
    <div className="relative h-screen flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto pt-17">
        {/* ── 인트로 ── */}
        {view === "intro" && (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-5 px-10 max-w-2xl w-full">
              <div className="bg-orange-200 text-primary text-sm font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5">
                ✦ 취향으로 알아보는 나만의 코드
              </div>

              <h1 className="text-[32px] font-bold text-neutral-800 text-center leading-tight">
                당신의 취향,
                <br />
                <span className="text-primary">세 글자</span>로 표현해드릴게요 ✦
              </h1>

              <p className="typo-body-md text-neutral-400 text-center">
                좋아요 기록을 분석해 6가지 측면 중 상위 3가지를 뽑아,
                <br />
                나만의 미식코드를 만들어드려요.
              </p>

              <div className="relative w-full h-64 flex items-end justify-center">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-36 rounded-[50%] bg-orange-200 opacity-60" />

                <div className="absolute top-3 left-2 bg-white shadow-md rounded-full px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-neutral-700 whitespace-nowrap">
                  <span className="w-5 h-5 rounded-md bg-orange-200 flex items-center justify-center text-xs">♥</span>
                  좋아요 로그 분석
                </div>
                <div className="absolute top-3 right-2 bg-white shadow-md rounded-full px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-neutral-700 whitespace-nowrap">
                  <span className="w-5 h-5 rounded-md bg-orange-200 flex items-center justify-center text-xs">🏷️</span>
                  식당 미식코드 매칭
                </div>
                <div className="absolute top-1/2 -translate-y-4 left-0 bg-white shadow-md rounded-full px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-neutral-700 whitespace-nowrap">
                  <span className="w-5 h-5 rounded-md bg-orange-200 flex items-center justify-center text-xs">📊</span>
                  6가지 측면 분석
                </div>
                <div className="absolute top-1/2 -translate-y-4 right-0 bg-white shadow-md rounded-full px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-neutral-700 whitespace-nowrap">
                  <span className="w-5 h-5 rounded-md bg-orange-200 flex items-center justify-center text-xs">✦</span>
                  MBTI식 코드 생성
                </div>

                <img src={findyAiPickUrl} alt="핀디 캐릭터" className="relative z-10 h-44 w-auto" />
              </div>

              <Button onClick={handleAnalyze} variant="primary" size="md" className="w-full font-bold">
                내 미식코드 분석하기 →
              </Button>

              <p className="text-sm text-neutral-400">좋아요 기록 기반으로 자동 분석돼요!</p>
            </div>
          </div>
        )}

        {/* ── 분석 중 ── */}
        {view === "analyzing" && (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-6">
              <img src={findyAiPickUrl} alt="분석 중인 핀디" className="h-36 w-auto animate-bounce" />
              <div className="text-center">
                <p className="typo-body-lg font-semibold text-neutral-800 mb-3">
                  {ANALYZE_STEPS[analyzeStep]}
                </p>
                <div className="flex gap-2 justify-center">
                  {ANALYZE_STEPS.map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        i <= analyzeStep ? "bg-primary" : "bg-neutral-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 결과 ── */}
        {view === "result" && result && (
          <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">
            {/* 헤더 */}
            <div className="text-center">
              <span className="text-sm font-semibold text-primary bg-orange-200 px-3 py-1 rounded-full">
                ✦ 내 미식코드
              </span>
              <h2 className="text-2xl font-bold text-neutral-800 mt-3">당신의 코드가 나왔어요!</h2>
              {interactionCount > 0 && (
                <p className="text-sm text-neutral-400 mt-1">
                  {interactionCount}번의 좋아요 기록 기반으로 분석했어요
                </p>
              )}
            </div>

            {/* 미식코드 카드 */}
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl p-8 flex flex-col items-center gap-5">
              {/* MBTI 스타일 코드 글자 */}
              <div className="flex items-center gap-3">
                {personaLetters.map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-16 h-16 rounded-2xl ${a.bgClass} flex items-center justify-center shadow-sm`}>
                        <span className={`text-2xl font-black ${a.textClass} leading-tight tracking-tight`}>{a.code}</span>
                      </div>
                      <span className="text-xs text-neutral-600 font-medium">{a.aspect}</span>
                    </div>
                    {i < personaLetters.length - 1 && (
                      <span className="text-2xl text-primary/30 font-light mb-5">·</span>
                    )}
                  </div>
                ))}
              </div>

              {/* 코드 + 라벨 */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="bg-white/80 backdrop-blur-sm rounded-full px-7 py-2.5 shadow-sm flex items-baseline gap-1">
                  <span className="font-black text-neutral-800 text-2xl tracking-[0.25em]">{personaCode}</span>
                  <span className="font-bold text-neutral-600 text-lg">형</span>
                </div>
                {personaLabel && (
                  <span className="text-sm text-neutral-600 font-semibold">{personaLabel}</span>
                )}
              </div>

              {topAspects.length > 0 && (
                <p className="text-center text-neutral-600 typo-body-sm leading-relaxed max-w-xs">
                  {topAspects.map((t) => t.label).join(", ")}에 높은 선호도를 가진 타입이에요!
                </p>
              )}

              <img src={smileUrl} alt="웃는 핀디" className="h-20 w-auto" />
            </div>

            {/* 취향 레이더 + 관심 키워드 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-neutral-100 p-4 flex flex-col gap-1 shadow-sm">
                <h3 className="font-bold text-neutral-800 typo-body-sm">취향 레이더</h3>
                {Object.keys(aspectScores).length > 0 && <HexRadarChart aspectScores={aspectScores} />}
              </div>

              <div className="bg-white rounded-2xl border border-neutral-100 p-4 flex flex-col gap-3 shadow-sm">
                <h3 className="font-bold text-neutral-800 typo-body-sm">관심 키워드</h3>
                <div className="flex flex-wrap gap-1.5 content-start">
                  {sortedKeywords.map(([kw, weight]) => {
                    const ratio = weight / maxKw;
                    return (
                      <span
                        key={kw}
                        className={`bg-orange-100 text-primary font-semibold px-2 py-0.5 rounded-full leading-snug ${
                          ratio > 0.85 ? "text-[13px]" : ratio > 0.65 ? "text-[11px]" : "text-[10px]"
                        }`}
                        style={{ opacity: 0.45 + ratio * 0.55 }}
                      >
                        #{kw}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 취향 점수 */}
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 flex flex-col gap-4 shadow-sm">
              <h3 className="font-bold text-neutral-800 typo-body-lg">취향 점수</h3>
              <div className="flex flex-col gap-3.5">
                {sortedAspects.map((a) => {
                  const score = aspectScores[a.apiKey] ?? 0;
                  const pct = Math.round(score * 100);
                  const isTop = topAspects.some((t) => t.aspect === a.apiKey);
                  return (
                    <div key={a.key} className="flex items-center gap-3">
                      <span className={`typo-body-sm w-16 shrink-0 ${isTop ? "font-semibold text-neutral-800" : "text-neutral-400"}`}>
                        {a.userLabel}
                      </span>
                      <div className="flex-1 bg-neutral-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${isTop ? "bg-primary" : "bg-neutral-300"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className={`typo-caption w-8 text-right shrink-0 ${isTop ? "text-primary font-semibold" : "text-neutral-400"}`}>
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 식당 미식코드 안내 */}
            <div className="bg-neutral-50 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-neutral-800 typo-body-lg">식당 미식코드</h3>
                <span className="typo-micro bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded-full">이 집의 특징</span>
              </div>
              <p className="typo-body-sm text-neutral-500 leading-relaxed">
                식당도 리뷰를 분석해 미식코드가 있어요. 나의 코드와 맞는 식당을 찾아보세요!
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {ASPECTS.map((a) => {
                  const isMyCode = personaCode.includes(a.code);
                  return (
                    <div
                      key={a.key}
                      className={`rounded-xl p-3 flex items-start gap-2.5 transition-all ${
                        isMyCode ? `${a.bgClass} ring-1 ring-primary/20` : "bg-white border border-neutral-100"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`typo-caption font-bold ${isMyCode ? a.textClass : "text-neutral-700"}`}>
                            [{a.code}] {a.restaurantLabel}
                          </span>
                          {isMyCode && (
                            <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full leading-none">
                              내 코드
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{a.restaurantDesc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button variant="outline" size="md" className="w-full" onClick={handleReset}>
              처음으로 돌아가기
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
