import MenuItem from "@/components/common/MenuItem";
import { useRestaurantMenusQuery } from "@/hooks/useRestaurant";

interface MenuTabProps {
  restaurantId: number;
}

export default function MenuTab({ restaurantId }: MenuTabProps) {
  const { data, isLoading, isError } = useRestaurantMenusQuery(restaurantId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-neutral-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="p-4 typo-caption text-neutral-400">
        메뉴 정보를 불러오지 못했습니다.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      {data?.menus.map((m) => (
        <MenuItem key={m.menuId} name={m.name} price={m.price} imageUrl={m.imageUrl} />
      ))}
    </div>
  );
}
