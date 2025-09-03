import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink,
  Clock,
  Package,
  Users,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { useNotifications, type SystemNotification } from '../../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterProps {
  children?: React.ReactNode;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  children,
}) => {
  const {
    systemNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    unreadCount,
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (notification: SystemNotification) => {
    // Try to determine icon from notification data or type
    if (notification.data?.type) {
      switch (notification.data.type) {
        case 'product':
          return <Package className="h-4 w-4" />;
        case 'user':
          return <Users className="h-4 w-4" />;
        case 'system':
          return <Activity className="h-4 w-4" />;
        default:
          return <Bell className="h-4 w-4" />;
      }
    }

    switch (notification.type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const handleNotificationClick = (notification: SystemNotification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Execute primary action if available
    if (notification.actions && notification.actions.length > 0) {
      notification.actions[0].onClick();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount} unread</Badge>
              )}
            </div>
          </SheetTitle>
          <SheetDescription>
            Stay updated with system activities and important events
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {systemNotifications.length > 0 && (
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear all
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            {systemNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No notifications</h3>
                <p className="text-sm text-muted-foreground">
                  You're all caught up! New notifications will appear here.
                </p>
              </div>
            ) : (
              systemNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative p-4 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                    !notification.read
                      ? 'bg-primary/5 border-primary/20'
                      : 'bg-background'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {!notification.read && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium truncate">
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2 ml-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(notification.timestamp, {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                      
                      {notification.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.description}
                        </p>
                      )}

                      {notification.actions && notification.actions.length > 0 && (
                        <div className="flex space-x-2 mt-3">
                          {notification.actions.map((action, index) => (
                            <Button
                              key={index}
                              variant={action.variant === 'destructive' ? 'destructive' : 'outline'}
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick();
                                if (!notification.read) {
                                  markAsRead(notification.id);
                                }
                              }}
                            >
                              {action.label}
                              {action.label.includes('View') && (
                                <ExternalLink className="h-3 w-3 ml-1" />
                              )}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
