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

interface DetailItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

const DetailItem = ({ icon: Icon, label, value, color }: DetailItemProps) => (
  <div className="p-4 bg-card/5 rounded-lg backdrop-blur-sm">
    <div className="flex items-center space-x-3">
      <Icon className={cn("w-5 h-5", color)} />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  </div>
);

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
          badge: cn(styles.statusBadge, styles.safe),
          icon: CheckCircle,
          text: "Transaction Safe",
          color: "text-green-500"
        };
      case "suspicious":
        return {
          badge: cn(styles.statusBadge, styles.suspicious),
          icon: AlertTriangle,
          text: "Suspicious Activity",
          color: "text-yellow-500"
        };
      case "danger":
        return {
          badge: cn(styles.statusBadge, styles.danger),
          icon: XCircle,
          text: "High Risk",
          color: "text-red-500"
        };
      default:
        return {
          badge: styles.statusBadge,
          icon: Activity,
          text: "Analyzing",
          color: "text-blue-500"
        };
    }
  };

  return (
    <section id="live-demo" className="py-24 relative overflow-hidden">
      <motion.div 
        className="container mx-auto px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: animationTriggered ? 1 : 0, y: animationTriggered ? 0 : 20 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <Badge variant="outline" className={styles.badge}>
            Live Demo
          </Badge>
          <h2 className={cn("text-4xl font-bold mt-4 mb-2", styles.gradientText)}>
            Experience Real-Time Fraud Detection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch our AI system analyze transactions and detect potential fraud in real-time
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Analysis Card */}
          <motion.div
            layout
            className={styles.demoCard}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 bg-transparent">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold">{currentDemo.title}</h3>
                      <p className="text-sm text-muted-foreground">{currentDemo.description}</p>
                    </div>
                    <div className={getStatusStyle(currentDemo.status).badge}>
                      <currentDemo.animation.icon className="w-4 h-4 mr-2" />
                      {getStatusStyle(currentDemo.status).text}
                    </div>
                  </div>

                  <div className={styles.detailsGrid}>
                    <DetailItem
                      icon={User}
                      label="User"
                      value={currentDemo.details.user}
                      color={currentDemo.animation.color}
                    />
                    <DetailItem
                      icon={DollarSign}
                      label="Amount"
                      value={currentDemo.details.amount}
                      color={currentDemo.animation.color}
                    />
                    <DetailItem
                      icon={MapPin}
                      label="Location"
                      value={currentDemo.details.location}
                      color={currentDemo.animation.color}
                    />
                    <DetailItem
                      icon={Shield}
                      label="Security"
                      value={currentDemo.details.networkStatus}
                      color={currentDemo.animation.color}
                    />
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="text-sm font-medium">Risk Score</span>
                      <motion.span
                        key={nexusScore}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn("text-lg font-bold", currentDemo.animation.color)}
                      >
                        {nexusScore.toLocaleString()}
                      </motion.span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <motion.div
                        className={cn("h-full rounded-full", currentDemo.animation.background)}
                        initial={{ width: "0%" }}
                        animate={{ width: `${(nexusScore / 10000) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Info Panel */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-semibold mb-4">
                Advanced Fraud Detection in Action
              </h3>
              <p className="text-muted-foreground mb-6">
                Watch our system analyze transactions in real-time, using advanced AI 
                and behavioral biometrics to detect and prevent fraud with unprecedented accuracy.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className={cn(styles.demoCard, "p-4")}>
                  <div className="text-center">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-medium">Real-Time</h4>
                    <p className="text-sm text-muted-foreground">Instant Analysis</p>
                  </div>
                </Card>
                <Card className={cn(styles.demoCard, "p-4")}>
                  <div className="text-center">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-medium">99.94%</h4>
                    <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                  </div>
                </Card>
              </div>

              <Button
                onClick={runDemo}
                disabled={isAnalyzing}
                className={cn(styles.analyzeButton, "mt-6 w-full")}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4 mr-2" />
                    Run New Analysis
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Background Elements */}
      <div className={cn(styles.orb, "top-1/4 left-1/4")} />
      <div className={cn(styles.orb, "bottom-1/4 right-1/4")} />
    </section>
  );
};

export default LiveDemo;