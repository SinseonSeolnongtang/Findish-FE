// ─── 공통 탐색 식당 아이템 ────────────────────────────────────────────────────
export interface ExploreRestaurantItem {
  restaurantId?: string;
  name?: string;
  category?: string;
  address?: string;
  priceRange?: string;
  reviewCount?: number;
  distance?: number;
  lat?: number;
  lng?: number;
  thumbnailUrl?: string;
  tags?: string[];
}

// ─── 1. 자연어 검색 ──────────────────────────────────────────────────────────
// GET /api/v1/explore/search
export interface ExploreSearchRequest {
  keyword: string;
  lat?: number;
  lng?: number;
}
export type ExploreSearchResponse = ExploreRestaurantItem[];

// ─── 2. 카드 AI 요약 조회 ────────────────────────────────────────────────────
// GET /api/v1/explore/{naverPlaceId}/card-summary
export interface GetCardSummaryResponse {
  naverPlaceId?: string;
  name?: string;
  tasteSummary?: string;
  moodSummary?: string | null;
  serviceSummary?: string;
  tasteImages?: string[];
  moodImages?: string[];
  serviceImages?: string[];
  ambianceSummary?: string;
  priceSummary?: string;
  facilitySummary?: string;
  waitingSummary?: string;
  overallSummary?: string;
}

// ─── 3/4/5. 선택 공통 ────────────────────────────────────────────────────────
// POST /api/v1/explore/selections
// GET  /api/v1/explore/selections
// DELETE /api/v1/explore/selections/{naverPlaceId}
export interface AddSelectionRequest {
  naverPlaceId: string;
}
export interface SelectionsResponse {
  selections?: ExploreRestaurantItem[];
  selectedCount?: number;
  isCompleted?: boolean;
}

// ─── 6. 가게 비교 분석 ───────────────────────────────────────────────────────
// GET /api/v1/explore/analysis
export interface TopKeywordItem {
  keyword?: string;
  positiveRatio?: number;
  negativeRatio?: number;
}

export interface AspectRadarItem {
  score?: number;
  positiveRatio?: number;
  positiveCount?: number;
  negativeCount?: number;
  reviewCount?: number;
  scoreRelative?: number;
}

export type AspectRadarKey = "taste" | "mood" | "service" | "value" | "facility" | "waiting";

export interface RestaurantPersona {
  code?: string;
  label?: string;
}

export interface RestaurantCardItem {
  restaurantId?: string;
  name?: string;
  category?: string;
  address?: string | null;
  thumbnailUrl?: string;
  parking?: boolean;
  groupSeating?: boolean;
  restaurantPersona?: RestaurantPersona | null;
  topKeywords?: TopKeywordItem[];
  aspectRadar?: Partial<Record<AspectRadarKey, AspectRadarItem>>;
  aiReason?: string;
}
export interface AnalysisSummary {
  commonText?: string;
  tradeOffText?: string;
}
export interface KeywordScoreItem {
  keyword?: string;
  scores?: Array<{
    restaurantId?: string;
    ratio?: number;
    positiveRatio?: number;
    negativeRatio?: number;
    sentimentLabel?: string;
  }>;
}

export interface AspectTradeoffScore {
  naverPlaceId?: string;
  ratio?: number;
  positiveRatio?: number;
  negativeRatio?: number;
  sentimentLabel?: string;
}

export interface AspectTradeoff {
  aspect?: string;
  label?: string;
  scores?: AspectTradeoffScore[];
  gap?: number;
}

export interface GetAnalysisResponse {
  restaurants?: RestaurantCardItem[];
  summary?: AnalysisSummary;
  commonKeywords?: KeywordScoreItem[];
  tradeOffKeywords?: KeywordScoreItem[];
  aspectTradeoff?: AspectTradeoff[];
}

export type AnalysisRestaurant = RestaurantCardItem;
export type AnalysisKeyword = KeywordScoreItem;
