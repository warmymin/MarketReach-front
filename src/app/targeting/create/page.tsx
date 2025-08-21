'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Target, Save, ArrowLeft, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store';
import { targetingApi } from '@/lib/api';

const CreateTargetPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addTargetingLocation, addNotification } = useAppStore();
  
  const [formData, setFormData] = useState({
    name: '',
    memo: '',
    centerLat: 37.5665,
    centerLng: 126.9780,
    radiusM: 1000
  });
  
  const [address, setAddress] = useState('');
  const [coverageArea, setCoverageArea] = useState(0);
  const [estimatedReach, setEstimatedReach] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // URL 파라미터에서 데이터 로드
  useEffect(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');
    const addressParam = searchParams.get('address');

    if (lat && lng && radius) {
      setFormData(prev => ({
        ...prev,
        centerLat: parseFloat(lat),
        centerLng: parseFloat(lng),
        radiusM: parseInt(radius)
      }));
      
      if (addressParam) {
        setAddress(addressParam);
      }
    }

    // 계산값 업데이트
    updateCalculations();
  }, [searchParams]);

  // 계산값 업데이트
  const updateCalculations = () => {
    const area = Math.PI * formData.radiusM * formData.radiusM;
    setCoverageArea(area);
    
    const reach = Math.floor(formData.radiusM * 2.5);
    setEstimatedReach(reach);
  };

  // 폼 데이터 변경 핸들러
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 반경이 변경되면 계산값 업데이트
    if (field === 'radiusM') {
      setTimeout(() => updateCalculations(), 0);
    }
  };

  // 타겟 생성 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      addNotification({
        type: 'error',
        message: '타겟팅 위치 이름을 입력해주세요.'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await targetingApi.create({
        name: formData.name,
        memo: formData.memo,
        centerLat: formData.centerLat,
        centerLng: formData.centerLng,
        radiusM: formData.radiusM
      });

      if (response.data.success) {
        addTargetingLocation(response.data.data);
        addNotification({
          type: 'success',
          message: '타겟팅 위치가 성공적으로 생성되었습니다.'
        });
        
        // 타겟팅 목록 페이지로 이동
        router.push('/targeting');
      }
    } catch (error) {
      console.error('Failed to create targeting location:', error);
      addNotification({
        type: 'error',
        message: '타겟팅 위치 생성에 실패했습니다.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">타겟 생성</h1>
              <p className="text-gray-600">선택한 위치로 새로운 타겟팅을 생성합니다</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 폼 */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    타겟팅 위치 이름 *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="예: 강남역 타겟팅, 홍대입구 타겟팅"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설명 (선택사항)
                  </label>
                  <textarea
                    value={formData.memo}
                    onChange={(e) => handleInputChange('memo', e.target.value)}
                    placeholder="이 타겟팅 위치에 대한 설명을 입력하세요"
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      위도
                    </label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={formData.centerLat}
                      onChange={(e) => handleInputChange('centerLat', parseFloat(e.target.value))}
                      className="w-full"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      경도
                    </label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={formData.centerLng}
                      onChange={(e) => handleInputChange('centerLng', parseFloat(e.target.value))}
                      className="w-full"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    반경 (미터)
                  </label>
                  <Input
                    type="number"
                    min="100"
                    max="50000"
                    value={formData.radiusM}
                    onChange={(e) => handleInputChange('radiusM', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    최소 100m, 최대 50km까지 설정 가능합니다.
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    타겟 생성
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* 오른쪽: 미리보기 */}
          <div className="space-y-6">
            {/* 위치 정보 */}
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  위치 정보
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    주소
                  </label>
                  <p className="text-sm text-gray-900">
                    {address || '주소 정보 없음'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    좌표
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {formData.centerLat.toFixed(6)}, {formData.centerLng.toFixed(6)}
                  </p>
                </div>
              </div>
            </Card>

            {/* 타겟팅 통계 */}
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-600" />
                  타겟팅 통계
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">반경</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {formData.radiusM >= 1000 
                        ? `${(formData.radiusM / 1000).toFixed(1)}km` 
                        : `${formData.radiusM}m`
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">커버 면적</span>
                    <span className="text-sm font-semibold text-green-600">
                      {coverageArea >= 1000000 
                        ? `${(coverageArea / 1000000).toFixed(1)}km²`
                        : `${Math.round(coverageArea)}m²`
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">예상 도달</span>
                    <span className="text-sm font-semibold text-purple-600">
                      {estimatedReach.toLocaleString()}명
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 생성 완료 후 안내 */}
            <Card className="bg-green-50 border-green-200">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">
                    타겟 생성 완료 시
                  </h4>
                  <ul className="text-xs text-green-700 mt-2 space-y-1">
                    <li>• 타겟팅 목록에 추가됩니다</li>
                    <li>• 캠페인 생성 시 선택 가능합니다</li>
                    <li>• 언제든지 수정/삭제할 수 있습니다</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTargetPage;
