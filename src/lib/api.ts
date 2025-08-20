import axios from 'axios';
import { ApiResponse, Company, Customer, TargetingLocation, Campaign, Delivery, Statistics } from '@/types';

const API_BASE_URL = 'http://localhost:8083/api';

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
  getById: (id: number) => api.get<ApiResponse<Company>>(`/companies/${id}`),
  create: (data: Partial<Company>) => api.post<ApiResponse<Company>>('/companies', data),
  update: (id: number, data: Partial<Company>) => api.put<ApiResponse<Company>>(`/companies/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/companies/${id}`),
};

// 고객 관리 API
export const customerApi = {
  getAll: () => api.get<ApiResponse<Customer[]>>('/customers'),
  getById: (id: number) => api.get<ApiResponse<Customer>>(`/customers/${id}`),
  getNearby: (lat: number, lng: number, radius: number = 10) => 
    api.get<ApiResponse<Customer[]>>(`/customers/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
  create: (data: Partial<Customer>) => api.post<ApiResponse<Customer>>('/customers', data),
  update: (id: number, data: Partial<Customer>) => api.put<ApiResponse<Customer>>(`/customers/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/customers/${id}`),
};

// 타겟팅 관리 API
export const targetingApi = {
  getAll: () => api.get<ApiResponse<TargetingLocation[]>>('/targeting-locations'),
  getById: (id: number) => api.get<ApiResponse<TargetingLocation>>(`/targeting-locations/${id}`),
  create: (data: Partial<TargetingLocation>) => api.post<ApiResponse<TargetingLocation>>('/targeting-locations', data),
  update: (id: number, data: Partial<TargetingLocation>) => api.put<ApiResponse<TargetingLocation>>(`/targeting-locations/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/targeting-locations/${id}`),
};

// 캠페인 관리 API
export const campaignApi = {
  getAll: () => api.get<ApiResponse<Campaign[]>>('/campaigns'),
  getById: (id: number) => api.get<ApiResponse<Campaign>>(`/campaigns/${id}`),
  create: (data: Partial<Campaign>) => api.post<ApiResponse<Campaign>>('/campaigns', data),
  update: (id: number, data: Partial<Campaign>) => api.put<ApiResponse<Campaign>>(`/campaigns/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/campaigns/${id}`),
};

// 발송 관리 API
export const deliveryApi = {
  getAll: () => api.get<ApiResponse<Delivery[]>>('/deliveries'),
  getById: (id: number) => api.get<ApiResponse<Delivery>>(`/deliveries/${id}`),
  getByCampaign: (campaignId: number) => api.get<ApiResponse<Delivery[]>>(`/deliveries/campaign/${campaignId}`),
  create: (data: Partial<Delivery>) => api.post<ApiResponse<Delivery>>('/deliveries', data),
  update: (id: number, data: Partial<Delivery>) => api.put<ApiResponse<Delivery>>(`/deliveries/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/deliveries/${id}`),
};

// 통계 API
export const statisticsApi = {
  getDashboard: () => api.get<ApiResponse<Statistics>>('/statistics/dashboard'),
};

export default api;
