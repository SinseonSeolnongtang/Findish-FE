import { useRestaurantInfoQuery } from "@/hooks/useRestaurant";
import PhoneIcon from "@/assets/icons/review/phone.svg?react";
import LocationIcon from "@/assets/icons/review/location.svg?react";

interface InfoTabProps {
  restaurantId: string;
}

export default function InfoTab({ restaurantId }: InfoTabProps) {
  const { data, isLoading, isError } = useRestaurantInfoQuery(restaurantId);

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

  return (
    <div className="flex flex-col p-4">
      <h3 className="typo-body-md font-bold text-neutral-900 mb-4">가게 정보</h3>
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-2">
          <LocationIcon className="shrink-0 mt-0.5" />
          <div>
            <p className="typo-body-sm font-bold text-neutral-400">주소</p>
            <p className="typo-body-sm text-neutral-900 mt-1">{data.address}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <PhoneIcon className="shrink-0 mt-0.5" />
          <div>
            <p className="typo-body-sm font-bold text-neutral-400">전화번호</p>
            <p className="typo-body-sm text-neutral-900 mt-1">{data.phone}</p>
          </div>
        </div>
      </div>

      <div className="my-5 border-t border-neutral-100" />

      <h3 className="typo-body-md font-bold text-neutral-900 mb-4">영업 시간</h3>
      <div className="flex flex-col gap-2 mb-5">
        {data.businessHours.map(({ day, hours, isHoliday }) => (
          <div key={day} className="flex gap-3 typo-caption">
            <span className="font-bold text-neutral-600 w-4 shrink-0">{day}</span>
            <span className={isHoliday ? "text-error-dark font-bold" : "text-neutral-900"}>
              {isHoliday ? "휴무" : hours}
            </span>
          </div>
        ))}
      </div>

      <div className="my-5 border-t border-neutral-100" />

      <h3 className="typo-body-md font-bold text-neutral-900 mb-4">편의 시설</h3>
      <div className="flex flex-col gap-3.5">
        {data.facilities.map((f) => (
          <span key={f} className="typo-caption font-bold text-neutral-700">
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
