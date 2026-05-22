import { http, HttpResponse } from "msw";
import type {
  CreateAiPickPresetRequest,
  UpdateAiPickPresetRequest,
  ResolveFriendRequestBody,
} from "@/types/aiPick";

const SITUATION_TITLE_MAP: Record<string, string> = {
  DATE: "특별한 데이트를 위한 추천",
  FRIEND: "친구들과 즐거운 한 끼 추천",
  ALONE: "혼자만의 여유로운 식사 추천",
  MEETING: "중요한 비즈니스 미팅 추천",
  FAMILY: "가족과 함께하는 따뜻한 식사 추천",
};

const MOCK_AIPICK_RESTAURANTS = [
  {
    restaurantId: "a1b2c3d4-0001-0000-0000-000000000001",
    name: "고기굽는마을",
    category: "삼겹살",
    address: "서울 성북구 동소문로 45",
    thumbnailUrl: "https://picsum.photos/seed/aipick1/800/600",
    tags: ["#삼겹살", "#회식", "#주차가능"],
    lat: 37.5891,
    lng: 127.016,
  },
  {
    restaurantId: "a1b2c3d4-0001-0000-0000-000000000002",
    name: "방목 2호점",
    category: "삼겹살",
    address: "서울 성북구 삼선동 67",
    thumbnailUrl: "https://picsum.photos/seed/aipick2/800/600",
    tags: ["#삼겹살", "#데이트", "#분위기좋음"],
    lat: 37.5893,
    lng: 127.018,
  },
  {
    restaurantId: "a1b2c3d4-0001-0000-0000-000000000003",
    name: "이탈리아노 성북",
    category: "이탈리안",
    address: "서울 성북구 보문동 101",
    thumbnailUrl: "https://picsum.photos/seed/aipick3/800/600",
    tags: ["#파스타", "#데이트", "#분위기"],
    lat: 37.592,
    lng: 127.022,
  },
];

const MOCK_FRIENDS = [
  { memberId: "f0000001-0000-0000-0000-000000000001", loginId: "dawon01", name: "다원" },
  { memberId: "f0000001-0000-0000-0000-000000000002", loginId: "yunseo02", name: "윤서" },
  { memberId: "f0000001-0000-0000-0000-000000000003", loginId: "minji03", name: "민지" },
];

const MOCK_PRESET_HISTORY = [
  {
    presetId: "p0000001-0000-0000-0000-000000000001",
    title: "다원님 외 2명과 함께하는 식사",
    createdAt: "2026-05-01T10:00:00",
  },
  {
    presetId: "p0000001-0000-0000-0000-000000000002",
    title: "혼자 즐기는 나만의 식사",
    createdAt: "2026-05-10T18:00:00",
  },
];

export const aiPickHandlers = [
  // ─── AI Pick ─────────────────────────────────────────────────────────────

  // POST /api/v1/ai-pick/presets
  http.post("/api/v1/ai-pick/presets", async ({ request }) => {
    const body = (await request.json()) as CreateAiPickPresetRequest;
    const situationLabel = SITUATION_TITLE_MAP[body.situation] ?? "맞춤 추천";
    const friendCount = (body.friendIds ?? []).length;
    const title =
      friendCount > 0
        ? `다원님 외 ${friendCount}명과 함께하는 ${situationLabel}`
        : `나를 위한 ${situationLabel}`;

    return HttpResponse.json(
      {
        presetId: crypto.randomUUID(),
        title,
        aiMessage: `Findish AI가 ${situationLabel}에 딱 맞는 가게를 골라봤어요!`,
        restaurants: [MOCK_AIPICK_RESTAURANTS[0]],
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  }),

  // GET /api/v1/ai-pick/presets
  http.get("/api/v1/ai-pick/presets", () => {
    return HttpResponse.json({ presets: MOCK_PRESET_HISTORY });
  }),

  // GET /api/v1/ai-pick/presets/{presetId}
  http.get("/api/v1/ai-pick/presets/:presetId", ({ params }) => {
    const presetId = params.presetId as string;
    return HttpResponse.json({
      presetId,
      title: "다원님 외 3명과 함께하는 식사",
      friends: [
        { memberId: "f0000001-0000-0000-0000-000000000001", name: "다원" },
        { memberId: "f0000001-0000-0000-0000-000000000002", name: "윤서" },
      ],
      situation: "FRIEND",
      budgetMin: 10000,
      budgetMax: 38000,
      priorities: ["TASTE", "ATMOSPHERE"],
      extraCondition: "주차가 되면 좋겠어",
      aiMessage: "Findish AI가 친구들과 즐거운 한 끼를 위한 가게를 골라봤어요!",
      restaurants: [MOCK_AIPICK_RESTAURANTS[0]],
      createdAt: "2026-05-01T10:00:00",
    });
  }),

  // PATCH /api/v1/ai-pick/presets/{presetId}
  http.patch("/api/v1/ai-pick/presets/:presetId", async ({ request, params }) => {
    const presetId = params.presetId as string;
    const body = (await request.json()) as UpdateAiPickPresetRequest;
    const situationLabel = body.situation
      ? SITUATION_TITLE_MAP[body.situation]
      : "업데이트된 추천";

    return HttpResponse.json({
      presetId,
      title: `(수정됨) ${situationLabel}`,
      aiMessage: "변경된 조건으로 재추천했어요!",
      restaurants: MOCK_AIPICK_RESTAURANTS,
      updatedAt: new Date().toISOString(),
    });
  }),

  // ─── Friend ──────────────────────────────────────────────────────────────

  // GET /api/v1/friends
  http.get("/api/v1/friends", () => {
    return HttpResponse.json({ friends: MOCK_FRIENDS });
  }),

  // GET /api/v1/friends/requests/received
  http.get("/api/v1/friends/requests/received", () => {
    return HttpResponse.json([
      {
        requestId: "340f0639-aaaa-bbbb-cccc-111111111111",
        senderId: "602f0c10-aaaa-bbbb-cccc-222222222222",
        senderName: "민지",
        senderLoginId: "minji03",
        requestedAt: "2026-05-18T14:22:00",
      },
      {
        requestId: "340f0639-aaaa-bbbb-cccc-333333333333",
        senderId: "602f0c10-aaaa-bbbb-cccc-444444444444",
        senderName: "윤서",
        senderLoginId: "yunseo02",
        requestedAt: "2026-05-19T09:10:00",
      },
    ]);
  }),

  // POST /api/v1/friends/requests
  http.post("/api/v1/friends/requests", async ({ request }) => {
    const { loginId } = (await request.json()) as { loginId: string };
    return HttpResponse.json(
      { requestId: crypto.randomUUID(), toName: loginId, status: "PENDING" },
      { status: 201 },
    );
  }),

  // PATCH /api/v1/friends/requests/{requestId}
  http.patch("/api/v1/friends/requests/:requestId", async ({ request, params }) => {
    const requestId = Number(params.requestId);
    const { status } = (await request.json()) as ResolveFriendRequestBody;
    return HttpResponse.json({ requestId, status });
  }),

  // DELETE /api/v1/friends/{memberId}
  http.delete("/api/v1/friends/:memberId", () => {
    return HttpResponse.json({ message: "친구가 삭제되었습니다." });
  }),
];
