'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Play, Pause, X } from 'lucide-react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAppStore } from '@/store';
import { campaignApi } from '@/lib/api';
import { Campaign } from '@/types';

// 캠페인 생성/편집 모달 컴포넌트
const CampaignModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  campaign?: Campaign | null;
  onSubmit: (campaignData: Partial<Campaign>) => void;
  loading: boolean;
}> = ({ isOpen, onClose, campaign, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    description: '',
    status: 'DRAFT' as 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED',
    targetingLocationId: ''
  });
  const [targetingLocations, setTargetingLocations] = useState<any[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name || '',
        message: campaign.message || '',
        description: campaign.description || '',
        status: campaign.status || 'DRAFT',
        targetingLocationId: campaign.targetingLocationId?.toString() || ''
      });
    } else {
      setFormData({
        name: '',
        message: '',
        description: '',
        status: 'DRAFT',
        targetingLocationId: ''
      });
    }
  }, [campaign]);

  // 타겟팅 위치 목록 로드
  useEffect(() => {
    const fetchTargetingLocations = async () => {
      if (isOpen) {
        try {
          setLoadingLocations(true);
          const response = await fetch('http://localhost:8083/api/targeting-locations');
          const data = await response.json();
          if (data.success) {
            setTargetingLocations(data.data);
          }
        } catch (error) {
          console.error('Failed to fetch targeting locations:', error);
        } finally {
          setLoadingLocations(false);
        }
      }
    };

    fetchTargetingLocations();
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      targetingLocationId: formData.targetingLocationId ? parseInt(formData.targetingLocationId) : undefined
    };
    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {campaign ? '캠페인 편집' : '새 캠페인 생성'}
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
              캠페인 이름 *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="캠페인 이름을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              메시지 *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="발송할 메시지를 입력하세요"
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="캠페인에 대한 설명을 입력하세요"
              className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              타겟팅 위치 *
            </label>
            {loadingLocations ? (
              <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
                <span className="text-gray-500">로딩 중...</span>
              </div>
            ) : (
              <select
                value={formData.targetingLocationId}
                onChange={(e) => setFormData({ ...formData, targetingLocationId: e.target.value })}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">타겟팅 위치를 선택하세요</option>
                {targetingLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name} ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' })}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DRAFT">초안</option>
              <option value="ACTIVE">활성</option>
              <option value="PAUSED">일시정지</option>
              <option value="COMPLETED">완료</option>
            </select>
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
              {campaign ? '수정' : '생성'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const CampaignCard: React.FC<{
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, status: string) => void;
}> = ({ campaign, onEdit, onDelete, onToggleStatus }) => {
  const statusColors = {
    DRAFT: 'bg-gray-100 text-gray-800',
    ACTIVE: 'bg-green-100 text-green-800',
    PAUSED: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
  };

  const statusLabels = {
    DRAFT: '초안',
    ACTIVE: '활성',
    PAUSED: '일시정지',
    COMPLETED: '완료',
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
              {statusLabels[campaign.status]}
            </span>
          </div>
          <p className="text-gray-600 mb-2">{campaign.message}</p>
          {campaign.description && (
            <p className="text-gray-500 text-sm mb-4">{campaign.description}</p>
          )}
          <div className="text-sm text-gray-500">
            생성일: {new Date(campaign.createdAt).toLocaleDateString('ko-KR')}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {campaign.status === 'DRAFT' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onToggleStatus(campaign.id, 'ACTIVE')}
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
          {campaign.status === 'ACTIVE' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onToggleStatus(campaign.id, 'PAUSED')}
            >
              <Pause className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(campaign)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(campaign.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const CampaignsPage: React.FC = () => {
  const { campaigns, setCampaigns, addCampaign, updateCampaign, deleteCampaign, addNotification } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await campaignApi.getAll();
        if (response.data.success) {
          setCampaigns(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        addNotification({
          type: 'error',
          message: '캠페인 목록을 불러오는데 실패했습니다.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [setCampaigns, addNotification]);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    setEditingCampaign(null);
    setModalOpen(true);
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setModalOpen(true);
  };

  const handleSubmit = async (campaignData: Partial<Campaign>) => {
    try {
      setSubmitting(true);
      
      if (editingCampaign) {
        // 수정
        const response = await campaignApi.update(editingCampaign.id, campaignData);
        if (response.data.success) {
          updateCampaign(editingCampaign.id, response.data.data);
          addNotification({
            type: 'success',
            message: '캠페인이 수정되었습니다.'
          });
        }
      } else {
        // 생성
        const response = await campaignApi.create(campaignData);
        if (response.data.success) {
          addCampaign(response.data.data);
          addNotification({
            type: 'success',
            message: '캠페인이 생성되었습니다.'
          });
        }
      }
      
      setModalOpen(false);
      setEditingCampaign(null);
    } catch (error) {
      console.error('Campaign operation failed:', error);
      addNotification({
        type: 'error',
        message: editingCampaign ? '캠페인 수정에 실패했습니다.' : '캠페인 생성에 실패했습니다.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 캠페인을 삭제하시겠습니까?')) {
      try {
        const response = await campaignApi.delete(id);
        if (response.data.success) {
          deleteCampaign(id);
          addNotification({
            type: 'success',
            message: '캠페인이 삭제되었습니다.'
          });
        }
      } catch (error) {
        console.error('Delete campaign failed:', error);
        addNotification({
          type: 'error',
          message: '캠페인 삭제에 실패했습니다.'
        });
      }
    }
  };

  const handleToggleStatus = async (id: number, status: string) => {
    try {
      const campaign = campaigns.find(c => c.id === id);
      if (campaign) {
        const updatedCampaign = { ...campaign, status: status as any };
        const response = await campaignApi.update(id, updatedCampaign);
        if (response.data.success) {
          updateCampaign(id, response.data.data);
          addNotification({
            type: 'success',
            message: '캠페인 상태가 업데이트되었습니다.'
          });
        }
      }
    } catch (error) {
      console.error('Toggle status failed:', error);
      addNotification({
        type: 'error',
        message: '캠페인 상태 업데이트에 실패했습니다.'
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">캠페인 관리</h1>
            <p className="text-gray-600">마케팅 캠페인을 생성하고 관리하세요</p>
          </div>
          <Button variant="primary" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            새 캠페인
          </Button>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="캠페인 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">모든 상태</option>
                <option value="DRAFT">초안</option>
                <option value="ACTIVE">활성</option>
                <option value="PAUSED">일시정지</option>
                <option value="COMPLETED">완료</option>
              </select>
            </div>
          </div>
        </Card>

        {/* 캠페인 목록 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index}>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">캠페인이 없습니다.</p>
              <Button variant="primary" className="mt-4" onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                첫 번째 캠페인 생성
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CampaignCard
                  campaign={campaign}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* 캠페인 생성/편집 모달 */}
        <CampaignModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingCampaign(null);
          }}
          campaign={editingCampaign}
          onSubmit={handleSubmit}
          loading={submitting}
        />
      </div>
    </Layout>
  );
};

export default CampaignsPage;
