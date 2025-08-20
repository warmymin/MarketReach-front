'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Database, Palette } from 'lucide-react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const SettingsPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">설정</h1>
          <p className="text-gray-600">MarketReach 플랫폼 설정을 관리하세요</p>
        </div>

        {/* 설정 카테고리 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 프로필 설정 */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <User className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">프로필 설정</h2>
            </div>
            
            <div className="space-y-4">
              <Input
                label="이름"
                placeholder="관리자"
                defaultValue="관리자"
              />
              <Input
                label="이메일"
                type="email"
                placeholder="admin@marketreach.com"
                defaultValue="admin@marketreach.com"
              />
              <Input
                label="전화번호"
                placeholder="010-1234-5678"
                defaultValue="010-1234-5678"
              />
              
              <div className="pt-4">
                <Button variant="primary">
                  프로필 업데이트
                </Button>
              </div>
            </div>
          </Card>

          {/* 알림 설정 */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="h-6 w-6 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-900">알림 설정</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">이메일 알림</p>
                  <p className="text-sm text-gray-500">캠페인 완료 및 발송 상태 알림</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">브라우저 알림</p>
                  <p className="text-sm text-gray-500">실시간 발송 상태 업데이트</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">SMS 알림</p>
                  <p className="text-sm text-gray-500">중요한 발송 실패 알림</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </Card>

          {/* 보안 설정 */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900">보안 설정</h2>
            </div>
            
            <div className="space-y-4">
              <Input
                label="현재 비밀번호"
                type="password"
                placeholder="현재 비밀번호를 입력하세요"
              />
              <Input
                label="새 비밀번호"
                type="password"
                placeholder="새 비밀번호를 입력하세요"
              />
              <Input
                label="새 비밀번호 확인"
                type="password"
                placeholder="새 비밀번호를 다시 입력하세요"
              />
              
              <div className="pt-4">
                <Button variant="primary">
                  비밀번호 변경
                </Button>
              </div>
            </div>
          </Card>

          {/* 데이터베이스 설정 */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <Database className="h-6 w-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900">데이터베이스 설정</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">연결 상태</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">연결됨</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">데이터베이스</p>
                  <p className="font-medium">PostgreSQL</p>
                </div>
                <div>
                  <p className="text-gray-500">버전</p>
                  <p className="font-medium">15.0</p>
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline">
                  데이터베이스 테스트
                </Button>
              </div>
            </div>
          </Card>

          {/* 테마 설정 */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <Palette className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900">테마 설정</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-900 mb-3">색상 테마</p>
                <div className="grid grid-cols-3 gap-3">
                  <button className="w-full h-12 bg-blue-600 rounded-lg border-2 border-blue-600"></button>
                  <button className="w-full h-12 bg-green-600 rounded-lg border-2 border-transparent hover:border-green-600"></button>
                  <button className="w-full h-12 bg-purple-600 rounded-lg border-2 border-transparent hover:border-purple-600"></button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">다크 모드</p>
                  <p className="text-sm text-gray-500">어두운 테마 사용</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </Card>

          {/* 시스템 정보 */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="h-6 w-6 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-900">시스템 정보</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">버전</p>
                  <p className="font-medium">MarketReach v1.0.0</p>
                </div>
                <div>
                  <p className="text-gray-500">빌드</p>
                  <p className="font-medium">2024.01.01</p>
                </div>
                <div>
                  <p className="text-gray-500">Node.js</p>
                  <p className="font-medium">18.17.0</p>
                </div>
                <div>
                  <p className="text-gray-500">React</p>
                  <p className="font-medium">18.2.0</p>
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline">
                  업데이트 확인
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
