import React from 'react';
import { Shield, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface MaintenanceProps {
  startTime?: Date;
  endTime?: Date;
  reason?: string;
  onDismiss?: () => void;
}

export function MaintenanceMode({
  startTime = new Date(),
  endTime = new Date(Date.now() + 3600000), // Default 1 hour
  reason = "Scheduled system maintenance",
  onDismiss
}: MaintenanceProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-yellow-500" />
            <CardTitle>System Maintenance</CardTitle>
          </div>
          <CardDescription>
            Our system is currently undergoing maintenance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {formatTime(startTime)} - {formatTime(endTime)}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            <span>Estimated time remaining: {getTimeRemaining()}</span>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium">Reason for maintenance:</p>
            <p className="text-sm text-muted-foreground mt-1">{reason}</p>
          </div>
        </CardContent>
        <CardFooter>
          {onDismiss && (
            <Button variant="outline" onClick={onDismiss}>
              Dismiss
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
