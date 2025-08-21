'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Target, Users, Map, Save, ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface LocationData {
  name: string;
  lat: number;
  lng: number;
  defaultRadius: number;
}

const QUICK_LOCATIONS: LocationData[] = [
  { name: '강남역', lat: 37.498095, lng: 127.027610, defaultRadius: 1000 },
  { name: '홍대입구', lat: 37.557192, lng: 126.925382, defaultRadius: 800 },
  { name: '잠실', lat: 37.5139, lng: 127.1006, defaultRadius: 1200 },
  { name: '명동', lat: 37.5636, lng: 126.9834, defaultRadius: 600 },
  { name: '동대문', lat: 37.5665, lng: 127.0090, defaultRadius: 700 },
  { name: '서울역', lat: 37.554678, lng: 126.970606, defaultRadius: 900 },
];

const TargetingMapPage: React.FC = () => {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // 지도 상태
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 });
  const [radius, setRadius] = useState(1000);
  const [address, setAddress] = useState('');
  const [coverageArea, setCoverageArea] = useState(0);
  const [estimatedReach, setEstimatedReach] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 지도 객체 참조
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  // Kakao Maps SDK 로드
  useEffect(() => {
    const loadKakaoMap = () => {
      // 이미 로드되어 있는지 확인
      if (window.kakao && window.kakao.maps) {
        console.log('✅ Kakao Maps SDK가 이미 로드되어 있음');
        // SDK가 이미 로드되어 있으면 지도 초기화는 별도 useEffect에서 처리
        setIsLoading(false);
        return;
      }

      console.log('🔄 Kakao Maps SDK 로드 시작');
      const script = document.createElement('script');
      script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=7129a6af85bdf28f0c5c1733ea1afb07&autoload=false';
      
      script.onload = () => {
        console.log('✅ 스크립트 로드 성공');
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            console.log('✅ Kakao Maps SDK 로드 완료');
            setIsLoading(false);
          });
        }
      };
      
      script.onerror = (error) => {
        console.error('❌ 스크립트 로드 실패:', error);
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    };

    loadKakaoMap();
  }, []);

  // 지도 초기화 (컴포넌트 마운트 후 실행)
  useEffect(() => {
    if (!isLoading && mapContainerRef.current && window.kakao?.maps) {
      console.log('🗺️ 지도 초기화 시작 (마운트 후)');
      initMap();
    }
  }, [isLoading]);

  // 원 재생성 함수 (기본)
  const recreateCircle = () => {
    if (!mapRef.current || !window.kakao?.maps) return;
    
    try {
      console.log('🔄 원 재생성 시도:', { center, radius });
      
      // 기존 원 제거
      if (circleRef.current) {
        circleRef.current.setMap(null);
        console.log('✅ 기존 원 제거 완료');
      }
      
      // 새 원 생성
      const circle = new window.kakao.maps.Circle({
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        radius: radius,
        strokeWeight: 3,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
        fillColor: '#FF0000',
        fillOpacity: 0.3,
        map: mapRef.current
      });
      
      circleRef.current = circle;
      console.log('✅ 원 재생성 완료:', circle);
      console.log('원이 지도에 표시됨:', circle.getMap());
    } catch (error) {
      console.error('❌ 원 재생성 실패:', error);
    }
  };

  // 원 재생성 함수 (위치 지정)
  const recreateCircleAtPosition = (lat: number, lng: number) => {
    if (!mapRef.current || !window.kakao?.maps) return;
    
    try {
      console.log('🔄 원 재생성 시도 (위치 지정):', { lat, lng, radius });
      
      // 기존 원 제거
      if (circleRef.current) {
        circleRef.current.setMap(null);
        console.log('✅ 기존 원 제거 완료');
      }
      
      // 새 원 생성
      const circle = new window.kakao.maps.Circle({
        center: new window.kakao.maps.LatLng(lat, lng),
        radius: radius,
        strokeWeight: 3,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
        fillColor: '#FF0000',
        fillOpacity: 0.3,
        map: mapRef.current
      });
      
      circleRef.current = circle;
      console.log('✅ 원 재생성 완료 (위치 지정):', circle);
      console.log('원이 지도에 표시됨:', circle.getMap());
    } catch (error) {
      console.error('❌ 원 재생성 실패 (위치 지정):', error);
    }
  };

  // 지도 초기화
  const initMap = () => {
    console.log('🗺️ 지도 초기화 시작');
    
    try {
      const container = mapContainerRef.current!;
      console.log('컨테이너 크기:', container.offsetWidth, 'x', container.offsetHeight);
      
      const options = {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: 3
      };
      
      console.log('지도 옵션:', options);
      const map = new window.kakao.maps.Map(container, options);
      mapRef.current = map;
      console.log('✅ 지도 객체 생성 완료');
      
      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(center.lat, center.lng),
        map: map
      });
      markerRef.current = marker;
      console.log('✅ 마커 생성 완료');
      
      // 원 생성 (안전하게)
      try {
        console.log('원 생성 시도:', {
          center: { lat: center.lat, lng: center.lng },
          radius: radius,
          map: !!map
        });
        
        const circle = new window.kakao.maps.Circle({
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          radius: radius,
          strokeWeight: 3,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeStyle: 'solid',
          fillColor: '#FF0000',
          fillOpacity: 0.3,
          map: map
        });
        
        circleRef.current = circle;
        console.log('✅ 원 생성 완료:', circle);
        console.log('원이 지도에 표시됨:', circle.getMap());
        console.log('원 메서드 확인:', {
          setCenter: typeof circle.setCenter,
          setRadius: typeof circle.setRadius,
          getCenter: typeof circle.getCenter,
          getMap: typeof circle.getMap
        });
      } catch (error) {
        console.error('❌ 원 생성 실패:', error);
        circleRef.current = null;
      }
      
      // 클릭 이벤트
      window.kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
        const lat = mouseEvent.latLng.getLat();
        const lng = mouseEvent.latLng.getLng();
        
        console.log('🗺️ 지도 클릭됨:', lat, lng);
        console.log('클릭 전 center 상태:', center);
        
        // 상태 업데이트
        setCenter({ lat, lng });
        
        // 마커 업데이트
        try {
          if (markerRef.current) {
            markerRef.current.setPosition(mouseEvent.latLng);
            console.log('✅ 마커 위치 업데이트 완료');
          }
        } catch (error) {
          console.error('❌ 마커 업데이트 실패:', error);
        }
        
        // 원 자동 재생성 (클릭한 위치에 직접 생성)
        setTimeout(() => {
          console.log('원 재생성 호출 시 center 상태:', { lat, lng });
          recreateCircleAtPosition(lat, lng);
        }, 50);
        
        // 주소 조회
        updateAddress(lat, lng);
      });
      
      console.log('✅ 클릭 이벤트 등록 완료');
      console.log('✅ 지도 초기화 완료');
      
      // 초기 주소 조회
      updateAddress(center.lat, center.lng);
      
    } catch (error) {
      console.error('❌ 지도 초기화 실패:', error);
    }
  };

  // 주소 업데이트
  const updateAddress = async (lat: number, lng: number) => {
    try {
      // REST API 키로 변경 (JavaScript 키가 아닌 REST API 키 사용)
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
        {
          headers: {
            'Authorization': `KakaoAK b40c004cf9eecc7cda1ff20d114c0b11`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.documents && data.documents.length > 0) {
          setAddress(data.documents[0].address.address_name);
        } else {
          setAddress('주소를 찾을 수 없습니다.');
        }
      } else {
        console.error('주소 조회 실패:', response.status, response.statusText);
        setAddress('주소를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('주소 조회 오류:', error);
      setAddress('주소 조회 중 오류 발생');
    }
  };

  // 계산값 업데이트
  const updateCalculations = () => {
    const area = Math.PI * radius * radius;
    setCoverageArea(area);
    const reach = Math.floor(area * 800);
    setEstimatedReach(reach);
    console.log('📊 계산 업데이트:', { radius, area, reach });
  };

  // 반경 업데이트
  const handleRadiusChange = (newRadius: number) => {
    console.log('📏 반경 업데이트:', newRadius);
    setRadius(newRadius);
    
    // 원 자동 재생성 (현재 중심점에)
    setTimeout(() => {
      recreateCircleAtPosition(center.lat, center.lng);
    }, 100);
    
    updateCalculations();
  };

  // 빠른 위치 이동
  const moveToLocation = (location: LocationData) => {
    console.log('🚀 빠른 이동:', location.name, location.lat, location.lng);
    setCenter({ lat: location.lat, lng: location.lng });
    setRadius(location.defaultRadius);
    
    // 지도와 마커 업데이트
    try {
      const newLatLng = new window.kakao.maps.LatLng(location.lat, location.lng);
      
      if (mapRef.current) {
        mapRef.current.panTo(newLatLng);
        console.log('✅ 지도 이동 완료');
      }
      
      if (markerRef.current) {
        markerRef.current.setPosition(newLatLng);
        console.log('✅ 마커 이동 완료');
      }
      
      console.log('✅ 빠른 이동 완료');
    } catch (error) {
      console.error('❌ 빠른 이동 실패:', error);
    }
    
    // 원 자동 재생성 (위치 지정)
    setTimeout(() => {
      recreateCircleAtPosition(location.lat, location.lng);
    }, 100);
    
    updateAddress(location.lat, location.lng);
    updateCalculations();
  };

  // 타겟 생성 페이지로 이동
  const handleCreateTarget = () => {
    console.log('🎯 타겟 생성 버튼 클릭됨');
    console.log('데이터:', { center, radius, address });
    
    const params = new URLSearchParams({
      lat: center.lat.toString(),
      lng: center.lng.toString(),
      radius: radius.toString(),
      address: address
    });
    
    console.log('이동할 URL:', `/create-targeting?${params.toString()}`);
    router.push(`/create-targeting?${params.toString()}`);
  };

  // 계산값 업데이트
  useEffect(() => {
    updateCalculations();
  }, [radius]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">지도를 불러오는 중...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex h-screen bg-gray-50">
        {/* 왼쪽 지도 영역 (70%) */}
        <div className="flex-1 flex flex-col">
          {/* 상단 컨트롤 */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Map className="h-5 w-5 mr-2 text-blue-600" />
                <h1 className="text-lg font-semibold text-gray-900">위치 타겟팅</h1>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/targeting')}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                목록으로
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {QUICK_LOCATIONS.map((location) => (
                <Button
                  key={location.name}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log('🚀 빠른 이동 버튼 클릭:', location.name);
                    moveToLocation(location);
                  }}
                  className="text-xs"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  {location.name}
                </Button>
              ))}
            </div>
          </div>

          {/* 지도 */}
          <div className="flex-1 relative" style={{ minHeight: '500px' }}>
            <div 
              ref={mapContainerRef} 
              className="w-full h-full"
              style={{ 
                width: '100%', 
                height: '100%', 
                minHeight: '500px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#f3f4f6'
              }}
            />
            
            {/* 지도 로딩 오버레이 */}
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">지도를 불러오는 중...</p>
                  <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p>
                </div>
              </div>
            )}
            
            {/* 디버그 정보 */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white p-2 rounded text-xs z-20">
              <div>로딩 상태: {isLoading ? '로딩 중' : '완료'}</div>
              <div>컨테이너: {mapContainerRef.current ? '있음' : '없음'}</div>
              <div>SDK: {window.kakao?.maps ? '로드됨' : '로딩 중'}</div>
              <div>지도: {mapRef.current ? '생성됨' : '없음'}</div>
              <div>마커: {markerRef.current ? '있음' : '없음'}</div>
              <div>원: {circleRef.current ? '있음' : '없음'}</div>
              <div>위도: {center.lat.toFixed(6)}</div>
              <div>경도: {center.lng.toFixed(6)}</div>
              <div>반경: {radius}m</div>
              <button 
                onClick={() => recreateCircleAtPosition(center.lat, center.lng)}
                className="mt-2 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                원 재생성
              </button>
            </div>
            
            {/* 반경 조절 슬라이더 */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 min-w-[300px] z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">반경 조절</span>
                <span className="text-sm font-semibold text-blue-600">
                  {radius >= 1000 ? `${(radius / 1000).toFixed(1)}km` : `${radius}m`}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={radius}
                onChange={(e) => {
                  console.log('🎚️ 슬라이더 변경:', e.target.value);
                  handleRadiusChange(parseInt(e.target.value));
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{ zIndex: 1000 }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>100m</span>
                <span>5km</span>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 정보 패널 (30%) */}
        <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Map className="h-5 w-5 mr-2 text-blue-600" />
                타겟팅 정보
              </h2>
            </div>

            {/* 위치 정보 */}
            <Card>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    위도 (Latitude)
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {center.lat.toFixed(6)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    경도 (Longitude)
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {center.lng.toFixed(6)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    주소
                  </label>
                  <p className="text-sm text-gray-900">
                    {address || '주소를 불러오는 중...'}
                  </p>
                </div>
              </div>
            </Card>

            {/* 타겟팅 통계 */}
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">반경</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    {radius >= 1000 ? `${(radius / 1000).toFixed(1)}km` : `${radius}m`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">커버 면적</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {coverageArea >= 1000000 
                      ? `${(coverageArea / 1000000).toFixed(1)}km²`
                      : `${Math.round(coverageArea)}m²`
                    }
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">예상 도달</span>
                  </div>
                  <span className="text-sm font-semibold text-purple-600">
                    {estimatedReach.toLocaleString()}명
                  </span>
                </div>
              </div>
            </Card>

            {/* 타겟 생성 버튼 */}
            <div className="pt-4">
              <Button
                onClick={handleCreateTarget}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <Save className="h-4 w-4 mr-2" />
                타겟 생성
              </Button>
            </div>

            {/* 사용법 안내 */}
            <Card>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">사용법</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 지도를 클릭하여 중심점을 설정하세요</li>
                  <li>• 하단 슬라이더로 반경을 조절하세요</li>
                  <li>• 상단 버튼으로 빠른 이동이 가능합니다</li>
                  <li>• "타겟 생성" 버튼으로 저장하세요</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </Layout>
  );
};

export default TargetingMapPage;
