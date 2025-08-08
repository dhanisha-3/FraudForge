import React from "react";
import {
  Zap,
  Shield,
  RefreshCcw,
  AlertTriangle,
  LineChart,
  Brain,
  Lock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Run Security Scan",
      icon: Shield,
      onClick: () => navigate("/security/scan"),
      description: "Quick system security check",
    },
    {
      label: "Update AI Models",
      icon: Brain,
      onClick: () => navigate("/ai-models/update"),
      description: "Sync with latest models",
    },
    {
      label: "View Analytics",
      icon: LineChart,
      onClick: () => navigate("/analytics"),
      description: "Real-time system analytics",
    },
    {
      label: "Security Alerts",
      icon: AlertTriangle,
      onClick: () => navigate("/security/alerts"),
      description: "View active security alerts",
    },
    {
      label: "Sync Data",
      icon: RefreshCcw,
      onClick: () => navigate("/sync"),
      description: "Manual data synchronization",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Zap className="h-5 w-5" />
          <span className="sr-only">Quick actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <DropdownMenuItem
              key={action.label}
              onClick={action.onClick}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Icon className="h-4 w-4" />
              <div className="flex flex-col">
                <span>{action.label}</span>
                <span className="text-xs text-muted-foreground">
                  {action.description}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
