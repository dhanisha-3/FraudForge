import React from "react";
import {
  Bell,
  Check,
  Shield,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  description: string;
  type: "security" | "alert" | "info" | "success" | "error";
  timestamp: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Security Alert",
    description: "Unusual login attempt detected from new IP address",
    type: "security",
    timestamp: new Date(),
    read: false,
  },
  {
    id: "2",
    title: "AI Model Update",
    description: "New fraud detection model deployed successfully",
    type: "success",
    timestamp: new Date(Date.now() - 3600000),
    read: false,
  },
  {
    id: "3",
    title: "System Maintenance",
    description: "Scheduled maintenance in 2 hours",
    type: "info",
    timestamp: new Date(Date.now() - 7200000),
    read: false,
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "security":
        return <Shield className="h-4 w-4 text-orange-500" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "success":
        return <Check className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[380px] mr-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <CardDescription>You have {unreadCount} unread notifications</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] px-4">
              <div className="space-y-4 py-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex gap-4 items-start p-2 rounded-lg transition-colors ${
                      notification.read ? 'opacity-60' : 'bg-muted'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    {getIcon(notification.type)}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
