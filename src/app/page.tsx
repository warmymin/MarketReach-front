'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Send, 
  Users, 
  TrendingUp, 
  Plus, 
  Calendar, 
  MapPin, 
  MessageSquare,
  RefreshCw,
  Settings,
  HelpCircle
} from 'lucide-react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAppStore } from '@/store';
import { dashboardApi } from '@/lib/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import HourlyDeliveryChart from '@/components/HourlyDeliveryChart';

// 요약 지표 카드 컴포넌트
const SummaryCard: React.FC<{
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, change, changeType, icon, color }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-green-600';
    if (changeType === 'negative') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm font-medium ${getChangeColor()}`}>
            {change}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

// 시간대별 발송 현황 차트 컴포넌트
const HourlyDeliveriesChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <Card>
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">시간대별 발송 현황</h3>
          <p className="text-sm text-gray-600">오늘 발송된 메시지 현황</p>
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
              dataKey="count" 
              fill="#8b5cf6" 
              radius={[4, 4, 0, 0]}
              name="발송 건수"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// 지역별 고객 분포 차트 컴포넌트
const CustomerDistributionChart: React.FC<{ data: any[] }> = ({ data }) => {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  
  // 데이터 전처리: Top 5 + 기타로 그룹화
  const processData = (rawData: any[]) => {
    if (rawData.length <= 5) return rawData;
    
    const top5 = rawData.slice(0, 5);
    const others = rawData.slice(5);
    
    // 기타 그룹 생성
    const othersGroup = {
      region: '기타',
      count: others.reduce((sum, item) => sum + item.count, 0),
      percentage: Math.round(others.reduce((sum, item) => sum + item.percentage, 0) * 10) / 10
    };
    
    return [...top5, othersGroup];
  };
  
  const processedData = processData(data);
  
  // 커스텀 레이블 렌더러 - 작은 비율은 레이블 숨김
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, region, percentage }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // 5% 미만이면 레이블 숨김
    if (percent < 0.05) {
      return null;
    }
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${region}\n${percentage}%`}
      </text>
    );
  };
  
  // 고도화된 커스텀 툴팁
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-2xl backdrop-blur-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].fill }}></div>
              <p className="font-bold text-gray-900 text-lg">{data.region}</p>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <span className="text-xl">👥</span>
              <span className="font-semibold">{data.count}명</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <span className="text-xl">📊</span>
              <span className="font-semibold">{data.percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">지역별 고객 분포</h3>
          <p className="text-sm text-gray-600">타겟 고객 지역 분포도 (Top 5 + 기타)</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="percentage"
            >
              {processedData.map((entry, index) => {
                // 기타 그룹은 항상 마지막 색상 사용
                const colorIndex = entry.region === '기타' ? COLORS.length - 1 : index % (COLORS.length - 1);
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[colorIndex]}
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                );
              })}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// 캠페인 목록 컴포넌트
const CampaignList: React.FC<{ campaigns: any[] }> = ({ campaigns }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENDING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SENDING':
        return '진행중';
      case 'COMPLETED':
        return '완료';
      case 'DRAFT':
        return '대기';
      default:
        return status;
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">최근 캠페인</h3>
            <p className="text-sm text-gray-600">진행 중이거나 최근 완료된 캠페인</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>새 캠페인 생성</span>
          </Button>
        </div>
        
        <div className="space-y-4">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{campaign.name}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{campaign.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(campaign.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{campaign.messageCount}건</span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                {getStatusText(campaign.status)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};

const DashboardPage: React.FC = () => {
  const { addNotification } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summaryData, setSummaryData] = useState({
    totalCampaigns: 0,
    totalDeliveries: 0,
    sentCount: 0,
    failedCount: 0,
    pendingCount: 0,
    reachedCustomers: 0,
    reachRate: 0,
    totalChange: 0,
    successChange: 0,
    failureChange: 0,
    pendingChange: 0
  });
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [distributionData, setDistributionData] = useState<any[]>([]);
  const [campaignsData, setCampaignsData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 요약 지표
      const summaryResponse = await dashboardApi.getSummary();
      if (summaryResponse.data.success) {
        setSummaryData(summaryResponse.data.data);
      }
      
      // 시간대별 발송 현황
      const hourlyResponse = await dashboardApi.getHourlyDeliveries();
      if (hourlyResponse.data.success) {
        setHourlyData(hourlyResponse.data.data);
      }
      
      // 지역별 고객 분포
      const distributionResponse = await dashboardApi.getCustomerDistribution();
      if (distributionResponse.data.success) {
        setDistributionData(distributionResponse.data.data);
      }
      
      // 최근 캠페인 목록
      const campaignsResponse = await dashboardApi.getRecentCampaigns();
      if (campaignsResponse.data.success) {
        setCampaignsData(campaignsResponse.data.data.slice(0, 3)); // 최근 3개만
      }
      
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
            <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
            <p className="text-gray-600 mt-1">MarketReach 플랫폼 현황을 한눈에 확인하세요</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>새로고침</span>
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 요약 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title="총 발송"
            value={summaryData.totalDeliveries?.toLocaleString() || '0'}
            change={`${summaryData.totalChange > 0 ? '+' : ''}${summaryData.totalChange}%`}
            changeType={summaryData.totalChange >= 0 ? "positive" : "negative"}
            icon={<Send className="h-6 w-6 text-white" />}
            color="bg-blue-500"
          />
          <SummaryCard
            title="성공"
            value={summaryData.sentCount?.toLocaleString() || '0'}
            change={`${summaryData.successChange > 0 ? '+' : ''}${summaryData.successChange}%`}
            changeType={summaryData.successChange >= 0 ? "positive" : "negative"}
            icon={<Users className="h-6 w-6 text-white" />}
            color="bg-green-500"
          />
          <SummaryCard
            title="실패"
            value={summaryData.failedCount?.toLocaleString() || '0'}
            change={`${summaryData.failureChange > 0 ? '+' : ''}${summaryData.failureChange}%`}
            changeType={summaryData.failureChange >= 0 ? "negative" : "positive"}
            icon={<TrendingUp className="h-6 w-6 text-white" />}
            color="bg-red-500"
          />
          <SummaryCard
            title="대기중"
            value={summaryData.pendingCount?.toLocaleString() || '0'}
            change={`${summaryData.pendingChange > 0 ? '+' : ''}${summaryData.pendingChange}%`}
            changeType={summaryData.pendingChange >= 0 ? "positive" : "negative"}
            icon={<Target className="h-6 w-6 text-white" />}
            color="bg-orange-500"
          />
        </div>

        {/* 차트 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HourlyDeliveryChart />
          <CustomerDistributionChart data={distributionData} />
        </div>

        {/* 캠페인 목록 */}
        <CampaignList campaigns={campaignsData} />
      </div>
    </Layout>
  );
};

export default DashboardPage;
