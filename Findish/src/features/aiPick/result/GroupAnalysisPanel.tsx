import { useState } from "react";
import type { AiPickPersonalization } from "@/types/aiPick";
import GroupRadarChart from "./GroupRadarChart";
import Keyword from "@/components/common/Keyword";
import { RADAR_AXES } from "./constants";

const ASPECT_COLOR: Record<string, string> = {
  mood: "#FF6900",
  taste: "#FACC15",
  service: "#22C55E",
  value: "#3B82F6",
  facility: "#8B5CF6",
  waiting: "#EC4899",
};

const MEDAL_BG = ["#F59E0B", "#9CA3AF", "#A87B52"];

const USER_COLOR = "#FF6900";
const GROUP_COLOR = "#3B82F6";

type ViewMode = "all" | "me" | "group";

interface Props {
  personalization?: AiPickPersonalization;
  friendNames?: string[];
}

function computeScore(radar: Record<string, number>): number {
  const vals = Object.values(radar);
  if (!vals.length) return 0;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 1000) / 10;
}

interface ProfileCardProps {
  title: string;
  description: string;
  radar: Record<string, number>;
  color: string;
  bgColor: string;
}

function ProfileCard({ title, description, radar, color, bgColor }: ProfileCardProps) {
  const score = computeScore(radar);
  const series = [{ label: title, color, data: radar }];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="typo-body-sm font-semibold text-neutral-700">{title}</p>
        <p className="typo-caption text-neutral-400 mt-0.5">{description}</p>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex items-center gap-4">
          <div className="shrink-0 bg-neutral-50 rounded-xl border border-neutral-100 px-4 py-3 flex flex-col items-center gap-1 min-w-22">
            <span className="typo-caption text-neutral-500">종합 점수</span>
            <span className="text-2xl font-bold leading-tight" style={{ color }}>{score}점</span>
            <span className="typo-caption text-neutral-400">/100</span>
          </div>
          <div style={{ width: 380 }}>
            <GroupRadarChart series={series} bgColor={bgColor} />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {RADAR_AXES.map((axis) => (
          <div
            key={axis.key}
            className="flex flex-col items-center gap-0.5 bg-neutral-50 rounded-xl px-3 py-2 border border-neutral-100 flex-1"
          >
            <span className="typo-caption text-neutral-500">{axis.label}</span>
            <span className="text-sm font-bold" style={{ color }}>
              {Math.round((radar[axis.key] ?? 0) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GroupAnalysisPanel({ personalization, friendNames }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("all");

  if (!personalization) {
    return (
      <div className="flex items-center justify-center h-60">
        <p className="typo-body-md text-neutral-400">그룹 분석 데이터가 없어요.</p>
      </div>
    );
  }

  const {
    userRadar,
    avgRadar,
    sharedKeywords,
    topAspects,
    personaLabel,
    personalizationMessage,
    groupAgreement,
    members,
    groupSize,
    vectorActive,
    interactionCount,
  } = personalization;

  const isGroup = groupSize != null && groupSize > 1;
  const agreementPct = groupAgreement != null ? Math.round(groupAgreement * 100) : null;

  const allSeries = [];
  if (userRadar) allSeries.push({ label: "나", color: USER_COLOR, data: userRadar });
  if (avgRadar) allSeries.push({ label: isGroup ? "그룹 평균" : "전체 평균", color: GROUP_COLOR, data: avgRadar });

  const TOGGLE_MODES: { id: ViewMode; label: string }[] = [
    { id: "all", label: "모두" },
    { id: "me", label: "나" },
    { id: "group", label: "그룹" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* 헤더 카드 */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className="typo-body-sm font-semibold text-neutral-700">
              {isGroup ? "그룹 취향 분석" : "나의 취향 분석"}
            </p>
            {personalizationMessage && (
              <p className="typo-caption text-neutral-500 leading-relaxed max-w-xl">
                {personalizationMessage}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            {personaLabel && (
              <span
                className={`typo-caption font-semibold px-2.5 py-1 rounded-full ${
                  vectorActive === false
                    ? "bg-neutral-100 text-neutral-500"
                    : "bg-orange-100 text-primary"
                }`}
              >
                {personaLabel}
              </span>
            )}
            {isGroup && groupSize && (
              <span className="typo-caption text-neutral-400 bg-neutral-50 px-2.5 py-1 rounded-full border border-neutral-100">
                그룹 {groupSize}명
              </span>
            )}
          </div>
        </div>

        {/* 통계 바 */}
        <div className="flex items-stretch bg-neutral-50 border border-neutral-100 rounded-2xl overflow-hidden mt-4 divide-x divide-neutral-100">
          {agreementPct != null && (
            <div className="flex items-center gap-3 px-4 py-3">
              <svg width="32" height="32" viewBox="0 0 32 32" className="-rotate-90 shrink-0">
                <circle cx="16" cy="16" r="11" fill="none" stroke="#FED7AA" strokeWidth="4.5" />
                <circle cx="16" cy="16" r="11" fill="none" stroke="#FF6900" strokeWidth="4.5"
                  strokeDasharray={`${2 * Math.PI * 11 * agreementPct / 100} 1000`}
                  strokeLinecap="round" />
              </svg>
              <div className="flex flex-col">
                <span className="text-[10px] text-neutral-400 leading-none mb-0.5">취향 일치도</span>
                <span className="text-[15px] font-bold text-primary leading-none">{agreementPct}%</span>
              </div>
            </div>
          )}
          {interactionCount != null && (
            <div className="flex items-center gap-2.5 px-4 py-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9" cy="7" r="4" stroke="#9CA3AF" strokeWidth="2" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="typo-caption text-neutral-600">상호작용 {interactionCount}건</span>
            </div>
          )}
          {(friendNames && friendNames.length > 0 ? friendNames : members)?.map((name) => (
            <div key={name} className="flex items-center gap-2 px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="4" stroke="#9CA3AF" strokeWidth="2" />
              </svg>
              <span className="typo-caption text-neutral-600 font-medium">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 레이더 섹션 */}
      {allSeries.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          {/* 섹션 헤더 + 토글 */}
          <div className="flex items-center justify-between mb-4">
            <p className="typo-body-sm font-semibold text-neutral-700">취향 레이더</p>
            <div className="flex items-center bg-neutral-100 rounded-full p-0.5 gap-0.5">
              {TOGGLE_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`px-3 py-1 rounded-full typo-caption font-semibold transition-all cursor-pointer ${
                    viewMode === mode.id
                      ? "bg-white text-neutral-800 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* 모두: 기존 합산 레이더 */}
          {viewMode === "all" && (
            <>
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-6">
                <div style={{ width: 380 }}>
                  <GroupRadarChart series={allSeries} />
                </div>
                {topAspects && topAspects.length > 0 && (
                  <div className="w-44 shrink-0 flex flex-col gap-2.5">
                    <p className="typo-caption font-semibold text-neutral-500 text-center">주요 측면</p>
                    {topAspects.map((aspect, i) => (
                      <div
                        key={aspect.aspect}
                        className="bg-neutral-50 rounded-xl px-3 py-2.5 flex flex-col items-center gap-1 border border-neutral-100"
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                            style={{ backgroundColor: MEDAL_BG[i] ?? "#9CA3AF", fontSize: 10 }}
                          >
                            {i + 1}
                          </span>
                          <span
                            className="text-lg font-bold leading-none"
                            style={{ color: ASPECT_COLOR[aspect.aspect] ?? "#374151" }}
                          >
                            {(aspect.score * 100).toFixed(1)}점
                          </span>
                        </div>
                        <span className="typo-caption text-neutral-500 text-center">{aspect.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </div>
              <div className="flex justify-center gap-5 mt-3 flex-wrap">
                {allSeries.map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="typo-caption text-neutral-600 font-medium">{s.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 나: 개인 프로필 카드 */}
          {viewMode === "me" && userRadar && (
            <ProfileCard
              title="나의 취향 프로필"
              description="나의 취향 선호도를 기준으로 평가했어요."
              radar={userRadar}
              color={USER_COLOR}
              bgColor="#FFF7ED"
            />
          )}
          {viewMode === "me" && !userRadar && (
            <p className="typo-body-md text-neutral-400 text-center py-10">개인 취향 데이터가 없어요.</p>
          )}

          {/* 그룹: 그룹 평균 프로필 카드 */}
          {viewMode === "group" && avgRadar && (
            <ProfileCard
              title={isGroup ? "그룹 평균 취향 프로필" : "전체 평균 취향 프로필"}
              description={
                isGroup
                  ? "그룹 구성원의 평균 취향 선호도를 기준으로 평가했어요."
                  : "전체 사용자의 평균 취향 선호도를 기준으로 평가했어요."
              }
              radar={avgRadar}
              color={GROUP_COLOR}
              bgColor="#EFF6FF"
            />
          )}
          {viewMode === "group" && !avgRadar && (
            <p className="typo-body-md text-neutral-400 text-center py-10">그룹 평균 데이터가 없어요.</p>
          )}
        </div>
      )}

      {/* 공통 취향 키워드 */}
      {sharedKeywords && sharedKeywords.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          <p className="typo-body-sm font-semibold text-neutral-700 mb-1">
            공통 취향 키워드
          </p>
          <p className="typo-caption text-neutral-400 mb-4">
            그룹 내 모든 멤버가 공유하는 취향
          </p>
          <div className="flex flex-wrap gap-3">
            {sharedKeywords.map((kw) => (
              <div key={kw.keyword} className="flex flex-col items-center gap-1">
                <Keyword label={kw.keyword} colored />
                <span className="text-[11px] text-neutral-400 font-medium">
                  {Math.round(kw.group_weight * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
