import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Shield, 
  MapPin, 
  DollarSign, 
  Clock,
  Smartphone,
  Bell,
  Settings,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Globe,
  CreditCard,
  Lock,
  Unlock,
  TrendingUp,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpendingLimit {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: "daily" | "weekly" | "monthly";
  enabled: boolean;
}

interface TrustedLocation {
  id: string;
  name: string;
  address: string;
  radius: number;
  enabled: boolean;
}

interface SecurityRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  riskLevel: "low" | "medium" | "high";
}

interface Notification {
  id: string;
  type: "transaction" | "location" | "security" | "limit";
  message: string;
  timestamp: Date;
  severity: "info" | "warning" | "critical";
  read: boolean;
}

const SafeZonePortal = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [spendingLimits, setSpendingLimits] = useState<SpendingLimit[]>([
    { id: "1", category: "Groceries", limit: 500, spent: 234, period: "monthly", enabled: true },
    { id: "2", category: "Entertainment", limit: 200, spent: 89, period: "monthly", enabled: true },
    { id: "3", category: "Online Shopping", limit: 1000, spent: 567, period: "monthly", enabled: true },
    { id: "4", category: "Gas Stations", limit: 300, spent: 145, period: "monthly", enabled: false }
  ]);

  const [trustedLocations, setTrustedLocations] = useState<TrustedLocation[]>([
    { id: "1", name: "Home", address: "123 Main St, New York, NY", radius: 1, enabled: true },
    { id: "2", name: "Work", address: "456 Business Ave, New York, NY", radius: 0.5, enabled: true },
    { id: "3", name: "Gym", address: "789 Fitness Blvd, New York, NY", radius: 0.3, enabled: true }
  ]);

  const [securityRules, setSecurityRules] = useState<SecurityRule[]>([
    { id: "1", name: "Block International Transactions", description: "Automatically block transactions from outside the US", enabled: true, riskLevel: "high" },
    { id: "2", name: "Require 2FA for Large Purchases", description: "Require additional verification for purchases over $500", enabled: true, riskLevel: "medium" },
    { id: "3", name: "Time-Based Restrictions", description: "Block transactions between 11 PM and 6 AM", enabled: false, riskLevel: "low" },
    { id: "4", name: "Velocity Checks", description: "Flag multiple transactions within 5 minutes", enabled: true, riskLevel: "medium" }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", type: "transaction", message: "Transaction approved: $45.67 at Starbucks", timestamp: new Date(Date.now() - 300000), severity: "info", read: false },
    { id: "2", type: "location", message: "New location detected: Los Angeles, CA", timestamp: new Date(Date.now() - 600000), severity: "warning", read: false },
    { id: "3", type: "limit", message: "Approaching spending limit: Entertainment (89% used)", timestamp: new Date(Date.now() - 900000), severity: "warning", read: true },
    { id: "4", type: "security", message: "Suspicious login attempt blocked", timestamp: new Date(Date.now() - 1200000), severity: "critical", read: false }
  ]);

  const [userProfile, setUserProfile] = useState({
    name: "Sarah Johnson",
    securityScore: 94,
    accountStatus: "Protected",
    lastActivity: new Date(),
    totalTransactions: 1247,
    blockedThreats: 23
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Add random notification
      if (Math.random() < 0.3) {
        const types = ["transaction", "location", "security", "limit"] as const;
        const severities = ["info", "warning", "critical"] as const;
        const messages = [
          "Transaction approved: $12.34 at Coffee Shop",
          "New device login detected",
          "Spending limit warning: 85% used",
          "Suspicious activity blocked",
          "Location verification successful"
        ];

        const newNotification: Notification = {
          id: Date.now().toString(),
          type: types[Math.floor(Math.random() * types.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date(),
          severity: severities[Math.floor(Math.random() * severities.length)],
          read: false
        };

        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      }

      // Update spending amounts
      setSpendingLimits(prev => prev.map(limit => ({
        ...limit,
        spent: Math.min(limit.limit, limit.spent + Math.random() * 5)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleSpendingLimit = (id: string) => {
    setSpendingLimits(prev => prev.map(limit => 
      limit.id === id ? { ...limit, enabled: !limit.enabled } : limit
    ));
  };

  const toggleSecurityRule = (id: string) => {
    setSecurityRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "transaction": return CreditCard;
      case "location": return MapPin;
      case "security": return Shield;
      case "limit": return DollarSign;
      default: return Bell;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-500";
      case "warning": return "text-yellow-500";
      case "info": return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <section id="safezone" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Customer SafeZone™ Portal
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Your Personal Fraud Shield
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Take control of your financial security with customizable protection rules and real-time monitoring
          </p>
        </div>

        {/* User Profile Header */}
        <Card className="p-6 mb-8 bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{userProfile.name}</h3>
                <p className="text-muted-foreground">Account Status: {userProfile.accountStatus}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{userProfile.securityScore}%</div>
                <div className="text-sm text-muted-foreground">Security Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{userProfile.totalTransactions}</div>
                <div className="text-sm text-muted-foreground">Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{userProfile.blockedThreats}</div>
                <div className="text-sm text-muted-foreground">Threats Blocked</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-muted/20 rounded-lg p-1">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "limits", label: "Spending Limits", icon: DollarSign },
            { id: "locations", label: "Trusted Locations", icon: MapPin },
            { id: "security", label: "Security Rules", icon: Shield },
            { id: "notifications", label: `Notifications ${unreadCount > 0 ? `(${unreadCount})` : ''}`, icon: Bell }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1"
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                    Spending Overview
                  </h3>
                  <div className="space-y-3">
                    {spendingLimits.slice(0, 3).map((limit) => (
                      <div key={limit.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{limit.category}</span>
                          <span>${limit.spent.toFixed(0)} / ${limit.limit}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={cn(
                              "h-2 rounded-full transition-all duration-300",
                              (limit.spent / limit.limit) > 0.8 ? "bg-red-500" :
                              (limit.spent / limit.limit) > 0.6 ? "bg-yellow-500" : "bg-green-500"
                            )}
                            style={{ width: `${Math.min(100, (limit.spent / limit.limit) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                    Location Status
                  </h3>
                  <div className="space-y-3">
                    {trustedLocations.map((location) => (
                      <div key={location.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {location.radius}km radius
                          </div>
                        </div>
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          location.enabled ? "bg-green-500" : "bg-gray-400"
                        )} />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-purple-500" />
                    Security Status
                  </h3>
                  <div className="space-y-3">
                    {securityRules.slice(0, 3).map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{rule.name}</div>
                          <div className={cn("text-xs", getRiskLevelColor(rule.riskLevel))}>
                            {rule.riskLevel.toUpperCase()} RISK
                          </div>
                        </div>
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          rule.enabled ? "bg-green-500" : "bg-gray-400"
                        )} />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "limits" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Spending Limits</h3>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Limit
                  </Button>
                </div>
                <div className="grid gap-4">
                  {spendingLimits.map((limit) => (
                    <Card key={limit.id} className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{limit.category}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{limit.period} limit</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Switch 
                            checked={limit.enabled}
                            onCheckedChange={() => toggleSpendingLimit(limit.id)}
                          />
                          <Button size="sm" variant="outline">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Spent: ${limit.spent.toFixed(2)}</span>
                          <span>Limit: ${limit.limit}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div 
                            className={cn(
                              "h-3 rounded-full transition-all duration-300",
                              (limit.spent / limit.limit) > 0.8 ? "bg-red-500" :
                              (limit.spent / limit.limit) > 0.6 ? "bg-yellow-500" : "bg-green-500"
                            )}
                            style={{ width: `${Math.min(100, (limit.spent / limit.limit) * 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {((limit.spent / limit.limit) * 100).toFixed(1)}% used
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Security Rules</h3>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Rule
                  </Button>
                </div>
                <div className="grid gap-4">
                  {securityRules.map((rule) => (
                    <Card key={rule.id} className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold">{rule.name}</h4>
                            <Badge variant={
                              rule.riskLevel === "high" ? "destructive" :
                              rule.riskLevel === "medium" ? "default" : "secondary"
                            }>
                              {rule.riskLevel.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Switch 
                            checked={rule.enabled}
                            onCheckedChange={() => toggleSecurityRule(rule.id)}
                          />
                          <Button size="sm" variant="outline">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Notifications</h3>
                  <Button variant="outline">
                    Mark All Read
                  </Button>
                </div>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={cn(
                        "p-4 bg-card/50 backdrop-blur-sm border-primary/20 cursor-pointer transition-all duration-200",
                        !notification.read && "border-primary/40 bg-primary/5"
                      )}
                      onClick={() => markNotificationRead(notification.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          getSeverityColor(notification.severity).replace('text-', 'bg-').replace('500', '500/20')
                        )}>
                          {React.createElement(getNotificationIcon(notification.type), { 
                            className: cn("w-5 h-5", getSeverityColor(notification.severity)) 
                          })}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{notification.message}</p>
                          <p className="text-sm text-muted-foreground">
                            {notification.timestamp.toLocaleString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-3 h-3 bg-primary rounded-full" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SafeZonePortal;
