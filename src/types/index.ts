// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// 회사 타입
export interface Company {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// 고객 타입
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  latitude: number;
  longitude: number;
  address?: string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

// 타겟팅 위치 타입
export interface TargetingLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  description?: string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

// 캠페인 타입
export interface Campaign {
  id: number;
  name: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  targetingLocationId: number;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

// 발송 타입
export interface Delivery {
  id: number;
  campaignId: number;
  customerId: number;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  sentAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 통계 타입
export interface Statistics {
  totalCompanies: number;
  totalCustomers: number;
  totalCampaigns: number;
  totalTargetingLocations: number;
  activeDeliveries: number;
  completedDeliveries: number;
}

// 지도 좌표 타입
export interface Coordinates {
  lat: number;
  lng: number;
}
