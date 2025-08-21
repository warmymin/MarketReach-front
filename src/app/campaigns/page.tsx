'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Send, CheckCircle, AlertCircle, Clock, X, Upload, Image as ImageIcon, Target, Send as SendIcon, BarChart3 } from 'lucide-react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAppStore } from '@/store';
import { campaignApi, uploadImage } from '@/lib/api';
import { Campaign } from '@/types';

// 이미지 업로드 컴포넌트
const ImageUpload: React.FC<{
  imageUrl?: string;
  imageAlt?: string;
  onImageChange: (url: string, alt: string) => void;
  onImageRemove: () => void;
}> = ({ imageUrl, imageAlt, onImageChange, onImageRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { addNotification } = useAppStore();

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      addNotification({ type: 'error', message: '이미지 파일만 업로드 가능합니다.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addNotification({ type: 'error', message: '파일 크기는 5MB를 초과할 수 없습니다.' });
      return;
    }

    try {
      setUploading(true);
      const result = await uploadImage(file);
      onImageChange(result.url, file.name);
      addNotification({ type: 'success', message: '이미지가 업로드되었습니다.' });
    } catch (error) {
      console.error('Image upload failed:', error);
      addNotification({ type: 'error', message: '이미지 업로드에 실패했습니다.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        이미지 첨부 (선택사항)
      </label>
      <p className="text-xs text-gray-500">
        최대 1개, 파일당 5MB 이하의 이미지 파일 (PNG, JPG, GIF 등)
      </p>
      
      {imageUrl ? (
        <div className="relative">
          <img
            src={`http://localhost:8084${imageUrl}`}
            alt={imageAlt || '캠페인 이미지'}
            className="w-full h-32 object-cover rounded-md border"
          />
          <button
            type="button"
            onClick={onImageRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            {uploading ? (
              <div className="space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600">업로드 중...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                <p className="text-sm text-gray-600">
                  클릭하여 업로드 또는 드래그하여 파일을 놓으세요
                </p>
              </div>
            )}
          </label>
        </div>
      )}
    </div>
  );
};

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
    imageUrl: '',
    imageAlt: '',
    status: 'DRAFT' as 'DRAFT' | 'SENDING' | 'COMPLETED' | 'PAUSED' | 'CANCELLED',
    targetingLocationId: '',
    targetId: ''
  });
  const [targetingLocations, setTargetingLocations] = useState<any[]>([]);

  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name || '',
        message: campaign.message || '',
        description: campaign.description || '',
        imageUrl: campaign.imageUrl || '',
        imageAlt: campaign.imageAlt || '',
        status: campaign.status || 'DRAFT',
        targetingLocationId: campaign.targetingLocationId?.toString() || '',
        targetId: ''
      });
    } else {
      setFormData({
        name: '',
        message: '',
        description: '',
        imageUrl: '',
        imageAlt: '',
        status: 'DRAFT',
        targetingLocationId: '',
        targetId: ''
      });
    }
  }, [campaign]);

  // 타겟팅 위치 및 타겟 목록 로드
  useEffect(() => {
    const fetchTargetingData = async () => {
      if (isOpen) {
        try {
          setLoadingLocations(true);
          
          // 타겟팅 위치 목록 로드
          const targetingResponse = await fetch('http://localhost:8084/api/targeting-locations');
          const targetingData = await targetingResponse.json();
          if (targetingData.success) {
            setTargetingLocations(targetingData.data);
          }
          

        } catch (error) {
          console.error('Failed to fetch targeting data:', error);
        } finally {
          setLoadingLocations(false);
        }
      }
    };

    fetchTargetingData();
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      targetingLocationId: formData.targetingLocationId || undefined
    };
    onSubmit(submitData);
  };

  const handleImageChange = (url: string, alt: string) => {
    setFormData({ ...formData, imageUrl: url, imageAlt: alt });
  };

  const handleImageRemove = () => {
    setFormData({ ...formData, imageUrl: '', imageAlt: '' });
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
              캠페인 이름
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="캠페인 이름을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              메시지
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="고객에게 전송할 마케팅 메시지를 작성하세요"
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.message.length}/1000자
            </div>
          </div>

          <ImageUpload
            imageUrl={formData.imageUrl}
            imageAlt={formData.imageAlt}
            onImageChange={handleImageChange}
            onImageRemove={handleImageRemove}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명 (선택사항)
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
              타겟팅 설정
            </label>
            <select
              value={formData.targetingLocationId}
              onChange={(e) => setFormData({ ...formData, targetingLocationId: e.target.value })}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loadingLocations}
            >
              <option value="">타겟팅을 선택하세요</option>
              
              {/* 타겟팅 위치 목록 */}
              {targetingLocations.map((location) => (
                <option 
                  key={location.id} 
                  value={location.id}
                >
                  📍 {location.name} (반경: {location.radiusM}m)
                </option>
              ))}
            </select>
            {loadingLocations && (
              <p className="text-sm text-gray-500 mt-1">타겟팅 목록을 불러오는 중...</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'DRAFT' | 'SENDING' | 'COMPLETED' | 'PAUSED' | 'CANCELLED' })}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DRAFT">초안</option>
              <option value="SENDING">발송 중</option>
              <option value="COMPLETED">발송 완료</option>
              <option value="PAUSED">일시정지</option>
              <option value="CANCELLED">취소됨</option>
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
  onDelete: (id: string) => void;
  onSend: (id: string) => void;
}> = ({ campaign, onEdit, onDelete, onSend }) => {
  const [stats, setStats] = useState<{
    targetingLocationName?: string;
    targetingRadiusM?: number;
    totalDeliveries?: number;
    successfulDeliveries?: number;
    successRate?: number;
  }>({});
  const [loadingStats, setLoadingStats] = useState(false);

  // 캠페인 통계 정보 로드
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const response = await fetch(`http://localhost:8084/api/campaigns/${campaign.id}/stats`);
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch campaign stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [campaign.id]);

  const statusColors = {
    DRAFT: 'bg-gray-100 text-gray-800',
    SENDING: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    PAUSED: 'bg-orange-100 text-orange-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    DRAFT: '초안',
    SENDING: '발송 중',
    COMPLETED: '발송 완료',
    PAUSED: '일시정지',
    CANCELLED: '취소됨',
  };

  // 안전한 날짜 포맷팅 함수
  const formatDate = (dateInput: any) => {
    try {
      if (!dateInput) {
        return '날짜 없음';
      }
      
      let date: Date;
      
      // 배열 형태의 날짜 데이터 처리 (백엔드에서 오는 형식)
      if (Array.isArray(dateInput)) {
        // [year, month, day, hour, minute, second, nano] 형태
        const [year, month, day, hour, minute, second] = dateInput;
        date = new Date(year, month - 1, day, hour, minute, second); // month는 0-based
      } else if (typeof dateInput === 'string') {
        // 문자열 형태의 날짜
        date = new Date(dateInput);
      } else {
        return '날짜 없음';
      }
      
      if (isNaN(date.getTime())) {
        return '날짜 없음';
      }
      
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Date parsing error:', error, dateInput);
      return '날짜 없음';
    }
  };

  return (
    <Card>
      <div className="flex items-start space-x-4">
        {/* 이미지 섹션 */}
        <div className="flex-shrink-0 w-32 h-24">
          {campaign.imageUrl ? (
            <img
              src={`http://localhost:8084${campaign.imageUrl}`}
              alt={campaign.imageAlt || campaign.name}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* 내용 섹션 */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
              {statusLabels[campaign.status]}
            </span>
          </div>
          <p className="text-gray-600 mb-2">{campaign.message}</p>
          {campaign.description && (
            <p className="text-gray-500 text-sm mb-2">{campaign.description}</p>
          )}
          <div className="space-y-1 text-sm text-gray-500">
            <div>생성일: {formatDate(campaign.createdAt)}</div>
          </div>

          {/* 통계 정보 섹션 */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4">
              {/* 타겟팅 정보 */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {loadingStats ? '로딩 중...' : (stats.targetingLocationName || '타겟팅 없음')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {stats.targetingRadiusM ? `반경: ${stats.targetingRadiusM}m` : '타겟팅'}
                  </div>
                </div>
              </div>

              {/* 발송 건수 */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <SendIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {loadingStats ? '...' : (stats.totalDeliveries || 0)}
                  </div>
                  <div className="text-xs text-gray-500">발송 건수</div>
                </div>
              </div>

              {/* 성공률 */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {loadingStats ? '...' : (stats.successRate ? `${Math.round(stats.successRate)}%` : '0%')}
                  </div>
                  <div className="text-xs text-gray-500">성공률</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center space-x-2">
          {/* 발송 버튼 - DRAFT 또는 PAUSED 상태에서만 표시 */}
          {(campaign.status === 'DRAFT' || campaign.status === 'PAUSED') && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onSend(campaign.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-1" />
              발송
            </Button>
          )}
          
          {/* 발송 중 상태 */}
          {campaign.status === 'SENDING' && (
            <Button
              size="sm"
              variant="outline"
              disabled
              className="opacity-50 cursor-not-allowed"
            >
              <Clock className="h-4 w-4 mr-1" />
              발송 중...
            </Button>
          )}
          
          {/* 발송 완료 상태 */}
          {campaign.status === 'COMPLETED' && (
            <Button
              size="sm"
              variant="outline"
              disabled
              className="opacity-50 cursor-not-allowed"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              발송완료
            </Button>
          )}
          
          {/* 수정 버튼 - DRAFT 또는 PAUSED 상태에서만 표시 */}
          {(campaign.status === 'DRAFT' || campaign.status === 'PAUSED') && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(campaign)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          {/* 삭제 버튼 - DRAFT, COMPLETED, PAUSED 상태에서만 표시 */}
          {(campaign.status === 'DRAFT' || campaign.status === 'COMPLETED' || campaign.status === 'PAUSED') && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(campaign.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

// 메인 캠페인 페이지 컴포넌트
const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { addNotification } = useAppStore();

  // 캠페인 목록 로드
  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignApi.getAll();
      if (response.data.success) {
        setCampaigns(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load campaigns:', error);
      addNotification({ type: 'error', message: '캠페인 목록을 불러오는데 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  // 캠페인 생성/수정
  const handleSubmit = async (campaignData: Partial<Campaign>) => {
    try {
      if (editingCampaign) {
        await campaignApi.update(editingCampaign.id, campaignData);
        addNotification({ type: 'success', message: '캠페인이 수정되었습니다.' });
      } else {
        await campaignApi.create(campaignData);
        addNotification({ type: 'success', message: '캠페인이 생성되었습니다.' });
      }
      setModalOpen(false);
      setEditingCampaign(null);
      loadCampaigns();
    } catch (error) {
      console.error('Failed to save campaign:', error);
      addNotification({ type: 'error', message: '캠페인 저장에 실패했습니다.' });
    }
  };

  // 캠페인 삭제
  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 캠페인을 삭제하시겠습니까?')) return;
    
    try {
      await campaignApi.delete(id);
      addNotification({ type: 'success', message: '캠페인이 삭제되었습니다.' });
      loadCampaigns();
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      addNotification({ type: 'error', message: '캠페인 삭제에 실패했습니다.' });
    }
  };

  // 캠페인 발송
  const handleSend = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8084/api/campaigns/${id}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        addNotification({ type: 'success', message: '캠페인 발송이 완료되었습니다.' });
      } else {
        addNotification({ type: 'error', message: data.message || '캠페인 발송에 실패했습니다.' });
      }
      
      loadCampaigns();
    } catch (error) {
      console.error('Failed to send campaign:', error);
      addNotification({ type: 'error', message: '캠페인 발송에 실패했습니다.' });
    }
  };

  // 필터링된 캠페인 목록
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">캠페인 관리</h1>
            <p className="text-gray-600">마케팅 캠페인을 생성하고 관리하세요</p>
          </div>
          <Button
            onClick={() => {
              setEditingCampaign(null);
              setModalOpen(true);
            }}
            variant="primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            새 캠페인
          </Button>
        </div>

        {/* 필터 및 검색 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
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
              <option value="all">모든 상태</option>
              <option value="DRAFT">초안</option>
              <option value="SENDING">발송 중</option>
              <option value="COMPLETED">발송 완료</option>
              <option value="PAUSED">일시정지</option>
              <option value="CANCELLED">취소됨</option>
            </select>
          </div>
        </div>

        {/* 캠페인 목록 */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">캠페인을 불러오는 중...</p>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">캠페인이 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onEdit={(campaign) => {
                  setEditingCampaign(campaign);
                  setModalOpen(true);
                }}
                onDelete={handleDelete}
                onSend={handleSend}
              />
            ))}
          </div>
        )}

        {/* 모달 */}
        <CampaignModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingCampaign(null);
          }}
          campaign={editingCampaign}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </Layout>
  );
};

export default CampaignsPage;
