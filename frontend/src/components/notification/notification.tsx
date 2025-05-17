import { useState, useEffect } from "react";
import { Bell, BellOff, CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  getNotification,
  markNotificationAsRead,
} from "@/services/notification.service.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import { convertDateToTimeAgo } from "@/utils/dateUtils.ts";

export type Notification = {
  id: string;
  message: string;
  type: string;
  userId: number;
  isRead: boolean;
  createdAt: string;
};

export function NotificationPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchNotifications = async () => {
    try {
      if (!currentUser) return;
      const data = await getNotification(currentUser?.id);
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications().then();
  }, []);

  useEffect(() => {
    //call every 1mins
    const interval = setInterval(() => {
      fetchNotifications().then();
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          {unreadCount > 0 ? (
            <>
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            </>
          ) : (
            <BellOff className="h-5 w-5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" forceMount>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-96">
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No new notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-muted/50 transition-colors",
                    !notification.isRead && "bg-muted/25",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      {notification.type === "success" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : notification.type === "error" ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <Info className="h-5 w-5 text-blue-500" />
                      )}
                      <div>
                        <p className="text-sm">{notification.message}</p>
                        <time className="text-xs text-muted-foreground mt-1">
                          {convertDateToTimeAgo(notification.createdAt)}
                        </time>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-6 px-2"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
