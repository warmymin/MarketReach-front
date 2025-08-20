'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MapPin, Edit, Trash2, Mail, Phone } from 'lucide-react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAppStore } from '@/store';
import { customerApi } from '@/lib/api';
import { Customer } from '@/types';

const CustomerCard: React.FC<{
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
}> = ({ customer, onEdit, onDelete }) => {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{customer.phone}</span>
              </div>
            )}
            {customer.address && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{customer.address}</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">위치</p>
              <p className="font-medium">
                {customer.latitude.toFixed(6)}, {customer.longitude.toFixed(6)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">등록일</p>
              <p className="font-medium">
                {new Date(customer.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(customer)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(customer.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const CustomersPage: React.FC = () => {
  const { customers, setCustomers, addCustomer, updateCustomer, deleteCustomer, addNotification } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await customerApi.getAll();
        if (response.data.success) {
          setCustomers(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch customers:', error);
        addNotification({
          type: 'error',
          message: '고객 목록을 불러오는데 실패했습니다.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [setCustomers, addNotification]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm) ||
    customer.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (customer: Customer) => {
    // TODO: 편집 모달 또는 페이지로 이동
    addNotification({
      type: 'info',
      message: '고객 편집 기능은 준비 중입니다.'
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 고객을 삭제하시겠습니까?')) {
      try {
        await customerApi.delete(id);
        deleteCustomer(id);
        addNotification({
          type: 'success',
          message: '고객이 삭제되었습니다.'
        });
      } catch (error) {
        addNotification({
          type: 'error',
          message: '고객 삭제에 실패했습니다.'
        });
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">고객 관리</h1>
            <p className="text-gray-600">고객 정보를 관리하고 위치 기반 검색을 활용하세요</p>
          </div>
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            새 고객
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 고객 수</p>
                <p className="text-2xl font-bold text-gray-900">{filteredCustomers.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">이메일 등록</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredCustomers.filter(c => c.email).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">전화번호 등록</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredCustomers.filter(c => c.phone).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* 검색 */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="고객명, 이메일, 전화번호, 주소로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* 고객 목록 */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index}>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredCustomers.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">고객이 없습니다.</p>
              <Button variant="primary">
                <Plus className="h-4 w-4 mr-2" />
                첫 번째 고객 등록
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CustomerCard
                  customer={customer}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CustomersPage;
