import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  BarChart3, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useAppStore } from '@/store';

const navigation = [
  { name: '대시보드', href: '/', icon: LayoutDashboard },
  { name: '캠페인', href: '/campaigns', icon: Target },
  { name: '타겟팅', href: '/targeting', icon: BarChart3 },
  { name: '고객', href: '/customers', icon: Users },
  { name: '발송 모니터링', href: '/deliveries', icon: BarChart3 },
  { name: '설정', href: '/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <>
      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* 사이드바 */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-lg lg:relative lg:translate-x-0"
      >
        <div className="flex h-full flex-col">
          {/* 헤더 */}
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">MarketReach</h1>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* 네비게이션 */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* 푸터 */}
          <div className="border-t p-4">
            <div className="text-xs text-gray-500">
              MarketReach v1.0.0
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
