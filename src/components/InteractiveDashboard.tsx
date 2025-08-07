import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  DollarSign,
  Activity,
  Eye,
  Brain,
  Network,
  Zap,
  Target,
  Clock,
  Globe,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as d3 from "d3";
import { cn } from "@/lib/utils";

interface ThreatData {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  amount: number;
  timestamp: Date;
  status: "active" | "blocked" | "investigating";
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
  icon: React.ElementType;
  color: string;
}

const InteractiveDashboard = () => {
  const [activeThreats, setActiveThreats] = useState<ThreatData[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");
  const [realTimeData, setRealTimeData] = useState({
    transactionsPerSecond: 0,
    threatsBlocked: 0,
    accuracy: 99.94,
    falsePositives: 2.1
  });

  const networkGraphRef = useRef<SVGSVGElement>(null);
  const heatmapRef = useRef<SVGSVGElement>(null);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        transactionsPerSecond: Math.floor(Math.random() * 1000) + 8000,
        threatsBlocked: prev.threatsBlocked + Math.floor(Math.random() * 3),
        accuracy: 99.94 + (Math.random() - 0.5) * 0.1,
        falsePositives: 2.1 + (Math.random() - 0.5) * 0.5
      }));

      // Add new threat occasionally
      if (Math.random() < 0.3) {
        const newThreat: ThreatData = {
          id: `threat-${Date.now()}`,
          type: ["Card Fraud", "Account Takeover", "Synthetic Identity", "Money Laundering"][Math.floor(Math.random() * 4)],
          severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
          location: ["New York", "London", "Tokyo", "São Paulo", "Mumbai"][Math.floor(Math.random() * 5)],
          amount: Math.floor(Math.random() * 50000) + 1000,
          timestamp: new Date(),
          status: ["active", "blocked", "investigating"][Math.floor(Math.random() * 3)] as any
        };
        
        setActiveThreats(prev => [newThreat, ...prev.slice(0, 9)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Initialize network graph
  useEffect(() => {
    if (!networkGraphRef.current) return;

    const svg = d3.select(networkGraphRef.current);
    const width = 400;
    const height = 300;

    svg.selectAll("*").remove();

    // Create sample network data
    const nodes = [
      { id: "user1", group: 1, risk: 0.1 },
      { id: "user2", group: 1, risk: 0.8 },
      { id: "user3", group: 2, risk: 0.9 },
      { id: "merchant1", group: 3, risk: 0.2 },
      { id: "merchant2", group: 3, risk: 0.7 },
      { id: "device1", group: 4, risk: 0.6 },
      { id: "device2", group: 4, risk: 0.9 }
    ];

    const links = [
      { source: "user1", target: "merchant1", strength: 0.3 },
      { source: "user2", target: "merchant2", strength: 0.8 },
      { source: "user3", target: "merchant2", strength: 0.9 },
      { source: "user2", target: "device1", strength: 0.7 },
      { source: "user3", target: "device2", strength: 0.9 }
    ];

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: any) => Math.sqrt(d.strength * 10));

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", 8)
      .attr("fill", (d: any) => {
        if (d.risk > 0.7) return "#ef4444";
        if (d.risk > 0.4) return "#f59e0b";
        return "#10b981";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    });
  }, []);

  const metrics: MetricCard[] = [
    {
      title: "Transactions/Sec",
      value: realTimeData.transactionsPerSecond.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: Zap,
      color: "text-blue-500"
    },
    {
      title: "Threats Blocked",
      value: realTimeData.threatsBlocked.toString(),
      change: "+8.2%",
      trend: "up",
      icon: Shield,
      color: "text-green-500"
    },
    {
      title: "Accuracy Rate",
      value: `${realTimeData.accuracy.toFixed(2)}%`,
      change: "+0.1%",
      trend: "up",
      icon: Target,
      color: "text-purple-500"
    },
    {
      title: "False Positives",
      value: `${realTimeData.falsePositives.toFixed(1)}%`,
      change: "-15.3%",
      trend: "down",
      icon: AlertTriangle,
      color: "text-orange-500"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "blocked": return "text-green-500";
      case "investigating": return "text-yellow-500";
      case "active": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Activity className="w-4 h-4 mr-2" />
            Live Intelligence Dashboard
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Real-Time Fraud Intelligence
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced analytics and AI-powered insights for comprehensive fraud detection and prevention
          </p>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <metric.icon className={cn("w-8 h-8", metric.color)} />
                  <Badge variant={metric.trend === "up" ? "default" : metric.trend === "down" ? "secondary" : "outline"}>
                    {metric.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Threat Feed */}
          <Card className="lg:col-span-1 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                Active Threats
              </h3>
              <Badge variant="outline">{activeThreats.length}</Badge>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {activeThreats.map((threat) => (
                  <motion.div
                    key={threat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4 bg-background/50 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={cn("w-2 h-2 rounded-full", getSeverityColor(threat.severity))} />
                        <span className="text-sm font-medium">{threat.type}</span>
                      </div>
                      <span className={cn("text-xs", getStatusColor(threat.status))}>
                        {threat.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Location: {threat.location}</div>
                      <div>Amount: ${threat.amount.toLocaleString()}</div>
                      <div>Time: {threat.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>

          {/* Network Graph */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Network className="w-5 h-5 mr-2 text-blue-500" />
              Fraud Network Analysis
            </h3>
            <svg ref={networkGraphRef} width="100%" height="300" className="border border-border/20 rounded-lg" />
            <div className="mt-4 flex justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Low Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span>Medium Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>High Risk</span>
              </div>
            </div>
          </Card>

          {/* AI Insights */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-500" />
              AI Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Pattern Detection</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Identified 3 new fraud patterns in the last hour. Accuracy improved by 0.2%.
                </p>
              </div>
              
              <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Geographic Anomaly</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Unusual activity spike detected in Eastern Europe. Increased monitoring activated.
                </p>
              </div>
              
              <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Temporal Analysis</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Peak fraud attempts predicted for 2-4 AM EST based on historical patterns.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDashboard;
