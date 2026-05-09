import { type StoreCardData } from "@/components/common/StoreCard";
import PinNamed from "@/components/common/PinNamed";
import MAP_BG from "@/assets/map_bg.png";

interface MapViewProps {
  restaurants: StoreCardData[];
  pinPositions: Record<number, { left: string; top: string }>;
  selectedId: number | null;
  onPinClick: (id: number) => void;
  searched: boolean;
}

export default function MapView({ restaurants, pinPositions, selectedId, onPinClick, searched }: MapViewProps) {
  return (
    <div
      className="absolute inset-0 pt-17"
      style={{
        backgroundImage: `url(${MAP_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {searched &&
        restaurants.map((r) => {
          const pos = pinPositions[r.id];
          return (
            <PinNamed
              key={r.id}
              name={r.name}
              rating={r.rating}
              imageUrl={r.imageUrl}
              isSelected={selectedId === r.id}
              onClick={() => onPinClick(r.id)}
              style={{ left: pos.left, top: pos.top }}
            />
          );
        })}
    </div>
  );
}
