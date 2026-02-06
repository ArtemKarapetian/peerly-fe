import { Bell, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * NotificationsList - Мини-список последних уведомлений
 * 
 * Показывает 3 последних уведомления + ссылку "Все уведомления"
 */

export type NotificationType = 'feedback' | 'grade' | 'reminder' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  time: string; // e.g., "10 минут назад"
  isRead: boolean;
}

interface NotificationsListProps {
  items: Notification[];
  onNotificationClick: (id: string) => void;
  onViewAllClick: () => void;
}

export function NotificationsList({ 
  items, 
  onNotificationClick, 
  onViewAllClick 
}: NotificationsListProps) {
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'feedback':
        return MessageSquare;
      case 'grade':
        return CheckCircle;
      case 'reminder':
        return AlertCircle;
      case 'info':
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'feedback':
        return 'bg-[#9cf38d]';
      case 'grade':
        return 'bg-[#b7bdff]';
      case 'reminder':
        return 'bg-[#ffd4a3]';
      case 'info':
      default:
        return 'bg-[#d2e1f8]';
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="w-10 h-10 bg-[#d2e1f8] rounded-full mx-auto flex items-center justify-center mb-2">
          <Bell className="w-5 h-5 text-[#5b8def]" />
        </div>
        <p className="text-[13px] text-[#767692]">
          Нет новых уведомлений
        </p>
      </div>
    );
  }

  // Show only latest 3
  const displayItems = items.slice(0, 3);

  return (
    <div className="space-y-0">
      {/* Notifications list */}
      <div>
        {displayItems.map((notification, index) => {
          const Icon = getNotificationIcon(notification.type);
          const color = getNotificationColor(notification.type);

          return (
            <button
              key={notification.id}
              onClick={() => onNotificationClick(notification.id)}
              className={`
                w-full text-left p-3 transition-all
                ${index !== displayItems.length - 1 ? 'border-b border-[#e6e8ee]' : ''}
                ${notification.isRead 
                  ? 'hover:bg-white hover:shadow-sm hover:rounded-[12px]' 
                  : 'bg-white/30 hover:bg-white hover:shadow-sm hover:rounded-[12px]'
                }
              `}
            >
              <div className="flex items-start gap-2.5">
                {/* Icon */}
                <div className={`w-7 h-7 ${color} rounded-[6px] flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4 text-[#21214f]" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className={`text-[13px] mb-1 leading-[1.4] tracking-[-0.2px] ${notification.isRead ? 'text-[#767692]' : 'text-[#21214f] font-medium'}`}>
                    {notification.title}
                  </div>
                  <div className="text-[12px] text-[#767692]">
                    {notification.time}
                  </div>
                </div>

                {/* Unread indicator */}
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-[#2563eb] rounded-full shrink-0 mt-1.5"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* View all link */}
      {items.length > 3 && (
        <button
          onClick={() => {
            window.location.hash = '/inbox';
            onViewAllClick();
          }}
          className="w-full text-center text-[14px] text-[#2563eb] hover:text-[#1d4ed8] font-medium py-3 transition-colors border-t border-[#e6e8ee]"
        >
          Все уведомления ({items.length})
        </button>
      )}
    </div>
  );
}