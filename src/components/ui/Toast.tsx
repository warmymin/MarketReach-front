import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useAppStore } from '@/store';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

const Toast: React.FC<ToastProps> = ({ id, type, message }) => {
  const removeNotification = useAppStore((state) => state.removeNotification);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(id);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [id, removeNotification]);
  
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };
  
  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-center gap-3 rounded-lg border p-4 shadow-lg ${colors[type]}`}
    >
      {icons[type]}
      <p className="flex-1 text-sm font-medium text-gray-900">{message}</p>
      <button
        onClick={() => removeNotification(id)}
        className="text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

const ToastContainer: React.FC = () => {
  const notifications = useAppStore((state) => state.notifications);
  
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Toast key={notification.id} {...notification} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
