import { useRestaurantInfoQuery } from "@/hooks/useRestaurant";
import LocationIcon from "@/assets/icons/review/location.svg?react";

interface InfoTabProps {
  restaurantId: string;
}

interface BusinessHour {
  day: string;
  hours: string;
  is_24h: boolean;
  breaktime: string | null;
  is_closed: boolean;
}

function parseBusinessHours(raw: string): BusinessHour[] {
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default function InfoTab({ restaurantId }: InfoTabProps) {
  const { data: response, isLoading, isError } = useRestaurantInfoQuery(restaurantId);
  const data = response?.data;

  if (isLoading) {
    return (
      <div className="p-4 flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-5 rounded bg-neutral-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="p-4 typo-caption text-neutral-400">
        가게 정보를 불러오지 못했습니다.
      </p>
    );
  }

  const businessHours = data.businessHours ? parseBusinessHours(data.businessHours) : [];

  const facilities = [
    { label: "주차", available: data.parking },
    { label: "단체석", available: data.groupSeating },
  ];

  return (
    <div className="flex flex-col p-4">
      <h3 className="typo-body-md font-bold text-neutral-900 mb-4">가게 정보</h3>
      <div className="flex flex-col gap-5">
        {data.address && (
          <div className="flex items-start gap-2">
            <LocationIcon className="shrink-0 mt-0.5" />
            <div>
              <p className="typo-body-sm font-bold text-neutral-400">주소</p>
              <p className="typo-body-sm text-neutral-900 mt-1">{data.address}</p>
            </div>
          </div>
        )}
      </div>

      {businessHours.length > 0 && (
        <>
          <div className="my-5 border-t border-neutral-100" />
          <h3 className="typo-body-md font-bold text-neutral-900 mb-4">영업 시간</h3>
          <div className="flex flex-col gap-3">
            {businessHours.map((item) => (
              <div key={item.day} className="flex gap-4">
                <span className="typo-body-sm font-bold text-neutral-500 w-4 shrink-0">
                  {item.day}
                </span>
                <div className="flex flex-col gap-0.5">
                  {item.is_closed ? (
                    <span className="typo-body-sm text-neutral-400">휴무</span>
                  ) : item.is_24h ? (
                    <span className="typo-body-sm text-neutral-900">24시간</span>
                  ) : (
                    <span className="typo-body-sm text-neutral-900">{item.hours}</span>
                  )}
                  {item.breaktime && (
                    <span className="typo-caption text-neutral-400">
                      브레이크타임 {item.breaktime}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <>
        <div className="my-5 border-t border-neutral-100" />
        <h3 className="typo-body-md font-bold text-neutral-900 mb-4">편의 시설</h3>
        <div className="flex flex-col gap-3.5">
          {facilities.map(({ label, available }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="typo-body-sm text-neutral-700">{label}</span>
              <span
                className={`typo-caption font-bold ${
                  available ? "text-primary-500" : "text-neutral-400"
                }`}
              >
                {available ? "가능" : "불가"}
              </span>
            </div>
          ))}
        </div>
      </>
    </div>
  );
}
