import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function MapTestPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = new naver.maps.Map(container, {
      center: new naver.maps.LatLng(37.5820, 127.0080),
      zoom: 15,
    });

    new naver.maps.Marker({
      position: new naver.maps.LatLng(37.5820, 127.0080),
      map,
      title: "테스트 마커",
    });

    return () => {
      container.removeAttribute("style");
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-neutral-200">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-neutral-500 hover:text-neutral-800"
        >
          ← 뒤로
        </button>
        <span className="text-sm font-semibold text-neutral-700">Naver Maps 연동 테스트</span>
      </div>
      <div ref={containerRef} className="flex-1" />
    </div>
  );
}
