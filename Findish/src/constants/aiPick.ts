import type { AiPickPriority, AiPickSituation } from '@/types/aiPick';

export const SITUATION_OPTIONS: { label: string; value: AiPickSituation }[] = [
  { label: '데이트', value: 'DATE' },
  { label: '친구', value: 'FRIEND' },
  { label: '혼자', value: 'ALONE' },
  { label: '회식', value: 'MEETING' },
  { label: '가족', value: 'FAMILY' },
];

export const PRIORITY_OPTIONS: { label: string; value: AiPickPriority }[] = [
  { label: '맛', value: 'TASTE' },
  { label: '분위기', value: 'ATMOSPHERE' },
  { label: '가성비', value: 'PRICE' },
  { label: '청결도', value: 'CLEANLINESS' },
  { label: '서비스', value: 'SERVICE' },
  { label: '주차', value: 'PARKING' },
];

export const SITUATION_LABEL = Object.fromEntries(
  SITUATION_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<AiPickSituation, string>;

export const PRIORITY_LABEL = Object.fromEntries(
  PRIORITY_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<AiPickPriority, string>;
