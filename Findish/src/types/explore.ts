// ─── 1. 자연어 검색 ──────────────────────────────────────────────────────────
// GET /api/v1/explore/search
export interface ExploreSearchRequest {
  keyword: string;
  lat?: number;
  lng?: number;
}
export interface ExploreRestaurantItem {
  restaurantId: string;
  name: string;
  category: string;
  address: string;
  distance: number;
  priceRange: string;
  lat: number;
  lng: number;
  imageUrls: string[];
  tags: string[];
}
export interface ExploreSearchResponse {
  totalCount: number;
  restaurants: ExploreRestaurantItem[];
}

// ─── 2. 카드 AI 요약 조회 ────────────────────────────────────────────────────
// GET /api/v1/explore/{restaurantId}/card-summary
export interface CategorySummary {
  summary: string;
  positiveKeywords: string[];
  negativeKeywords: string[];
}
export interface GetCardSummaryResponse {
  taste: CategorySummary;
  atmosphere: CategorySummary;
  service: CategorySummary;
}

// ─── 3/4/5. 선택 공통 ────────────────────────────────────────────────────────
// POST /api/v1/explore/selections
// GET  /api/v1/explore/selections
// DELETE /api/v1/explore/selections/{restaurantId}
export interface AddSelectionRequest {
  restaurantId: string;
}
export interface SelectionItem {
  restaurantId: string;
  name: string;
  thumbnailUrl: string;
}
export interface SelectionsResponse {
  selectedCount: number;
  isCompleted: boolean;
  selections: SelectionItem[];
}

// ─── 6. 가게 비교 분석 ───────────────────────────────────────────────────────
// GET /api/v1/explore/analysis
export interface AnalysisTopKeyword {
  keyword: string;
  positiveRatio: number;
  negativeRatio: number;
}
export interface AnalysisRestaurant {
  restaurantId: string | null;
  name: string;
  category: string;
  thumbnailUrl: string;
  topKeywords: AnalysisTopKeyword[];
}
export interface AnalysisSummary {
  commonText: string;
  tradeOffText: string;
}
export interface AnalysisKeywordScore {
  restaurantId: string | null;
  ratio: number;
}
export interface AnalysisKeyword {
  keyword: string;
  scores: AnalysisKeywordScore[];
}
export interface GetAnalysisResponse {
  restaurants: AnalysisRestaurant[];
  summary: AnalysisSummary;
  commonKeywords: AnalysisKeyword[];
  tradeOffKeywords: AnalysisKeyword[];
}
