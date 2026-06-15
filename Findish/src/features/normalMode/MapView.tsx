import { useEffect, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { type StoreCardData } from "@/components/common/StoreCard";
import PinNamed from "@/components/common/PinNamed";

interface MapViewProps {
  restaurants: StoreCardData[];
  selectedId: string | null;
  onPinClick: (id: string) => void;
  searched: boolean;
  pinnedStore?: StoreCardData | null;
}

function pinHtml(name: string, imageUrl: string | undefined, isSelected: boolean): string {
  return renderToStaticMarkup(
    <PinNamed
      name={name}
      imageUrl={imageUrl}
      isSelected={isSelected}
      style={{ position: "relative", transform: "none" }}
    />
  );
}

export default function MapView({
  restaurants,
  selectedId,
  onPinClick,
  searched,
  pinnedStore,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const pinnedMarkerRef = useRef<naver.maps.Marker | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    mapRef.current = new naver.maps.Map(container, {
      center: new naver.maps.LatLng(37.582, 127.008),
      zoom: 15,
      zoomControl: false,
      mapDataControl: false,
      scaleControl: false,
      scrollWheel: false,
    });

    // 누적 delta가 임계값을 넘어야 한 단계 줌 (기본 대비 ~3배 둔감)
    let accumulated = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const map = mapRef.current;
      if (!map) return;
      // ctrlKey=true: 트랙패드 핀치 (작은 delta) → 낮은 임계값
      const threshold = e.ctrlKey ? 80 : 300;
      accumulated += e.deltaY;
      const steps = Math.trunc(accumulated / threshold);
      if (steps !== 0) {
        map.setZoom(map.getZoom() - steps, true);
        accumulated -= steps * threshold;
      }
    };
    container.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeAttribute("style");
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    pinnedMarkerRef.current?.setMap(null);
    pinnedMarkerRef.current = null;

    if (!pinnedStore || pinnedStore.lat == null || pinnedStore.lng == null) return;

    const isSelected = selectedId === pinnedStore.id;
    const alreadyInResults = searched && restaurants.some((r) => r.id === pinnedStore.id);
    if (alreadyInResults) return;

    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(pinnedStore.lat, pinnedStore.lng),
      map,
      title: pinnedStore.name,
      icon: {
        content: pinHtml(pinnedStore.name, pinnedStore.imageUrl, isSelected),
        anchor: new naver.maps.Point(48, 111),
      },
    });
    marker.addListener("click", () => onPinClick(pinnedStore.id));
    pinnedMarkerRef.current = marker;

    map.setCenter(new naver.maps.LatLng(pinnedStore.lat, pinnedStore.lng));
  }, [pinnedStore, selectedId, searched, restaurants, onPinClick]);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    if (!searched) return;

    restaurants.forEach((r) => {
      if (r.lat == null || r.lng == null) return;
      const isSelected = selectedId === r.id;

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(r.lat, r.lng),
        map: mapRef.current!,
        title: r.name,
        icon: {
          content: pinHtml(r.name, r.imageUrl, isSelected),
          anchor: new naver.maps.Point(48, 111),
        },
      });

      marker.addListener("click", () => onPinClick(r.id));
      markersRef.current.push(marker);
    });
  }, [searched, restaurants, selectedId, onPinClick]);

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 top-17 h-[calc(100vh-68px)]"
    />
  );
}
