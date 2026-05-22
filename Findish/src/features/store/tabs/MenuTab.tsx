import { useState } from "react";
import MenuItem from "@/components/common/MenuItem";
import { useRestaurantMenusQuery } from "@/hooks/useRestaurant";
import { useAddToCartMutation } from "@/hooks/useCart";

interface MenuTabProps {
  restaurantId: string;
}

export default function MenuTab({ restaurantId }: MenuTabProps) {
  const { data, isLoading, isError } = useRestaurantMenusQuery(restaurantId);
  const { mutate: addToCart } = useAddToCartMutation();
  const [addingMenuId, setAddingMenuId] = useState<string | null>(null);

  const handleAdd = (menuId: string) => {
    setAddingMenuId(menuId);
    addToCart(
      { restaurantId, menuId, quantity: 1 },
      { onSettled: () => setAddingMenuId(null) },
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
      {data?.menus.map((m) => (
        <MenuItem
          key={m.menuId}
          name={m.name}
          price={m.price}
          imageUrl={m.imageUrl}
          isAdding={addingMenuId === m.menuId}
          onAdd={() => handleAdd(m.menuId)}
        />
      ))}
    </div>
  );
}
