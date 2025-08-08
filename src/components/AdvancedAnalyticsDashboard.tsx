import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  Globe,
  Brain,
  Zap,
  Target,
  Eye,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  totalTransactions: number;
  fraudDetected: number;
  falsePositives: number;
  accuracyRate: number;
  avgProcessingTime: number;
  totalSaved: number;
  channelBreakdown: {
    cardPresent: number;
    online: number;
    mobile: number;
    upi: number;
  };
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  timeSeriesData: {
    hour: number;
    transactions: number;
    frauds: number;
  }[];
  geographicData: {
    region: string;
    transactions: number;
    fraudRate: number;
  }[];
  mlModelPerformance: {
    model: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  }[];
}

const AdvancedAnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalTransactions: 0,
    fraudDetected: 0,
    falsePositives: 0,
    accuracyRate: 0,
    avgProcessingTime: 0,
    totalSaved: 0,
    channelBreakdown: { cardPresent: 0, online: 0, mobile: 0, upi: 0 },
    riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
    timeSeriesData: [],
    geographicData: [],
    mlModelPerformance: []
  });

  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate realistic analytics data
  const generateAnalyticsData = (): AnalyticsData => {
    const totalTransactions = Math.floor(Math.random() * 50000) + 100000;
    const fraudDetected = Math.floor(totalTransactions * 0.02); // 2% fraud rate
    const falsePositives = Math.floor(fraudDetected * 0.05); // 5% false positive rate
    
    return {
      totalTransactions,
      fraudDetected,
      falsePositives,
      accuracyRate: 99.7 - Math.random() * 0.5,
      avgProcessingTime: 45 + Math.random() * 10,
      totalSaved: fraudDetected * 1500, // Average fraud amount
      channelBreakdown: {
        cardPresent: Math.floor(totalTransactions * 0.4),
        online: Math.floor(totalTransactions * 0.35),
        mobile: Math.floor(totalTransactions * 0.2),
        upi: Math.floor(totalTransactions * 0.05)
      },
      riskDistribution: {
        low: Math.floor(totalTransactions * 0.7),
        medium: Math.floor(totalTransactions * 0.2),
        high: Math.floor(totalTransactions * 0.08),
        critical: Math.floor(totalTransactions * 0.02)
      },
      timeSeriesData: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        transactions: Math.floor(Math.random() * 5000) + 1000,
        frauds: Math.floor(Math.random() * 100) + 10
      })),
      geographicData: [
        { region: "North America", transactions: Math.floor(totalTransactions * 0.4), fraudRate: 1.8 },
        { region: "Europe", transactions: Math.floor(totalTransactions * 0.3), fraudRate: 1.5 },
        { region: "Asia Pacific", transactions: Math.floor(totalTransactions * 0.2), fraudRate: 2.2 },
        { region: "Latin America", transactions: Math.floor(totalTransactions * 0.07), fraudRate: 3.1 },
        { region: "Africa", transactions: Math.floor(totalTransactions * 0.03), fraudRate: 4.5 }
      ],
      mlModelPerformance: [
        { model: "Ensemble Classifier", accuracy: 99.7, precision: 98.9, recall: 97.8, f1Score: 98.3 },
        { model: "Neural Network", accuracy: 98.9, precision: 97.5, recall: 96.8, f1Score: 97.1 },
        { model: "Random Forest", accuracy: 97.8, precision: 96.2, recall: 95.9, f1Score: 96.0 },
        { model: "Gradient Boosting", accuracy: 98.2, precision: 97.1, recall: 96.5, f1Score: 96.8 }
      ]
    };
  };

  // Update analytics data
  useEffect(() => {
    const updateData = () => {
      setAnalyticsData(generateAnalyticsData());
    };

    updateData();
    const interval = setInterval(updateData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const refreshData = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setAnalyticsData(generateAnalyticsData());
    setIsRefreshing(false);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "cardPresent": return Shield;
      case "online": return Globe;
      case "mobile": return Activity;
      case "upi": return Zap;
      default: return Activity;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-green-500";
      case "medium": return "text-yellow-500";
      case "high": return "text-orange-500";
      case "critical": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <section id="analytics" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <BarChart3 className="w-4 h-4 mr-2" />
            Advanced Analytics
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Fraud Detection Analytics Dashboard
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive analytics and insights into fraud detection performance, trends, and system efficiency
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <select 
              className="px-3 py-2 border border-border rounded-md bg-background text-sm"
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            
            <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing}>
              <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold">{formatNumber(analyticsData.totalTransactions)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">+12.5%</span>
                  </div>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Fraud Detected</p>
                  <p className="text-2xl font-bold text-red-500">{formatNumber(analyticsData.fraudDetected)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">-8.2%</span>
                  </div>
                </div>
                <Shield className="w-8 h-8 text-red-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                  <p className="text-2xl font-bold text-green-500">{analyticsData.accuracyRate.toFixed(1)}%</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">+0.3%</span>
                  </div>
                </div>
                <Target className="w-8 h-8 text-green-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Money Saved</p>
                  <p className="text-2xl font-bold text-green-500">${formatNumber(analyticsData.totalSaved)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">+15.7%</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Channel Breakdown */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-accent" />
              Transaction Channels
            </h3>
            <div className="space-y-4">
              {Object.entries(analyticsData.channelBreakdown).map(([channel, count]) => {
                const percentage = (count / analyticsData.totalTransactions) * 100;
                const Icon = getChannelIcon(channel);
                return (
                  <div key={channel} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <span className="capitalize">{channel.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24">
                        <Progress value={percentage} className="h-2" />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{percentage.toFixed(1)}%</span>
                      <span className="text-sm text-muted-foreground w-16 text-right">{formatNumber(count)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Risk Distribution */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-accent" />
              Risk Distribution
            </h3>
            <div className="space-y-4">
              {Object.entries(analyticsData.riskDistribution).map(([risk, count]) => {
                const percentage = (count / analyticsData.totalTransactions) * 100;
                return (
                  <div key={risk} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn("w-3 h-3 rounded-full", 
                        risk === "low" ? "bg-green-500" :
                        risk === "medium" ? "bg-yellow-500" :
                        risk === "high" ? "bg-orange-500" : "bg-red-500"
                      )} />
                      <span className="capitalize">{risk} Risk</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24">
                        <Progress value={percentage} className="h-2" />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{percentage.toFixed(1)}%</span>
                      <span className="text-sm text-muted-foreground w-16 text-right">{formatNumber(count)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Geographic Analysis */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-accent" />
            Geographic Fraud Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {analyticsData.geographicData.map((region) => (
              <div key={region.region} className="text-center p-4 bg-background/50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">{region.region}</h4>
                <div className="text-2xl font-bold mb-1">{formatNumber(region.transactions)}</div>
                <div className="text-xs text-muted-foreground mb-2">transactions</div>
                <Badge variant={region.fraudRate > 3 ? "destructive" : region.fraudRate > 2 ? "default" : "secondary"}>
                  {region.fraudRate}% fraud
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* ML Model Performance */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-accent" />
            ML Model Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2">Model</th>
                  <th className="text-center py-2">Accuracy</th>
                  <th className="text-center py-2">Precision</th>
                  <th className="text-center py-2">Recall</th>
                  <th className="text-center py-2">F1 Score</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.mlModelPerformance.map((model, index) => (
                  <tr key={model.model} className="border-b border-border/20">
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <div className={cn("w-2 h-2 rounded-full", 
                          index === 0 ? "bg-green-500" : "bg-blue-500"
                        )} />
                        <span className="font-medium">{model.model}</span>
                        {index === 0 && <Badge variant="secondary" className="text-xs">Active</Badge>}
                      </div>
                    </td>
                    <td className="text-center py-3">
                      <span className="font-medium text-green-500">{model.accuracy}%</span>
                    </td>
                    <td className="text-center py-3">
                      <span className="font-medium">{model.precision}%</span>
                    </td>
                    <td className="text-center py-3">
                      <span className="font-medium">{model.recall}%</span>
                    </td>
                    <td className="text-center py-3">
                      <span className="font-medium">{model.f1Score}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="text-center">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{analyticsData.avgProcessingTime.toFixed(0)}ms</div>
              <div className="text-sm text-muted-foreground">Avg Processing Time</div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{((analyticsData.totalTransactions - analyticsData.falsePositives) / analyticsData.totalTransactions * 100).toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">True Positive Rate</div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="text-center">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{(analyticsData.falsePositives / analyticsData.totalTransactions * 100).toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">False Positive Rate</div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdvancedAnalyticsDashboard;
