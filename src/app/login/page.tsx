'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Mail, 
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  UserPlus
} from 'lucide-react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 에러 메시지 초기화
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    }

    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        // 로그인 처리 (지연 없음)
        console.log('로그인 데이터:', formData);
        
        // 로그인 성공 시 대시보드로 이동
        router.push('/');
        
      } catch (error) {
        console.error('로그인 실패:', error);
        setErrors({ general: '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            {/* 헤더 */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                KT MarketReach
              </h1>
              <p className="text-lg text-gray-600">
                위치기반 마케팅 서비스 로그인
              </p>
            </div>

            {/* 로그인 폼 */}
            <Card>
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 일반 에러 메시지 */}
                  {errors.general && (
                    <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                      <p className="text-sm text-red-600">{errors.general}</p>
                    </div>
                  )}

                  {/* 이메일 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline w-4 h-4 mr-2" />
                      이메일
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="example@company.com"
                      className={errors.email ? 'border-red-500' : ''}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* 비밀번호 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock className="inline w-4 h-4 mr-2" />
                      비밀번호
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="비밀번호를 입력하세요"
                        className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  {/* 로그인 버튼 */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full py-3 text-lg font-semibold"
                      loading={isLoading}
                      disabled={isLoading}
                    >
                      <span>{isLoading ? '로그인 중...' : '로그인'}</span>
                      {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
                    </Button>
                  </div>
                </form>

                {/* 추가 링크 */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      아직 계정이 없으신가요?
                    </p>
                    <Link
                      href="/signup"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      회원가입하기
                    </Link>
                  </div>
                </div>

                {/* 서비스 소개 */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">
                      📍 위치기반 마케팅 서비스
                    </h3>
                    <p className="text-sm text-blue-800">
                      KT MarketReach로 타겟 고객에게 정확하고 효과적인 
                      마케팅 메시지를 전달하세요.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
