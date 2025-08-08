import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AnimatedLineGraph,
  AnimatedBarGraph,
  AnimatedPieChart,
  AnimatedHeatmap,
  AnimatedGauge
} from "./AnimatedGraphs";
import { 
  Activity, 
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  CheckCircle,
  Brain,
  Zap,
  Target,
  BarChart3,
  Globe,
  Users,
  DollarSign,
  Clock,
  Cpu,
  Network,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Bell,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface RealTimeMetrics {
  timestamp: number;
  totalTransactions: number;
  fraudDetected: number;
  accuracyRate: number;
  processingTime: number;
  riskScore: number;
  systemLoad: number;
}

interface ChannelData {
  name: string;
  transactions: number;
  fraudRate: number;
  color: string;
}

interface GeographicRisk {
  region: string;
  riskLevel: number;
  transactions: number;
  color: string;
}

const RealTimeAnalyticsDashboard = () => {
  const [isLive, setIsLive] = useState(true);
  const [metrics, setMetrics] = useState<RealTimeMetrics[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<RealTimeMetrics>({
    timestamp: Date.now(),
    totalTransactions: 0,
    fraudDetected: 0,
    accuracyRate: 0,
    processingTime: 0,
    riskScore: 0,
    systemLoad: 0
  });
  const [channelData, setChannelData] = useState<ChannelData[]>([]);
  const [geographicRisk, setGeographicRisk] = useState<GeographicRisk[]>([]);
  const [alertCount, setAlertCount] = useState(0);

  // Generate realistic data
  const generateMetrics = (): RealTimeMetrics => {
    const baseTransactions = 15000;
    const variance = Math.random() * 5000;
    const totalTransactions = baseTransactions + variance;
    const fraudDetected = Math.floor(totalTransactions * (0.015 + Math.random() * 0.01));
    
    return {
      timestamp: Date.now(),
      totalTransactions,
      fraudDetected,
      accuracyRate: 99.5 + Math.random() * 0.5,
      processingTime: 35 + Math.random() * 25,
      riskScore: Math.random() * 100,
      systemLoad: 60 + Math.random() * 30
    };
  };

  const generateChannelData = (): ChannelData[] => [
    {
      name: "Card Present",
      transactions: Math.floor(Math.random() * 5000) + 8000,
      fraudRate: 0.8 + Math.random() * 0.5,
      color: "#3b82f6"
    },
    {
      name: "Online",
      transactions: Math.floor(Math.random() * 4000) + 6000,
      fraudRate: 1.5 + Math.random() * 1.0,
      color: "#10b981"
    },
    {
      name: "Mobile",
      transactions: Math.floor(Math.random() * 3000) + 4000,
      fraudRate: 1.2 + Math.random() * 0.8,
      color: "#f59e0b"
    },
    {
      name: "UPI",
      transactions: Math.floor(Math.random() * 2000) + 2000,
      fraudRate: 2.0 + Math.random() * 1.5,
      color: "#ef4444"
    }
  ];

  const generateGeographicRisk = (): GeographicRisk[] => [
    { region: "North America", riskLevel: 15 + Math.random() * 10, transactions: 45000, color: "#22c55e" },
    { region: "Europe", riskLevel: 12 + Math.random() * 8, transactions: 32000, color: "#3b82f6" },
    { region: "Asia Pacific", riskLevel: 25 + Math.random() * 15, transactions: 28000, color: "#f59e0b" },
    { region: "Latin America", riskLevel: 35 + Math.random() * 20, transactions: 15000, color: "#ef4444" },
    { region: "Africa", riskLevel: 45 + Math.random() * 25, transactions: 8000, color: "#dc2626" },
    { region: "Middle East", riskLevel: 30 + Math.random() * 15, transactions: 12000, color: "#f97316" }
  ];

  // Real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newMetrics = generateMetrics();
      setCurrentMetrics(newMetrics);
      
      setMetrics(prev => {
        const updated = [...prev, newMetrics];
        return updated.slice(-20); // Keep last 20 data points
      });

      setChannelData(generateChannelData());
      setGeographicRisk(generateGeographicRisk());
      
      // Random alert generation
      if (Math.random() > 0.8) {
        setAlertCount(prev => prev + 1);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Initialize data
  useEffect(() => {
    const initialMetrics = Array.from({ length: 10 }, (_, i) => ({
      ...generateMetrics(),
      timestamp: Date.now() - (9 - i) * 2000
    }));
    setMetrics(initialMetrics);
    setCurrentMetrics(initialMetrics[initialMetrics.length - 1]);
    setChannelData(generateChannelData());
    setGeographicRisk(generateGeographicRisk());
  }, []);

  // Convert metrics to graph data
  const transactionGraphData = metrics.map((m, i) => ({
    x: i,
    y: m.totalTransactions,
    label: new Date(m.timestamp).toLocaleTimeString()
  }));

  const fraudGraphData = metrics.map((m, i) => ({
    x: i,
    y: m.fraudDetected,
    label: new Date(m.timestamp).toLocaleTimeString(),
    color: "#ef4444"
  }));

  const accuracyGraphData = metrics.map((m, i) => ({
    x: i,
    y: m.accuracyRate,
    label: new Date(m.timestamp).toLocaleTimeString(),
    color: "#22c55e"
  }));

  const channelPieData = channelData.map(channel => ({
    label: channel.name,
    value: channel.transactions,
    color: channel.color
  }));

  const riskHeatmapData = [
    [20, 35, 45, 30, 25, 40],
    [15, 25, 55, 35, 30, 45],
    [25, 40, 35, 50, 40, 35],
    [30, 45, 40, 45, 55, 50],
    [35, 50, 45, 40, 35, 45]
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <section id="realtime-dashboard" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Activity className="w-4 h-4 mr-2" />
            Real-Time Analytics Dashboard
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Live Fraud Detection Analytics
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced real-time analytics with animated visualizations and interactive monitoring capabilities
          </p>
        </div>

        {/* Control Panel */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant={isLive ? "default" : "outline"}
              onClick={() => setIsLive(!isLive)}
              className="flex items-center space-x-2"
            >
              {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isLive ? "Live" : "Paused"}</span>
              {isLive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2" />}
            </Button>
            
            <Badge variant="secondary" className="flex items-center space-x-2">
              <Clock className="w-3 h-3" />
              <span>Updated {new Date().toLocaleTimeString()}</span>
            </Badge>

            <Badge variant="outline" className="flex items-center space-x-2">
              <Bell className="w-3 h-3" />
              <span>{alertCount} Alerts</span>
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {[
            { 
              icon: Activity, 
              label: "Transactions", 
              value: formatNumber(currentMetrics.totalTransactions), 
              color: "text-blue-500",
              change: "+12.5%",
              trend: "up"
            },
            { 
              icon: Shield, 
              label: "Fraud Detected", 
              value: formatNumber(currentMetrics.fraudDetected), 
              color: "text-red-500",
              change: "-8.2%",
              trend: "down"
            },
            { 
              icon: Target, 
              label: "Accuracy", 
              value: `${currentMetrics.accuracyRate.toFixed(1)}%`, 
              color: "text-green-500",
              change: "+0.3%",
              trend: "up"
            },
            { 
              icon: Clock, 
              label: "Avg Time", 
              value: `${currentMetrics.processingTime.toFixed(0)}ms`, 
              color: "text-purple-500",
              change: "-5ms",
              trend: "down"
            },
            { 
              icon: AlertTriangle, 
              label: "Risk Score", 
              value: currentMetrics.riskScore.toFixed(0), 
              color: "text-orange-500",
              change: "+2.1",
              trend: "up"
            },
            { 
              icon: Cpu, 
              label: "System Load", 
              value: `${currentMetrics.systemLoad.toFixed(0)}%`, 
              color: "text-indigo-500",
              change: "+5%",
              trend: "up"
            }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20 hover-lift">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={cn("w-5 h-5", metric.color)} />
                  <div className="flex items-center space-x-1">
                    {metric.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={cn("text-xs font-medium", 
                      metric.trend === "up" ? "text-green-500" : "text-red-500"
                    )}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <motion.div 
                  className="text-xl font-bold"
                  key={metric.value}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {metric.value}
                </motion.div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Transaction Timeline */}
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-accent" />
                Transaction Timeline
              </h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span>Transactions</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span>Fraud</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <AnimatedLineGraph
                data={transactionGraphData}
                width={600}
                height={250}
                color="#3b82f6"
                showDots={true}
                showGrid={true}
                gradient={true}
              />
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <AnimatedLineGraph
                  data={fraudGraphData}
                  width={600}
                  height={250}
                  color="#ef4444"
                  showDots={true}
                  showGrid={false}
                />
              </div>
            </div>
          </Card>

          {/* System Performance Gauges */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-accent" />
              System Performance
            </h3>
            
            <div className="space-y-6">
              <div className="text-center">
                <AnimatedGauge
                  value={currentMetrics.accuracyRate}
                  max={100}
                  size={140}
                  color="#22c55e"
                  label="Accuracy Rate"
                />
              </div>
              
              <div className="text-center">
                <AnimatedGauge
                  value={currentMetrics.systemLoad}
                  max={100}
                  size={140}
                  color={currentMetrics.systemLoad > 80 ? "#ef4444" : "#3b82f6"}
                  label="System Load"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Channel Distribution */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Network className="w-5 h-5 mr-2 text-accent" />
              Channels
            </h3>
            
            <div className="flex justify-center mb-4">
              <AnimatedPieChart
                data={channelPieData}
                size={180}
                showLabels={false}
              />
            </div>
            
            <div className="space-y-2">
              {channelData.map((channel, index) => (
                <motion.div
                  key={channel.name}
                  className="flex items-center justify-between text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: channel.color }}
                    />
                    <span>{channel.name}</span>
                  </div>
                  <span className="font-medium">{formatNumber(channel.transactions)}</span>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Fraud Rate by Channel */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-accent" />
              Fraud Rates
            </h3>
            
            <AnimatedBarGraph
              data={channelData.map(channel => ({
                label: channel.name.split(' ')[0],
                value: channel.fraudRate,
                color: channel.color
              }))}
              width={250}
              height={200}
              showValues={true}
            />
          </Card>

          {/* Geographic Risk */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-accent" />
              Geographic Risk
            </h3>
            
            <div className="space-y-3">
              {geographicRisk.slice(0, 5).map((region, index) => (
                <motion.div
                  key={region.region}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: region.color }}
                    />
                    <span className="text-sm">{region.region}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{region.riskLevel.toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground">risk</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Risk Heatmap */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-accent" />
              Risk Heatmap
            </h3>
            
            <div className="flex justify-center">
              <AnimatedHeatmap
                data={riskHeatmapData}
                width={200}
                height={150}
                colorScale={["#22c55e", "#ef4444"]}
              />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Low Risk</span>
              <span>High Risk</span>
            </div>
          </Card>
        </div>

        {/* Accuracy Timeline */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-accent" />
            Accuracy Timeline
          </h3>
          
          <AnimatedLineGraph
            data={accuracyGraphData}
            width={1000}
            height={200}
            color="#22c55e"
            showDots={true}
            showGrid={true}
            gradient={true}
          />
        </Card>
      </div>
    </section>
  );
};

export default RealTimeAnalyticsDashboard;
