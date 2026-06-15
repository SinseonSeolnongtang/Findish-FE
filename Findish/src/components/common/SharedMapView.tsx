import { useEffect, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { StoreCardData } from "@/components/common/StoreCard";
import PinNamed from "@/components/common/PinNamed";
import type { Restaurant } from "@/features/pick/types";

interface SharedMapViewProps {
  mode: "normal" | "pick";
  // normal mode
  restaurants?: StoreCardData[];
  selectedId?: string | null;
  onPinClick?: (id: string) => void;
  searched?: boolean;
  pinnedStore?: StoreCardData | null;
  // pick mode
  pickRestaurant?: Restaurant | null;
  showPickPin?: boolean;
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

export default function SharedMapView({
  mode,
  restaurants = [],
  selectedId = null,
  onPinClick,
  searched = false,
  pinnedStore = null,
  pickRestaurant = null,
  showPickPin = false,
}: SharedMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const normalMarkersRef = useRef<naver.maps.Marker[]>([]);
  const pinnedMarkerRef = useRef<naver.maps.Marker | null>(null);
  const pickMarkerRef = useRef<naver.maps.Marker | null>(null);

  // 지도 초기화 (마운트 시 1회)
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

    let accumulated = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const map = mapRef.current;
      if (!map) return;
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

  // 일반 모드: 검색 결과 마커 관리
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    normalMarkersRef.current.forEach((m) => m.setMap(null));
    normalMarkersRef.current = [];

    if (mode !== "normal" || !searched) return;

    restaurants.forEach((r) => {
      if (r.lat == null || r.lng == null) return;
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(r.lat, r.lng),
        map,
        title: r.name,
        icon: {
          content: pinHtml(r.name, r.imageUrl, selectedId === r.id),
          anchor: new naver.maps.Point(48, 111),
        },
      });
      marker.addListener("click", () => onPinClick?.(r.id));
      normalMarkersRef.current.push(marker);
    });
  }, [mode, searched, restaurants, selectedId, onPinClick]);

  // 일반 모드: 딥링크 핀드 스토어 마커 관리
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    pinnedMarkerRef.current?.setMap(null);
    pinnedMarkerRef.current = null;

    if (mode !== "normal") return;
    if (!pinnedStore || pinnedStore.lat == null || pinnedStore.lng == null) return;

    const alreadyInResults = searched && restaurants.some((r) => r.id === pinnedStore.id);
    if (alreadyInResults) return;

    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(pinnedStore.lat, pinnedStore.lng),
      map,
      title: pinnedStore.name,
      icon: {
        content: pinHtml(pinnedStore.name, pinnedStore.imageUrl, selectedId === pinnedStore.id),
        anchor: new naver.maps.Point(48, 111),
      },
    });
    marker.addListener("click", () => onPinClick?.(pinnedStore.id));
    pinnedMarkerRef.current = marker;
    map.setCenter(new naver.maps.LatLng(pinnedStore.lat, pinnedStore.lng));
  }, [mode, pinnedStore, selectedId, searched, restaurants, onPinClick]);

  // 선택 모드: 단일 마커 관리
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    pickMarkerRef.current?.setMap(null);
    pickMarkerRef.current = null;

    if (mode !== "pick") return;
    if (!showPickPin || !pickRestaurant || pickRestaurant.lat == null || pickRestaurant.lng == null) return;

    const position = new naver.maps.LatLng(pickRestaurant.lat, pickRestaurant.lng);
    map.panTo(position);

    pickMarkerRef.current = new naver.maps.Marker({
      position,
      map,
      icon: {
        content: pinHtml(pickRestaurant.name, pickRestaurant.imageUrl, true),
        anchor: new naver.maps.Point(48, 111),
      },
    });
  }, [mode, pickRestaurant, showPickPin]);

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 top-17 h-[calc(100vh-68px)]"
    />
  );
}
