// ─── 1. 자연어 검색 ──────────────────────────────────────────────────────────
// GET /api/v1/explore/search
export interface ExploreSearchRequest {
  keyword: string;
  lat?: number;
  lng?: number;
}
export interface ExploreRestaurantItem {
  restaurantId: number;
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
  restaurantId: number;
}
export interface SelectionItem {
  restaurantId: number;
  name: string;
  thumbnailUrl: string;
}
export interface SelectionsResponse {
  selectedCount: number;
  isCompleted: boolean;
  selections: SelectionItem[];
}
