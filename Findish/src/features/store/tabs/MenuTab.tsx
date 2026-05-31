import { useState } from "react";
import MenuItem from "@/components/common/MenuItem";
import { useRestaurantMenusQuery } from "@/hooks/useRestaurant";
import { useAddToCartMutation } from "@/hooks/useCart";
import type { MenuItem as MenuItemType } from "@/types/restaurant";

interface MenuTabProps {
  restaurantId: string;
}

export default function MenuTab({ restaurantId }: MenuTabProps) {
  const { data, isLoading, isError } = useRestaurantMenusQuery(restaurantId);
  const { mutate: addToCart } = useAddToCartMutation();
  const [addingName, setAddingName] = useState<string | null>(null);

  const handleAdd = (m: MenuItemType) => {
    const key = m.name ?? "";
    setAddingName(key);
    addToCart(
      {
        naverPlaceId: restaurantId,
        menuName: m.name ?? "",
        price: Number(m.price?.replace(/[^0-9]/g, "") || 0),
        quantity: 1,
        imageUrl: m.imageUrl,
      },
      { onSettled: () => setAddingName(null) },
    );
  };

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
      {data?.data?.map((m, i) => (
        <MenuItem
          key={m.name ?? i}
          name={m.name ?? ""}
          price={Number(m.price?.replace(/[^0-9]/g, "") || 0)}
          imageUrl={m.imageUrl}
          isAdding={addingName === (m.name ?? "")}
          onAdd={() => handleAdd(m)}
        />
      ))}
    </div>
  );
}
