declare namespace naver.maps {
  class Map {
    constructor(element: HTMLElement | string, options?: MapOptions);
    setCenter(latlng: LatLng): void;
    setZoom(zoom: number, useEffect?: boolean): void;
    getZoom(): number;
    panTo(latlng: LatLng): void;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  class Point {
    constructor(x: number, y: number);
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    addListener(event: string, handler: () => void): void;
  }

  interface MapOptions {
    center?: LatLng;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    zoomControl?: boolean;
    mapDataControl?: boolean;
    scaleControl?: boolean;
    scrollWheel?: boolean;
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map;
    title?: string;
    icon?: MarkerIcon;
  }

  interface MarkerIcon {
    content: string;
    anchor?: Point;
  }
}

interface Window {
  naver: typeof naver;
}
