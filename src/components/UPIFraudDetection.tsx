import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Smartphone, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Eye,
  Brain,
  Zap,
  MapPin,
  Clock,
  DollarSign,
  User,
  QrCode,
  Globe,
  TrendingUp,
  Activity,
  Lock,
  Unlock,
  Phone,
  MessageSquare,
  CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface UPITransaction {
  id: string;
  upiId: string;
  amount: number;
  receiverUPI: string;
  transactionType: "P2P" | "P2M" | "QR" | "Request";
  timestamp: Date;
  riskScore: number;
  status: "processing" | "approved" | "flagged" | "blocked";
  riskFactors: string[];
  deviceInfo: string;
}

interface UPIFraudPattern {
  id: string;
  type: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  indicators: string[];
  prevalence: number;
}

interface UPIAnalysis {
  upiProvider: string;
  accountAge: number;
  transactionHistory: number;
  riskLevel: number;
  phoneVerified: boolean;
  bankLinked: boolean;
  deviceTrust: number;
}

const UPIFraudDetection = () => {
  const [activeTransaction, setActiveTransaction] = useState<UPITransaction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [upiInput, setUpiInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [receiverInput, setReceiverInput] = useState("");
  const [transactionType, setTransactionType] = useState<"P2P" | "P2M" | "QR" | "Request">("P2P");

  const [recentTransactions, setRecentTransactions] = useState<UPITransaction[]>([
    {
      id: "upi_001",
      upiId: "user@paytm",
      amount: 50000,
      receiverUPI: "scammer@phonepe",
      transactionType: "P2P",
      timestamp: new Date(Date.now() - 300000),
      riskScore: 98,
      status: "blocked",
      riskFactors: ["High amount", "New receiver", "Suspicious UPI ID", "Device mismatch"],
      deviceInfo: "New Android Device"
    },
    {
      id: "upi_002",
      upiId: "john@gpay",
      amount: 500,
      receiverUPI: "coffee@shop",
      transactionType: "QR",
      timestamp: new Date(Date.now() - 600000),
      riskScore: 15,
      status: "approved",
      riskFactors: [],
      deviceInfo: "Trusted iPhone"
    },
    {
      id: "upi_003",
      upiId: "victim@paytm",
      amount: 25000,
      receiverUPI: "fake@merchant",
      transactionType: "Request",
      timestamp: new Date(Date.now() - 900000),
      riskScore: 89,
      status: "flagged",
      riskFactors: ["Social engineering pattern", "Urgent request", "High amount"],
      deviceInfo: "Compromised Device"
    }
  ]);

  const [fraudPatterns, setFraudPatterns] = useState<UPIFraudPattern[]>([
    {
      id: "upi_pattern_001",
      type: "SIM Swap Attack",
      description: "Fraudster takes control of victim's phone number",
      severity: "critical",
      indicators: ["New device", "Immediate high-value transactions", "Changed patterns"],
      prevalence: 23.4
    },
    {
      id: "upi_pattern_002",
      type: "QR Code Manipulation",
      description: "Malicious QR codes redirecting payments to fraudsters",
      severity: "high",
      indicators: ["Unknown merchant", "Mismatched QR data", "Suspicious amounts"],
      prevalence: 18.7
    },
    {
      id: "upi_pattern_003",
      type: "Social Engineering",
      description: "Tricking users into making payments through fake requests",
      severity: "high",
      indicators: ["Urgent requests", "Authority impersonation", "Fear tactics"],
      prevalence: 31.2
    },
    {
      id: "upi_pattern_004",
      type: "Fake Payment Apps",
      description: "Malicious apps mimicking legitimate UPI applications",
      severity: "critical",
      indicators: ["Unofficial app stores", "Excessive permissions", "Poor reviews"],
      prevalence: 12.8
    }
  ]);

  const [upiAnalysis, setUpiAnalysis] = useState<UPIAnalysis>({
    upiProvider: "Google Pay",
    accountAge: 24,
    transactionHistory: 1247,
    riskLevel: 12,
    phoneVerified: true,
    bankLinked: true,
    deviceTrust: 95
  });

  // Advanced UPI fraud detection algorithm
  const analyzeUPITransaction = () => {
    if (!upiInput || !amountInput || !receiverInput) return;

    setIsAnalyzing(true);
    setActiveTransaction({
      id: `upi_${Date.now()}`,
      upiId: upiInput,
      amount: parseFloat(amountInput),
      receiverUPI: receiverInput,
      transactionType,
      timestamp: new Date(),
      riskScore: 0,
      status: "processing",
      riskFactors: [],
      deviceInfo: "Current Device"
    });

    // Advanced UPI fraud detection algorithm
    setTimeout(() => {
      const amount = parseFloat(amountInput);
      const senderUPI = upiInput.toLowerCase();
      const receiverUPI = receiverInput.toLowerCase();

      let riskScore = 0;
      const riskFactors = [];

      // 1. Amount-based risk analysis
      if (amount > 100000) {
        riskScore += 40;
        riskFactors.push("Extremely high amount (>₹1L)");
      } else if (amount > 50000) {
        riskScore += 30;
        riskFactors.push("Very high amount (>₹50K)");
      } else if (amount > 25000) {
        riskScore += 20;
        riskFactors.push("High amount transaction");
      } else if (amount > 10000) {
        riskScore += 10;
        riskFactors.push("Above average amount");
      }

      // 2. UPI ID validation and risk assessment
      if (!isValidUPIId(senderUPI)) {
        riskScore += 25;
        riskFactors.push("Invalid sender UPI format");
      }

      if (!isValidUPIId(receiverUPI)) {
        riskScore += 25;
        riskFactors.push("Invalid receiver UPI format");
      }

      // 3. Suspicious UPI patterns
      const suspiciousPatterns = ['temp', 'test', 'fake', 'scam', 'fraud', 'unknown', 'random'];
      if (suspiciousPatterns.some(pattern => receiverUPI.includes(pattern))) {
        riskScore += 35;
        riskFactors.push("Suspicious receiver UPI pattern");
      }

      // 4. Transaction type specific risks
      switch (transactionType) {
        case "Request":
          if (amount > 5000) {
            riskScore += 20;
            riskFactors.push("High-value payment request");
          }
          // Check for social engineering patterns
          if (amount > 1000 && isBusinessHours()) {
            riskScore += 15;
            riskFactors.push("Urgent request pattern detected");
          }
          break;

        case "P2M":
          // Merchant verification
          if (!receiverUPI.includes('merchant') && !receiverUPI.includes('shop') && amount > 10000) {
            riskScore += 15;
            riskFactors.push("High amount to unverified merchant");
          }
          break;

        case "QR":
          // QR code transactions have higher fraud risk
          riskScore += 5;
          if (amount > 5000) {
            riskScore += 10;
            riskFactors.push("High-value QR transaction");
          }
          break;
      }

      // 5. Velocity analysis
      const recentTransactions = recentTransactions.filter(tx =>
        tx.upiId === senderUPI &&
        (Date.now() - tx.timestamp.getTime()) < 3600000 // Last hour
      );

      const totalAmountLastHour = recentTransactions.reduce((sum, tx) => sum + tx.amount, 0);

      if (recentTransactions.length >= 5) {
        riskScore += 30;
        riskFactors.push("Excessive transaction frequency");
      } else if (recentTransactions.length >= 3) {
        riskScore += 20;
        riskFactors.push("High transaction frequency");
      }

      if (totalAmountLastHour > 50000) {
        riskScore += 25;
        riskFactors.push("High cumulative amount in short time");
      }

      // 6. Time-based analysis
      const currentHour = new Date().getHours();
      if (currentHour >= 23 || currentHour <= 5) {
        riskScore += 15;
        riskFactors.push("Unusual transaction time (night hours)");
      }

      // 7. UPI provider risk assessment
      const senderProvider = extractUPIProvider(senderUPI);
      const receiverProvider = extractUPIProvider(receiverUPI);

      const highRiskProviders = ['unknown', 'temp', 'test'];
      if (highRiskProviders.includes(receiverProvider)) {
        riskScore += 20;
        riskFactors.push("High-risk UPI provider");
      }

      // 8. Cross-UPI provider analysis
      if (senderProvider !== receiverProvider && amount > 25000) {
        riskScore += 10;
        riskFactors.push("High-value cross-provider transaction");
      }

      // 9. Device behavior simulation
      const deviceRisk = analyzeDeviceBehavior();
      riskScore += deviceRisk.score;
      if (deviceRisk.factors.length > 0) {
        riskFactors.push(...deviceRisk.factors);
      }

      // 10. Social engineering detection
      if (transactionType === "Request" && isSocialEngineeringPattern(amount, currentHour)) {
        riskScore += 25;
        riskFactors.push("Potential social engineering attack");
      }

      // 11. Round amount analysis (common in fraud)
      if (amount % 1000 === 0 && amount >= 10000) {
        riskScore += 8;
        riskFactors.push("Round amount pattern");
      }

      // Cap risk score at 100
      riskScore = Math.min(100, riskScore);

      // Determine status based on risk score
      let status: "approved" | "flagged" | "blocked";
      if (riskScore >= 75) {
        status = "blocked";
      } else if (riskScore >= 45) {
        status = "flagged";
      } else {
        status = "approved";
      }

      setActiveTransaction(prev => prev ? {
        ...prev,
        riskScore: Math.round(riskScore),
        status,
        riskFactors
      } : null);

      setIsAnalyzing(false);

      // Add to recent transactions
      setTimeout(() => {
        setRecentTransactions(prev => {
          const newTransaction = {
            id: `upi_${Date.now()}`,
            upiId: senderUPI,
            amount,
            receiverUPI: receiverInput,
            transactionType,
            timestamp: new Date(),
            riskScore: Math.round(riskScore),
            status,
            riskFactors,
            deviceInfo: "Current Device"
          };
          return [newTransaction, ...prev.slice(0, 4)];
        });
      }, 1000);
    }, 3000);
  };

  // UPI ID validation
  const isValidUPIId = (upiId: string): boolean => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upiId) && upiId.length >= 3 && upiId.length <= 50;
  };

  // Extract UPI provider from UPI ID
  const extractUPIProvider = (upiId: string): string => {
    const parts = upiId.split('@');
    return parts.length > 1 ? parts[1].toLowerCase() : 'unknown';
  };

  // Check if current time is business hours
  const isBusinessHours = (): boolean => {
    const hour = new Date().getHours();
    return hour >= 9 && hour <= 18;
  };

  // Analyze device behavior (simulated)
  const analyzeDeviceBehavior = (): { score: number; factors: string[] } => {
    const factors = [];
    let score = 0;

    // Simulate device fingerprinting
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;

    // Check for suspicious user agents
    if (userAgent.includes('bot') || userAgent.includes('crawler')) {
      score += 30;
      factors.push("Automated/bot behavior detected");
    }

    // Simulate location consistency check
    if (Math.random() > 0.8) { // 20% chance of location mismatch
      score += 15;
      factors.push("Location inconsistency detected");
    }

    // Simulate typing pattern analysis
    if (Math.random() > 0.85) { // 15% chance of unusual typing
      score += 10;
      factors.push("Unusual typing pattern");
    }

    return { score, factors };
  };

  // Social engineering pattern detection
  const isSocialEngineeringPattern = (amount: number, hour: number): boolean => {
    // Common social engineering patterns:
    // 1. Urgent high-value requests during business hours
    // 2. Round amounts that seem "official"
    // 3. Amounts that match common scam patterns

    const commonScamAmounts = [1000, 2000, 5000, 10000, 25000, 50000];
    const isCommonScamAmount = commonScamAmounts.includes(amount);
    const isBusinessHour = hour >= 9 && hour <= 18;

    return isCommonScamAmount && isBusinessHour && amount >= 1000;
  };

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

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case "P2P": return User;
      case "P2M": return CreditCard;
      case "QR": return QrCode;
      case "Request": return MessageSquare;
      default: return Smartphone;
    }
  };

  return (
    <section id="upi" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Smartphone className="w-4 h-4 mr-2" />
            UPI Fraud Detection
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Real-Time UPI Security
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced UPI transaction monitoring with AI-powered fraud pattern detection and social engineering protection
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* UPI Transaction Analyzer */}
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-500" />
              UPI Transaction Analysis
            </h3>

            {/* Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your UPI ID</label>
                <Input
                  placeholder="user@paytm"
                  value={upiInput}
                  onChange={(e) => setUpiInput(e.target.value)}
                  disabled={isAnalyzing}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  disabled={isAnalyzing}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Receiver UPI ID</label>
                <Input
                  placeholder="receiver@gpay"
                  value={receiverInput}
                  onChange={(e) => setReceiverInput(e.target.value)}
                  disabled={isAnalyzing}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Transaction Type</label>
                <select 
                  className="w-full p-2 border border-border rounded-md bg-background"
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value as any)}
                  disabled={isAnalyzing}
                >
                  <option value="P2P">Person to Person</option>
                  <option value="P2M">Person to Merchant</option>
                  <option value="QR">QR Code Payment</option>
                  <option value="Request">Payment Request</option>
                </select>
              </div>
            </div>

            <Button 
              onClick={analyzeUPITransaction}
              disabled={isAnalyzing || !upiInput || !amountInput || !receiverInput}
              className="w-full mb-6"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing UPI Transaction...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Analyze UPI Transaction
                </>
              )}
            </Button>

            {/* Active Transaction Analysis */}
            {activeTransaction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Card className="p-6 bg-background/50 border-primary/30">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">UPI Transaction Analysis</h4>
                    <div className="flex items-center space-x-2">
                      {React.createElement(getStatusIcon(activeTransaction.status), { 
                        className: cn("w-5 h-5", getStatusColor(activeTransaction.status)) 
                      })}
                      <span className={cn("font-medium", getStatusColor(activeTransaction.status))}>
                        {activeTransaction.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{activeTransaction.upiId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">₹{activeTransaction.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{activeTransaction.receiverUPI}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {React.createElement(getTransactionTypeIcon(activeTransaction.transactionType), { 
                        className: "w-4 h-4 text-muted-foreground" 
                      })}
                      <span className="text-sm">{activeTransaction.transactionType}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Risk Score</span>
                      <span className={cn("font-bold", getStatusColor(activeTransaction.status))}>
                        {activeTransaction.riskScore}/100
                      </span>
                    </div>
                    <Progress value={activeTransaction.riskScore} className="h-3" />
                  </div>

                  {activeTransaction.riskFactors.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Risk Factors:</h5>
                      <div className="flex flex-wrap gap-2">
                        {activeTransaction.riskFactors.map((factor, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {/* Recent UPI Transactions */}
            <div>
              <h4 className="font-semibold mb-4">Recent UPI Transactions</h4>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <Card key={transaction.id} className="p-4 bg-background/30 border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {React.createElement(getTransactionTypeIcon(transaction.transactionType), { 
                          className: "w-4 h-4 text-muted-foreground" 
                        })}
                        <div>
                          <div className="font-medium text-sm">{transaction.upiId}</div>
                          <div className="text-xs text-muted-foreground">
                            ₹{transaction.amount.toLocaleString()} → {transaction.receiverUPI}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={cn("text-sm font-medium", getStatusColor(transaction.status))}>
                          {transaction.status.toUpperCase()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Risk: {transaction.riskScore}/100
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>

          {/* UPI Analysis & Fraud Patterns */}
          <div className="space-y-6">
            {/* UPI Account Analysis */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-blue-500" />
                UPI Account Analysis
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">UPI Provider:</span>
                  <span className="text-sm font-medium">{upiAnalysis.upiProvider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Account Age:</span>
                  <span className="text-sm font-medium">{upiAnalysis.accountAge} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transaction History:</span>
                  <span className="text-sm font-medium">{upiAnalysis.transactionHistory} txns</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Risk Level:</span>
                  <span className="text-sm font-medium text-green-500">{upiAnalysis.riskLevel}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Phone Verified:</span>
                  <span className={cn("text-sm font-medium", upiAnalysis.phoneVerified ? "text-green-500" : "text-red-500")}>
                    {upiAnalysis.phoneVerified ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Bank Linked:</span>
                  <span className={cn("text-sm font-medium", upiAnalysis.bankLinked ? "text-green-500" : "text-red-500")}>
                    {upiAnalysis.bankLinked ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Device Trust:</span>
                  <span className="text-sm font-medium text-green-500">{upiAnalysis.deviceTrust}%</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">Account Verified</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  UPI account shows normal usage patterns and high trust score.
                </p>
              </div>
            </Card>

            {/* UPI Fraud Patterns */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-red-500" />
                UPI Fraud Patterns
              </h3>
              
              <div className="space-y-4">
                {fraudPatterns.map((pattern) => (
                  <div key={pattern.id} className="p-3 bg-background/50 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{pattern.type}</h4>
                      <Badge variant={
                        pattern.severity === "critical" ? "destructive" :
                        pattern.severity === "high" ? "default" :
                        pattern.severity === "medium" ? "secondary" : "outline"
                      }>
                        {pattern.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{pattern.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Prevalence:</span>
                      <span className="text-xs font-medium">{pattern.prevalence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* UPI Security Tips */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-green-500" />
                Security Tips
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Never share your UPI PIN with anyone</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Verify QR codes before scanning</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Be cautious of urgent payment requests</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Use official UPI apps only</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Enable transaction alerts</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UPIFraudDetection;
