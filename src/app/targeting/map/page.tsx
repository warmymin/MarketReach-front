'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Target, Users, Map, Save, ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { KakaoMap, KakaoLatLng, KakaoMarker, KakaoCircle, KakaoGeocoder } from '@/types/kakao-maps';

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
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<KakaoMap | null>(null);
  const [marker, setMarker] = useState<KakaoMarker | null>(null);
  const [circle, setCircle] = useState<KakaoCircle | null>(null);
  const [geocoder, setGeocoder] = useState<KakaoGeocoder | null>(null);
  
  const [centerLat, setCenterLat] = useState(37.5665);
  const [centerLng, setCenterLng] = useState(126.9780);
  const [radius, setRadius] = useState(1000);
  const [address, setAddress] = useState('');
  const [coverageArea, setCoverageArea] = useState(0);
  const [estimatedReach, setEstimatedReach] = useState(0);
  const [isLoading, setIsLoading] = useState(true);



  // Kakao Maps SDK 로드 (공식 문서 방식)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log('=== 타겟팅 맵 초기화 ===');
    console.log('1. 컴포넌트 마운트됨');
    console.log('2. mapRef.current:', mapRef.current);

    const loadKakaoMap = () => {
      // 이미 로드되어 있는지 확인
      if (window.kakao && window.kakao.maps) {
        console.log('3. Kakao Maps SDK가 이미 로드되어 있음');
        initMap();
        return;
      }

      console.log('3. Kakao Maps SDK 로드 시작');

      const script = document.createElement('script');
      script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=7129a6af85bdf28f0c5c1733ea1afb07&autoload=false';
      script.async = false;
      
      script.onload = () => {
        console.log('4. ✅ 스크립트 로드 성공');
        
        // Kakao Maps SDK 로드
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            console.log('5. ✅ Kakao Maps SDK 로드 완료');
            setIsLoading(false);
            initMap();
          });
        } else {
          console.error('4. ❌ kakao 객체를 찾을 수 없습니다');
          setIsLoading(false);
        }
      };
      
      script.onerror = (error) => {
        console.error('4. ❌ 스크립트 로드 실패:', error);
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    };

    // 즉시 실행
    loadKakaoMap();
  }, []);

  // 지도 초기화 (공식 문서 방식)
  const initMap = () => {
    try {
      console.log('6. 🗺️ 지도 초기화 시작...');
      
      // kakao 객체 확인
      if (!window.kakao?.maps) {
        console.error('6. ❌ Kakao Maps SDK가 로드되지 않았습니다.');
        return;
      }
      
      console.log('7. ✅ Kakao Maps SDK 확인됨');
      console.log('8. mapRef.current:', mapRef.current);
      
      // 컨테이너 확인
      if (!mapRef.current) {
        console.log('8. ⚠️ mapRef가 null입니다. 100ms 후 재시도...');
        setTimeout(() => {
          initMap();
        }, 100);
        return;
      }
      
      console.log('9. ✅ 지도 컨테이너 확인됨, 지도 생성 시작...');
      
      // 지도 생성 (공식 문서 방식)
      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(centerLat, centerLng),
        level: 3
      };
      
      console.log('10. 지도 생성 시도:', { container, options });
      const kakaoMap = new window.kakao.maps.Map(container, options);
      console.log('10. ✅ 지도 생성 완료:', kakaoMap);
      setMap(kakaoMap);

      // 지오코더 초기화 (안전하게)
      try {
        if (window.kakao.maps.services && window.kakao.maps.services.Geocoder) {
          const kakaoGeocoder = new window.kakao.maps.services.Geocoder();
          setGeocoder(kakaoGeocoder);
          console.log('10.1. ✅ 지오코더 초기화 완료');
        } else {
          console.log('10.1. ⚠️ 지오코더 서비스가 아직 로드되지 않음');
        }
      } catch (error) {
        console.log('10.1. ⚠️ 지오코더 초기화 실패:', error);
      }

      // 마커 생성 (안전하게)
      try {
        console.log('10.2. 마커 생성 시도:', { centerLat, centerLng, map: !!kakaoMap });
        const markerPosition = new window.kakao.maps.LatLng(centerLat, centerLng);
        console.log('10.2. 마커 위치:', markerPosition);
        
        const kakaoMarker = new window.kakao.maps.Marker({
          position: markerPosition,
          map: kakaoMap
        });
        setMarker(kakaoMarker);
        console.log('10.2. ✅ 마커 생성 완료:', kakaoMarker);
        console.log('10.2. 마커가 지도에 표시됨:', kakaoMarker.getMap());
      } catch (error) {
        console.log('10.2. ⚠️ 마커 생성 실패:', error);
      }

      // 원 생성 (안전하게)
      try {
        console.log('10.3. 원 생성 시도:', { centerLat, centerLng, radius, map: !!kakaoMap });
        const circleCenter = new window.kakao.maps.LatLng(centerLat, centerLng);
        console.log('10.3. 원 중심점:', circleCenter);
        
        const kakaoCircle = new window.kakao.maps.Circle({
          center: circleCenter,
          radius: radius,
          strokeWeight: 3,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeStyle: 'solid',
          fillColor: '#FF0000',
          fillOpacity: 0.3,
          map: kakaoMap
        });
        setCircle(kakaoCircle);
        console.log('10.3. ✅ 원 생성 완료:', kakaoCircle);
        console.log('10.3. 원이 지도에 표시됨:', kakaoCircle.getMap());
      } catch (error) {
        console.log('10.3. ⚠️ 원 생성 실패:', error);
      }

      // 지도 클릭 이벤트 (안전하게)
      try {
        const clickListener = (mouseEvent: any) => {
          console.log('🗺️ 지도 클릭됨!');
          console.log('마우스 이벤트:', mouseEvent);
          
          if (mouseEvent && mouseEvent.latLng) {
            const latlng = mouseEvent.latLng;
            const lat = latlng.getLat();
            const lng = latlng.getLng();
            console.log('📍 클릭한 위치:', lat, lng);
            
            // 즉시 중심점 업데이트
            setCenterLat(lat);
            setCenterLng(lng);
            
            // 마커와 원 업데이트
            if (marker && circle && map) {
              try {
                const newLatLng = new window.kakao.maps.LatLng(lat, lng);
                marker.setPosition(newLatLng);
                circle.setCenter(newLatLng);
                map.panTo(newLatLng);
                console.log('✅ 마커와 원 위치 즉시 업데이트 완료');
              } catch (error) {
                console.log('⚠️ 마커/원 업데이트 실패:', error);
              }
            }
            
            // 주소 조회 및 계산 업데이트
            setTimeout(() => {
              updateAddress(lat, lng);
              updateCalculations();
            }, 100);
          } else {
            console.log('⚠️ 마우스 이벤트에서 위치 정보를 찾을 수 없습니다');
          }
        };
        
        window.kakao.maps.event.addListener(kakaoMap, 'click', clickListener);
        console.log('10.4. ✅ 클릭 이벤트 등록 완료');
      } catch (error) {
        console.log('10.4. ⚠️ 클릭 이벤트 등록 실패:', error);
      }

      // 초기 주소 조회 (안전하게)
      try {
        updateAddress(centerLat, centerLng);
        updateCalculations();
        console.log('10.5. ✅ 초기 주소 조회 완료');
      } catch (error) {
        console.log('10.5. ⚠️ 초기 주소 조회 실패:', error);
      }
      
      console.log('11. ✅ 지도 초기화 완료');
    } catch (error) {
      console.error('11. 지도 초기화 실패:', error);
    }
  };

  // 중심점 업데이트
  const updateCenter = (lat: number, lng: number) => {
    console.log('📍 중심점 업데이트:', lat, lng);
    
    // 상태 업데이트
    setCenterLat(lat);
    setCenterLng(lng);

    // 마커와 원 업데이트
    if (marker && circle && map) {
      try {
        const latlng = new window.kakao.maps.LatLng(lat, lng);
        marker.setPosition(latlng);
        circle.setCenter(latlng);
        map.panTo(latlng);
        console.log('✅ 마커와 원 위치 업데이트 완료');
      } catch (error) {
        console.log('⚠️ 마커/원 업데이트 실패:', error);
      }
    } else {
      console.log('⚠️ 마커, 원, 또는 지도가 없습니다:', { marker: !!marker, circle: !!circle, map: !!map });
    }

    // 주소 조회 및 계산 업데이트
    setTimeout(() => {
      updateAddress(lat, lng);
      updateCalculations();
    }, 100);
  };

  // 반경 업데이트
  const updateRadius = (newRadius: number) => {
    console.log('📏 반경 업데이트:', newRadius);
    setRadius(newRadius);
    
    if (circle) {
      try {
        circle.setRadius(newRadius);
        console.log('✅ 원 반경 업데이트 완료');
      } catch (error) {
        console.log('⚠️ 원 반경 업데이트 실패:', error);
      }
    } else {
      console.log('⚠️ 원이 없습니다');
    }

    updateCalculations();
  };

  // 주소 업데이트
  const updateAddress = (lat: number, lng: number) => {
    if (!geocoder) {
      console.log('⚠️ 지오코더가 없어서 주소 조회를 건너뜁니다.');
      setAddress('주소를 불러오는 중...');
      return;
    }

    try {
      geocoder.coord2Address(lng, lat, (result: any, status: string) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const addressResult = result[0];
          const fullAddress = addressResult.address.address_name;
          setAddress(fullAddress);
        } else {
          setAddress('주소를 찾을 수 없습니다.');
        }
      });
    } catch (error) {
      console.log('⚠️ 주소 조회 중 오류:', error);
      setAddress('주소 조회 실패');
    }
  };

  // 계산값 업데이트
  const updateCalculations = () => {
    // 커버 면적 계산 (πr²)
    const area = Math.PI * radius * radius;
    setCoverageArea(area);

    // 예상 도달 고객 수 계산 (면적 * 800)
    const reach = Math.floor(area * 800);
    setEstimatedReach(reach);
    
    console.log('📊 계산 업데이트:', { radius, area, reach });
  };

  // 빠른 위치 이동
  const moveToLocation = (location: LocationData) => {
    console.log('🚀 빠른 이동:', location.name, location.lat, location.lng);
    
    // 즉시 상태 업데이트
    setCenterLat(location.lat);
    setCenterLng(location.lng);
    setRadius(location.defaultRadius);
    
    // 마커와 원 업데이트
    if (marker && circle && map) {
      try {
        const newLatLng = new window.kakao.maps.LatLng(location.lat, location.lng);
        marker.setPosition(newLatLng);
        circle.setCenter(newLatLng);
        circle.setRadius(location.defaultRadius);
        map.panTo(newLatLng);
        console.log('✅ 빠른 이동 완료');
      } catch (error) {
        console.log('⚠️ 빠른 이동 실패:', error);
      }
    }
    
    // 주소 조회 및 계산 업데이트
    setTimeout(() => {
      updateAddress(location.lat, location.lng);
      updateCalculations();
    }, 100);
  };

  // 타겟 생성 페이지로 이동
  const handleCreateTarget = () => {
    console.log('🎯 타겟 생성 버튼 클릭됨');
    console.log('데이터:', { centerLat, centerLng, radius, address });
    
    const targetData = {
      centerLat,
      centerLng,
      radius,
      address
    };
    
    // URL 파라미터로 데이터 전달
    const params = new URLSearchParams({
      lat: centerLat.toString(),
      lng: centerLng.toString(),
      radius: radius.toString(),
      address: address
    });
    
    console.log('이동할 URL:', `/create-targeting?${params.toString()}`);
    router.push(`/create-targeting?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">지도를 불러오는 중...</p>
            <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p>
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
          {/* 상단 빠른 이동 버튼 */}
          <div className="bg-white p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ArrowLeft 
                  className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-800" 
                  onClick={() => router.back()}
                />
                <h1 className="text-xl font-semibold text-gray-900">위치 타겟팅</h1>
              </div>
              <Button
                variant="primary"
                onClick={handleCreateTarget}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Target className="h-4 w-4 mr-2" />
                타겟 생성
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
            <div className="flex-1 relative">
              <div 
                ref={mapRef} 
                className="w-full h-full" 
                style={{ minHeight: '400px', border: '2px solid blue' }}
                data-testid="map-container"
              />
              {/* 디버그 정보 */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
                <div>지도 상태: {map ? '로드됨' : '로딩 중'}</div>
                <div>마커: {marker ? '있음' : '없음'}</div>
                <div>원: {circle ? '있음' : '없음'}</div>
                <div>위도: {centerLat.toFixed(6)}</div>
                <div>경도: {centerLng.toFixed(6)}</div>
                <div>반경: {radius}m</div>
                <div>클릭 테스트: 지도를 클릭해보세요!</div>
              </div>
            
            {/* 지도 로딩 중 */}
            {isLoading && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">지도를 불러오는 중...</p>
                  <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p>
                </div>
              </div>
            )}
            
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
                  updateRadius(parseInt(e.target.value));
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
                    {centerLat.toFixed(6)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    경도 (Longitude)
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {centerLng.toFixed(6)}
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
