import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard, 
  Globe,
  Smartphone,
  Zap,
  Shield,
  Activity,
  TrendingUp,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Settings,
  Wifi,
  MapPin,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChannelMetrics {
  channel: "card-present" | "online" | "mobile" | "upi";
  name: string;
  icon: React.ComponentType<any>;
  totalTransactions: number;
  fraudDetected: number;
  fraudRate: number;
  averageAmount: number;
  processingTime: number;
  accuracy: number;
  volume24h: number;
  riskFactors: string[];
  securityFeatures: string[];
}

interface ChannelTransaction {
  id: string;
  channel: "card-present" | "online" | "mobile" | "upi";
  amount: number;
  merchant: string;
  location: string;
  timestamp: Date;
  riskScore: number;
  status: "approved" | "flagged" | "blocked";
  securityMeasures: string[];
}

const MultiChannelSupport = () => {
  const [selectedChannel, setSelectedChannel] = useState<"card-present" | "online" | "mobile" | "upi">("card-present");
  const [channelMetrics, setChannelMetrics] = useState<ChannelMetrics[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<ChannelTransaction[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Initialize channel data
  useEffect(() => {
    const initialMetrics: ChannelMetrics[] = [
      {
        channel: "card-present",
        name: "Card Present",
        icon: CreditCard,
        totalTransactions: 125000,
        fraudDetected: 1250,
        fraudRate: 1.0,
        averageAmount: 85.50,
        processingTime: 35,
        accuracy: 99.8,
        volume24h: 15000,
        riskFactors: ["Skimming devices", "Counterfeit cards", "Lost/stolen cards"],
        securityFeatures: ["EMV chip verification", "PIN authentication", "Real-time monitoring"]
      },
      {
        channel: "online",
        name: "Online Payments",
        icon: Globe,
        totalTransactions: 89000,
        fraudDetected: 1780,
        fraudRate: 2.0,
        averageAmount: 125.75,
        processingTime: 42,
        accuracy: 99.5,
        volume24h: 12000,
        riskFactors: ["Card-not-present fraud", "Account takeover", "Phishing attacks"],
        securityFeatures: ["3D Secure", "Device fingerprinting", "Behavioral analysis"]
      },
      {
        channel: "mobile",
        name: "Mobile Payments",
        icon: Smartphone,
        totalTransactions: 67000,
        fraudDetected: 1005,
        fraudRate: 1.5,
        averageAmount: 45.25,
        processingTime: 28,
        accuracy: 99.6,
        volume24h: 8500,
        riskFactors: ["SIM swapping", "App tampering", "Device theft"],
        securityFeatures: ["Biometric authentication", "App attestation", "Location verification"]
      },
      {
        channel: "upi",
        name: "UPI Payments",
        icon: Zap,
        totalTransactions: 156000,
        fraudDetected: 3120,
        fraudRate: 2.0,
        averageAmount: 35.80,
        processingTime: 25,
        accuracy: 99.4,
        volume24h: 22000,
        riskFactors: ["Social engineering", "QR code manipulation", "Fake payment apps"],
        securityFeatures: ["Multi-factor authentication", "Transaction limits", "Real-time alerts"]
      }
    ];

    setChannelMetrics(initialMetrics);
  }, []);

  // Generate sample transactions
  const generateTransaction = (channel: ChannelMetrics['channel']): ChannelTransaction => {
    const merchants = {
      "card-present": ["Walmart", "Target", "McDonald's", "Gas Station", "Grocery Store"],
      "online": ["Amazon", "eBay", "Netflix", "Online Shop", "Digital Service"],
      "mobile": ["Starbucks", "Uber", "Food Delivery", "Mobile App", "Subscription"],
      "upi": ["Local Store", "Street Vendor", "Restaurant", "Pharmacy", "Utility Bill"]
    };

    const locations = ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ"];
    const channelMerchants = merchants[channel];
    
    const amount = channel === "upi" ? Math.random() * 100 + 5 :
                  channel === "mobile" ? Math.random() * 150 + 10 :
                  channel === "online" ? Math.random() * 300 + 20 :
                  Math.random() * 200 + 15;

    const riskScore = Math.random() * 100;
    const status = riskScore > 80 ? "blocked" : riskScore > 60 ? "flagged" : "approved";

    const securityMeasures = {
      "card-present": ["EMV Verified", "PIN Authenticated"],
      "online": ["3D Secure", "Device Verified"],
      "mobile": ["Biometric Auth", "App Verified"],
      "upi": ["2FA Verified", "Limit Checked"]
    };

    return {
      id: `${channel}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      channel,
      amount: Math.round(amount * 100) / 100,
      merchant: channelMerchants[Math.floor(Math.random() * channelMerchants.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      timestamp: new Date(),
      riskScore: Math.round(riskScore),
      status: status as any,
      securityMeasures: securityMeasures[channel]
    };
  };

  // Simulate real-time transactions
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const channels: ChannelMetrics['channel'][] = ["card-present", "online", "mobile", "upi"];
      const randomChannel = channels[Math.floor(Math.random() * channels.length)];
      const newTransaction = generateTransaction(randomChannel);
      
      setRecentTransactions(prev => [newTransaction, ...prev.slice(0, 19)]);

      // Update channel metrics
      setChannelMetrics(prev => prev.map(metric => 
        metric.channel === randomChannel ? {
          ...metric,
          totalTransactions: metric.totalTransactions + 1,
          fraudDetected: newTransaction.status === "blocked" ? metric.fraudDetected + 1 : metric.fraudDetected
        } : metric
      ));
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const selectedMetrics = channelMetrics.find(m => m.channel === selectedChannel);
  const channelTransactions = recentTransactions.filter(t => t.channel === selectedChannel);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "text-green-500";
      case "flagged": return "text-yellow-500";
      case "blocked": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return CheckCircle;
      case "flagged": return AlertTriangle;
      case "blocked": return Shield;
      default: return Activity;
    }
  };

  return (
    <section id="channels" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Wifi className="w-4 h-4 mr-2" />
            Multi-Channel Support
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Comprehensive Payment Channel Protection
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced fraud detection across all payment channels - card-present, online, mobile, and UPI transactions
          </p>
        </div>

        {/* Channel Selection */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {channelMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Button
                key={metric.channel}
                variant={selectedChannel === metric.channel ? "default" : "outline"}
                onClick={() => setSelectedChannel(metric.channel)}
                className="flex items-center space-x-2 px-6 py-3"
              >
                <Icon className="w-5 h-5" />
                <span>{metric.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {(metric.volume24h / 1000).toFixed(1)}K
                </Badge>
              </Button>
            );
          })}
        </div>

        {selectedMetrics && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Channel Overview */}
            <div className="lg:col-span-2">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    {React.createElement(selectedMetrics.icon, { className: "w-8 h-8 text-primary" })}
                    <div>
                      <h3 className="text-xl font-bold">{selectedMetrics.name}</h3>
                      <p className="text-muted-foreground">Real-time fraud protection</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={cn("w-3 h-3 rounded-full", isMonitoring ? "bg-green-500 animate-pulse" : "bg-gray-500")} />
                    <span className="text-sm font-medium">
                      {isMonitoring ? "Live Monitoring" : "Monitoring Paused"}
                    </span>
                  </div>
                </div>

                {/* Channel Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">
                      {(selectedMetrics.totalTransactions / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-muted-foreground">Total Transactions</div>
                  </div>
                  
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-red-500">
                      {selectedMetrics.fraudRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Fraud Rate</div>
                  </div>
                  
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">
                      {selectedMetrics.accuracy.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-500">
                      {selectedMetrics.processingTime}ms
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Processing</div>
                  </div>
                </div>

                {/* Security Features */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Lock className="w-4 h-4 mr-2 text-accent" />
                    Security Features
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMetrics.securityFeatures.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
                    Common Risk Factors
                  </h4>
                  <div className="space-y-2">
                    {selectedMetrics.riskFactors.map((factor, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        <span className="text-sm">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Recent Transactions */}
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-accent" />
                  Recent {selectedMetrics.name} Transactions
                </h3>
                
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  <AnimatePresence>
                    {channelTransactions.slice(0, 10).map((transaction) => {
                      const StatusIcon = getStatusIcon(transaction.status);
                      return (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="p-3 bg-background/50 rounded-lg border border-border/50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              {React.createElement(selectedMetrics.icon, { className: "w-4 h-4 text-muted-foreground" })}
                              <div>
                                <div className="font-medium text-sm">{transaction.merchant}</div>
                                <div className="text-xs text-muted-foreground">{transaction.location}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <div className="font-bold">${transaction.amount.toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground">
                                  {transaction.timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                              <StatusIcon className={cn("w-4 h-4", getStatusColor(transaction.status))} />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {transaction.securityMeasures.map((measure, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {measure}
                                </Badge>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              Risk: {transaction.riskScore}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </Card>
            </div>

            {/* Channel Comparison */}
            <div>
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-accent" />
                  Channel Comparison
                </h3>
                
                <div className="space-y-4">
                  {channelMetrics.map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <div key={metric.channel} className="p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4 text-primary" />
                            <span className="font-medium text-sm">{metric.name}</span>
                          </div>
                          <Badge variant={metric.channel === selectedChannel ? "default" : "outline"}>
                            {metric.accuracy.toFixed(1)}%
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Volume (24h):</span>
                            <span className="font-medium">{(metric.volume24h / 1000).toFixed(1)}K</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Fraud Rate:</span>
                            <span className="font-medium text-red-500">{metric.fraudRate.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Avg Amount:</span>
                            <span className="font-medium">${metric.averageAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Processing:</span>
                            <span className="font-medium">{metric.processingTime}ms</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Channel Statistics */}
              <Card className="mt-6 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-accent" />
                  Overall Statistics
                </h3>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {channelMetrics.reduce((sum, m) => sum + m.totalTransactions, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Transactions</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {(channelMetrics.reduce((sum, m) => sum + m.accuracy, 0) / channelMetrics.length).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Average Accuracy</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {(channelMetrics.reduce((sum, m) => sum + m.volume24h, 0) / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-muted-foreground">Daily Volume</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MultiChannelSupport;
