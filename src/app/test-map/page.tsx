'use client';

import React, { useEffect, useRef } from 'react';

const TestMapPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;

    const loadMap = () => {
      // 기존 스크립트 제거
      const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=7129a6af85bdf28f0c5c1733ea1afb07';
      
              script.onload = () => {
          console.log('✅ Kakao Maps SDK 로드 성공');
          console.log('🔍 API 키:', '7129a6af85bdf28f0c5c1733ea1afb07');
          console.log('🔍 현재 도메인:', window.location.hostname);
          
          // DOM이 준비된 후 지도 초기화
          setTimeout(() => {
            // DOM 요소를 직접 찾아보기
            const mapContainer = document.querySelector('[data-testid="map-container"]');
            console.log('🔍 직접 찾은 mapContainer:', mapContainer);
            console.log('🔍 mapRef.current:', mapRef.current);
            
            const container = mapRef.current || mapContainer;
            if (container) {
              const options = {
                center: new window.kakao.maps.LatLng(37.5665, 126.9780),
                level: 3
              };

              try {
                const map = new window.kakao.maps.Map(container, options);
                console.log('✅ 지도 생성 성공');
              } catch (error) {
                console.error('❌ 지도 생성 실패:', error);
              }
            } else {
              console.error('❌ 지도 컨테이너를 찾을 수 없습니다');
            }
          }, 500);
        };
      
      script.onerror = (error) => {
        console.error('❌ Kakao Maps SDK 로드 실패:', error);
        console.log('🔍 API 키:', '7129a6af85bdf28f0c5c1733ea1afb07');
        console.log('🔍 현재 도메인:', window.location.hostname);
      };
      
      document.head.appendChild(script);
    };

    // 페이지가 완전히 로드된 후 실행
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadMap);
    } else {
      loadMap();
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Kakao Maps 테스트</h1>
      <div className="mb-4">
        <p>API 키: <code>7129a6af85bdf28f0c5c1733ea1afb07</code></p>
        <p>도메인: <code>{typeof window !== 'undefined' ? window.location.hostname : 'loading...'}</code></p>
      </div>
      <div 
        ref={mapRef} 
        style={{ width: '500px', height: '400px', border: '1px solid #ccc' }}
        data-testid="map-container"
      />
    </div>
  );
};

export default TestMapPage;
