'use client';

import React, { useEffect, useRef, useState } from 'react';

const DebugMapPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string>('초기화 중...');

  useEffect(() => {
    console.log('=== 디버그 시작 ===');
    console.log('1. 컴포넌트 마운트됨');
    console.log('2. window 객체:', typeof window);
    console.log('3. document 객체:', typeof document);
    console.log('4. mapRef.current:', mapRef.current);
    
    if (typeof window === 'undefined') {
      setStatus('서버 사이드에서 실행 중');
      return;
    }

    // Kakao Maps 공식 방식으로 로드
    const script = document.createElement('script');
    script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=7129a6af85bdf28f0c5c1733ea1afb07&autoload=false';
    script.async = false;
    
    script.onload = () => {
      console.log('5. 스크립트 로드 성공');
      setStatus('스크립트 로드 성공');
      
      // Kakao Maps SDK 로드
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          console.log('6. Kakao Maps SDK 로드 완료');
          setStatus('SDK 로드 완료');
          
          // 지도 생성 시도
          setTimeout(() => {
            try {
              console.log('7. kakao 객체:', window.kakao);
              console.log('8. kakao.maps:', window.kakao?.maps);
              console.log('9. mapRef.current:', mapRef.current);
              
              if (!mapRef.current) {
                console.log('10. mapRef가 null입니다');
                setStatus('mapRef가 null입니다');
                return;
              }
              
              console.log('11. kakao.maps.Map:', window.kakao.maps.Map);
              console.log('12. kakao.maps.LatLng:', window.kakao.maps.LatLng);
              
              // 더 안전한 방법으로 지도 생성
              const center = new window.kakao.maps.LatLng(37.5665, 126.9780);
              console.log('13. center 생성됨:', center);
              
              const options = {
                center: center,
                level: 3
              };
              console.log('14. options:', options);
              
              const map = new window.kakao.maps.Map(mapRef.current, options);
              
              console.log('15. 지도 생성 성공:', map);
              setStatus('지도 생성 성공!');
            } catch (error) {
              console.error('15. 지도 생성 실패:', error);
              setStatus(`지도 생성 실패: ${error}`);
            }
          }, 1000);
        });
      } else {
        console.error('5. kakao 객체를 찾을 수 없습니다');
        setStatus('kakao 객체를 찾을 수 없습니다');
      }
    };
    
    script.onerror = (error) => {
      console.error('5. 스크립트 로드 실패:', error);
      setStatus('스크립트 로드 실패');
    };
    
    document.head.appendChild(script);
    console.log('4. 스크립트 태그 추가됨');
    
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Kakao Maps 디버그</h1>
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p><strong>상태:</strong> {status}</p>
        <p><strong>API 키:</strong> 7129a6af85bdf28f0c5c1733ea1afb07</p>
        <p><strong>도메인:</strong> {typeof window !== 'undefined' ? window.location.hostname : 'loading...'}</p>
      </div>
      <div 
        ref={mapRef} 
        style={{ 
          width: '600px', 
          height: '400px', 
          border: '2px solid red',
          backgroundColor: '#f0f0f0'
        }}
      >
        지도가 여기에 표시됩니다...
      </div>
    </div>
  );
};

export default DebugMapPage;
