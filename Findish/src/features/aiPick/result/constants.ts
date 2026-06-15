export const RESTAURANT_COLORS = [
  { stroke: "#FF6900", fill: "#FF6900" },
  { stroke: "#3B82F6", fill: "#3B82F6" },
  { stroke: "#10B981", fill: "#10B981" },
] as const;

export type AspectKey =
  | "taste"
  | "mood"
  | "service"
  | "value"
  | "facility"
  | "waiting";

export const RADAR_AXES: { label: string; key: AspectKey }[] = [
  { label: "맛", key: "taste" },
  { label: "분위기", key: "mood" },
  { label: "서비스", key: "service" },
  { label: "가성비", key: "value" },
  { label: "시설", key: "facility" },
  { label: "대기", key: "waiting" },
];
