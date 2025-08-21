'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Edit, Trash2, Map } from 'lucide-react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAppStore } from '@/store';
import { targetingApi } from '@/lib/api';
import { TargetingLocation } from '@/types';
import { useRouter } from 'next/navigation';

export default function TargetingPage() {
  const router = useRouter();
  const { targetingLocations, setTargetingLocations, addTargetingLocation, updateTargetingLocation, deleteTargetingLocation, addNotification } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<TargetingLocation | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 타겟팅 위치 데이터 가져오기
        const targetingResponse = await targetingApi.getAll();
        if (targetingResponse.data.success) {
          setTargetingLocations(targetingResponse.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        addNotification({
          type: 'error',
          message: '데이터를 불러오는데 실패했습니다.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (loading) {
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

  return (
    <Layout>
      <div className="p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">타겟팅 관리</h1>
            <p className="text-gray-600 mt-1">캠페인 발송을 위한 타겟팅 위치를 관리합니다.</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push('/targeting/map')}
              className="flex items-center"
            >
              <Map className="h-4 w-4 mr-2" />
              지도에서 생성
            </Button>
            <Button
              onClick={() => setModalOpen(true)}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              새 타겟팅
            </Button>
          </div>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="타겟팅 이름으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 타겟팅 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <TargetingCard
              key={location.id}
              location={location}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">타겟팅이 없습니다</h3>
            <p className="text-gray-600 mb-4">새로운 타겟팅을 생성해보세요.</p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              첫 번째 타겟팅 생성
            </Button>
          </div>
        )}

        {/* 모달 */}
        <TargetingModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingLocation(null);
          }}
          onSubmit={handleSubmit}
          editingLocation={editingLocation}
          submitting={submitting}
        />
      </div>
    </Layout>
  );
}

// 타겟팅 카드 컴포넌트
const TargetingCard: React.FC<{
  location: TargetingLocation;
  onEdit: (location: TargetingLocation) => void;
  onDelete: (id: string) => void;
}> = ({ location, onEdit, onDelete }) => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
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
              variant="outline"
              onClick={() => onDelete(location.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>위도:</span>
            <span className="font-medium">{location.centerLat.toFixed(6)}</span>
          </div>
          <div className="flex justify-between">
            <span>경도:</span>
            <span className="font-medium">{location.centerLng.toFixed(6)}</span>
          </div>
          <div className="flex justify-between">
            <span>반경:</span>
            <span className="font-medium">{location.radiusM}m</span>
          </div>
          {location.memo && (
            <div className="pt-2 border-t border-gray-200">
              <span className="text-gray-500">{location.memo}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            생성일: {new Date(location.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Card>
  );
};

// 타겟팅 모달 컴포넌트
const TargetingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TargetingLocation>) => void;
  editingLocation: TargetingLocation | null;
  submitting: boolean;
}> = ({ isOpen, onClose, onSubmit, editingLocation, submitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    centerLat: 37.5665,
    centerLng: 126.9780,
    radiusM: 1000,
    memo: ''
  });

  useEffect(() => {
    if (editingLocation) {
      setFormData({
        name: editingLocation.name,
        centerLat: editingLocation.centerLat,
        centerLng: editingLocation.centerLng,
        radiusM: editingLocation.radiusM,
        memo: editingLocation.memo || ''
      });
    } else {
      setFormData({
        name: '',
        centerLat: 37.5665,
        centerLng: 126.9780,
        radiusM: 1000,
        memo: ''
      });
    }
  }, [editingLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {editingLocation ? '타겟팅 수정' : '새 타겟팅 생성'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              타겟팅 이름
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="타겟팅 이름을 입력하세요"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                위도
              </label>
              <Input
                type="number"
                step="any"
                value={formData.centerLat}
                onChange={(e) => setFormData({ ...formData, centerLat: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                경도
              </label>
              <Input
                type="number"
                step="any"
                value={formData.centerLng}
                onChange={(e) => setFormData({ ...formData, centerLng: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              반경 (미터)
            </label>
            <Input
              type="number"
              value={formData.radiusM}
              onChange={(e) => setFormData({ ...formData, radiusM: parseInt(e.target.value) })}
              min="100"
              max="50000"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              메모
            </label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="타겟팅에 대한 메모를 입력하세요"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? '저장 중...' : (editingLocation ? '수정' : '생성')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
