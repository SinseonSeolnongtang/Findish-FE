import { type StoreCardData } from "@/components/common/StoreCard";
import MenuItem from "@/components/common/MenuItem";
import { MOCK_MENUS } from "@/mocks/storeDetail";

interface MenuTabProps {
  store: StoreCardData;
}

export default function MenuTab({ store }: MenuTabProps) {
  return (
    <div className="flex flex-col gap-3 p-4">
      {MOCK_MENUS.map((m) => (
        <MenuItem key={m.name} name={m.name} price={m.price} imageUrl={store.imageUrl} />
      ))}
    </div>
  );
}
