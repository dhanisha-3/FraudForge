import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Zap, 
  Shield, 
  Target,
  DollarSign,
  Clock,
  Users,
  Award
} from "lucide-react";

const PerformanceMetrics = () => {
  const metrics = [
    {
      title: "Detection Accuracy",
      value: "99.7%",
      improvement: "+15% vs competition",
      icon: Target,
      color: "success",
      progress: 99.7
    },
    {
      title: "False Positive Reduction",
      value: "85%",
      improvement: "Industry leading",
      icon: Shield,
      color: "primary",
      progress: 85
    },
    {
      title: "Processing Speed",
      value: "<50ms",
      improvement: "10x faster",
      icon: Zap,
      color: "warning",
      progress: 95
    },
    {
      title: "Customer Satisfaction",
      value: "40%",
      improvement: "Approval rate boost",
      icon: DollarSign,
      color: "success",
      progress: 100
    }
  ];

  const comparisons = [
    {
      metric: "Detection Accuracy",
      traditional: "70-80%",
      competitors: "85-92%",
      nexus: "99.7%",
      advantage: "🔥 15% better"
    },
    {
      metric: "False Positive Rate",
      traditional: "20-30%",
      competitors: "8-15%",
      nexus: "3%",
      advantage: "🔥 85% reduction"
    },
    {
      metric: "Processing Speed",
      traditional: "2-5 seconds",
      competitors: "200-500ms",
      nexus: "<50ms",
      advantage: "🔥 10x faster"
    },
    {
      metric: "Zero-Day Detection",
      traditional: "20%",
      competitors: "45%",
      nexus: "99.8%",
      advantage: "🔥 Revolutionary"
    }
  ];

  const achievements = [
    {
      title: "World's First",
      description: "Production-ready quantum fraud detection",
      icon: Award,
      highlight: true
    },
    {
      title: "Breakthrough Results",
      description: "12 new fraud archetypes discovered",
      icon: TrendingUp,
      highlight: false
    },
    {
      title: "Enterprise Ready",
      description: "10M+ transactions per second",
      icon: Users,
      highlight: false
    },
    {
      title: "Real-time Protection",
      description: "48-72 hour fraud prediction",
      icon: Clock,
      highlight: true
    }
  ];

  return (
    <section id="performance" className="py-24 bg-card/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="quantum" className="mb-4">
            Performance Excellence
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-hero bg-clip-text text-transparent">Market-Leading</span> Performance Metrics
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            FraudGuard AI delivers unprecedented accuracy while reducing false positives and enhancing user experience
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="p-6 bg-card/80 backdrop-blur-sm border-primary/20 hover:shadow-glow transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-${metric.color} flex items-center justify-center shadow-neural group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {metric.improvement}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">{metric.title}</h3>
                <div className="text-3xl font-bold mb-2 bg-gradient-hero bg-clip-text text-transparent">
                  {metric.value}
                </div>
                <Progress value={metric.progress} className="h-2" />
              </Card>
            );
          })}
        </div>

        {/* Comparison Table */}
        <Card className="p-8 bg-card/80 backdrop-blur-sm border-primary/20 mb-16">
          <h3 className="text-2xl font-bold mb-6 text-center">Market Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Capability</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Traditional Systems</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Leading Competitors</th>
                  <th className="text-center py-3 px-4 font-semibold text-primary">FraudGuard AI</th>
                  <th className="text-center py-3 px-4 font-semibold text-accent">Advantage</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-medium">{row.metric}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{row.traditional}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{row.competitors}</td>
                    <td className="py-3 px-4 text-center font-bold text-primary">{row.nexus}</td>
                    <td className="py-3 px-4 text-center text-accent font-medium">{row.advantage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <Card 
                key={index} 
                className={`p-6 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                  achievement.highlight 
                    ? 'border-primary/40 shadow-quantum' 
                    : 'border-primary/20 hover:border-primary/30'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${
                    achievement.highlight 
                      ? 'bg-gradient-quantum shadow-quantum' 
                      : 'bg-gradient-neural shadow-neural'
                  } flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* ROI Callout */}
        <Card className="mt-16 p-8 bg-gradient-quantum/10 backdrop-blur-sm border-primary/30 text-center">
          <h3 className="text-3xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            1,894% ROI Guaranteed
          </h3>
          <p className="text-xl text-muted-foreground mb-6">
            $9.97M annual savings with only $500K investment - Revolutionary fraud prevention economics
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold text-success">$125M</div>
              <div className="text-sm text-muted-foreground">Direct Fraud Savings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">$45M</div>
              <div className="text-sm text-muted-foreground">False Positive Reduction</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">$70M</div>
              <div className="text-sm text-muted-foreground">Operational Efficiency</div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default PerformanceMetrics;