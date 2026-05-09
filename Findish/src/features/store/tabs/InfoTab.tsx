import PhoneIcon from "@/assets/icons/review/phone.svg?react";
import LocationIcon from "@/assets/icons/review/location.svg?react";

interface InfoTabProps {
  parking: boolean;
  wheelchair: boolean;
  noKids: boolean;
  noPets: boolean;
}

export default function InfoTab({ parking, wheelchair, noKids, noPets }: InfoTabProps) {
  const facilities = [
    { label: parking ? "주차 가능" : "주차 불가능", positive: parking },
    { label: wheelchair ? "휠체어 접근 가능" : "휠체어 접근 불가능", positive: wheelchair },
    { label: noKids ? "노키즈존" : "노키즈존 아님", positive: !noKids },
    { label: noPets ? "반려동물 동반 불가" : "반려동물 동반 가능", positive: !noPets },
  ];

  return (
    <div className="flex flex-col p-4">
      <h3 className="typo-body-md font-bold text-neutral-900 mb-4">가게 정보</h3>
      <div className="flex flex-col gap-5">
        {/* 주소 */}
        <div className="flex items-start gap-2">
          <LocationIcon className="shrink-0 mt-0.5" />
          <div>
            <p className="typo-body-sm font-bold text-neutral-400">주소</p>
            <p className="typo-body-sm text-neutral-900 mt-1">서울 성북구 삼선교로 55</p>
          </div>
        </div>

        {/* 전화번호 */}
        <div className="flex items-start gap-2">
          <PhoneIcon className="shrink-0 mt-0.5" />
          <div>
            <p className="typo-body-sm font-bold text-neutral-400">전화번호</p>
            <p className="typo-body-sm text-neutral-900 mt-1">02-1234-1234</p>
          </div>
        </div>
      </div>

      <div className="my-5 border-t border-neutral-100" />

      <h3 className="typo-body-md font-bold text-neutral-900 mb-4">편의 시설</h3>
      <div className="flex flex-col gap-3.5">
        {facilities.map(({ label, positive }) => (
          <span key={label} className={`typo-caption font-bold ${positive ? "text-success" : "text-error-dark"}`}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
