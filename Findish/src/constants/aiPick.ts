import type { AiPickSituation } from '@/types/aiPick';

export const SITUATION_OPTIONS: { label: string; value: AiPickSituation }[] = [
  { label: '데이트', value: 'DATE' },
  { label: '친구', value: 'FRIEND' },
  { label: '혼자', value: 'ALONE' },
  { label: '회식', value: 'MEETING' },
  { label: '가족', value: 'FAMILY' },
];

export const SITUATION_LABEL = Object.fromEntries(
  SITUATION_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<AiPickSituation, string>;
