declare global {
  interface Window {
    kakao: any;
  }
  
  const kakao: any;
}

export interface KakaoMap {
  setCenter: (latlng: KakaoLatLng) => void;
  getCenter: () => KakaoLatLng;
  addOverlay: (overlay: any) => void;
  removeOverlay: (overlay: any) => void;
  setLevel: (level: number) => void;
  getLevel: () => number;
  panTo: (latlng: KakaoLatLng) => void;
  setBounds: (bounds: KakaoLatLngBounds) => void;
  getBounds: () => KakaoLatLngBounds;
  addListener: (event: string, handler: Function) => void;
  removeListener: (event: string, handler: Function) => void;
}

export interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
  getLatLng: () => { lat: number; lng: number };
}

export interface KakaoLatLngBounds {
  getSouthWest: () => KakaoLatLng;
  getNorthEast: () => KakaoLatLng;
  getCenter: () => KakaoLatLng;
  getLatLngBounds: () => { sw: KakaoLatLng; ne: KakaoLatLng };
}

export interface KakaoMarker {
  setMap: (map: KakaoMap | null) => void;
  setPosition: (latlng: KakaoLatLng) => void;
  getPosition: () => KakaoLatLng;
}

export interface KakaoCircle {
  setMap: (map: KakaoMap | null) => void;
  setCenter: (latlng: KakaoLatLng) => void;
  setRadius: (radius: number) => void;
  getCenter: () => KakaoLatLng;
  getRadius: () => number;
}

export interface KakaoGeocoder {
  coord2Address: (
    lng: number,
    lat: number,
    callback: (result: any, status: string) => void
  ) => void;
}

export interface KakaoMapOptions {
  center: KakaoLatLng;
  level: number;
}

export interface KakaoMarkerOptions {
  position: KakaoLatLng;
  map?: KakaoMap;
}

export interface KakaoCircleOptions {
  center: KakaoLatLng;
  radius: number;
  strokeWeight: number;
  strokeColor: string;
  strokeOpacity: number;
  strokeStyle: string;
  fillColor: string;
  fillOpacity: number;
  map?: KakaoMap;
}
