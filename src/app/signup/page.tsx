'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  FileText,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    business_number: '',
    industry: '',
    email: '',
    phone: '',
    address: '',
    created_at: new Date().toISOString().split('T')[0] // 오늘 날짜 자동 설정
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 산업군 옵션
  const industryOptions = [
    'IT/소프트웨어',
    '제조업',
    '유통/물류',
    '금융/보험',
    '건설업',
    '의료/제약',
    '교육',
    '미디어/엔터테인먼트',
    '식품/음료',
    '화장품/뷰티',
    '부동산',
    '기타'
  ];

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

    if (!formData.name.trim()) {
      newErrors.name = '기업명을 입력해주세요.';
    }

    if (!formData.business_number.trim()) {
      newErrors.business_number = '사업자등록번호를 입력해주세요.';
    } else if (!/^\d{3}-\d{2}-\d{5}$/.test(formData.business_number)) {
      newErrors.business_number = '사업자등록번호 형식이 올바르지 않습니다. (예: 123-45-67890)';
    }

    if (!formData.industry) {
      newErrors.industry = '산업군을 선택해주세요.';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^\d{2,3}-\d{3,4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '전화번호 형식이 올바르지 않습니다. (예: 02-1234-5678)';
    }

    if (!formData.address.trim()) {
      newErrors.address = '주소를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('회원가입 데이터:', formData);
      alert('회원가입이 완료되었습니다! (콘솔에서 데이터를 확인하세요)');
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
            className="max-w-2xl mx-auto"
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
                B2B 위치기반 마케팅 서비스 기업 회원가입
              </p>
            </div>

            {/* 회원가입 폼 */}
            <Card>
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 기업명 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Building2 className="inline w-4 h-4 mr-2" />
                      기업명 *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="기업명을 입력하세요"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* 사업자등록번호 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="inline w-4 h-4 mr-2" />
                      사업자등록번호 *
                    </label>
                    <Input
                      type="text"
                      value={formData.business_number}
                      onChange={(e) => handleInputChange('business_number', e.target.value)}
                      placeholder="123-45-67890"
                      className={errors.business_number ? 'border-red-500' : ''}
                    />
                    {errors.business_number && (
                      <p className="mt-1 text-sm text-red-600">{errors.business_number}</p>
                    )}
                  </div>

                  {/* 산업군 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="inline w-4 h-4 mr-2" />
                      산업군 *
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.industry ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">산업군을 선택하세요</option>
                      {industryOptions.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                    {errors.industry && (
                      <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
                    )}
                  </div>

                  {/* 이메일 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline w-4 h-4 mr-2" />
                      이메일 *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="example@company.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* 전화번호 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline w-4 h-4 mr-2" />
                      전화번호 *
                    </label>
                    <Input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="02-1234-5678"
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  {/* 주소 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-2" />
                      주소 *
                    </label>
                    <Input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="서울시 강남구 테헤란로 123"
                      className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                    )}
                  </div>

                  {/* 가입일 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline w-4 h-4 mr-2" />
                      가입일
                    </label>
                    <Input
                      type="date"
                      value={formData.created_at}
                      readOnly
                      className="bg-gray-50 cursor-not-allowed"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      가입일은 자동으로 설정됩니다.
                    </p>
                  </div>

                  {/* 회원가입 버튼 */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full py-3 text-lg font-semibold"
                    >
                      <span>회원가입</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </form>

                {/* 추가 정보 */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">
                      📍 위치기반 마케팅 서비스란?
                    </h3>
                    <p className="text-sm text-blue-800">
                      KT MarketReach는 고객의 위치 정보를 활용하여 타겟 고객에게 
                      정확하고 효과적인 마케팅 메시지를 전달하는 B2B 서비스입니다.
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

export default SignupPage;
