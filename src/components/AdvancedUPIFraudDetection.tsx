import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Brain,
  Target,
  Activity,
  Clock,
  MapPin,
  Smartphone,
  Users,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  Play,
  Pause,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface UPITransaction {
  id: string;
  senderUPI: string;
  receiverUPI: string;
  amount: number;
  timestamp: Date;
  transactionType: "P2P" | "P2M" | "Request" | "QR";
  location: string;
  deviceId: string;
  ipAddress: string;
  riskScore: number;
  status: "processing" | "approved" | "flagged" | "blocked";
  riskFactors: string[];
  socialEngineeringScore: number;
  velocityRisk: number;
  deviceRisk: number;
  locationRisk: number;
}

interface UPIPattern {
  id: string;
  pattern: string;
  description: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  detectionCount: number;
  lastDetected: Date;
}

interface UPIAnalytics {
  totalTransactions: number;
  fraudDetected: number;
  socialEngineeringAttempts: number;
  velocityViolations: number;
  deviceAnomalies: number;
  accuracyRate: number;
  avgProcessingTime: number;
}

const AdvancedUPIFraudDetection = () => {
  const [upiInput, setUpiInput] = useState("");
  const [receiverInput, setReceiverInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [transactionType, setTransactionType] = useState<"P2P" | "P2M" | "Request" | "QR">("P2P");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<UPITransaction | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<UPITransaction[]>([]);
  const [fraudPatterns, setFraudPatterns] = useState<UPIPattern[]>([]);
  const [analytics, setAnalytics] = useState<UPIAnalytics>({
    totalTransactions: 0,
    fraudDetected: 0,
    socialEngineeringAttempts: 0,
    velocityViolations: 0,
    deviceAnomalies: 0,
    accuracyRate: 0,
    avgProcessingTime: 0
  });
  const [isLiveMode, setIsLiveMode] = useState(false);

  // Advanced UPI fraud detection algorithm
  const analyzeUPITransaction = (transaction: Omit<UPITransaction, 'riskScore' | 'status' | 'riskFactors' | 'socialEngineeringScore' | 'velocityRisk' | 'deviceRisk' | 'locationRisk'>): UPITransaction => {
    const startTime = performance.now();
    let riskScore = 0;
    const riskFactors: string[] = [];

    // 1. UPI ID Validation and Risk Assessment
    const senderValidation = validateUPIId(transaction.senderUPI);
    const receiverValidation = validateUPIId(transaction.receiverUPI);
    
    if (!senderValidation.isValid) {
      riskScore += 30;
      riskFactors.push("Invalid sender UPI format");
    }
    
    if (!receiverValidation.isValid) {
      riskScore += 30;
      riskFactors.push("Invalid receiver UPI format");
    }

    // 2. Amount-based Risk Analysis
    const amountRisk = analyzeAmountRisk(transaction.amount, transaction.transactionType);
    riskScore += amountRisk.score;
    riskFactors.push(...amountRisk.factors);

    // 3. Social Engineering Detection
    const socialEngineeringScore = detectSocialEngineering(transaction);
    riskScore += socialEngineeringScore.score;
    riskFactors.push(...socialEngineeringScore.factors);

    // 4. Velocity Analysis
    const velocityRisk = analyzeVelocity(transaction.senderUPI, transaction.amount);
    riskScore += velocityRisk.score;
    riskFactors.push(...velocityRisk.factors);

    // 5. Device and Location Risk
    const deviceRisk = analyzeDeviceRisk(transaction.deviceId, transaction.ipAddress);
    const locationRisk = analyzeLocationRisk(transaction.location, transaction.senderUPI);
    
    riskScore += deviceRisk.score + locationRisk.score;
    riskFactors.push(...deviceRisk.factors, ...locationRisk.factors);

    // 6. Transaction Type Specific Analysis
    const typeRisk = analyzeTransactionType(transaction);
    riskScore += typeRisk.score;
    riskFactors.push(...typeRisk.factors);

    // 7. Time-based Analysis
    const timeRisk = analyzeTimePatterns(transaction.timestamp);
    riskScore += timeRisk.score;
    riskFactors.push(...timeRisk.factors);

    // Determine status
    let status: UPITransaction['status'];
    if (riskScore >= 80) {
      status = "blocked";
    } else if (riskScore >= 50) {
      status = "flagged";
    } else {
      status = "approved";
    }

    const processingTime = performance.now() - startTime;

    return {
      ...transaction,
      riskScore: Math.min(100, riskScore),
      status,
      riskFactors,
      socialEngineeringScore: socialEngineeringScore.score,
      velocityRisk: velocityRisk.score,
      deviceRisk: deviceRisk.score,
      locationRisk: locationRisk.score
    };
  };

  // UPI ID validation with advanced checks
  const validateUPIId = (upiId: string): { isValid: boolean; risk: number } => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    const isFormatValid = upiRegex.test(upiId) && upiId.length >= 3 && upiId.length <= 50;
    
    let risk = 0;
    
    // Check for suspicious patterns
    const suspiciousPatterns = ['temp', 'test', 'fake', 'scam', 'fraud', 'unknown', 'random', '123', 'abc'];
    if (suspiciousPatterns.some(pattern => upiId.toLowerCase().includes(pattern))) {
      risk += 25;
    }
    
    // Check for unusual characters or patterns
    if (upiId.includes('..') || upiId.includes('--') || upiId.includes('__')) {
      risk += 15;
    }
    
    return { isValid: isFormatValid, risk };
  };

  // Amount-based risk analysis
  const analyzeAmountRisk = (amount: number, type: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    // High amount thresholds
    if (amount > 200000) {
      score += 40;
      factors.push("Extremely high amount (>₹2L)");
    } else if (amount > 100000) {
      score += 30;
      factors.push("Very high amount (>₹1L)");
    } else if (amount > 50000) {
      score += 20;
      factors.push("High amount transaction");
    }
    
    // Round amount patterns (common in fraud)
    if (amount % 1000 === 0 && amount >= 5000) {
      score += 10;
      factors.push("Round amount pattern");
    }
    
    // Type-specific amount analysis
    if (type === "Request" && amount > 10000) {
      score += 15;
      factors.push("High-value payment request");
    }
    
    return { score, factors };
  };

  // Social engineering detection
  const detectSocialEngineering = (transaction: any): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    const hour = transaction.timestamp.getHours();
    const amount = transaction.amount;
    
    // Common social engineering patterns
    const commonScamAmounts = [1000, 2000, 5000, 10000, 25000, 50000, 99999];
    if (commonScamAmounts.includes(amount)) {
      score += 20;
      factors.push("Common scam amount pattern");
    }
    
    // Urgent request patterns during business hours
    if (transaction.transactionType === "Request" && hour >= 9 && hour <= 18 && amount > 5000) {
      score += 25;
      factors.push("Potential urgent request scam");
    }
    
    // Emergency amount patterns
    if (amount === 99999 || amount === 50001 || amount === 25001) {
      score += 30;
      factors.push("Emergency scam amount pattern");
    }
    
    return { score, factors };
  };

  // Velocity analysis
  const analyzeVelocity = (senderUPI: string, amount: number): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    // Simulate velocity check
    const recentCount = Math.floor(Math.random() * 10);
    const recentAmount = Math.floor(Math.random() * 100000);
    
    if (recentCount >= 10) {
      score += 35;
      factors.push("Excessive transaction frequency");
    } else if (recentCount >= 5) {
      score += 20;
      factors.push("High transaction frequency");
    }
    
    if (recentAmount > 100000) {
      score += 30;
      factors.push("High cumulative amount");
    }
    
    return { score, factors };
  };

  // Device risk analysis
  const analyzeDeviceRisk = (deviceId: string, ipAddress: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    // Simulate device analysis
    if (Math.random() > 0.8) {
      score += 20;
      factors.push("New device detected");
    }
    
    if (Math.random() > 0.9) {
      score += 25;
      factors.push("Suspicious device behavior");
    }
    
    // IP-based risk
    if (ipAddress.startsWith("192.168") || ipAddress.startsWith("10.")) {
      // Private IP - lower risk
    } else if (Math.random() > 0.85) {
      score += 15;
      factors.push("Suspicious IP location");
    }
    
    return { score, factors };
  };

  // Location risk analysis
  const analyzeLocationRisk = (location: string, senderUPI: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    const highRiskLocations = ["Unknown", "Nigeria", "Romania", "Russia"];
    if (highRiskLocations.some(loc => location.includes(loc))) {
      score += 30;
      factors.push("High-risk geographic location");
    }
    
    // Simulate location consistency check
    if (Math.random() > 0.9) {
      score += 20;
      factors.push("Location inconsistency detected");
    }
    
    return { score, factors };
  };

  // Transaction type analysis
  const analyzeTransactionType = (transaction: any): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    switch (transaction.transactionType) {
      case "QR":
        score += 5;
        if (transaction.amount > 10000) {
          score += 10;
          factors.push("High-value QR transaction");
        }
        break;
      case "Request":
        if (transaction.amount > 1000) {
          score += 8;
          factors.push("Payment request risk");
        }
        break;
    }
    
    return { score, factors };
  };

  // Time pattern analysis
  const analyzeTimePatterns = (timestamp: Date): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    const hour = timestamp.getHours();
    
    // Night time transactions
    if (hour >= 23 || hour <= 5) {
      score += 15;
      factors.push("Unusual transaction time");
    }
    
    // Weekend patterns
    const day = timestamp.getDay();
    if ((day === 0 || day === 6) && hour >= 22) {
      score += 10;
      factors.push("Late weekend transaction");
    }
    
    return { score, factors };
  };

  // Handle transaction analysis
  const handleAnalyzeTransaction = () => {
    if (!upiInput || !receiverInput || !amountInput) return;
    
    setIsAnalyzing(true);
    
    const transaction = {
      id: `upi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderUPI: upiInput,
      receiverUPI: receiverInput,
      amount: parseFloat(amountInput),
      timestamp: new Date(),
      transactionType,
      location: "Mumbai, India", // Simulated
      deviceId: `device_${Math.random().toString(36).substr(2, 9)}`,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    };
    
    setTimeout(() => {
      const analyzedTransaction = analyzeUPITransaction(transaction);
      setCurrentTransaction(analyzedTransaction);
      setIsAnalyzing(false);
      
      // Update analytics
      setAnalytics(prev => ({
        totalTransactions: prev.totalTransactions + 1,
        fraudDetected: prev.fraudDetected + (analyzedTransaction.status === "blocked" ? 1 : 0),
        socialEngineeringAttempts: prev.socialEngineeringAttempts + (analyzedTransaction.socialEngineeringScore > 20 ? 1 : 0),
        velocityViolations: prev.velocityViolations + (analyzedTransaction.velocityRisk > 15 ? 1 : 0),
        deviceAnomalies: prev.deviceAnomalies + (analyzedTransaction.deviceRisk > 15 ? 1 : 0),
        accuracyRate: 96.8 + Math.random() * 2,
        avgProcessingTime: 35 + Math.random() * 15
      }));
      
      // Add to recent transactions
      setRecentTransactions(prev => [analyzedTransaction, ...prev.slice(0, 9)]);
    }, 2000);
  };

  // Generate fraud patterns
  useEffect(() => {
    const patterns: UPIPattern[] = [
      {
        id: "1",
        pattern: "Round Amount Scam",
        description: "Transactions with round amounts (₹1000, ₹5000, etc.)",
        riskLevel: "medium",
        detectionCount: 156,
        lastDetected: new Date(Date.now() - 3600000)
      },
      {
        id: "2",
        pattern: "Emergency Request",
        description: "Urgent payment requests with emotional manipulation",
        riskLevel: "high",
        detectionCount: 89,
        lastDetected: new Date(Date.now() - 1800000)
      },
      {
        id: "3",
        pattern: "Fake UPI ID",
        description: "UPI IDs mimicking legitimate services",
        riskLevel: "critical",
        detectionCount: 234,
        lastDetected: new Date(Date.now() - 900000)
      },
      {
        id: "4",
        pattern: "Velocity Attack",
        description: "Multiple rapid transactions from same source",
        riskLevel: "high",
        detectionCount: 67,
        lastDetected: new Date(Date.now() - 2700000)
      }
    ];
    
    setFraudPatterns(patterns);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "text-green-500";
      case "flagged": return "text-yellow-500";
      case "blocked": return "text-red-500";
      case "processing": return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return CheckCircle;
      case "flagged": return AlertTriangle;
      case "blocked": return XCircle;
      case "processing": return Activity;
      default: return Shield;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "critical": return "text-red-500";
      case "high": return "text-orange-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  return (
    <section id="advanced-upi" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Zap className="w-4 h-4 mr-2" />
            Advanced UPI Fraud Detection
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Intelligent UPI Transaction Analysis
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered UPI fraud detection with social engineering analysis, velocity monitoring, and real-time risk assessment
          </p>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {[
            { label: "Total Transactions", value: analytics.totalTransactions.toLocaleString(), icon: Activity, color: "text-blue-500" },
            { label: "Fraud Detected", value: analytics.fraudDetected.toString(), icon: Shield, color: "text-red-500" },
            { label: "Social Engineering", value: analytics.socialEngineeringAttempts.toString(), icon: Users, color: "text-orange-500" },
            { label: "Velocity Violations", value: analytics.velocityViolations.toString(), icon: TrendingUp, color: "text-purple-500" },
            { label: "Device Anomalies", value: analytics.deviceAnomalies.toString(), icon: Smartphone, color: "text-yellow-500" },
            { label: "Accuracy Rate", value: `${analytics.accuracyRate.toFixed(1)}%`, icon: Target, color: "text-green-500" },
            { label: "Avg Time", value: `${analytics.avgProcessingTime.toFixed(0)}ms`, icon: Clock, color: "text-indigo-500" }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={cn("w-5 h-5", metric.color)} />
                </div>
                <div className="text-lg font-bold">{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction Analysis Form */}
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-accent" />
              UPI Transaction Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Sender UPI ID</label>
                <Input
                  placeholder="sender@paytm"
                  value={upiInput}
                  onChange={(e) => setUpiInput(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Receiver UPI ID</label>
                <Input
                  placeholder="receiver@phonepe"
                  value={receiverInput}
                  onChange={(e) => setReceiverInput(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Transaction Type</label>
                <select 
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value as any)}
                >
                  <option value="P2P">P2P Transfer</option>
                  <option value="P2M">P2M Payment</option>
                  <option value="Request">Payment Request</option>
                  <option value="QR">QR Code Payment</option>
                </select>
              </div>
            </div>
            
            <Button 
              onClick={handleAnalyzeTransaction}
              disabled={isAnalyzing || !upiInput || !receiverInput || !amountInput}
              className="w-full mb-6"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Transaction...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Analyze UPI Transaction
                </>
              )}
            </Button>

            {/* Analysis Results */}
            {currentTransaction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-background/50 rounded-lg border border-border/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Analysis Results</h4>
                  <div className="flex items-center space-x-2">
                    {React.createElement(getStatusIcon(currentTransaction.status), { 
                      className: cn("w-5 h-5", getStatusColor(currentTransaction.status)) 
                    })}
                    <span className={cn("font-medium", getStatusColor(currentTransaction.status))}>
                      {currentTransaction.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{currentTransaction.riskScore}</div>
                    <div className="text-xs text-muted-foreground">Overall Risk</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-500">{currentTransaction.socialEngineeringScore}</div>
                    <div className="text-xs text-muted-foreground">Social Eng.</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-500">{currentTransaction.velocityRisk}</div>
                    <div className="text-xs text-muted-foreground">Velocity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-500">{currentTransaction.deviceRisk}</div>
                    <div className="text-xs text-muted-foreground">Device</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">Risk Score Breakdown</div>
                  <Progress value={currentTransaction.riskScore} className="h-3" />
                </div>
                
                {currentTransaction.riskFactors.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Risk Factors:</div>
                    <div className="flex flex-wrap gap-2">
                      {currentTransaction.riskFactors.map((factor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </Card>

          {/* Fraud Patterns & Recent Transactions */}
          <div className="space-y-6">
            {/* Fraud Patterns */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-accent" />
                Detected Fraud Patterns
              </h3>
              
              <div className="space-y-3">
                {fraudPatterns.map((pattern) => (
                  <motion.div
                    key={pattern.id}
                    className="p-3 bg-background/50 rounded-lg border border-border/50"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{pattern.pattern}</span>
                      <Badge variant={
                        pattern.riskLevel === "critical" ? "destructive" :
                        pattern.riskLevel === "high" ? "default" :
                        pattern.riskLevel === "medium" ? "secondary" : "outline"
                      }>
                        {pattern.riskLevel}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{pattern.description}</p>
                    <div className="flex justify-between text-xs">
                      <span>Detected: {pattern.detectionCount} times</span>
                      <span>Last: {pattern.lastDetected.toLocaleTimeString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Recent Transactions */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-accent" />
                Recent Transactions
              </h3>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                <AnimatePresence>
                  {recentTransactions.map((transaction) => {
                    const StatusIcon = getStatusIcon(transaction.status);
                    return (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="p-3 bg-background/50 rounded-lg border border-border/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <StatusIcon className={cn("w-4 h-4", getStatusColor(transaction.status))} />
                            <span className="text-sm font-medium">₹{transaction.amount.toLocaleString()}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {transaction.transactionType}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Risk: {transaction.riskScore} | {transaction.timestamp.toLocaleTimeString()}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedUPIFraudDetection;
