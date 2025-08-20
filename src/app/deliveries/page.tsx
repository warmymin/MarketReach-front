'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Send,
  RefreshCw
} from 'lucide-react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAppStore } from '@/store';
import { deliveryApi } from '@/lib/api';
import { Delivery } from '@/types';

const DeliveryCard: React.FC<{
  delivery: Delivery;
}> = ({ delivery }) => {
  const statusConfig = {
    PENDING: {
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      label: '대기중',
      color: 'bg-yellow-100 text-yellow-800',
      bgColor: 'bg-yellow-50'
    },
    SENT: {
      icon: <Send className="h-5 w-5 text-blue-500" />,
      label: '발송됨',
      color: 'bg-blue-100 text-blue-800',
      bgColor: 'bg-blue-50'
    },
    DELIVERED: {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      label: '전달됨',
      color: 'bg-green-100 text-green-800',
      bgColor: 'bg-green-50'
    },
    FAILED: {
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      label: '실패',
      color: 'bg-red-100 text-red-800',
      bgColor: 'bg-red-50'
    }
  };

  const config = statusConfig[delivery.status];

  return (
    <Card className={config.bgColor}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {config.icon}
          <div>
            <h3 className="font-semibold text-gray-900">발송 #{delivery.id}</h3>
            <p className="text-sm text-gray-600">
              캠페인 ID: {delivery.campaignId} | 고객 ID: {delivery.customerId}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
            {config.label}
          </span>
          
          <div className="text-right text-sm text-gray-500">
            <div>생성: {new Date(delivery.createdAt).toLocaleString('ko-KR')}</div>
            {delivery.sentAt && (
              <div>발송: {new Date(delivery.sentAt).toLocaleString('ko-KR')}</div>
            )}
            {delivery.deliveredAt && (
              <div>전달: {new Date(delivery.deliveredAt).toLocaleString('ko-KR')}</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const DeliveriesPage: React.FC = () => {
  const { deliveries, setDeliveries, addNotification } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await deliveryApi.getAll();
      if (response.data.success) {
        setDeliveries(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
      addNotification({
        type: 'error',
        message: '발송 목록을 불러오는데 실패했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDeliveries();
    setRefreshing(false);
    addNotification({
      type: 'success',
      message: '발송 목록이 새로고침되었습니다.'
    });
  };

  const statusCounts = {
    PENDING: deliveries.filter(d => d.status === 'PENDING').length,
    SENT: deliveries.filter(d => d.status === 'SENT').length,
    DELIVERED: deliveries.filter(d => d.status === 'DELIVERED').length,
    FAILED: deliveries.filter(d => d.status === 'FAILED').length,
  };

  const totalDeliveries = deliveries.length;
  const successRate = totalDeliveries > 0 
    ? ((statusCounts.DELIVERED / totalDeliveries) * 100).toFixed(1)
    : '0';

  return (
    <Layout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">발송 모니터링</h1>
            <p className="text-gray-600">실시간 발송 현황을 모니터링하세요</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            loading={refreshing}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 발송</p>
                <p className="text-2xl font-bold text-gray-900">{totalDeliveries}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">대기중</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.PENDING}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">발송됨</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.SENT}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">전달됨</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.DELIVERED}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">실패</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.FAILED}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* 성공률 차트 */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">발송 성공률</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">전달 성공률</span>
              <span className="text-sm font-medium text-gray-900">{successRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${successRate}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center text-sm">
              <div>
                <p className="font-medium text-yellow-600">{statusCounts.PENDING}</p>
                <p className="text-gray-500">대기중</p>
              </div>
              <div>
                <p className="font-medium text-blue-600">{statusCounts.SENT}</p>
                <p className="text-gray-500">발송됨</p>
              </div>
              <div>
                <p className="font-medium text-green-600">{statusCounts.DELIVERED}</p>
                <p className="text-gray-500">전달됨</p>
              </div>
              <div>
                <p className="font-medium text-red-600">{statusCounts.FAILED}</p>
                <p className="text-gray-500">실패</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 발송 목록 */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <Card key={index}>
                <div className="animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-gray-200 rounded"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-6 bg-gray-200 rounded"></div>
                      <div className="text-right">
                        <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : deliveries.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">발송 내역이 없습니다.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {deliveries.map((delivery, index) => (
              <motion.div
                key={delivery.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DeliveryCard delivery={delivery} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DeliveriesPage;
