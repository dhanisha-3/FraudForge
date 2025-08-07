import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Atom, 
  Network, 
  Fingerprint, 
  Bot, 
  Shield, 
  Brain, 
  Cpu,
  TrendingUp,
  MessageSquare,
  Search
} from "lucide-react";

const DefenseMatrix = () => {
  const layers = [
    {
      id: 1,
      title: "Behavioral Biometrics Engine",
      description: "Creates unforgeable 'behavioral fingerprints' through mouse movement patterns, typing dynamics, and touch biometrics",
      icon: Fingerprint,
      color: "quantum",
      features: [
        "Mouse movement pattern analysis",
        "Keystroke dynamics profiling",
        "Touch biometric authentication",
        "Behavioral DNA creation"
      ]
    },
    {
      id: 2,
      title: "Contextual Intelligence Network",
      description: "Advanced geospatial anomaly detection, device DNA profiling, and social network analysis for comprehensive context",
      icon: Network,
      color: "neural",
      features: [
        "Geospatial anomaly detection",
        "Device DNA profiling",
        "Social network analysis",
        "Time-pattern intelligence"
      ]
    },
    {
      id: 3,
      title: "Explainable AI Framework",
      description: "Real-time explanations for every decision with risk factor breakdown and GDPR compliance",
      icon: MessageSquare,
      color: "accent",
      features: [
        "Real-time decision explanations",
        "Risk factor breakdown",
        "Appeal process integration",
        "Regulatory compliance"
      ]
    },
    {
      id: 4,
      title: "FraudGuard Score™ Engine",
      description: "Dynamic risk scoring (0-1000) with real-time updates based on multi-modal behavioral analysis",
      icon: TrendingUp,
      color: "warning",
      features: [
        "Dynamic 0-1000 scoring scale",
        "Real-time score updates",
        "Multi-factor risk calculation",
        "Behavioral deviation tracking"
      ]
    },
    {
      id: 5,
      title: "Smart Intervention System",
      description: "Graduated response system with smart challenges instead of binary block/allow decisions",
      icon: Shield,
      color: "success",
      features: [
        "Zone-based interventions",
        "Smart challenge mechanisms",
        "Graduated response levels",
        "Customer-friendly blocking"
      ]
    },
    {
      id: 6,
      title: "Fraud Prophet™ Predictive Analytics",
      description: "Advanced predictive capabilities including intent prediction, risk trajectory analysis, and fraud calendars",
      icon: Brain,
      color: "secondary",
      features: [
        "Intent prediction engine",
        "Risk trajectory modeling",
        "Fraud calendar predictions",
        "Merchant alert system"
      ]
    },
    {
      id: 7,
      title: "Digital Twin Technology",
      description: "Creates digital replicas of user behavior patterns for advanced fraud simulation and drift detection",
      icon: Cpu,
      color: "primary",
      features: [
        "Normal behavior modeling",
        "Fraud scenario stress testing",
        "Behavior drift detection",
        "Recovery pattern learning"
      ]
    }
  ];

  return (
    <section id="architecture" className="py-24 bg-card/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="quantum" className="mb-4">
            Multi-Modal AI Architecture
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The <span className="bg-gradient-hero bg-clip-text text-transparent">FraudGuard AI</span> Ecosystem
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Revolutionary behavioral biometrics and contextual intelligence delivering 99.7% accuracy with explainable AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {layers.map((layer, index) => {
            const IconComponent = layer.icon;
            return (
              <Card 
                key={layer.id} 
                className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-glow group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-${layer.color} flex items-center justify-center shadow-${layer.color === 'quantum' ? 'quantum' : 'neural'} group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Layer {layer.id}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {layer.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {layer.description}
                    </p>
                    <div className="space-y-2">
                      {layer.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DefenseMatrix;