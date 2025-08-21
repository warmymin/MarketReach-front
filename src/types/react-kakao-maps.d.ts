declare module 'react-kakao-maps' {
  import React from 'react';

  export interface KakaoMapProps {
    center: { lat: number; lng: number };
    style?: React.CSSProperties;
    level?: number;
    onClick?: (map: any, mouseEvent: any) => void;
    children?: React.ReactNode;
  }

  export interface MarkerProps {
    position: { lat: number; lng: number };
    children?: React.ReactNode;
  }

  export interface CustomOverlayProps {
    position: { lat: number; lng: number };
    children?: React.ReactNode;
  }

  export const KakaoMap: React.FC<KakaoMapProps>;
  export const Marker: React.FC<MarkerProps>;
  export const CustomOverlay: React.FC<CustomOverlayProps>;
  export const CustomOverlayWithString: React.FC<CustomOverlayProps>;
  export const usePlaceService: () => any;
}
