import { useEffect, useRef, useState } from "react";
import MenuItem from "@/components/common/MenuItem";
import Toast from "@/components/common/Toast";
import { useRestaurantMenusQuery } from "@/hooks/useRestaurant";
import { useAddToCartMutation } from "@/hooks/useCart";
import type { MenuItem as MenuItemType } from "@/types/restaurant";
import type { AxiosError } from "axios";

interface MenuTabProps {
  restaurantId: string;
}

export default function MenuTab({ restaurantId }: MenuTabProps) {
  const { data, isLoading, isError } = useRestaurantMenusQuery(restaurantId);
  const { mutate: addToCart } = useAddToCartMutation();
  const [addingName, setAddingName] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; showCartButton: boolean } | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (message: string, showCartButton = true) => {
    setToast({ message, showCartButton });
    setToastVisible(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 3000);
  };

  const handleAdd = (m: MenuItemType) => {
    const key = m.name ?? "";
    setAddingName(key);
    addToCart(
      {
        naverPlaceId: restaurantId,
        menuName: m.name ?? "",
        price: m.price ?? 0,
        quantity: 1,
        imageUrl: m.imageUrl,
      },
      {
        onSuccess: () => {
          showToast(`${m.name ?? "메뉴"}을(를) 담았어요.`);
        },
        onSettled: () => setAddingName(null),
        onError: (error: Error) => {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 409) {
            showToast("이미 다른 가게의 메뉴가 담겨있어요.");
          }
        },
      },
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
    <>
      <div className="flex flex-col gap-3 p-4">
        {(data?.data?.menus ?? []).map((m, i) => (
          <MenuItem
            key={m.name ?? i}
            name={m.name ?? ""}
            price={m.price ?? 0}
            imageUrl={m.imageUrl}
            isAdding={addingName === (m.name ?? "")}
            onAdd={() => handleAdd(m)}
          />
        ))}
      </div>
      {toast && <Toast message={toast.message} visible={toastVisible} showCartButton={toast.showCartButton} />}
    </>
  );
}
