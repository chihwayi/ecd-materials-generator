import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import api from '../../services/api';

interface NotificationBadgeProps {
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ className = '' }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'teacher' || user?.role === 'parent') {
      fetchUnreadCount();
      // Poll for new messages every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/communication/messages/unread-count');
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  if ((user?.role !== 'teacher' && user?.role !== 'parent') || unreadCount === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    </div>
  );
};

export default NotificationBadge; 