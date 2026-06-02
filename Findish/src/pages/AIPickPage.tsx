import { useRef, useState } from "react";
import Header from "@/components/common/Header";
import Toast from "@/components/common/Toast";
import Button from "@/components/common/Button";
import AISidebar from "@/features/aiPick/AISidebar";
import findyAiPickUrl from "@/assets/icons/Findy/findy_ai_pick.svg?url";
import StepCompanion from "@/features/aiPick/StepCompanion";
import StepSituation from "@/features/aiPick/StepSituation";
import StepBudget from "@/features/aiPick/StepBudget";
import StepFactors from "@/features/aiPick/StepFactors";
import StepResult, {
  type SelectedConditions,
} from "@/features/aiPick/StepResult";
import StepProgressBar from "@/features/aiPick/StepProgressBar";
import FriendList from "@/features/aiPick/FriendList";
import {
  useCreatePresetMutation,
  useUpdatePresetMutation,
  usePresetDetailQuery,
  useDeletePresetMutation,
} from "@/hooks/useAiPick";
import type { AiPickSituation, AiPickRestaurantItem } from "@/types/aiPick";

type View = "home" | "preset" | "result" | "friends";

interface ResultData {
  presetId?: string;
  title: string;
  aiMessage?: string;
  restaurants: AiPickRestaurantItem[];
}

