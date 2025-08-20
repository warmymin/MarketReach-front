'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MapPin, Edit, Trash2, Users } from 'lucide-react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAppStore } from '@/store';
import { targetingApi } from '@/lib/api';
import { TargetingLocation } from '@/types';

const TargetingCard: React.FC<{
  location: TargetingLocation;
  onEdit: (location: TargetingLocation) => void;
  onDelete: (id: number) => void;
}> = ({ location, onEdit, onDelete }) => {
  // 예상 도달 고객 수 계산 (임시)
  const estimatedReach = Math.floor(Math.random() * 100) + 10;

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
          </div>
          <p className="text-gray-600 mb-4">{location.description || '설명이 없습니다.'}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">위치</p>
              <p className="font-medium">
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">반경</p>
              <p className="font-medium">{location.radius}km</p>
            </div>
            <div>
              <p className="text-gray-500">예상 도달</p>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-green-500" />
                <p className="font-medium text-green-600">{estimatedReach}명</p>
              </div>
            </div>
            <div>
              <p className="text-gray-500">생성일</p>
              <p className="font-medium">
                {new Date(location.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(location)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(location.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const TargetingPage: React.FC = () => {
  const { targetingLocations, setTargetingLocations, addTargetingLocation, updateTargetingLocation, deleteTargetingLocation, addNotification } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTargetingLocations = async () => {
      try {
        setLoading(true);
        const response = await targetingApi.getAll();
        if (response.data.success) {
          setTargetingLocations(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch targeting locations:', error);
        addNotification({
          type: 'error',
          message: '타겟팅 위치 목록을 불러오는데 실패했습니다.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTargetingLocations();
  }, [setTargetingLocations, addNotification]);

  const filteredLocations = targetingLocations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (location: TargetingLocation) => {
    // TODO: 편집 모달 또는 페이지로 이동
    addNotification({
      type: 'info',
      message: '타겟팅 위치 편집 기능은 준비 중입니다.'
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 타겟팅 위치를 삭제하시겠습니까?')) {
      try {
        await targetingApi.delete(id);
        deleteTargetingLocation(id);
        addNotification({
          type: 'success',
          message: '타겟팅 위치가 삭제되었습니다.'
        });
      } catch (error) {
        addNotification({
          type: 'error',
          message: '타겟팅 위치 삭제에 실패했습니다.'
        });
      }
    }
  };

  const totalEstimatedReach = filteredLocations.reduce((total, location) => {
    return total + (Math.floor(Math.random() * 100) + 10);
  }, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">타겟팅 관리</h1>
            <p className="text-gray-600">위치 기반 타겟팅을 설정하고 관리하세요</p>
          </div>
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            새 타겟팅
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 타겟팅 위치</p>
                <p className="text-2xl font-bold text-gray-900">{filteredLocations.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 예상 도달</p>
                <p className="text-2xl font-bold text-gray-900">{totalEstimatedReach.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">평균 반경</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredLocations.length > 0 
                    ? (filteredLocations.reduce((sum, loc) => sum + loc.radius, 0) / filteredLocations.length).toFixed(1)
                    : 0}km
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* 검색 */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="타겟팅 위치 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* 타겟팅 위치 목록 */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index}>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredLocations.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">타겟팅 위치가 없습니다.</p>
              <Button variant="primary">
                <Plus className="h-4 w-4 mr-2" />
                첫 번째 타겟팅 위치 생성
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLocations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TargetingCard
                  location={location}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TargetingPage;
