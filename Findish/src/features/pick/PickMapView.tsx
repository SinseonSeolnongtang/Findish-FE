import { useEffect, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { type Restaurant } from "@/features/pick/types";
import PinNamed from "@/components/common/PinNamed";

interface Props {
  restaurant: Restaurant | null;
  showPin: boolean;
}

function pinHtml(name: string, imageUrl: string): string {
  return renderToStaticMarkup(
    <PinNamed
      name={name}
      imageUrl={imageUrl}
      isSelected
      style={{ position: "relative", transform: "none" }}
    />
  );
}

export default function PickMapView({ restaurant, showPin }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);

  // 지도 초기화 (마운트 시 1회)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    mapRef.current = new naver.maps.Map(container, {
      center: new naver.maps.LatLng(37.5820, 127.0080),
      zoom: 16,
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
      // Naver Maps가 주입한 인라인 스타일 제거 (StrictMode 대응)
      container.removeAttribute("style");
      mapRef.current = null;
    };
  }, []);

  // 레스토랑 변경 또는 핀 표시 여부 변경 시 마커 업데이트
  useEffect(() => {
    if (!mapRef.current) return;

    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }

    if (!showPin || !restaurant || restaurant.lat == null || restaurant.lng == null) return;

    const position = new naver.maps.LatLng(restaurant.lat, restaurant.lng);
    mapRef.current.panTo(position);

    markerRef.current = new naver.maps.Marker({
      position,
      map: mapRef.current,
      icon: {
        content: pinHtml(restaurant.name, restaurant.imageUrl),
        // 핀 삼각형 끝(tip) 위치: x=46(핀 바디 중앙), y=120(삼각형 하단)
        anchor: new naver.maps.Point(48, 111),
      },
    });
  }, [restaurant, showPin]);

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 top-17 h-[calc(100vh-68px)]"
    />
  );
}
