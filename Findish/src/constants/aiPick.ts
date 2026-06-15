import type { AiPickSituation } from '@/types/aiPick';

export const SITUATION_OPTIONS: { label: string; value: AiPickSituation }[] = [
  { label: '데이트', value: 'DATE' },
  { label: '친구와 모임', value: 'FRIEND' },
  { label: '혼자 편하게', value: 'ALONE' },
  { label: '회사/비즈니스', value: 'MEETING' },
  { label: '가족과 함께', value: 'FAMILY' },
  { label: '기타 상황', value: 'OTHER' },
];

export const SITUATION_LABEL = Object.fromEntries(
  SITUATION_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<AiPickSituation, string>;
