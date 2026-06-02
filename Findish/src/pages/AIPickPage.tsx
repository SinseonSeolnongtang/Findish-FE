import { useState } from 'react';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import AISidebar from '@/features/aiPick/AISidebar';
import StepCompanion from '@/features/aiPick/StepCompanion';
import StepSituation from '@/features/aiPick/StepSituation';
import StepBudget from '@/features/aiPick/StepBudget';
import StepFactors from '@/features/aiPick/StepFactors';
import StepResult, { type SelectedConditions } from '@/features/aiPick/StepResult';
import StepProgressBar from '@/features/aiPick/StepProgressBar';
import FriendList from '@/features/aiPick/FriendList';
import { useCreatePresetMutation, useUpdatePresetMutation, usePresetDetailQuery, useDeletePresetMutation } from '@/hooks/useAiPick';
import type { AiPickSituation, AiPickPriority, AiPickRestaurantItem } from '@/types/aiPick';

type View = 'home' | 'preset' | 'result' | 'friends';

interface ResultData {
  presetId?: string;
  title: string;
  restaurants: AiPickRestaurantItem[];
}

export default function AIPickPage() {
  const [view, setView] = useState<View>('home');
  const [presetStep, setPresetStep] = useState<1 | 2 | 3 | 4>(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // 폼 상태 — API enum 타입으로 관리
  const [companions, setCompanions] = useState<string[]>([]);
  const [situation, setSituation] = useState<AiPickSituation | ''>('');
  const [budgetMin, setBudgetMin] = useState(10000);
  const [budgetMax, setBudgetMax] = useState(38000);
  const [priorities, setPriorities] = useState<AiPickPriority[]>([]);
  const [additionalNote, setAdditionalNote] = useState('');

  const [result, setResult] = useState<ResultData | null>(null);

  const createPresetMutation = useCreatePresetMutation();
  const updatePresetMutation = useUpdatePresetMutation();
  const deletePresetMutation = useDeletePresetMutation();
  const { data: presetDetail } = usePresetDetailQuery(selectedPresetId ?? '');

  // 사이드바에서 히스토리 클릭 → 프리셋 상세 조회 후 결과 뷰 진입
  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    setResult(null);
    setView('result');
  };

  const handleStart = () => {
    setPresetStep(1);
    setView('preset');
  };

  const handlePick = () => {
    if (!situation) return;

    const body = {
      friendIds: companions.length > 0 ? companions : undefined,
      situation,
      budgetMin,
      budgetMax,
      priorities,
      extraCondition: additionalNote.trim() || undefined,
    };

    if (selectedPresetId !== null) {
      updatePresetMutation.mutate(
        { presetId: selectedPresetId, body },
        {
          onSuccess: (data) => {
            setResult({ presetId: data.presetId, title: data.title ?? '', restaurants: data.restaurants ?? [] });
            setView('result');
          },
        },
      );
    } else {
      createPresetMutation.mutate(body, {
        onSuccess: (data) => {
          setResult({ presetId: data.presetId, title: data.title ?? '', restaurants: data.restaurants ?? [] });
          setView('result');
        },
      });
    }
  };

  const handleNextStep = () => {
    setDirection('forward');
    if (presetStep < 4) setPresetStep((s) => (s + 1) as 2 | 3 | 4);
    else handlePick();
  };

  const handlePrevStep = () => {
    setDirection('backward');
    if (presetStep > 1) setPresetStep((s) => (s - 1) as 1 | 2 | 3);
  };

  const handleReset = () => {
    // selectedPresetId 유지 — 기존 프리셋이면 수정 API로 분기하기 위함
    setResult(null);
    setPresetStep(1);
    setView('preset');
  };

  const handleDelete = () => {
    const presetId = selectedPresetId ?? result?.presetId;
    if (!presetId) return;
    deletePresetMutation.mutate(presetId, {
      onSuccess: () => handleNewChat(),
    });
  };

  const handlePresetDelete = (presetId: string) => {
    deletePresetMutation.mutate(presetId, {
      onSuccess: () => {
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
    setSituation('');
    setBudgetMin(10000);
    setBudgetMax(38000);
    setPriorities([]);
    setAdditionalNote('');
    setView('home');
  };

  // 사이드바 히스토리 선택 시 presetDetail이 로드되면 표시
  const displayResult: ResultData | null =
    selectedPresetId !== null && presetDetail
      ? { title: presetDetail.title ?? '', restaurants: presetDetail.restaurants ?? [] }
      : result;

  const displayConditions: SelectedConditions | undefined =
    selectedPresetId !== null && presetDetail
      ? {
          situation: presetDetail.situation ?? '',
          budgetMin: presetDetail.budgetMin ?? 0,
          budgetMax: presetDetail.budgetMax ?? 0,
          priorities: presetDetail.priorities ?? [],
          extraCondition: presetDetail.extraCondition || undefined,
          companionCount: (presetDetail.friends?.length ?? 0) > 0 ? presetDetail.friends!.length : undefined,
        }
      : result
        ? {
            situation,
            budgetMin,
            budgetMax,
            priorities,
            extraCondition: additionalNote.trim() || undefined,
            companionCount: companions.length > 0 ? companions.length : undefined,
          }
        : undefined;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden pt-17">
        <AISidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
          onFriendClick={() => setView('friends')}
          onNewChat={handleNewChat}
          onPresetSelect={handlePresetSelect}
          onPresetDelete={handlePresetDelete}
        />

        <main className="flex-1 overflow-y-auto">
          {/* 홈 */}
          {view === 'home' && (
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

          {/* 프리셋 — ProgressBar + Step */}
          {view === 'preset' && (
            <div className="flex flex-col h-full">
              <StepProgressBar
                key={presetStep}
                currentStep={presetStep}
                totalSteps={4}
                direction={direction}
              />

              {presetStep === 1 && (
                <StepCompanion
                  selected={companions}
                  onSelect={setCompanions}
                  onNext={handleNextStep}
                />
              )}
              {presetStep === 2 && (
                <StepSituation
                  selected={situation}
                  onSelect={setSituation}
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
                  selected={priorities}
                  onSelect={setPriorities}
                  additionalNote={additionalNote}
                  onNoteChange={setAdditionalNote}
                  onPrev={handlePrevStep}
                  onNext={handleNextStep}
                  loading={createPresetMutation.isPending || updatePresetMutation.isPending}
                />
              )}
            </div>
          )}

          {/* 친구 관리 */}
          {view === 'friends' && <FriendList />}

          {/* 추천 결과 — 새 프리셋 또는 히스토리 상세 */}
          {view === 'result' && displayResult && (
            <StepResult
              title={displayResult.title}
              restaurants={displayResult.restaurants}
              conditions={displayConditions}
              onReset={handleReset}
              onDelete={handleDelete}
            />
          )}

          {/* 히스토리 상세 로딩 중 */}
          {view === 'result' && !displayResult && (
            <div className="flex items-center justify-center h-full">
              <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
