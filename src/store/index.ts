import { create } from 'zustand';
import { Statistics, Campaign, TargetingLocation, Customer, Delivery } from '@/types';

interface AppState {
  // 로딩 상태
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // 로그인 상태
  isLoggedIn: boolean;
  user: { email: string; name?: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // 통계 데이터
  statistics: Statistics | null;
  setStatistics: (stats: Statistics) => void;
  
  // 캠페인 데이터
  campaigns: Campaign[];
  setCampaigns: (campaigns: Campaign[]) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, campaign: Campaign) => void;
  deleteCampaign: (id: string) => void;
  
  // 타겟팅 데이터
  targetingLocations: TargetingLocation[];
  setTargetingLocations: (locations: TargetingLocation[]) => void;
  addTargetingLocation: (location: TargetingLocation) => void;
  updateTargetingLocation: (id: string, location: TargetingLocation) => void;
  deleteTargetingLocation: (id: string) => void;
  
  // 고객 데이터
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  
  // 발송 데이터
  deliveries: Delivery[];
  setDeliveries: (deliveries: Delivery[]) => void;
  addDelivery: (delivery: Delivery) => void;
  updateDelivery: (id: string, delivery: Delivery) => void;
  deleteDelivery: (id: string) => void;
  
  // UI 상태
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // 알림
  notifications: Array<{ id: string; type: 'success' | 'error' | 'info'; message: string }>;
  addNotification: (notification: { type: 'success' | 'error' | 'info'; message: string }) => void;
  removeNotification: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // 로딩 상태
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  
  // 로그인 상태
  isLoggedIn: false,
  user: null,
  login: async (email: string, password: string) => {
    try {
      // 실제 로그인 API 호출 (현재는 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 로그인 성공 시 상태 업데이트
      set({ 
        isLoggedIn: true, 
        user: { email, name: email.split('@')[0] } 
      });
      
      // 로컬 스토리지에 로그인 상태 저장
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }));
      
      return true;
    } catch (error) {
      console.error('로그인 실패:', error);
      return false;
    }
  },
  logout: () => {
    set({ isLoggedIn: false, user: null });
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  },
  
  // 통계 데이터
  statistics: null,
  setStatistics: (stats) => set({ statistics: stats }),
  
  // 캠페인 데이터
  campaigns: [],
  setCampaigns: (campaigns) => set({ campaigns }),
  addCampaign: (campaign) => set((state) => ({ campaigns: [...state.campaigns, campaign] })),
  updateCampaign: (id, campaign) => set((state) => ({
    campaigns: state.campaigns.map(c => c.id === id ? campaign : c)
  })),
  deleteCampaign: (id) => set((state) => ({
    campaigns: state.campaigns.filter(c => c.id !== id)
  })),
  
  // 타겟팅 데이터
  targetingLocations: [],
  setTargetingLocations: (locations) => set({ targetingLocations: locations }),
  addTargetingLocation: (location) => set((state) => ({ 
    targetingLocations: [...state.targetingLocations, location] 
  })),
  updateTargetingLocation: (id, location) => set((state) => ({
    targetingLocations: state.targetingLocations.map(t => t.id === id ? location : t)
  })),
  deleteTargetingLocation: (id) => set((state) => ({
    targetingLocations: state.targetingLocations.filter(t => t.id !== id)
  })),
  
  // 고객 데이터
  customers: [],
  setCustomers: (customers) => set({ customers }),
  addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),
  updateCustomer: (id, customer) => set((state) => ({
    customers: state.customers.map(c => c.id === id ? customer : c)
  })),
  deleteCustomer: (id) => set((state) => ({
    customers: state.customers.filter(c => c.id !== id)
  })),
  
  // 발송 데이터
  deliveries: [],
  setDeliveries: (deliveries) => set({ deliveries }),
  addDelivery: (delivery) => set((state) => ({ deliveries: [...state.deliveries, delivery] })),
  updateDelivery: (id, delivery) => set((state) => ({
    deliveries: state.deliveries.map(d => d.id === id ? delivery : d)
  })),
  deleteDelivery: (id) => set((state) => ({
    deliveries: state.deliveries.filter(d => d.id !== id)
  })),
  
  // UI 상태
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  // 알림
  notifications: [],
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, { ...notification, id: Date.now().toString() }]
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
}));
