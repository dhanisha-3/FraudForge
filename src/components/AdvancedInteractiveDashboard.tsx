import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Brain,
  Zap,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Globe,
  Users,
  DollarSign,
  Clock,
  Cpu,
  Database,
  Network,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Maximize,
  Filter,
  Download,
  Bell,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardMetrics {
  totalTransactions: number;
  fraudDetected: number;
  accuracyRate: number;
  falsePositiveRate: number;
  avgProcessingTime: number;
  moneySaved: number;
  systemUptime: number;
  activeAlerts: number;
  transactionsPerSecond: number;
  riskScore: number;
}

interface TimeSeriesData {
  timestamp: string;
  transactions: number;
  frauds: number;
  accuracy: number;
  processingTime: number;
}

interface GeographicData {
  country: string;
  transactions: number;
  fraudRate: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  coordinates: [number, number];
}

interface AlertData {
  id: string;
  type: "critical" | "high" | "medium" | "low";
  message: string;
  timestamp: Date;
  location: string;
  amount: number;
}

const AdvancedInteractiveDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalTransactions: 0,
    fraudDetected: 0,
    accuracyRate: 0,
    falsePositiveRate: 0,
    avgProcessingTime: 0,
    moneySaved: 0,
    systemUptime: 99.97,
    activeAlerts: 0,
    transactionsPerSecond: 0,
    riskScore: 0
  });

  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [geographicData, setGeographicData] = useState<GeographicData[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [isRealTime, setIsRealTime] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const chartRef = useRef<HTMLCanvasElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Generate realistic data
  const generateMetrics = (): DashboardMetrics => {
    const totalTransactions = Math.floor(Math.random() * 10000) + 150000;
    const fraudDetected = Math.floor(totalTransactions * 0.02);
    
    return {
      totalTransactions,
      fraudDetected,
      accuracyRate: 99.7 - Math.random() * 0.3,
      falsePositiveRate: 2.1 + Math.random() * 0.8,
      avgProcessingTime: 45 + Math.random() * 15,
      moneySaved: fraudDetected * 1500,
      systemUptime: 99.95 + Math.random() * 0.05,
      activeAlerts: Math.floor(Math.random() * 15) + 5,
      transactionsPerSecond: Math.random() * 50 + 100,
      riskScore: Math.random() * 100
    };
  };

  const generateTimeSeriesData = (): TimeSeriesData[] => {
    const data: TimeSeriesData[] = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 3600000);
      data.push({
        timestamp: timestamp.toISOString(),
        transactions: Math.floor(Math.random() * 5000) + 2000,
        frauds: Math.floor(Math.random() * 100) + 20,
        accuracy: 99.5 + Math.random() * 0.5,
        processingTime: 40 + Math.random() * 20
      });
    }
    
    return data;
  };

  const generateGeographicData = (): GeographicData[] => {
    return [
      { country: "United States", transactions: 45000, fraudRate: 1.8, riskLevel: "medium", coordinates: [-95, 37] },
      { country: "United Kingdom", transactions: 12000, fraudRate: 1.2, riskLevel: "low", coordinates: [-2, 54] },
      { country: "Germany", transactions: 8500, fraudRate: 1.0, riskLevel: "low", coordinates: [10, 51] },
      { country: "France", transactions: 7200, fraudRate: 1.4, riskLevel: "low", coordinates: [2, 46] },
      { country: "Brazil", transactions: 6800, fraudRate: 3.2, riskLevel: "high", coordinates: [-55, -10] },
      { country: "India", transactions: 15000, fraudRate: 2.8, riskLevel: "high", coordinates: [77, 20] },
      { country: "China", transactions: 9200, fraudRate: 2.1, riskLevel: "medium", coordinates: [104, 35] },
      { country: "Nigeria", transactions: 2100, fraudRate: 8.5, riskLevel: "critical", coordinates: [8, 9] },
      { country: "Russia", transactions: 3400, fraudRate: 4.2, riskLevel: "high", coordinates: [105, 61] },
      { country: "Australia", transactions: 4500, fraudRate: 1.1, riskLevel: "low", coordinates: [133, -27] }
    ];
  };

  const generateAlert = (): AlertData => {
    const types: AlertData['type'][] = ["critical", "high", "medium", "low"];
    const messages = [
      "Coordinated fraud attack detected",
      "Unusual transaction velocity spike",
      "New fraud pattern identified",
      "Geographic anomaly detected",
      "Device fingerprint mismatch",
      "Behavioral biometric failure",
      "Network intrusion attempt",
      "Account takeover suspected"
    ];
    
    const locations = ["New York", "London", "Tokyo", "Mumbai", "São Paulo", "Lagos", "Moscow", "Sydney"];
    
    return {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: types[Math.floor(Math.random() * types.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      timestamp: new Date(),
      location: locations[Math.floor(Math.random() * locations.length)],
      amount: Math.floor(Math.random() * 50000) + 1000
    };
  };

  // Real-time updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setMetrics(generateMetrics());
      
      // Update time series data
      setTimeSeriesData(prev => {
        const newData = [...prev];
        if (newData.length >= 24) {
          newData.shift();
        }
        newData.push({
          timestamp: new Date().toISOString(),
          transactions: Math.floor(Math.random() * 5000) + 2000,
          frauds: Math.floor(Math.random() * 100) + 20,
          accuracy: 99.5 + Math.random() * 0.5,
          processingTime: 40 + Math.random() * 20
        });
        return newData;
      });

      // Generate alerts occasionally
      if (Math.random() > 0.7) {
        const newAlert = generateAlert();
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      }
    }, 3000 / animationSpeed);

    return () => clearInterval(interval);
  }, [isRealTime, animationSpeed]);

  // Initialize data
  useEffect(() => {
    setMetrics(generateMetrics());
    setTimeSeriesData(generateTimeSeriesData());
    setGeographicData(generateGeographicData());
    
    // Generate initial alerts
    const initialAlerts = Array.from({ length: 5 }, () => generateAlert());
    setAlerts(initialAlerts);
  }, []);

  // Animated Chart Component
  const AnimatedLineChart = ({ data, height = 200 }: { data: TimeSeriesData[], height?: number }) => {
    const maxTransactions = Math.max(...data.map(d => d.transactions));
    const maxFrauds = Math.max(...data.map(d => d.frauds));
    
    return (
      <div className="relative" style={{ height }}>
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <motion.line
              key={i}
              x1="0"
              y1={height * ratio}
              x2="100%"
              y2={height * ratio}
              stroke="hsl(var(--border))"
              strokeWidth="1"
              strokeOpacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
          ))}
          
          {/* Transaction line */}
          <motion.path
            d={`M ${data.map((d, i) => 
              `${(i / (data.length - 1)) * 100}% ${height - (d.transactions / maxTransactions) * height}`
            ).join(' L ')}`}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          
          {/* Fraud line */}
          <motion.path
            d={`M ${data.map((d, i) => 
              `${(i / (data.length - 1)) * 100}% ${height - (d.frauds / maxFrauds) * height * 0.3}`
            ).join(' L ')}`}
            fill="none"
            stroke="hsl(var(--destructive))"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
          />
          
          {/* Data points */}
          {data.map((d, i) => (
            <motion.circle
              key={i}
              cx={`${(i / (data.length - 1)) * 100}%`}
              cy={height - (d.transactions / maxTransactions) * height}
              r="4"
              fill="hsl(var(--primary))"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              whileHover={{ scale: 1.5 }}
            />
          ))}
        </svg>
      </div>
    );
  };

  // Animated Donut Chart
  const AnimatedDonutChart = ({ value, max, color, size = 120 }: { 
    value: number, max: number, color: string, size?: number 
  }) => {
    const radius = size / 2 - 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (value / max) * circumference;
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeInOut" }}
            style={{
              filter: `drop-shadow(0 0 10px ${color})`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div 
              className="text-2xl font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              {value.toFixed(1)}
            </motion.div>
            <div className="text-xs text-muted-foreground">/ {max}</div>
          </div>
        </div>
      </div>
    );
  };

  // Animated Bar Chart
  const AnimatedBarChart = ({ data }: { data: GeographicData[] }) => {
    const maxTransactions = Math.max(...data.map(d => d.transactions));
    
    return (
      <div className="space-y-3">
        {data.slice(0, 6).map((country, index) => (
          <motion.div
            key={country.country}
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="w-20 text-sm font-medium truncate">{country.country}</div>
            <div className="flex-1 relative">
              <div className="h-6 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full", 
                    country.riskLevel === "critical" ? "bg-red-500" :
                    country.riskLevel === "high" ? "bg-orange-500" :
                    country.riskLevel === "medium" ? "bg-yellow-500" : "bg-green-500"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${(country.transactions / maxTransactions) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <span className="text-xs font-medium text-white">
                  {(country.transactions / 1000).toFixed(1)}K
                </span>
                <span className="text-xs font-medium text-white">
                  {country.fraudRate}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical": return "text-red-500";
      case "high": return "text-orange-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "critical": return "destructive";
      case "high": return "default";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  return (
    <section id="dashboard" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <BarChart3 className="w-4 h-4 mr-2" />
            Advanced Interactive Dashboard
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Real-Time Fraud Detection Command Center
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive real-time monitoring and analytics dashboard with advanced visualizations and interactive controls
          </p>
        </div>

        {/* Dashboard Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant={isRealTime ? "default" : "outline"}
              onClick={() => setIsRealTime(!isRealTime)}
              className="flex items-center space-x-2"
            >
              {isRealTime ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRealTime ? "Pause" : "Resume"} Real-time</span>
            </Button>
            
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

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Speed:</span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-20"
              />
              <span className="text-sm font-medium">{animationSpeed}x</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
          {[
            { icon: Activity, label: "Transactions", value: formatNumber(metrics.totalTransactions), color: "text-blue-500", trend: "+12.5%" },
            { icon: Shield, label: "Fraud Detected", value: formatNumber(metrics.fraudDetected), color: "text-red-500", trend: "-8.2%" },
            { icon: Target, label: "Accuracy", value: `${metrics.accuracyRate.toFixed(1)}%`, color: "text-green-500", trend: "+0.3%" },
            { icon: AlertTriangle, label: "False Positive", value: `${metrics.falsePositiveRate.toFixed(1)}%`, color: "text-yellow-500", trend: "-2.1%" },
            { icon: Clock, label: "Avg Time", value: `${metrics.avgProcessingTime.toFixed(0)}ms`, color: "text-purple-500", trend: "-5ms" },
            { icon: DollarSign, label: "Money Saved", value: `$${formatNumber(metrics.moneySaved)}`, color: "text-green-500", trend: "+15.7%" },
            { icon: Cpu, label: "Uptime", value: `${metrics.systemUptime.toFixed(2)}%`, color: "text-blue-500", trend: "+0.01%" },
            { icon: Bell, label: "Active Alerts", value: metrics.activeAlerts.toString(), color: "text-orange-500", trend: "+3" }
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
                  <span className={cn("text-xs font-medium", 
                    metric.trend.startsWith('+') ? "text-green-500" : "text-red-500"
                  )}>
                    {metric.trend}
                  </span>
                </div>
                <div className="text-lg font-bold">{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction Timeline */}
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <LineChart className="w-5 h-5 mr-2 text-accent" />
                Transaction Timeline
              </h3>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Live</Badge>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <span>Transactions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-destructive rounded-full" />
                  <span>Fraud Detected</span>
                </div>
              </div>
            </div>
            
            <AnimatedLineChart data={timeSeriesData} height={300} />
          </Card>

          {/* Real-time Alerts */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-accent" />
              Real-time Alerts
            </h3>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              <AnimatePresence>
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-3 bg-background/50 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={getAlertBadge(alert.type) as any}>
                        {alert.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">{alert.message}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{alert.location}</span>
                      <span>${alert.amount.toLocaleString()}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* Secondary Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* System Performance */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Cpu className="w-5 h-5 mr-2 text-accent" />
              System Performance
            </h3>
            
            <div className="space-y-4">
              <div className="text-center">
                <AnimatedDonutChart 
                  value={metrics.accuracyRate} 
                  max={100} 
                  color="hsl(var(--primary))" 
                  size={100}
                />
                <div className="text-sm text-muted-foreground mt-2">Accuracy Rate</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">TPS:</span>
                  <span className="font-medium">{metrics.transactionsPerSecond.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Latency:</span>
                  <span className="font-medium">{metrics.avgProcessingTime.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uptime:</span>
                  <span className="font-medium text-green-500">{metrics.systemUptime.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Risk Assessment */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-accent" />
              Risk Assessment
            </h3>
            
            <div className="space-y-4">
              <div className="text-center">
                <AnimatedDonutChart 
                  value={metrics.riskScore} 
                  max={100} 
                  color={metrics.riskScore > 70 ? "hsl(var(--destructive))" : 
                         metrics.riskScore > 40 ? "hsl(var(--warning))" : "hsl(var(--success))"} 
                  size={100}
                />
                <div className="text-sm text-muted-foreground mt-2">Current Risk Level</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={
                    metrics.riskScore > 70 ? "destructive" :
                    metrics.riskScore > 40 ? "default" : "secondary"
                  }>
                    {metrics.riskScore > 70 ? "High Risk" :
                     metrics.riskScore > 40 ? "Medium Risk" : "Low Risk"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Threats:</span>
                  <span className="font-medium">{Math.floor(metrics.riskScore / 10)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Geographic Analysis */}
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-accent" />
              Geographic Fraud Analysis
            </h3>
            
            <AnimatedBarChart data={geographicData} />
          </Card>
        </div>

        {/* Bottom Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* ML Model Performance */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-accent" />
              ML Model Performance
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Ensemble", accuracy: 99.7, status: "active" },
                { name: "Neural Net", accuracy: 98.9, status: "active" },
                { name: "Random Forest", accuracy: 97.8, status: "standby" },
                { name: "SVM", accuracy: 97.3, status: "testing" }
              ].map((model, index) => (
                <motion.div
                  key={model.name}
                  className="p-3 bg-background/50 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{model.name}</span>
                    <Badge variant={
                      model.status === "active" ? "default" :
                      model.status === "testing" ? "secondary" : "outline"
                    }>
                      {model.status}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-green-500">{model.accuracy}%</div>
                  <Progress value={model.accuracy} className="h-2 mt-2" />
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Transaction Channels */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Network className="w-5 h-5 mr-2 text-accent" />
              Transaction Channels
            </h3>
            
            <div className="space-y-4">
              {[
                { channel: "Card Present", volume: 45, fraud: 1.2, icon: "💳" },
                { channel: "Online", volume: 35, fraud: 2.1, icon: "🌐" },
                { channel: "Mobile", volume: 15, fraud: 1.8, icon: "📱" },
                { channel: "UPI", volume: 5, fraud: 2.5, icon: "⚡" }
              ].map((channel, index) => (
                <motion.div
                  key={channel.channel}
                  className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{channel.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{channel.channel}</div>
                      <div className="text-xs text-muted-foreground">{channel.volume}% volume</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-red-500">{channel.fraud}%</div>
                    <div className="text-xs text-muted-foreground">fraud rate</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdvancedInteractiveDashboard;
