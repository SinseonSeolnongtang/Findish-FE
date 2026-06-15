# FINDISH

> **맛집 선택의 새로운 기준**  
> 너무 많은 검색 결과에 지치셨나요? Findish가 맛집을 하나로 추리도록 도와드려요.

---

## 목차

- [서비스 소개](#서비스-소개)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [페이지별 설명](#페이지별-설명)
- [상태 관리 및 데이터 흐름](#상태-관리-및-데이터-흐름)
- [디자인 시스템](#디자인-시스템)

---

## 서비스 소개

Findish는 수많은 맛집 검색 결과 속에서 피로감을 느끼는 사용자를 위한 **AI 기반 맛집 추천 서비스**입니다.  
단순 검색을 넘어 AI 리뷰 분석, 카드 탐색 UI, 그룹 취향 기반 추천까지 제공하여 "오늘 뭐 먹지?"라는 고민을 해결합니다.

---

## 주요 기능

### 1. 일반 모드 (Normal Mode)
- 키워드로 맛집을 검색하고 **네이버 지도** 위에서 위치를 확인
- 검색 결과 목록과 지도 핀을 연동하여 직관적인 탐색
- 맛집 선택 시 우측 패널에서 상세 정보 즉시 확인
  - **AI 요약**: 키워드별 리뷰 감성 분석 (긍정/부정), 대표 메뉴, 리뷰 사진
  - **메뉴**: 전체 메뉴 목록 및 장바구니 담기
  - **리뷰**: 실제 방문자 리뷰
  - **정보**: 영업시간, 연락처, 주소
- 좋아요 기능 (낙관적 업데이트 적용)
- 예약하기 기능

### 2. 픽 모드 (Pick Mode)
- 검색된 맛집을 **카드 형태로 한 곳씩 탐색**하는 틴더형 UI
- 각 카드는 홈 → 맛 → 분위기 → 서비스 4개 섹션으로 구성
- AI가 분석한 카테고리별 요약 정보 제공
- **넘기기/저장하기**로 최대 3개 식당을 픽하여 비교 페이지로 이동

### 3. AI 비교 분석 (Compare Page)
- 픽한 3개 식당의 리뷰 키워드를 **시각화하여 비교**
- 공통점과 트레이드오프를 분석하여 결정에 도움
- 막대 그래프로 키워드별 긍정/부정 비율 표시
- 카드 클릭 시 해당 맛집 상세 페이지로 이동

### 4. AI 픽 (AI Pick)
- 4단계 설문(동행자 → 상황 → 예산 → 우선순위)으로 조건 입력
- **친구 그룹의 취향을 함께 반영**하여 딱 1곳 추천
- 과거 추천 히스토리(프리셋) 조회 및 재사용
- 친구 초대/관리 기능

### 5. Findish 다이닝 에이전트 (챗봇)
- 모든 페이지에서 플로팅 버튼(FAB)으로 접근
- 자연어로 **예약, 주문, 취소, 메뉴 추천** 처리
- 예약/주문 확인 단계 UI (`CONFIRMING → COMPLETED`)
- 완료 후 마이페이지 바로가기 링크 제공

### 6. 장바구니 & 주문
- 메뉴 담기, 수량 조절, 아이템 삭제
- 총합 계산 및 주문 처리

### 7. 마이페이지
- 좋아요 내역
- 예약 내역 (방문예정 / 방문완료 / 취소&노쇼 필터)
- 주문 내역
- 프로필 수정 (이름, 비밀번호 변경)

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| **프레임워크** | React 19, TypeScript ~6.0 |
| **빌드 도구** | Vite 8 |
| **스타일링** | Tailwind CSS v4, clsx, tailwind-merge |
| **라우팅** | React Router DOM v7 |
| **서버 상태** | TanStack Query v5 |
| **클라이언트 상태** | Zustand v5 |
| **HTTP 클라이언트** | Axios |
| **폼 유효성 검사** | React Hook Form v7, Zod v4 |
| **애니메이션** | Motion v12 |
| **지도** | 네이버 지도 API |
| **API 코드 생성** | Orval (OpenAPI → TypeScript) |
| **개발 목업** | MSW (Mock Service Worker) v2 |
| **폰트** | Spoqa Han Sans Neo, Unbounded (로고) |

---

## 프로젝트 구조

```
src/
├── api/              # API 호출 함수 (도메인별 분리)
│   ├── agent.ts      # 챗봇 에이전트
│   ├── aiPick.ts     # AI 픽 / 친구
│   ├── auth.ts       # 인증 (로그인/회원가입)
│   ├── cart.ts       # 장바구니/주문
│   ├── explore.ts    # 픽 모드 탐색/비교
│   ├── myPage.ts     # 마이페이지
│   └── restaurant.ts # 맛집 검색/상세
│
├── components/
│   └── common/       # 재사용 공통 컴포넌트
│       ├── Button, Input, Checkbox, ...
│       ├── StoreCard, StoreCardLg, MenuItem
│       ├── SearchBar, SearchField
│       ├── Header, Pagination, Rating, ...
│       └── PrivateRoute
│
├── features/         # 기능 단위 컴포넌트
│   ├── agent/        # ChatbotFAB, ChatbotModal
│   ├── aiPick/       # AI 픽 4단계 스텝 컴포넌트
│   ├── myPage/       # 좋아요/예약/주문/프로필 탭
│   ├── normalMode/   # 지도, 검색결과패널, 가게카드
│   ├── pick/         # 픽 모드 섹션 컴포넌트
│   └── store/        # 가게 상세 (탭: AI/메뉴/리뷰/정보, 예약)
│
├── hooks/            # React Query 커스텀 훅
│   ├── useRestaurant.ts
│   ├── useExplore.ts
│   ├── useAiPick.ts
│   ├── useAgent.ts
│   ├── useAuth.ts
│   └── useCart.ts
│
├── layout/
│   └── AuthLayout.tsx
│
├── lib/
│   ├── axiosInstance.ts       # 기본 Axios 인스턴스 (JWT 인터셉터)
│   ├── agentAxiosInstance.ts  # 에이전트 전용 인스턴스
│   └── utils.ts               # cn() 유틸
│
├── pages/            # 페이지 컴포넌트
│   ├── MainPage.tsx
│   ├── LoginPage.tsx / SignupPage.tsx
│   ├── NormalModePage.tsx
│   ├── PickModePage.tsx
│   ├── ComparePage.tsx
│   ├── AIPickPage.tsx
│   ├── CartPage.tsx
│   └── MyPage.tsx
│
├── stores/
│   └── authStore.ts  # Zustand: 로그인 상태, 토큰 관리
│
└── types/            # TypeScript 타입 정의 (도메인별)
```

---

## 시작하기

### 사전 요구사항

- Node.js 18 이상
- pnpm

### 설치 및 실행

```bash
# 저장소 클론
git clone <repository-url>
cd Findish-FE/Findish

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

### 환경 변수 설정

`.env.local` 파일을 생성하여 필요한 환경 변수를 설정합니다.

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_NAVER_MAP_CLIENT_ID=your_naver_map_client_id
```

### 빌드

```bash
pnpm build
```

### API 코드 생성 (Orval)

```bash
pnpm api:gen
```

---

## 페이지별 설명

| 경로 | 페이지 | 인증 필요 |
|------|--------|-----------|
| `/` | 메인 (랜딩) | X |
| `/login` | 로그인 | X |
| `/signup` | 회원가입 | X |
| `/normal` | 일반 모드 (지도 + 검색) | X |
| `/pick` | 픽 모드 (카드 탐색) | X |
| `/compare` | AI 비교 분석 | X |
| `/cart` | 장바구니 | X |
| `/ai-pick` | AI 픽 (그룹 추천) | O |
| `/mypage` | 마이페이지 | O |

---

## 상태 관리 및 데이터 흐름

### 서버 상태 — TanStack Query

모든 API 호출은 `hooks/` 디렉토리에 위치한 커스텀 훅으로 추상화되어 있습니다.

- **staleTime**: 기본 5분 (QueryClient 전역 설정)
- **retry**: 1회
- 쿼리 키는 각 훅 파일에서 상수로 관리 (`SELECTIONS_KEY` 등)
- Infinite Query: 키워드 리뷰 무한 스크롤 (`useRestaurantKeywordReviewsInfiniteQuery`)

### 클라이언트 상태 — Zustand

`authStore`에서 로그인 여부와 JWT 토큰을 관리합니다.

```ts
const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
const { login, logout } = useAuthStore();
```

- `localStorage`에 `accessToken` / `refreshToken` 영속화
- Axios 인터셉터에서 요청마다 `Authorization` 헤더 자동 주입

### 낙관적 업데이트

좋아요 토글은 낙관적 업데이트 패턴으로 구현되어 있습니다.  
로컬 `toggledIds` 상태로 즉시 반영하고, API 성공/실패 시 서버 응답으로 동기화합니다.

---

## 디자인 시스템

### 색상 토큰

| 토큰 | 값 | 용도 |
|------|----|------|
| `primary` | `#FF6900` | 브랜드 컬러, 주요 액션 |
| `primary-dark` | `#F54900` | 호버 상태 |
| `neutral-900 ~ 100` | `#000 ~ #F3F1EF` | 텍스트, 배경, 보더 |
| `success` | `#00A63E` | 긍정 리뷰, 성공 상태 |
| `error` | `#FF4500` | 오류, 경고 |
| `star` | `#FDC700` | 별점 |

### 타이포그래피

`typo-*` 유틸리티 클래스로 일관된 텍스트 스타일을 적용합니다.

```
typo-h1 / typo-h2 / typo-h3
typo-t1 / typo-t2
typo-body-lg / typo-body-md / typo-body-sm
typo-caption / typo-micro
typo-logo  (Unbounded 폰트, FINDISH 로고 전용)
```

### 공통 컴포넌트

| 컴포넌트 | 설명 |
|----------|------|
| `Button` | size(sm/md/lg), variant(primary/secondary), shape(pill/default) |
| `Input` | 레이블, 에러 메시지 포함 입력 필드 |
| `SearchBar` | normal/pick 모드 전환 가능한 검색바 |
| `StoreCard` | 맛집 카드 (썸네일, 카테고리, 키워드, 좋아요) |
| `Rating` | 별점 표시 |
| `Pagination` | 페이지 네비게이션 |
| `ConfirmModal` | 삭제/취소 확인 다이얼로그 |
