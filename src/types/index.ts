// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// 회사 타입
export interface Company {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

// 고객 타입
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  lat: number;
  lng: number;
  address?: string;
  companyId: string;
  createdAt: string;
  updatedAt?: string;
}

// 고객 거리 정보 타입
export interface CustomerWithDistance extends Customer {
  distance?: number; // km 단위
}



// 타겟팅 위치 타입
export interface TargetingLocation {
  id: string;
  name: string;
  centerLat: number;
  centerLng: number;
  radiusM: number;
  memo?: string;
  createdAt: string;
}

// 캠페인 타입
export interface Campaign {
  id: string;
  name: string;
  message: string;
  description?: string;
  status: 'DRAFT' | 'SENDING' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';
  targetingLocationId?: string;

  companyId?: string;
  createdAt: string;
  updatedAt?: string;
  deliveries?: Delivery[];
}

// 발송 타입
export interface Delivery {
  id: string;
  campaignId?: string;
  customerId?: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  messageTextSent?: string;
  errorCode?: string;
  sentAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt?: string;
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
