import React from "react";
import {
  Activity,
  Cpu,
  Database,
  Shield,
  Signal,
  Clock,
  Brain,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SystemStatus {
  type: "healthy" | "warning" | "critical";
  label: string;
  value: string;
  icon: React.ElementType;
}

const statusColors = {
  healthy: "text-green-500",
  warning: "text-yellow-500",
  critical: "text-red-500",
};

export function StatusBar() {
  const [statuses, setStatuses] = React.useState<SystemStatus[]>([
    {
      type: "healthy",
      label: "AI Models",
      value: "100% Operational",
      icon: Brain as React.ElementType,
    },
    {
      type: "healthy",
      label: "System Load",
      value: "23%",
      icon: Cpu,
    },
    {
      type: "healthy",
      label: "API Latency",
      value: "45ms",
      icon: Activity,
    },
    {
      type: "healthy",
      label: "Database",
      value: "Connected",
      icon: Database,
    },
    {
      type: "healthy",
      label: "Security",
      value: "Active",
      icon: Shield,
    },
    {
      type: "healthy",
      label: "Network",
      value: "Stable",
      icon: Signal,
    },
  ]);

  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    // Update statuses randomly for demo
    const interval = setInterval(() => {
      setStatuses(prev => 
        prev.map(status => ({
          ...status,
          type: Math.random() > 0.9 
            ? "warning" 
            : Math.random() > 0.95 
              ? "critical" 
              : "healthy",
          value: status.label === "System Load" 
            ? `${Math.floor(Math.random() * 100)}%`
            : status.label === "API Latency"
              ? `${Math.floor(Math.random() * 200)}ms`
              : status.value
        }))
      );
    }, 5000);

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-6 bg-background border-t flex items-center justify-between px-4 text-xs text-muted-foreground">
      <div className="flex items-center space-x-4">
        {statuses.map((status) => {
          const Icon = status.icon;
          return (
            <Tooltip key={status.label}>
              <TooltipTrigger>
                <div className="flex items-center space-x-1">
                  <Icon className={cn("h-3 w-3", statusColors[status.type])} />
                  <span>{status.label}:</span>
                  <span className={cn(statusColors[status.type])}>
                    {status.value}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{status.label} Status: {status.value}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      <div className="flex items-center space-x-2">
        <Clock className="h-3 w-3" />
        <span>{currentTime.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
