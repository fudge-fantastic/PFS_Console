import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  Bell,
  ExternalLink,
  X 
} from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'system';

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

export interface NotificationOptions {
  title: string;
  description?: string;
  type?: NotificationType;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
  data?: any;
}

export interface SystemNotification extends NotificationOptions {
  id: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  // Toast notifications
  success: (message: string, options?: Partial<NotificationOptions>) => void;
  error: (message: string, options?: Partial<NotificationOptions>) => void;
  warning: (message: string, options?: Partial<NotificationOptions>) => void;
  info: (message: string, options?: Partial<NotificationOptions>) => void;
  
  // System notifications (persistent)
  systemNotifications: SystemNotification[];
  addSystemNotification: (notification: NotificationOptions) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-4 w-4" />;
    case 'error':
      return <XCircle className="h-4 w-4" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4" />;
    case 'info':
      return <Info className="h-4 w-4" />;
    case 'system':
      return <Bell className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const getToastStyle = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return {
        style: {
          background: 'hsl(var(--success))',
          borderColor: 'hsl(var(--success))',
          color: 'hsl(var(--success-foreground))',
        },
      };
    case 'error':
      return {
        style: {
          background: 'hsl(var(--destructive))',
          borderColor: 'hsl(var(--destructive))',
          color: 'hsl(var(--destructive-foreground))',
        },
      };
    case 'warning':
      return {
        style: {
          background: 'hsl(var(--warning))',
          borderColor: 'hsl(var(--warning))',
          color: 'hsl(var(--warning-foreground))',
        },
      };
    case 'info':
    case 'system':
    default:
      return {};
  }
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [systemNotifications, setSystemNotifications] = useState<SystemNotification[]>([]);

  const showToast = useCallback(
    (type: NotificationType, message: string, options?: Partial<NotificationOptions>) => {
      const icon = getIcon(type);
      const styleConfig = getToastStyle(type);
      
      const toastOptions = {
        duration: options?.persistent ? Infinity : (options?.duration || 4000),
        ...styleConfig,
      };

      if (options?.description || options?.actions) {
        // Rich toast with description and actions
        toast.custom(
          (t) => (
            <div className="flex items-start space-x-3 p-4 bg-background border rounded-lg shadow-lg min-w-[350px]">
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 space-y-1">
                <div className="font-medium text-sm">{message}</div>
                {options?.description && (
                  <div className="text-sm text-muted-foreground">
                    {options.description}
                  </div>
                )}
                {options?.actions && (
                  <div className="flex space-x-2 mt-2">
                    {options.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          action.onClick();
                          toast.dismiss(t);
                        }}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                          action.variant === 'destructive'
                            ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => toast.dismiss(t)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ),
          toastOptions
        );
      } else {
        // Simple toast
        toast(message, {
          icon,
          ...toastOptions,
        });
      }
    },
    []
  );

  const success = useCallback(
    (message: string, options?: Partial<NotificationOptions>) => {
      showToast('success', message, options);
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, options?: Partial<NotificationOptions>) => {
      showToast('error', message, options);
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, options?: Partial<NotificationOptions>) => {
      showToast('warning', message, options);
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, options?: Partial<NotificationOptions>) => {
      showToast('info', message, options);
    },
    [showToast]
  );

  const addSystemNotification = useCallback((notification: NotificationOptions) => {
    const systemNotification: SystemNotification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    };

    setSystemNotifications(prev => [systemNotification, ...prev]);

    // Also show as toast if not persistent system notification
    if (notification.type !== 'system') {
      showToast(notification.type || 'info', notification.title, notification);
    }
  }, [showToast]);

  const markAsRead = useCallback((id: string) => {
    setSystemNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setSystemNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setSystemNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  }, []);

  const clearAll = useCallback(() => {
    setSystemNotifications([]);
  }, []);

  const unreadCount = systemNotifications.filter(n => !n.read).length;

  const contextValue: NotificationContextType = {
    success,
    error,
    warning,
    info,
    systemNotifications,
    addSystemNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    unreadCount,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