export default function AIPickPage() {
  const [view, setView] = useState<View>("home");
  const [presetStep, setPresetStep] = useState<1 | 2 | 3 | 4>(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 폼 상태
  const [companions, setCompanions] = useState<string[]>([]);
  const [situation, setSituation] = useState<AiPickSituation | "">("");
  const [budgetMin, setBudgetMin] = useState(10000);
  const [budgetMax, setBudgetMax] = useState(38000);
  const [additionalNote, setAdditionalNote] = useState("");

  const [result, setResult] = useState<ResultData | null>(null);

  const showToast = (message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 3000);
  };

  const createPresetMutation = useCreatePresetMutation();
  const updatePresetMutation = useUpdatePresetMutation();
  const deletePresetMutation = useDeletePresetMutation();
  const { data: presetDetail } = usePresetDetailQuery(selectedPresetId ?? "");

  // 사이드바에서 히스토리 클릭 → 프리셋 상세 조회 후 결과 뷰 진입
  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    setResult(null);
    setView("result");
  };

  const handleStart = () => {
    setPresetStep(1);
    setView("preset");
  };

  const handlePick = () => {
    if (!situation) return;

    const body = {
      friendIds: companions.length > 0 ? companions : undefined,
      situation,
      budgetMin,
      budgetMax,
      extraCondition: additionalNote.trim() || undefined,
    };

    if (selectedPresetId !== null) {
      updatePresetMutation.mutate(
        { presetId: selectedPresetId, body },
        {
          onSuccess: (data) => {
            setResult({
              presetId: data.presetId,
              title: data.title ?? "",
              aiMessage: data.aiMessage,
              restaurants: data.restaurants ?? [],
            });
            setView("result");
          },
        },
      );
    } else {
      createPresetMutation.mutate(body, {
        onSuccess: (data) => {
          setResult({
            presetId: data.presetId,
            title: data.title ?? "",
            aiMessage: data.aiMessage,
            restaurants: data.restaurants ?? [],
          });
          setView("result");
        },
      });
    }
  };

  const handleNextStep = () => {
    setDirection("forward");
    if (presetStep < 4) setPresetStep((s) => (s + 1) as 2 | 3 | 4);
    else handlePick();
  };

  const handlePrevStep = () => {
    setDirection("backward");
    if (presetStep > 1) setPresetStep((s) => (s - 1) as 1 | 2 | 3);
  };

  const handleReset = () => {
    // selectedPresetId 유지 — 기존 프리셋이면 수정 API로 분기하기 위함
    setResult(null);
    setPresetStep(1);
    setView("preset");
  };

  const handleDelete = () => {
    const presetId = selectedPresetId ?? result?.presetId;
    const title = displayResult?.title ?? "";
    if (!presetId) return;
    deletePresetMutation.mutate(presetId, {
      onSuccess: () => {
        showToast(`${title}을 삭제하였습니다.`);
        handleNewChat();
      },
    });
  };

  const handlePresetDelete = (presetId: string, title: string) => {
    deletePresetMutation.mutate(presetId, {
      onSuccess: () => {
        showToast(`${title}을 삭제하였습니다.`);
        if (selectedPresetId === presetId || result?.presetId === presetId) {
          handleNewChat();
        }
      },
    });
  };

  const handleNewChat = () => {
    setSelectedPresetId(null);
    setResult(null);
    setPresetStep(1);
    setCompanions([]);
    setSituation("");
    setBudgetMin(10000);
    setBudgetMax(38000);
    setAdditionalNote("");
    setView("home");
  };

  // 사이드바 히스토리 선택 시 presetDetail이 로드되면 표시
  const displayResult: ResultData | null =
    selectedPresetId !== null && presetDetail
      ? {
          title: presetDetail.title ?? "",
          aiMessage: presetDetail.aiMessage,
          restaurants: presetDetail.restaurants ?? [],
        }
      : result;

  const displayConditions: SelectedConditions | undefined =
    selectedPresetId !== null && presetDetail
      ? {
          situation: presetDetail.situation ?? "",
          budgetMin: presetDetail.budgetMin ?? 0,
          budgetMax: presetDetail.budgetMax ?? 0,
          extraCondition: presetDetail.extraCondition || undefined,
          companionCount:
            (presetDetail.friends?.length ?? 0) > 0
              ? presetDetail.friends!.length
              : undefined,
        }
      : result
        ? {
            situation,
            budgetMin,
            budgetMax,
            extraCondition: additionalNote.trim() || undefined,
            companionCount:
              companions.length > 0 ? companions.length : undefined,
          }
        : undefined;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden pt-17">
        <AISidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
          onFriendClick={() => setView("friends")}
          onNewChat={handleNewChat}
          onPresetSelect={handlePresetSelect}
          onPresetDelete={handlePresetDelete}
        />

        <main className="flex-1 overflow-y-auto">
          {/* 홈 */}
          {view === "home" && (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-5 px-10 max-w-2xl w-full">
                {/* 상단 배지 */}
                <div className="bg-orange-200 text-primary text-sm font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5">
                  ✦ 우리만의 AI 추천 프리셋 만들기
                </div>

                {/* 헤딩 */}
                <h1 className="text-[32px] font-bold text-neutral-800 text-center leading-tight">
                  모두의 취향을 기억하는
                  <br />
                  우리만의 <span className="text-primary">AI</span> ✦
                </h1>

                {/* 서브타이틀 */}
                <p className="typo-body-md text-neutral-400 text-center">
                  좋아요와 조건을 분석해 친구와 나의 취향을 이해하고,
                  <br />딱 맞는 맛집 3곳을 추천해드려요.
                </p>

                {/* 캐릭터 + 기능 배지 */}
                <div className="relative w-full h-64 flex items-end justify-center">
                  {/* 오렌지 글로우 */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-36 rounded-[50%] bg-orange-200 opacity-60" />

                  {/* 배지: 좋아요 기록 분석 */}
                  <div className="absolute top-3 left-2 bg-white shadow-md rounded-full px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-neutral-700 whitespace-nowrap">
                    <span className="w-5 h-5 rounded-md bg-orange-200 flex items-center justify-center text-xs">
                      ♥
                    </span>
                    좋아요 기록 분석
                  </div>

                  {/* 배지: 함께하는 취향 이해 */}
                  <div className="absolute top-3 right-2 bg-white shadow-md rounded-full px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-neutral-700 whitespace-nowrap">
                    <span className="w-5 h-5 rounded-md bg-orange-200 flex items-center justify-center text-xs">
                      👥
                    </span>
                    함께하는 취향 이해
                  </div>

                  {/* 배지: 조건 입력 */}
                  <div className="absolute top-1/2 -translate-y-4 left-0 bg-white shadow-md rounded-full px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-neutral-700 whitespace-nowrap">
                    <span className="w-5 h-5 rounded-md bg-orange-200 flex items-center justify-center text-xs">
                      ☰
                    </span>
                    조건 입력
                  </div>

                  {/* 배지: 맞춤 맛집 3곳 추천 */}
                  <div className="absolute top-1/2 -translate-y-4 right-0 bg-white shadow-md rounded-full px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-neutral-700 whitespace-nowrap">
                    <span className="w-5 h-5 rounded-md bg-orange-200 flex items-center justify-center text-xs">
                      🏪
                    </span>
                    맞춤 맛집 3곳 추천
                  </div>

                  {/* 캐릭터 이미지 */}
                  <img
                    src={findyAiPickUrl}
                    alt="파인디 AI 캐릭터"
                    className="relative z-10 h-44 w-auto"
                  />
                </div>

                {/* CTA 버튼 */}
                <Button
                  onClick={handleStart}
                  variant="primary"
                  size="md"
                  className="w-full font-bold"
                >
                  프리셋 만들기 시작 →
                </Button>

                {/* 보조 텍스트 */}
                <p className="text-sm text-neutral-400">약 1분이면 완료돼요!</p>
              </div>
            </div>
          )}

          {/* 프리셋 — ProgressBar + Step */}
          {view === "preset" && (
            <div className="flex flex-col h-full">
              <StepProgressBar
                key={presetStep}
                currentStep={presetStep}
                totalSteps={4}
                direction={direction}
              />

              {presetStep === 1 && (
                <StepSituation
                  selected={situation}
                  onSelect={setSituation}
                  onPrev={handleNewChat}
                  onNext={handleNextStep}
                />
              )}
              {presetStep === 2 && (
                <StepCompanion
                  selected={companions}
                  onSelect={setCompanions}
                  onPrev={handlePrevStep}
                  onNext={handleNextStep}
                />
              )}
              {presetStep === 3 && (
                <StepBudget
                  minBudget={budgetMin}
                  maxBudget={budgetMax}
                  onMinChange={setBudgetMin}
                  onMaxChange={setBudgetMax}
                  onPrev={handlePrevStep}
                  onNext={handleNextStep}
                />
              )}
              {presetStep === 4 && (
                <StepFactors
                  additionalNote={additionalNote}
                  onNoteChange={setAdditionalNote}
                  onPrev={handlePrevStep}
                  onNext={handleNextStep}
                  loading={
                    createPresetMutation.isPending ||
                    updatePresetMutation.isPending
                  }
                />
              )}
            </div>
          )}

          {/* 친구 관리 */}
          {view === "friends" && <FriendList />}

          {/* 추천 결과 — 새 프리셋 또는 히스토리 상세 */}
          {view === "result" && displayResult && (
            <StepResult
              title={displayResult.title}
              aiMessage={displayResult.aiMessage}
              restaurants={displayResult.restaurants}
              conditions={displayConditions}
              onReset={handleReset}
              onDelete={handleDelete}
            />
          )}

          {/* 히스토리 상세 로딩 중 */}
          {view === "result" && !displayResult && (
            <div className="flex items-center justify-center h-full">
              <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </main>
      </div>

      <Toast message={toastMessage} visible={toastVisible} showCartButton={false} />
    </div>
  );
}
