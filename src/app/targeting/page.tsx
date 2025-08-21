'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MapPin, Edit, Trash2, Users, X } from 'lucide-react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAppStore } from '@/store';
import { targetingApi } from '@/lib/api';
import { TargetingLocation } from '@/types';

// 타겟팅 생성/편집 모달 컴포넌트
const TargetingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  location?: TargetingLocation | null;
  onSubmit: (locationData: Partial<TargetingLocation>) => void;
  loading: boolean;
}> = ({ isOpen, onClose, location, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    memo: '',
    centerLat: 37.5665,
    centerLng: 126.9780,
    radiusM: 1000
  });

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || '',
        memo: location.memo || '',
        centerLat: location.centerLat || 37.5665,
        centerLng: location.centerLng || 126.9780,
        radiusM: location.radiusM || 1000
      });
    } else {
      setFormData({
        name: '',
        memo: '',
        centerLat: 37.5665,
        centerLng: 126.9780,
        radiusM: 1000
      });
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {location ? '타겟팅 위치 편집' : '새 타겟팅 위치 생성'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              위치 이름 *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="예: 강남역, 홍대입구 등"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명 (선택사항)
            </label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              placeholder="타겟팅 위치에 대한 설명을 입력하세요"
              className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                위도 *
              </label>
              <Input
                type="number"
                step="0.000001"
                value={formData.centerLat}
                onChange={(e) => setFormData({ ...formData, centerLat: parseFloat(e.target.value) })}
                placeholder="37.5665"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                경도 *
              </label>
              <Input
                type="number"
                step="0.000001"
                value={formData.centerLng}
                onChange={(e) => setFormData({ ...formData, centerLng: parseFloat(e.target.value) })}
                placeholder="126.9780"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              반경 (미터) *
            </label>
            <Input
              type="number"
              min="100"
              max="50000"
              value={formData.radiusM}
              onChange={(e) => setFormData({ ...formData, radiusM: parseInt(e.target.value) })}
              placeholder="1000"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              최소 100m, 최대 50km까지 설정 가능합니다.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              {location ? '수정' : '생성'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const TargetingCard: React.FC<{
  location: TargetingLocation;
  onEdit: (location: TargetingLocation) => void;
  onDelete: (id: string) => void;
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
          <p className="text-gray-600 mb-4">{location.memo || '설명이 없습니다.'}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">위치</p>
              <p className="font-medium">
                {location.centerLat.toFixed(6)}, {location.centerLng.toFixed(6)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">반경</p>
              <p className="font-medium">{location.radiusM}m</p>
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
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<TargetingLocation | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    location.memo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (locationData: Partial<TargetingLocation>) => {
    try {
      setSubmitting(true);
      
      if (editingLocation) {
        // 수정
        const response = await targetingApi.update(editingLocation.id, locationData);
        if (response.data.success) {
          updateTargetingLocation(editingLocation.id, response.data.data);
          addNotification({
            type: 'success',
            message: '타겟팅 위치가 수정되었습니다.'
          });
        }
      } else {
        // 생성
        const response = await targetingApi.create(locationData);
        if (response.data.success) {
          addTargetingLocation(response.data.data);
          addNotification({
            type: 'success',
            message: '타겟팅 위치가 생성되었습니다.'
          });
        }
      }
      
      setModalOpen(false);
      setEditingLocation(null);
    } catch (error) {
      console.error('Failed to save targeting location:', error);
      addNotification({
        type: 'error',
        message: editingLocation ? '타겟팅 위치 수정에 실패했습니다.' : '타겟팅 위치 생성에 실패했습니다.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (location: TargetingLocation) => {
    setEditingLocation(location);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
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
          <Button 
            variant="primary"
            onClick={() => {
              setEditingLocation(null);
              setModalOpen(true);
            }}
          >
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
                    ? (filteredLocations.reduce((sum, loc) => sum + loc.radiusM, 0) / filteredLocations.length).toFixed(0)
                    : 0}m
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
              <Button 
                variant="primary"
                onClick={() => {
                  setEditingLocation(null);
                  setModalOpen(true);
                }}
              >
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

        {/* 모달 */}
        <TargetingModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingLocation(null);
          }}
          location={editingLocation}
          onSubmit={handleSubmit}
          loading={submitting}
        />
      </div>
    </Layout>
  );
};

export default TargetingPage;
