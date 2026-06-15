export interface RadarAspectItem {
  score?: number;
  positiveRatio?: number;
  positiveCount?: number;
  negativeCount?: number;
  reviewCount?: number;
}

export interface RadarRestaurant {
  name?: string;
  aspectRadar?: Partial<Record<string, RadarAspectItem>>;
}

export const RADAR_COLORS = [
  { stroke: "#FF6900", fill: "#FF6900" },
  { stroke: "#FACC15", fill: "#FACC15" },
  { stroke: "#22C55E", fill: "#22C55E" },
] as const;
