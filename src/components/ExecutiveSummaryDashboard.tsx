import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  DollarSign,
  Users,
  Globe,
  Brain,
  Zap,
  Activity,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  Award,
  Star,
  Rocket,
  Crown,
  Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExecutiveMetrics {
  totalTransactions: number;
  fraudPrevented: number;
  moneySaved: number;
  accuracyRate: number;
  falsePositiveReduction: number;
  customerSatisfaction: number;
  systemUptime: number;
  responseTime: number;
  roiPercentage: number;
  marketShare: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
  trend: "up" | "down" | "stable";
  change: string;
}

const ExecutiveSummaryDashboard = () => {
  const [metrics, setMetrics] = useState<ExecutiveMetrics>({
    totalTransactions: 0,
    fraudPrevented: 0,
    moneySaved: 0,
    accuracyRate: 0,
    falsePositiveReduction: 0,
    customerSatisfaction: 0,
    systemUptime: 0,
    responseTime: 0,
    roiPercentage: 0,
    marketShare: 0
  });

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);

  // Generate executive metrics
  const generateMetrics = (): ExecutiveMetrics => ({
    totalTransactions: 2500000 + Math.floor(Math.random() * 500000),
    fraudPrevented: 45000 + Math.floor(Math.random() * 10000),
    moneySaved: 67500000 + Math.floor(Math.random() * 15000000),
    accuracyRate: 99.7 + Math.random() * 0.3,
    falsePositiveReduction: 85 + Math.random() * 10,
    customerSatisfaction: 94 + Math.random() * 5,
    systemUptime: 99.95 + Math.random() * 0.05,
    responseTime: 45 + Math.random() * 15,
    roiPercentage: 340 + Math.random() * 60,
    marketShare: 15.8 + Math.random() * 2
  });

  const generateAchievements = (): Achievement[] => [
    {
      id: "industry_leader",
      title: "Industry Leader",
      description: "Highest accuracy rate in fraud detection",
      value: "99.7%",
      icon: Crown,
      color: "text-yellow-500",
      trend: "up",
      change: "+0.3%"
    },
    {
      id: "cost_savings",
      title: "Cost Savings Champion",
      description: "Saved over $67M in fraud losses",
      value: "$67.5M",
      icon: Trophy,
      color: "text-green-500",
      trend: "up",
      change: "+15.7%"
    },
    {
      id: "customer_satisfaction",
      title: "Customer Excellence",
      description: "Highest customer satisfaction score",
      value: "94.2%",
      icon: Star,
      color: "text-blue-500",
      trend: "up",
      change: "+2.1%"
    },
    {
      id: "innovation_award",
      title: "Innovation Award",
      description: "Best AI-powered fraud detection system",
      value: "2024",
      icon: Award,
      color: "text-purple-500",
      trend: "stable",
      change: "New"
    },
    {
      id: "market_growth",
      title: "Market Growth",
      description: "Fastest growing fraud detection platform",
      value: "340%",
      icon: Rocket,
      color: "text-orange-500",
      trend: "up",
      change: "+45%"
    }
  ];

  // Update metrics periodically
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(generateMetrics());
    };

    updateMetrics();
    setAchievements(generateAchievements());

    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (num: number): string => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num}`;
  };

  return (
    <section id="executive-summary" className="py-24 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 bg-gradient-to-r from-primary to-secondary text-white border-none">
            <Crown className="w-4 h-4 mr-2" />
            Executive Summary
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              FraudGuard AI: Transforming Financial Security
            </span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Industry-leading AI-powered fraud detection system delivering unprecedented accuracy, 
            cost savings, and customer satisfaction across global financial institutions
          </p>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {[
            {
              label: "Total Transactions",
              value: formatNumber(metrics.totalTransactions),
              icon: Activity,
              color: "text-blue-500",
              bgColor: "bg-blue-500/10",
              trend: "up",
              change: "+12.5%"
            },
            {
              label: "Fraud Prevented",
              value: formatNumber(metrics.fraudPrevented),
              icon: Shield,
              color: "text-red-500",
              bgColor: "bg-red-500/10",
              trend: "up",
              change: "+8.2%"
            },
            {
              label: "Money Saved",
              value: formatCurrency(metrics.moneySaved),
              icon: DollarSign,
              color: "text-green-500",
              bgColor: "bg-green-500/10",
              trend: "up",
              change: "+15.7%"
            },
            {
              label: "Accuracy Rate",
              value: `${metrics.accuracyRate.toFixed(1)}%`,
              icon: Target,
              color: "text-purple-500",
              bgColor: "bg-purple-500/10",
              trend: "up",
              change: "+0.3%"
            },
            {
              label: "ROI",
              value: `${metrics.roiPercentage.toFixed(0)}%`,
              icon: TrendingUp,
              color: "text-orange-500",
              bgColor: "bg-orange-500/10",
              trend: "up",
              change: "+45%"
            }
          ].map((kpi, index) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover-lift relative overflow-hidden">
                <div className={cn("absolute inset-0 opacity-5", kpi.bgColor)} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-3 rounded-full", kpi.bgColor)}>
                      <kpi.icon className={cn("w-6 h-6", kpi.color)} />
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">{kpi.change}</span>
                    </div>
                  </div>
                  <motion.div 
                    className="text-3xl font-bold mb-2"
                    key={kpi.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {kpi.value}
                  </motion.div>
                  <div className="text-sm text-muted-foreground">{kpi.label}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Achievements Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Industry Recognition & Achievements
            </span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover-lift text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                  <div className="relative">
                    <div className={cn("w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center", 
                      achievement.color === "text-yellow-500" ? "bg-yellow-500/10" :
                      achievement.color === "text-green-500" ? "bg-green-500/10" :
                      achievement.color === "text-blue-500" ? "bg-blue-500/10" :
                      achievement.color === "text-purple-500" ? "bg-purple-500/10" : "bg-orange-500/10"
                    )}>
                      <achievement.icon className={cn("w-8 h-8", achievement.color)} />
                    </div>
                    <h4 className="font-bold text-lg mb-2">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                    <div className="text-2xl font-bold mb-2">{achievement.value}</div>
                    <Badge variant={achievement.trend === "up" ? "default" : "secondary"}>
                      {achievement.change}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* System Performance */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-accent" />
              System Performance
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Accuracy Rate</span>
                  <span className="text-sm font-bold text-green-500">{metrics.accuracyRate.toFixed(1)}%</span>
                </div>
                <Progress value={metrics.accuracyRate} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">System Uptime</span>
                  <span className="text-sm font-bold text-blue-500">{metrics.systemUptime.toFixed(2)}%</span>
                </div>
                <Progress value={metrics.systemUptime} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                  <span className="text-sm font-bold text-purple-500">{metrics.customerSatisfaction.toFixed(1)}%</span>
                </div>
                <Progress value={metrics.customerSatisfaction} className="h-3" />
              </div>
            </div>
          </Card>

          {/* Business Impact */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-accent" />
              Business Impact
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div>
                  <div className="font-medium">False Positive Reduction</div>
                  <div className="text-sm text-muted-foreground">vs Traditional Systems</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-500">{metrics.falsePositiveReduction.toFixed(0)}%</div>
                  <div className="text-xs text-green-500">↓ Reduction</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div>
                  <div className="font-medium">Response Time</div>
                  <div className="text-sm text-muted-foreground">Average Processing</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-500">{metrics.responseTime.toFixed(0)}ms</div>
                  <div className="text-xs text-blue-500">Sub-100ms</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div>
                  <div className="font-medium">Market Share</div>
                  <div className="text-sm text-muted-foreground">Fraud Detection Market</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-purple-500">{metrics.marketShare.toFixed(1)}%</div>
                  <div className="text-xs text-purple-500">Growing</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Technology Stack */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-accent" />
              Technology Excellence
            </h3>
            
            <div className="space-y-4">
              {[
                { tech: "AI/ML Models", status: "Active", count: "6 Models" },
                { tech: "Real-time Processing", status: "Optimized", count: "<100ms" },
                { tech: "Behavioral Biometrics", status: "Advanced", count: "99.4% Accuracy" },
                { tech: "Multi-channel Support", status: "Complete", count: "4 Channels" },
                { tech: "Continuous Learning", status: "Enabled", count: "24/7 Updates" }
              ].map((item, index) => (
                <motion.div
                  key={item.tech}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-background/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div>
                    <div className="font-medium text-sm">{item.tech}</div>
                    <div className="text-xs text-muted-foreground">{item.status}</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {item.count}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Card className="p-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Transform Your Fraud Detection?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join leading financial institutions worldwide who trust FraudGuard AI to protect their customers 
              and reduce fraud losses by up to 85%.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                <Rocket className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline">
                <Users className="w-5 h-5 mr-2" />
                Schedule Demo
              </Button>
              <Button size="lg" variant="outline">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Case Studies
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ExecutiveSummaryDashboard;
