import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastChecked, setLastChecked] = useState(new Date());

  // Check for new reviews every 30 seconds
  useEffect(() => {
    const interval = setInterval(checkForNewReviews, 30000);
    return () => clearInterval(interval);
  }, [lastChecked]);

  const checkForNewReviews = async () => {
    try {
      const response = await apiService.getReviews({ 
        status: 'pending',
        since: lastChecked.toISOString()
      });
      
      const newReviews = response.data?.reviews || [];
      
      if (newReviews.length > 0) {
        const newNotifications = newReviews.map(review => ({
          id: `review-${review._id}`,
          type: 'review',
          title: 'New Review Submitted',
          message: `New review from ${review.userId?.firstName || 'Anonymous'}: "${review.reviewBody.substring(0, 50)}..."`,
          timestamp: new Date(review.createdAt),
          read: false,
          data: review
        }));

        setNotifications(prev => [...newNotifications, ...prev]);
        setUnreadCount(prev => prev + newNotifications.length);
      }
      
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error checking for new reviews:', error);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const removeNotification = (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    checkForNewReviews
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};