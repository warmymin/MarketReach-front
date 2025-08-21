import axios from 'axios';
import { ApiResponse, Company, Customer, TargetingLocation, Campaign, Delivery, Statistics } from '@/types';

const API_BASE_URL = 'http://localhost:8084/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 회사 관리 API
export const companyApi = {
  getAll: () => api.get<ApiResponse<Company[]>>('/companies'),
  getById: (id: string) => api.get<ApiResponse<Company>>(`/companies/${id}`),
  create: (data: Partial<Company>) => api.post<ApiResponse<Company>>('/companies', data),
  update: (id: string, data: Partial<Company>) => api.put<ApiResponse<Company>>(`/companies/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/companies/${id}`),
};

// 고객 관리 API
export const customerApi = {
  getAll: () => api.get<ApiResponse<Customer[]>>('/customers'),
  getById: (id: string) => api.get<ApiResponse<Customer>>(`/customers/${id}`),
  getNearby: (lat: number, lng: number, radius: number = 10) => 
    api.get<ApiResponse<Customer[]>>(`/customers/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
  getNearbyWithDistance: (lat: number, lng: number, radiusM: number) => 
    api.get<ApiResponse<{customers: Customer[], count: number}>>(`/customers/nearby?lat=${lat}&lng=${lng}&radiusM=${radiusM}`),
  create: (data: Partial<Customer>) => api.post<ApiResponse<Customer>>('/customers', data),
  update: (id: string, data: Partial<Customer>) => api.put<ApiResponse<Customer>>(`/customers/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/customers/${id}`),
};

// 타겟팅 관리 API
export const targetingApi = {
  getAll: () => api.get<ApiResponse<TargetingLocation[]>>('/targeting-locations'),
  getById: (id: string) => api.get<ApiResponse<TargetingLocation>>(`/targeting-locations/${id}`),
  create: (data: Partial<TargetingLocation>) => api.post<ApiResponse<TargetingLocation>>('/targeting-locations', data),
  update: (id: string, data: Partial<TargetingLocation>) => api.put<ApiResponse<TargetingLocation>>(`/targeting-locations/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/targeting-locations/${id}`),
};

// 타겟 관리 API


// 캠페인 관리 API
export const campaignApi = {
  getAll: () => api.get<ApiResponse<Campaign[]>>('/campaigns'),
  getById: (id: string) => api.get<ApiResponse<Campaign>>(`/campaigns/${id}`),
  create: (data: Partial<Campaign>) => api.post<ApiResponse<Campaign>>('/campaigns', data),
  update: (id: string, data: Partial<Campaign>) => api.put<ApiResponse<Campaign>>(`/campaigns/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/campaigns/${id}`),
};

// 발송 관리 API
export const deliveryApi = {
  getAll: () => api.get<ApiResponse<Delivery[]>>('/deliveries'),
  getById: (id: string) => api.get<ApiResponse<Delivery>>(`/deliveries/${id}`),
  getByCampaign: (campaignId: string) => api.get<ApiResponse<Delivery[]>>(`/deliveries/campaign/${campaignId}`),
  getByStatus: (status: string) => api.get<ApiResponse<Delivery[]>>(`/deliveries/status/${status}`),
  simulateCampaign: (campaignId: string) => api.post<ApiResponse<any>>(`/deliveries/simulate/${campaignId}`, {}),
  updateStatus: (id: string, status: string) => api.put<ApiResponse<Delivery>>(`/deliveries/${id}/status`, { status }),
  getSummary: () => api.get<ApiResponse<any>>('/deliveries/summary'),
  getRecent: () => api.get<ApiResponse<Delivery[]>>('/deliveries/recent'),
  getRealtimeStats: () => api.get<ApiResponse<any>>('/deliveries/realtime-stats'),
  getHourlyStats: () => api.get<ApiResponse<any>>('/deliveries/hourly-stats'),
  // 새로운 엔드포인트들
  getRecentByTimeSlot: () => api.get<ApiResponse<any>>('/deliveries/recent-timeslot'),
  getHourlyDeliveries: () => api.get<ApiResponse<any>>('/deliveries/hourly'),
};

// 통계 API
export const statisticsApi = {
  getDashboard: () => api.get<ApiResponse<Statistics>>('/statistics/dashboard'),
};

export default api;
