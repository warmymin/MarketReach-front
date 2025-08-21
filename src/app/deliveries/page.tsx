'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Send,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Calendar,
  Settings
} from 'lucide-react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAppStore } from '@/store';
import { deliveryApi } from '@/lib/api';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// 통계 카드 컴포넌트
const StatCard: React.FC<{
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, change, changeType, icon, color }) => {
  const getChangeIcon = () => {
    if (changeType === 'positive') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (changeType === 'negative') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center space-x-1 mt-1">
            {getChangeIcon()}
            <span className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {change}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

// 실시간 발송 현황 차트 컴포넌트
const RecentDeliveriesChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <Card>
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">실시간 발송 현황</h3>
          <p className="text-sm text-gray-600">최근 30분간 메시지 발송 현황</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              name="총 발송"
            />
            <Line 
              type="monotone" 
              dataKey="success" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name="성공"
            />
            <Line 
              type="monotone" 
              dataKey="failed" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              name="실패"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// 시간대별 발송 통계 차트 컴포넌트
const HourlyDeliveriesChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <Card>
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">시간대별 발송 통계</h3>
          <p className="text-sm text-gray-600">오늘 시간대별 발송 현황</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="hour" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar 
              dataKey="success" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]}
              name="성공"
            />
            <Bar 
              dataKey="failed" 
              fill="#ef4444" 
              radius={[4, 4, 0, 0]}
              name="실패"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

const DeliveriesPage: React.FC = () => {
  const { addNotification } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recentData, setRecentData] = useState<any[]>([]);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    pending: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 최근 30분간 5분 단위 데이터
      const recentResponse = await deliveryApi.getRecentByTimeSlot();
      if (recentResponse.data.success) {
        setRecentData(recentResponse.data.data);
      }
      
      // 시간대별 통계 데이터
      const hourlyResponse = await deliveryApi.getHourlyDeliveries();
      if (hourlyResponse.data.success) {
        setHourlyData(hourlyResponse.data.data);
      }
      
      // 요약 통계 계산
      const totalRecent = recentData.reduce((sum, item) => sum + item.total, 0);
      const successRecent = recentData.reduce((sum, item) => sum + item.success, 0);
      const failedRecent = recentData.reduce((sum, item) => sum + item.failed, 0);
      
      setSummaryStats({
        total: totalRecent,
        success: successRecent,
        failed: failedRecent,
        pending: totalRecent - successRecent - failedRecent
      });
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      addNotification({
        type: 'error',
        message: '대시보드 데이터 로드 중 오류가 발생했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    addNotification({
      type: 'success',
      message: '데이터가 새로고침되었습니다.'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">발송 현황</h1>
            <p className="text-gray-600 mt-1">
              {new Date().toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>새로고침</span>
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="총 발송"
            value={summaryStats.total.toLocaleString()}
            change="+8%"
            changeType="positive"
            icon={<Send className="h-6 w-6 text-white" />}
            color="bg-blue-500"
          />
          <StatCard
            title="성공"
            value={summaryStats.success.toLocaleString()}
            change="+12%"
            changeType="positive"
            icon={<CheckCircle className="h-6 w-6 text-white" />}
            color="bg-green-500"
          />
          <StatCard
            title="실패"
            value={summaryStats.failed.toLocaleString()}
            change="-5%"
            changeType="negative"
            icon={<XCircle className="h-6 w-6 text-white" />}
            color="bg-red-500"
          />
          <StatCard
            title="대기중"
            value={summaryStats.pending.toLocaleString()}
            change="+15%"
            changeType="positive"
            icon={<Clock className="h-6 w-6 text-white" />}
            color="bg-orange-500"
          />
        </div>

        {/* 차트 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentDeliveriesChart data={recentData} />
          <HourlyDeliveriesChart data={hourlyData} />
        </div>
      </div>
    </Layout>
  );
};

export default DeliveriesPage;
