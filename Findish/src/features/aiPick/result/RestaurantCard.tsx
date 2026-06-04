import RestaurantPickCard from "@/components/common/RestaurantPickCard";
import type { AiPickRestaurantItem } from "@/types/aiPick";
import { RESTAURANT_COLORS } from "./constants";

interface Props {
  r: AiPickRestaurantItem;
  rank: number;
  color: (typeof RESTAURANT_COLORS)[number];
}

export default function RestaurantCard({ r, rank, color }: Props) {
  const keywords = r.evidence?.keywords ?? [];
  const maxMentions = keywords.length > 0 ? Math.max(...keywords.map((k) => k.total_mentions)) : 1;

  return (
    <RestaurantPickCard
      name={r.name}
      category={r.category}
      address={r.address}
      thumbnailUrl={r.thumbnailUrl}
      rank={rank}
      color={color.stroke}
      parking={r.parking}
      groupSeating={r.groupSeating}
      reviewCount={r.reviewCount}
      priceRange={r.priceRange ?? undefined}
      matchScore={r.evidence?.matchScore}
      personaLabel={r.evidence?.restaurantPersona?.label}
      matchedKeywords={r.evidence?.matchedKeywords}
      keywordBars={[...keywords]
        .sort((a, b) => b.total_mentions - a.total_mentions)
        .slice(0, 6)
        .map((kw) => ({
          keyword: kw.keyword,
          barRatio: (kw.total_mentions / maxMentions) * 100,
          displayLabel: String(kw.total_mentions),
        }))}
    />
  );
}
