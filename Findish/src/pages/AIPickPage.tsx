import { useState } from "react";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import AISidebar from "@/features/aiPick/AISidebar";
import StepCompanion from "@/features/aiPick/StepCompanion";
import StepSituation from "@/features/aiPick/StepSituation";
import StepBudget from "@/features/aiPick/StepBudget";
import StepFactors from "@/features/aiPick/StepFactors";
import StepResult from "@/features/aiPick/StepResult";
import FriendList from "@/features/aiPick/FriendList";

interface ResultStore {
  name: string;
  category: string;
  tagline: string;
  image: string;
  isOpen: boolean;
  reviewCount: string;
  keywords: string[];
  reason: string;
}

type View = "home" | "preset" | "result" | "friends";

export default function AIPickPage() {
  const [view, setView] = useState<View>("home");
  const [presetStep, setPresetStep] = useState<1 | 2 | 3 | 4>(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [companions, setCompanions] = useState<string[]>([]);
  const [situation, setSituation] = useState("");
  const [budgetMin, setBudgetMin] = useState(10000);
  const [budgetMax, setBudgetMax] = useState(38000);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [additionalNote, setAdditionalNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultStore | null>(null);

  const handleStart = () => {
    setPresetStep(1);
    setView("preset");
  };

  const handlePick = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setResult({
      name: "방목 2호점",
      category: "한식",
      tagline: "직화로 완성되는 특별한 맛",
      image:
        "https://www.figma.com/api/mcp/asset/771182db-44d5-4065-950e-719d3bbc9abf",
      isOpen: true,
      reviewCount: "400+",
      keywords: ["#가성비", "#육즙가득", "#직화구이"],
      reason:
        '석우, 성재님과의 회식 자리에 딱 맞는 곳이에요. 1인당 2만~3만원대로 설정하신 예산 범위 안에 들어오고, 두 분 모두 가성비를 중시하시는 만큼 양 대비 가격이 합리적인 이 곳을 추천드려요.\n\n직화구이 방식으로 고기의 육즙이 살아있고, 오징어사리 서비스가 특히 인기예요. 최근 리뷰에서도 "고기 질이 좋다", "직원이 친절하다"는 평이 많아 서비스 면에서도 만족하실 거예요. 주차 공간도 넉넉해 이동이 편리합니다.',
    });
    setLoading(false);
    setView("result");
  };

  const handleNextStep = () => {
    if (presetStep < 4) setPresetStep((s) => (s + 1) as 2 | 3 | 4);
    else handlePick();
  };

  const handlePrevStep = () => {
    if (presetStep > 1) setPresetStep((s) => (s - 1) as 1 | 2 | 3);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden pt-17">
        <AISidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
          onFriendClick={() => setView("friends")}
        />

        <main className="flex-1 overflow-y-auto">
          {view === "home" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center flex flex-col items-center gap-4">
                <h1 className="typo-h1 font-bold text-neutral-800">
                  모두의 취향을 기억하는 우리만의 AI
                </h1>
                <p className="typo-body-md text-neutral-400">
                  모두의 취향을 고려하여 딱 1곳으로 골라드립니다.
                </p>
                <Button
                  onClick={handleStart}
                  variant="primary"
                  shape="pill"
                  size="md"
                  className="mt-4 px-10 typo-body-lg font-bold"
                >
                  시작하기
                </Button>
              </div>
            </div>
          )}

          {view === "preset" && presetStep === 1 && (
            <StepCompanion
              selected={companions}
              onSelect={setCompanions}
              onNext={handleNextStep}
            />
          )}

          {view === "preset" && presetStep === 2 && (
            <StepSituation
              selected={situation}
              onSelect={setSituation}
              onPrev={handlePrevStep}
              onNext={handleNextStep}
            />
          )}

          {view === "preset" && presetStep === 3 && (
            <StepBudget
              minBudget={budgetMin}
              maxBudget={budgetMax}
              onMinChange={setBudgetMin}
              onMaxChange={setBudgetMax}
              onPrev={handlePrevStep}
              onNext={handleNextStep}
            />
          )}

          {view === "preset" && presetStep === 4 && (
            <StepFactors
              selected={priorities}
              onSelect={setPriorities}
              additionalNote={additionalNote}
              onNoteChange={setAdditionalNote}
              onPrev={handlePrevStep}
              onNext={handleNextStep}
              loading={loading}
            />
          )}

          {view === "friends" && <FriendList />}

          {view === "result" && result && (
            <StepResult
              store={result}
              onReset={() => {
                setPresetStep(1);
                setView("preset");
                setResult(null);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
