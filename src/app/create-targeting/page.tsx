'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, MapPin, Target, Users } from 'lucide-react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface TargetingData {
  lat: string;
  lng: string;
  radius: string;
  address: string;
}

const CreateTargetingPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [targetingData, setTargetingData] = useState<TargetingData | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // URL 파라미터에서 데이터 추출
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');
    const address = searchParams.get('address');

    if (lat && lng && radius) {
      setTargetingData({
        lat,
        lng,
        radius,
        address: address || '주소 정보 없음'
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!targetingData || !name.trim()) {
      alert('필수 정보를 입력해주세요.');
      return;
    }

    try {
      // API 호출하여 타겟팅 저장
      const response = await fetch('/api/targeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          latitude: parseFloat(targetingData.lat),
          longitude: parseFloat(targetingData.lng),
          radius: parseInt(targetingData.radius),
          address: targetingData.address
        }),
      });

      if (response.ok) {
        alert('타겟팅이 성공적으로 생성되었습니다.');
        router.push('/targeting');
      } else {
        alert('타겟팅 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('타겟팅 생성 오류:', error);
      alert('타겟팅 생성 중 오류가 발생했습니다.');
    }
  };

  if (!targetingData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">데이터를 불러오는 중...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const radiusKm = (parseInt(targetingData.radius) / 1000).toFixed(1);
  const area = Math.PI * parseInt(targetingData.radius) * parseInt(targetingData.radius);
  const estimatedReach = Math.floor(area * 800);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              뒤로가기
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">타겟 생성</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 폼 */}
          <div>
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    타겟 이름 *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 강남역 타겟"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설명
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="타겟에 대한 설명을 입력하세요..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  타겟 생성
                </Button>
              </form>
            </Card>
          </div>

          {/* 오른쪽: 타겟팅 정보 */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                선택된 위치 정보
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    위도 (Latitude)
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {parseFloat(targetingData.lat).toFixed(6)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    경도 (Longitude)
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {parseFloat(targetingData.lng).toFixed(6)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    주소
                  </label>
                  <p className="text-sm text-gray-900">
                    {targetingData.address}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-600" />
                타겟팅 통계
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">반경</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    {radiusKm}km
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">커버 면적</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {area >= 1000000 
                      ? `${(area / 1000000).toFixed(1)}km²`
                      : `${Math.round(area)}m²`
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTargetingPage;
