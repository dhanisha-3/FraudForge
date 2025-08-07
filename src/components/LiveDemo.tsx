import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity,
  DollarSign,
  MapPin,
  Clock,
  User,
  Shield,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./animations/livedemo.module.css";
import { cn } from "@/lib/utils";

const LiveDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [nexusScore, setNexusScore] = useState(127);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [animationTriggered, setAnimationTriggered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('live-demo');
      if (element) {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isVisible && !animationTriggered) {
          setAnimationTriggered(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, [animationTriggered]);

  const demoSteps = [
    {
      title: "Normal Transaction",
      description: "Sarah purchases coffee for $4.50 in NYC",
      status: "safe",
      score: 127,
      details: {
        user: "Sarah Johnson",
        amount: "$4.50",
        location: "New York, NY",
        merchant: "Starbucks #1247",
        behavioralMatch: "99.7%",
        networkStatus: "Clean"
      },
      animation: {
        icon: CheckCircle,
        color: "text-green-500",
        background: "bg-green-500/10"
      }
    },
    {
      title: "Suspicious Activity Detected",
      description: "Same credentials used on new device in Romania",
      status: "suspicious",
      score: 5847,
      details: {
        user: "Sarah Johnson (?)",
        amount: "$49,999",
        location: "Bucharest, Romania",
        merchant: "Electronics Store",
        behavioralMatch: "6.2%",
        networkStatus: "3-hop fraud ring connection"
      },
      animation: {
        icon: AlertTriangle,
        color: "text-yellow-500",
        background: "bg-yellow-500/10"
      }
    },
    {
      title: "High-Risk Activity",
      description: "Multiple failed attempts with varying credentials",
      status: "danger",
      score: 9324,
      details: {
        user: "Multiple Attempts",
        amount: "$15,000",
        location: "Multiple Locations",
        merchant: "Online Gaming",
        behavioralMatch: "2.1%",
        networkStatus: "Known Fraud Pattern"
      },
      animation: {
        icon: XCircle,
        color: "text-red-500",
        background: "bg-red-500/10"
      }
    },
    {
      title: "Critical Fraud Alert",
      description: "Transaction blocked, account secured, fraud ring mapped",
      status: "blocked",
      score: 9847,
      details: {
        user: "Compromised Account",
        amount: "$49,999 BLOCKED",
        location: "Impossible geolocation",
        merchant: "Suspected fraud ring",
        behavioralMatch: "Automated tools detected",
        networkStatus: "17 connected accounts secured"
      }
    }
  ];

  const runDemo = () => {
    setCurrentStep(0);
    setIsAnalyzing(true);
    setNexusScore(127);
    
    const animationSteps = [
      { step: 1, score: 5847, delay: 2000 },
      { step: 2, score: 9324, delay: 4000 },
      { step: 3, score: 9847, delay: 6000 }
    ];

    animationSteps.forEach(({ step, score, delay }) => {
      setTimeout(() => {
        setCurrentStep(step);
        // Animate the score counter
        const startScore = step === 1 ? 127 : demoSteps[step - 1].score;
        const duration = 1000;
        const frames = 60;
        const increment = (score - startScore) / frames;
        
        let frame = 0;
        const animateScore = () => {
          frame++;
          setNexusScore(prev => Math.round(prev + increment));
          
          if (frame < frames) {
            requestAnimationFrame(animateScore);
          }
        };
        
        requestAnimationFrame(animateScore);
      }, delay);
    });

    setTimeout(() => setIsAnalyzing(false), 6000);
  };

  useEffect(() => {
    if (animationTriggered) {
      setTimeout(runDemo, 1000);
    }
  }, [animationTriggered]);

  const currentDemo = demoSteps[currentStep];
  
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "safe":
        return {
          badge: styles.statusBadge + " " + styles.safe,
          icon: CheckCircle,
          text: "Transaction Safe"
        };
      case "suspicious":
        return {
          badge: styles.statusBadge + " " + styles.suspicious,
          icon: AlertTriangle,
          text: "Suspicious Activity"
        };
      case "danger":
        return {
          badge: styles.statusBadge + " " + styles.danger,
          icon: XCircle,
          text: "High Risk"
        };
      default:
        return {
          badge: styles.statusBadge,
          icon: Activity,
          text: "Analyzing"
        };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe": return CheckCircle;
      case "analyzing": return AlertTriangle;
      case "blocked": return XCircle;
      default: return Activity;
    }
  };

  return (
    <section id="demo" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="neural" className="mb-4">
            Live Intelligence Demo
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-hero bg-clip-text text-transparent">Behavioral</span> Biometrics In Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Watch FraudGuard AI's multi-modal analysis detect unforgeable behavioral patterns in real-time
          </p>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={runDemo}
            disabled={isAnalyzing}
            className="mb-12"
          >
            {isAnalyzing ? "Running Analysis..." : "Run Live Demo"}
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Transaction Details */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Transaction Analysis</h3>
                <Badge variant={getStatusColor(currentDemo.status)} className="animate-pulse">
                  {currentDemo.title}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">User:</span>
                  <span className="font-medium">{currentDemo.details.user}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="font-medium">{currentDemo.details.amount}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Location:</span>
                  <span className="font-medium">{currentDemo.details.location}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Behavioral Match:</span>
                  <span className={`font-medium ${currentDemo.status === 'safe' ? 'text-success' : 'text-destructive'}`}>
                    {currentDemo.details.behavioralMatch}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Network Status:</span>
                  <span className="font-medium">{currentDemo.details.networkStatus}</span>
                </div>
              </div>
            </Card>

            {/* NEXUS Score */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/20">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-6">FraudGuard Score™</h3>
                
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={`hsl(var(--${getStatusColor(currentDemo.status)}))`}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(nexusScore / 1000) * 251.2} 251.2`}
                      className="transition-all duration-1000 ease-out"
                      style={{
                        filter: `drop-shadow(0 0 10px hsl(var(--${getStatusColor(currentDemo.status)})))`
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-3xl font-bold text-${getStatusColor(currentDemo.status)}`}>
                        {nexusScore.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">/ 1,000</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Risk Level:</span>
                     <Badge variant={getStatusColor(currentDemo.status)}>
                       {nexusScore <= 200 ? "Green Zone" : 
                        nexusScore <= 600 ? "Yellow Zone" : 
                        nexusScore <= 800 ? "Orange Zone" : "Red Zone"}
                     </Badge>
                   </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Processing Time:</span>
                    <span className="font-medium text-accent">&lt; 50ms</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Confidence:</span>
                    <span className="font-medium">
                      {currentDemo.status === 'blocked' ? '99.97%' : 
                       currentDemo.status === 'analyzing' ? '94.5%' : '99.7%'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* AI Explanation */}
          <Card className="mt-8 p-6 bg-card/80 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Shield className="w-5 h-5 text-accent" />
              <span>AI Explanation</span>
            </h3>
            <div className="bg-muted/20 rounded-lg p-4">
              <p className="text-sm leading-relaxed">
                {currentDemo.status === 'safe' && 
                  "✅ Behavioral biometrics verified. Multi-modal analysis shows consistent patterns across mouse movement, keystroke dynamics, and contextual factors. FraudGuard AI approves with high confidence."
                }
                {currentDemo.status === 'analyzing' && 
                  "⚠️ Behavioral anomaly detected. Multi-modal analysis reveals significant deviations in typing patterns and device characteristics. Smart intervention system activating enhanced verification."
                }
                {currentDemo.status === 'blocked' && 
                  "🚫 CRITICAL FRAUD ALERT: Behavioral biometrics impossible to replicate detected. FraudGuard AI's contextual intelligence confirms coordinated attack pattern. Digital Twin analysis shows 99.7% fraud probability. Transaction blocked with explainable reasoning."
                }
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;