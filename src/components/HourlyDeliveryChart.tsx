'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { dashboardApi } from '@/lib/api';

interface MessageData {
  hour: string;
  count: number;
}

interface HourlyDeliveryChartProps {
  data?: MessageData[];
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
}

const HourlyDeliveryChart: React.FC<HourlyDeliveryChartProps> = ({ 
  data, 
  autoRefresh = false, 
  refreshInterval = 60000 // 1분마다 자동 새로고침
}) => {
  const [messageData, setMessageData] = useState<MessageData[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // API에서 시간대별 발송 데이터 가져오기
  const fetchHourlyData = async (): Promise<MessageData[]> => {
    try {
      const response = await dashboardApi.getRecentHourlyStats();
      if (response.data.success) {
        const apiData = response.data.data;
        
        // API 데이터를 MessageData 형식으로 변환
        const formattedData: MessageData[] = apiData.map((item: any) => ({
          hour: `${item.hour.toString().padStart(2, '0')}:00`,
          count: item.count || 0
        }));
        
        return formattedData;
      }
    } catch (error) {
      console.error('시간대별 발송 데이터 조회 실패:', error);
    }
    
    // API 실패 시 현재 시간 기준으로 기본 데이터 생성
    return generateDefaultTimeSlots();
  };

  // 현재 시간을 기준으로 -4시간부터 현재까지의 5개 시간대 생성 (기본값)
  const generateDefaultTimeSlots = (): MessageData[] => {
    const now = new Date();
    const slots: MessageData[] = [];

    // 현재 시간부터 -4시간까지 5개 시간대 생성
    for (let i = 4; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(now.getHours() - i, 0, 0, 0); // 분, 초, 밀리초를 0으로 설정
      
      const hourString = time.getHours().toString().padStart(2, '0');
      const timeString = `${hourString}:00`;
      
      // props로 받은 데이터가 있으면 사용, 없으면 0으로 설정
      const existingData = data?.find(item => item.hour === timeString);
      const count = existingData ? existingData.count : 0;
      
      slots.push({
        hour: timeString,
        count: count
      });
    }

    return slots;
  };

  // 수동 새로고침 함수
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setCurrentTime(new Date());
    
    try {
      const newData = await fetchHourlyData();
      setMessageData(newData);
    } catch (error) {
      console.error('데이터 새로고침 실패:', error);
    }
    
    // 새로고침 애니메이션을 위한 지연
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 API에서 데이터 가져오기
    const loadData = async () => {
      const newData = await fetchHourlyData();
      setMessageData(newData);
    };
    
    loadData();

    // 현재 시간 업데이트 (1분마다)
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // 자동 새로고침 설정
    if (autoRefresh) {
      const refreshInterval = setInterval(async () => {
        const newData = await fetchHourlyData();
        setMessageData(newData);
      }, refreshInterval);

      return () => {
        clearInterval(timeInterval);
        clearInterval(refreshInterval);
      };
    }

    return () => clearInterval(timeInterval);
  }, [data, autoRefresh, refreshInterval]);

  // 커스텀 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{`시간: ${label}`}</p>
          <p className="text-purple-600 font-medium">
            {`발송 건수: ${payload[0].value}건`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* 제목 및 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            시간대별 발송 현황
          </h3>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>새로고침</span>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            오늘 발송된 메시지 추이
          </p>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>
              {currentTime.toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })}
            </span>
          </div>
        </div>
      </div>

      {/* 차트 */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={messageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="hour" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}건`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="#8b5cf6" 
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 범례 */}
      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span className="text-sm text-gray-600">발송 건수</span>
        </div>
      </div>
    </div>
  );
};

export default HourlyDeliveryChart;
