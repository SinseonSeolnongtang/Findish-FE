import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";

const RESTAURANT_IMG =
  "https://images.unsplash.com/photo-1544025162-d76594e8c5f9?w=400&q=80";

const RESTAURANTS = [
  { name: "착한돼지집", sub: "이화여자대학교 근기기", img: RESTAURANT_IMG },
  { name: "착한돼지집", sub: "나쁜대학교 근처", img: RESTAURANT_IMG },
  { name: "착한돼지집", sub: "착쁜대학교 근처기기", img: RESTAURANT_IMG },
];

interface BarItem {
  label: string;
  items: { name: string; positive: number; negative: number }[];
}

const COMMON_BARS: BarItem[] = [
  {
    label: "청결도",
    items: [
      { name: "착한돼지집", positive: 90, negative: 10 },
      { name: "나쁜돼지집", positive: 70, negative: 30 },
      { name: "착쁜돼지집", positive: 100, negative: 0 },
    ],
  },
  {
    label: "청결도",
    items: [
      { name: "착한돼지집", positive: 90, negative: 10 },
      { name: "나쁜돼지집", positive: 70, negative: 30 },
      { name: "착쁜돼지집", positive: 100, negative: 0 },
    ],
  },
  {
    label: "청결도",
    items: [
      { name: "착한돼지집", positive: 90, negative: 10 },
      { name: "나쁜돼지집", positive: 70, negative: 30 },
      { name: "착쁜돼지집", positive: 100, negative: 0 },
    ],
  },
  {
    label: "청결도",
    items: [
      { name: "착한돼지집", positive: 90, negative: 10 },
      { name: "나쁜돼지집", positive: 70, negative: 30 },
      { name: "착쁜돼지집", positive: 100, negative: 0 },
    ],
  },
  {
    label: "청결도",
    items: [
      { name: "착한돼지집", positive: 90, negative: 10 },
      { name: "나쁜돼지집", positive: 70, negative: 30 },
      { name: "착쁜돼지집", positive: 100, negative: 0 },
    ],
  },
  {
    label: "청결도",
    items: [
      { name: "착한돼지집", positive: 90, negative: 10 },
      { name: "나쁜돼지집", positive: 70, negative: 30 },
      { name: "착쁜돼지집", positive: 100, negative: 0 },
    ],
  },
];

const LEGEND_ITEMS = [
  { color: "#22C55E", label: "감자" },
  { color: "#FF6900", label: "감자" },
];

function BarGroup({ data }: { data: BarItem }) {
  const colors = ["#FF6900", "#FACC15", "#22C55E"];
  return (
    <div className="mb-4">
      <p className="text-[13px] font-bold text-neutral-800 mb-1">
        {data.label}
      </p>
      {data.items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span className="text-[11px] text-neutral-600 w-20 shrink-0 truncate">
            {item.name}
          </span>
          <div className="flex-1 h-3 rounded-full overflow-hidden bg-[#E5E7EB] relative">
            <div
              className="h-full rounded-full"
              style={{ width: `${item.positive}%`, backgroundColor: colors[i] }}
            />
          </div>
          {item.negative > 0 && (
            <span className="typo-micro text-neutral-400 w-8 text-right">
              {item.negative}%
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ComparePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header isLoggedIn />

      <main className="pt-17 max-w-225 mx-auto px-8 py-8">
        {/* 뒤로가기 */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-[15px] text-neutral-600 hover:text-primary transition-colors m-4 cursor-pointer"
        >
          ← 뒤로가기
        </button>

        {/* 레스토랑 3개 카드 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {RESTAURANTS.map((r, i) => (
            <div
              key={i}
              className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm"
            >
              <div className="w-full h-30 overflow-hidden">
                <img
                  src={r.img}
                  alt={r.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-[14px] font-bold text-neutral-800">
                  {r.name}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">{r.sub}</p>

                {/* 청결도 바 */}
                <div className="mt-2">
                  <div className="flex items-center justify-between typo-micro text-neutral-600 mb-1">
                    <span>청결도</span>
                    <span className="text-primary">90%</span>
                    <span className="text-neutral-400">10%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-[#E5E7EB]">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: "90%" }}
                    />
                  </div>
                </div>
                <div className="mt-1">
                  <div className="h-2 rounded-full overflow-hidden bg-[#E5E7EB]">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: "90%" }}
                    />
                  </div>
                </div>

                {/* 범례 */}
                <div className="flex items-center gap-3 mt-2">
                  {LEGEND_ITEMS.map((l, j) => (
                    <div key={j} className="flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: l.color }}
                      />
                      <span className="typo-micro text-neutral-600">
                        {l.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 공통점 / 트레이드오프 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 공통점 */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
            <h2 className="text-[20px] font-bold text-[#22C55E] mb-4">
              공통점
            </h2>
            {COMMON_BARS.map((bar, i) => (
              <BarGroup key={i} data={bar} />
            ))}
          </div>

          {/* 트레이드오프 */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
            <h2 className="text-[20px] font-bold text-primary mb-4">
              트레이드 오프
            </h2>
            {COMMON_BARS.map((bar, i) => (
              <BarGroup key={i} data={bar} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
