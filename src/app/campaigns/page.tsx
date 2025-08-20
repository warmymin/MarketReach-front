'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Play, Pause } from 'lucide-react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAppStore } from '@/store';
import { campaignApi } from '@/lib/api';
import { Campaign } from '@/types';

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
          <p className="text-gray-600 mb-4">{campaign.description || '설명이 없습니다.'}</p>
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
                         campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (campaign: Campaign) => {
    // TODO: 편집 모달 또는 페이지로 이동
    addNotification({
      type: 'info',
      message: '캠페인 편집 기능은 준비 중입니다.'
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 캠페인을 삭제하시겠습니까?')) {
      try {
        await campaignApi.delete(id);
        deleteCampaign(id);
        addNotification({
          type: 'success',
          message: '캠페인이 삭제되었습니다.'
        });
      } catch (error) {
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
        await campaignApi.update(id, updatedCampaign);
        updateCampaign(id, updatedCampaign);
        addNotification({
          type: 'success',
          message: '캠페인 상태가 업데이트되었습니다.'
        });
      }
    } catch (error) {
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
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            새 캠페인
          </Button>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="캠페인 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
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
              <Button variant="primary" className="mt-4">
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
      </div>
    </Layout>
  );
};

export default CampaignsPage;
