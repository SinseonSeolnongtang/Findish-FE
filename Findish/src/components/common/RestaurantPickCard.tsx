import Keyword from "@/components/common/Keyword";
import StarFilled from "@/assets/icons/common/star_filled.svg?react";

export interface KeywordBarItem {
  keyword: string;
  barRatio: number;
  displayLabel: string;
}

interface Props {
  name?: string;
  category?: string;
  address?: string | null;
  thumbnailUrl?: string;
  rank: number;
  color: string;
  onClick?: () => void;
  parking?: boolean;
  groupSeating?: boolean;
  reviewCount?: number | null;
  priceRange?: string | null;
  matchScore?: number | null;
  personaLabel?: string | null;
  matchedKeywords?: string[];
  keywordBars?: KeywordBarItem[];
  keywordTags?: string[];
}

export default function RestaurantPickCard({
  name,
  category,
  address,
  thumbnailUrl,
  rank,
  color,
  onClick,
  parking,
  groupSeating,
  reviewCount,
  priceRange,
  matchScore,
  personaLabel,
  matchedKeywords,
  keywordBars,
  keywordTags,
}: Props) {
  const showInfoBadges =
    parking != null || groupSeating != null || reviewCount != null || priceRange != null;

  return (
    <div
      className="w-full bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden"
      style={{ cursor: onClick ? "pointer" : undefined }}
      onClick={onClick}
    >
      {/* 썸네일 */}
      <div className="relative h-36">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
            <span className="typo-caption text-neutral-400">이미지 없음</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

        {/* 순위 배지 */}
        <div
          className="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-white font-bold typo-caption"
          style={{ backgroundColor: color }}
        >
          {rank}
        </div>

        {/* matchScore 배지 */}
        {matchScore != null && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white rounded-full px-2.5 py-0.5 flex items-center gap-1">
            <StarFilled width={10} height={10} fill="#FFD700" />
            <span className="text-[10px] font-semibold">{matchScore.toFixed(3)}</span>
          </div>
        )}

        {/* 이름 + 카테고리 + 주소 */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end gap-2 flex-wrap">
            <h3 className="typo-t1 font-bold text-white leading-tight">{name}</h3>
            {category && (
              <span className="typo-caption text-white/80 mb-0.5 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                {category}
              </span>
            )}
          </div>
          {address && (
            <p className="typo-caption text-white/70 mt-1 flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 shrink-0">
                <path
                  fillRule="evenodd"
                  d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-2.003 3.5-4.697 3.5-8.327a8.25 8.25 0 0 0-16.5 0c0 3.63 1.556 6.324 3.5 8.327a19.58 19.58 0 0 0 2.683 2.282 16.975 16.975 0 0 0 1.144.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  clipRule="evenodd"
                />
              </svg>
              {address}
            </p>
          )}
        </div>
      </div>

      {/* 정보 배지 */}
      {showInfoBadges && (
        <div className="px-4 pt-3 pb-1 flex flex-wrap gap-2">
          {parking === true && (
            <span className="flex items-center gap-1 typo-caption bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
              </svg>
              주차 가능
            </span>
          )}
          {parking === false && (
            <span className="flex items-center gap-1 typo-caption bg-neutral-50 text-neutral-400 px-2.5 py-1 rounded-full border border-neutral-200">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
              </svg>
              주차 불가
            </span>
          )}
          {groupSeating === true && (
            <span className="flex items-center gap-1 typo-caption bg-green-50 text-green-600 px-2.5 py-1 rounded-full border border-green-100">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
              </svg>
              단체석 가능
            </span>
          )}
          {groupSeating === false && (
            <span className="flex items-center gap-1 typo-caption bg-neutral-50 text-neutral-400 px-2.5 py-1 rounded-full border border-neutral-200">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
              </svg>
              단체석 없음
            </span>
          )}
          {reviewCount != null && (
            <span className="flex items-center gap-1 typo-caption bg-neutral-50 text-neutral-500 px-2.5 py-1 rounded-full border border-neutral-200">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path
                  fillRule="evenodd"
                  d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                  clipRule="evenodd"
                />
              </svg>
              리뷰 {reviewCount}건
            </span>
          )}
          {priceRange && (
            <span className="flex items-center gap-1 typo-caption bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full border border-amber-100">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
                  clipRule="evenodd"
                />
              </svg>
              {priceRange}
            </span>
          )}
        </div>
      )}

      {/* 식당 페르소나 */}
      {personaLabel && (
        <div className="px-4 pt-3 pb-1">
          <span className="inline-flex items-center gap-1 typo-caption font-semibold text-primary bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">
            <span className="text-[10px]">✦</span>
            {personaLabel}
          </span>
        </div>
      )}

      {/* 매칭 키워드 칩 */}
      {matchedKeywords && matchedKeywords.length > 0 && (
        <div className="px-4 pt-2 pb-1">
          <p className="typo-caption text-neutral-400 mb-1.5">매칭 키워드</p>
          <div className="flex flex-wrap gap-1.5">
            {matchedKeywords.map((kw) => (
              <Keyword key={kw} label={kw} />
            ))}
          </div>
        </div>
      )}

      {/* 키워드 태그 (태그 모드) */}
      {keywordTags && keywordTags.length > 0 && (
        <div className="px-4 pt-2 pb-4">
          <p className="typo-caption text-neutral-400 mb-1.5">주요 키워드</p>
          <div className="flex flex-wrap gap-1.5">
            {keywordTags.map((tag) => (
              <Keyword key={tag} label={tag} />
            ))}
          </div>
        </div>
      )}

      {/* 키워드 바 차트 (바 모드) */}
      {keywordBars && keywordBars.length > 0 && (
        <div className="px-4 pt-2 pb-4">
          <p className="typo-caption text-neutral-400 mb-2">주요 키워드</p>
          <div className="space-y-2">
            {keywordBars.map((kw) => (
              <div key={kw.keyword} className="flex items-center gap-2">
                <span className="typo-caption text-neutral-500 w-14 shrink-0 truncate text-right">
                  {kw.keyword}
                </span>
                <div className="flex-1 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${kw.barRatio}%`, backgroundColor: color }}
                  />
                </div>
                <span className="typo-caption text-neutral-400 w-8 text-right shrink-0">
                  {kw.displayLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
