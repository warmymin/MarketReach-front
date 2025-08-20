'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Target, 
  BarChart3,
  TrendingUp,
  Activity
} from 'lucide-react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import { useAppStore } from '@/store';
import { statisticsApi } from '@/lib/api';
import { Statistics } from '@/types';

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  change?: number;
}> = ({ title, value, icon, color, change }) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        {change !== undefined && (
          <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}% from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  </Card>
);

const RecentActivity: React.FC = () => (
  <Card>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
    <div className="space-y-3">
      {[
        { action: '새 캠페인 생성', time: '2분 전', type: 'campaign' },
        { action: '타겟팅 위치 업데이트', time: '15분 전', type: 'targeting' },
        { action: '발송 완료', time: '1시간 전', type: 'delivery' },
        { action: '새 고객 등록', time: '2시간 전', type: 'customer' },
      ].map((activity, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </Card>
);

const Dashboard: React.FC = () => {
  const { statistics, setStatistics, setLoading, addNotification } = useAppStore();
  const [loading, setLocalLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await statisticsApi.getDashboard();
        if (response.data.success) {
          setStatistics(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        addNotification({
          type: 'error',
          message: '통계 데이터를 불러오는데 실패했습니다.'
        });
      } finally {
        setLoading(false);
        setLocalLoading(false);
      }
    };

    fetchStatistics();
  }, [setStatistics, setLoading, addNotification]);

  const mockStats: Statistics = {
    totalCompanies: 5,
    totalCustomers: 1250,
    totalCampaigns: 23,
    totalTargetingLocations: 15,
    activeDeliveries: 8,
    completedDeliveries: 156
  };

  const stats = statistics || mockStats;

  return (
    <Layout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600">MarketReach 플랫폼 현황을 한눈에 확인하세요</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatCard
              title="총 회사"
              value={stats.totalCompanies}
              icon={<Building2 className="h-6 w-6 text-white" />}
              color="bg-blue-500"
              change={12}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatCard
              title="총 고객"
              value={stats.totalCustomers}
              icon={<Users className="h-6 w-6 text-white" />}
              color="bg-green-500"
              change={8}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatCard
              title="총 캠페인"
              value={stats.totalCampaigns}
              icon={<Target className="h-6 w-6 text-white" />}
              color="bg-purple-500"
              change={-3}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatCard
              title="타겟팅 위치"
              value={stats.totalTargetingLocations}
              icon={<BarChart3 className="h-6 w-6 text-white" />}
              color="bg-orange-500"
              change={15}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <StatCard
              title="진행중 발송"
              value={stats.activeDeliveries}
              icon={<Activity className="h-6 w-6 text-white" />}
              color="bg-yellow-500"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <StatCard
              title="완료된 발송"
              value={stats.completedDeliveries}
              icon={<TrendingUp className="h-6 w-6 text-white" />}
              color="bg-indigo-500"
              change={25}
            />
          </motion.div>
        </div>

        {/* 차트 및 활동 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">발송 현황</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">완료율</span>
                <span className="text-sm font-medium text-gray-900">95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">156</p>
                  <p className="text-xs text-gray-500">성공</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">8</p>
                  <p className="text-xs text-gray-500">진행중</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">2</p>
                  <p className="text-xs text-gray-500">실패</p>
                </div>
              </div>
            </div>
          </Card>
          
          <RecentActivity />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
