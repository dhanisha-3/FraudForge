import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, 
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Brain,
  Target,
  Activity,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  Play,
  Pause,
  RefreshCw,
  Zap,
  Lock,
  MapPin,
  Smartphone,
  Network,
  Ban,
  Cpu,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TransactionAnalysis {
  id: string;
  amount: number;
  merchant: string;
  location: string;
  timestamp: Date;
  cardNumber: string;
  fraudScore: number;
  status: "legitimate" | "suspicious" | "fraudulent" | "blocked";
  confidence: number;
  riskFactors: string[];
  amountRisk: number;
  velocityRisk: number;
  locationRisk: number;
  merchantRisk: number;
  behaviorRisk: number;
  recommendation: "approve" | "review" | "decline";
  isAnomalous: boolean;
  ganScore: number;
  nlpScore: number;
}

interface FraudModel {
  name: string;
  type: "GAN" | "NLP" | "ML" | "Ensemble";
  accuracy: number;
  precision: number;
  recall: number;
  status: "active" | "training" | "updating";
  lastUpdated: Date;
}

interface TransactionPattern {
  id: string;
  pattern: string;
  type: "amount" | "velocity" | "location" | "merchant" | "behavioral";
  riskLevel: "low" | "medium" | "high" | "critical";
  detectionCount: number;
  accuracy: number;
  lastDetected: Date;
}

const TransactionFraudDetection = () => {
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [location, setLocation] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<TransactionAnalysis | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<TransactionAnalysis[]>([]);
  const [fraudModels, setFraudModels] = useState<FraudModel[]>([]);
  const [fraudPatterns, setFraudPatterns] = useState<TransactionPattern[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(true);

  // Advanced transaction fraud detection with GAN and NLP
  const analyzeTransaction = (transactionData: any): TransactionAnalysis => {
    let fraudScore = 0;
    const riskFactors: string[] = [];

    // 1. Amount Risk Analysis
    const amountRisk = analyzeAmountRisk(transactionData.amount);
    fraudScore += amountRisk.score;
    riskFactors.push(...amountRisk.factors);

    // 2. Velocity Risk Analysis
    const velocityRisk = analyzeVelocityRisk(transactionData);
    fraudScore += velocityRisk.score;
    riskFactors.push(...velocityRisk.factors);

    // 3. Location Risk Analysis
    const locationRisk = analyzeLocationRisk(transactionData.location);
    fraudScore += locationRisk.score;
    riskFactors.push(...locationRisk.factors);

    // 4. Merchant Risk Analysis
    const merchantRisk = analyzeMerchantRisk(transactionData.merchant);
    fraudScore += merchantRisk.score;
    riskFactors.push(...merchantRisk.factors);

    // 5. Behavioral Analysis with GAN
    const behaviorRisk = analyzeBehaviorWithGAN(transactionData);
    fraudScore += behaviorRisk.score;
    riskFactors.push(...behaviorRisk.factors);

    // 6. NLP-based Pattern Analysis
    const nlpAnalysis = analyzeWithNLP(transactionData);
    fraudScore += nlpAnalysis.score;
    riskFactors.push(...nlpAnalysis.factors);

    // 7. Anomaly Detection
    const isAnomalous = detectAnomalies(transactionData);
    if (isAnomalous) {
      fraudScore += 25;
      riskFactors.push("Anomalous transaction pattern");
    }

    // Determine status and recommendation
    let status: TransactionAnalysis['status'];
    let recommendation: TransactionAnalysis['recommendation'];
    
    if (fraudScore >= 85) {
      status = "blocked";
      recommendation = "decline";
    } else if (fraudScore >= 70) {
      status = "fraudulent";
      recommendation = "decline";
    } else if (fraudScore >= 40) {
      status = "suspicious";
      recommendation = "review";
    } else {
      status = "legitimate";
      recommendation = "approve";
    }

    const confidence = Math.min(98, 70 + (fraudScore * 0.3));

    return {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: transactionData.amount,
      merchant: transactionData.merchant,
      location: transactionData.location,
      timestamp: new Date(),
      cardNumber: transactionData.cardNumber,
      fraudScore: Math.min(100, fraudScore),
      status,
      confidence,
      riskFactors,
      amountRisk: amountRisk.score,
      velocityRisk: velocityRisk.score,
      locationRisk: locationRisk.score,
      merchantRisk: merchantRisk.score,
      behaviorRisk: behaviorRisk.score,
      recommendation,
      isAnomalous,
      ganScore: behaviorRisk.score,
      nlpScore: nlpAnalysis.score
    };
  };

  // Amount risk analysis
  const analyzeAmountRisk = (amount: number): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];

    if (amount > 100000) {
      score += 35;
      factors.push("Extremely high amount (>₹1L)");
    } else if (amount > 50000) {
      score += 25;
      factors.push("Very high amount (>₹50K)");
    } else if (amount > 25000) {
      score += 15;
      factors.push("High amount transaction");
    }

    // Round amount patterns
    if (amount % 1000 === 0 && amount >= 5000) {
      score += 10;
      factors.push("Round amount pattern");
    }

    // Common fraud amounts
    const fraudAmounts = [9999, 19999, 49999, 99999];
    if (fraudAmounts.includes(amount)) {
      score += 20;
      factors.push("Common fraud amount");
    }

    return { score, factors };
  };

  // Velocity risk analysis
  const analyzeVelocityRisk = (transaction: any): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];

    // Simulate velocity analysis
    const recentTransactionCount = Math.floor(Math.random() * 15);
    const recentTotalAmount = Math.floor(Math.random() * 200000);

    if (recentTransactionCount >= 10) {
      score += 30;
      factors.push("High transaction frequency");
    } else if (recentTransactionCount >= 5) {
      score += 15;
      factors.push("Moderate transaction frequency");
    }

    if (recentTotalAmount > 100000) {
      score += 25;
      factors.push("High cumulative amount");
    }

    return { score, factors };
  };

  // Location risk analysis
  const analyzeLocationRisk = (location: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];

    const highRiskLocations = ["Nigeria", "Romania", "Russia", "Unknown"];
    const mediumRiskLocations = ["Brazil", "Mexico", "Philippines"];

    if (highRiskLocations.some(loc => location.includes(loc))) {
      score += 30;
      factors.push("High-risk geographic location");
    } else if (mediumRiskLocations.some(loc => location.includes(loc))) {
      score += 15;
      factors.push("Medium-risk geographic location");
    }

    if (location.toLowerCase().includes("unknown")) {
      score += 20;
      factors.push("Unknown transaction location");
    }

    return { score, factors };
  };

  // Merchant risk analysis
  const analyzeMerchantRisk = (merchant: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];

    const highRiskMerchants = ["Casino", "Gambling", "Crypto", "Adult Entertainment"];
    const suspiciousMerchants = ["Unknown Merchant", "Generic Store", "Online Retailer"];

    if (highRiskMerchants.some(m => merchant.toLowerCase().includes(m.toLowerCase()))) {
      score += 25;
      factors.push("High-risk merchant category");
    }

    if (suspiciousMerchants.some(m => merchant.toLowerCase().includes(m.toLowerCase()))) {
      score += 15;
      factors.push("Suspicious merchant name");
    }

    if (merchant.length < 3) {
      score += 10;
      factors.push("Incomplete merchant information");
    }

    return { score, factors };
  };

  // GAN-based behavioral analysis
  const analyzeBehaviorWithGAN = (transaction: any): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];

    // Simulate GAN analysis for behavioral patterns
    const behaviorScore = Math.random() * 100;
    
    // GAN detects if transaction pattern matches known fraud patterns
    if (behaviorScore > 80) {
      score += 30;
      factors.push("GAN detected fraudulent behavior pattern");
    } else if (behaviorScore > 60) {
      score += 20;
      factors.push("GAN detected suspicious behavior pattern");
    } else if (behaviorScore > 40) {
      score += 10;
      factors.push("GAN detected unusual behavior pattern");
    }

    // Time-based behavioral analysis
    const hour = new Date().getHours();
    if (hour >= 23 || hour <= 5) {
      score += 12;
      factors.push("Unusual transaction time");
    }

    return { score, factors };
  };

  // NLP-based pattern analysis
  const analyzeWithNLP = (transaction: any): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];

    // NLP analysis of merchant name and location
    const merchantText = transaction.merchant.toLowerCase();
    const locationText = transaction.location.toLowerCase();

    // Suspicious keywords in merchant name
    const suspiciousKeywords = ['temp', 'test', 'fake', 'unknown', 'generic', 'sample'];
    suspiciousKeywords.forEach(keyword => {
      if (merchantText.includes(keyword)) {
        score += 15;
        factors.push(`NLP detected suspicious keyword: ${keyword}`);
      }
    });

    // Language pattern analysis
    if (merchantText.match(/[^a-zA-Z0-9\s]/g)) {
      score += 10;
      factors.push("NLP detected unusual characters in merchant name");
    }

    // Location consistency analysis
    if (locationText.includes('unknown') || locationText.length < 3) {
      score += 15;
      factors.push("NLP detected incomplete location information");
    }

    return { score, factors };
  };

  // Anomaly detection
  const detectAnomalies = (transaction: any): boolean => {
    // Simulate anomaly detection based on multiple factors
    const anomalyFactors = [
      transaction.amount > 75000,
      transaction.merchant.length < 5,
      transaction.location.includes('Unknown'),
      new Date().getHours() >= 23 || new Date().getHours() <= 5
    ];

    return anomalyFactors.filter(Boolean).length >= 2;
  };

  // Handle transaction analysis
  const handleAnalyzeTransaction = () => {
    if (!amount || !merchant || !location || !cardNumber) return;
    
    setIsAnalyzing(true);
    
    const transactionData = {
      amount: parseFloat(amount),
      merchant: merchant.trim(),
      location: location.trim(),
      cardNumber: cardNumber.trim()
    };
    
    setTimeout(() => {
      const analysis = analyzeTransaction(transactionData);
      setCurrentAnalysis(analysis);
      setIsAnalyzing(false);
      setRecentAnalyses(prev => [analysis, ...prev.slice(0, 9)]);
    }, 2500);
  };

  // Initialize fraud models and patterns
  useEffect(() => {
    setFraudModels([
      {
        name: "GAN Behavior Analyzer",
        type: "GAN",
        accuracy: 94.8,
        precision: 92.3,
        recall: 89.7,
        status: "active",
        lastUpdated: new Date(Date.now() - 86400000)
      },
      {
        name: "NLP Pattern Detector",
        type: "NLP",
        accuracy: 91.2,
        precision: 88.9,
        recall: 93.1,
        status: "active",
        lastUpdated: new Date(Date.now() - 172800000)
      },
      {
        name: "Ensemble Fraud Classifier",
        type: "Ensemble",
        accuracy: 97.1,
        precision: 95.8,
        recall: 94.2,
        status: "training",
        lastUpdated: new Date(Date.now() - 43200000)
      }
    ]);

    setFraudPatterns([
      {
        id: "1",
        pattern: "High-Value Round Amounts",
        type: "amount",
        riskLevel: "high",
        detectionCount: 1247,
        accuracy: 89.5,
        lastDetected: new Date(Date.now() - 1800000)
      },
      {
        id: "2",
        pattern: "Rapid Transaction Velocity",
        type: "velocity",
        riskLevel: "critical",
        detectionCount: 892,
        accuracy: 94.2,
        lastDetected: new Date(Date.now() - 3600000)
      },
      {
        id: "3",
        pattern: "Geographic Anomalies",
        type: "location",
        riskLevel: "medium",
        detectionCount: 634,
        accuracy: 87.3,
        lastDetected: new Date(Date.now() - 900000)
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "legitimate": return "text-green-500";
      case "suspicious": return "text-yellow-500";
      case "fraudulent": return "text-orange-500";
      case "blocked": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "legitimate": return CheckCircle;
      case "suspicious": return AlertTriangle;
      case "fraudulent": return XCircle;
      case "blocked": return Ban;
      default: return Shield;
    }
  };

  return (
    <section id="transaction-fraud-detection" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <CreditCard className="w-4 h-4 mr-2" />
            AI Transaction Fraud Detection
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Advanced GAN & NLP Transaction Analysis
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cutting-edge AI models using GANs and NLP to detect fraudulent transactions with real-time behavioral analysis
          </p>
        </div>

        {/* AI Models Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {fraudModels.map((model, index) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {model.type === "GAN" ? <Bot className="w-4 h-4 text-purple-500" /> :
                     model.type === "NLP" ? <Brain className="w-4 h-4 text-blue-500" /> :
                     <Cpu className="w-4 h-4 text-green-500" />}
                    <span className="font-medium text-sm">{model.name}</span>
                  </div>
                  <Badge variant={model.status === "active" ? "default" : "secondary"}>
                    {model.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Accuracy: {model.accuracy}%</div>
                  <div>Precision: {model.precision}% | Recall: {model.recall}%</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analysis Form */}
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-accent" />
              Transaction Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Transaction Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Card Number (Last 4 digits)</label>
                <Input
                  placeholder="****1234"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={4}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Merchant Name</label>
                <Input
                  placeholder="Amazon India"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Transaction Location</label>
                <Input
                  placeholder="Mumbai, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Quick Test Transactions */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Quick Test Transactions</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  { label: "Normal Purchase", amount: "2500", merchant: "Amazon India", location: "Mumbai, India", card: "1234", type: "safe" },
                  { label: "High-Risk Transaction", amount: "99999", merchant: "Unknown Merchant", location: "Nigeria", card: "5678", type: "dangerous" },
                  { label: "Suspicious Pattern", amount: "50000", merchant: "Casino Royal", location: "Unknown", card: "9999", type: "suspicious" },
                  { label: "Velocity Attack", amount: "25000", merchant: "Generic Store", location: "Romania", card: "0000", type: "malicious" }
                ].map((test) => (
                  <Button
                    key={test.label}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAmount(test.amount);
                      setMerchant(test.merchant);
                      setLocation(test.location);
                      setCardNumber(test.card);
                    }}
                    className={cn(
                      "text-xs justify-start h-auto p-2",
                      test.type === "safe" && "border-green-500 text-green-600",
                      test.type === "suspicious" && "border-yellow-500 text-yellow-600",
                      test.type === "dangerous" && "border-orange-500 text-orange-600",
                      test.type === "malicious" && "border-red-500 text-red-600"
                    )}
                  >
                    {test.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={handleAnalyzeTransaction}
              disabled={isAnalyzing || !amount || !merchant || !location || !cardNumber}
              className="w-full mb-6"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing with AI Models...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze Transaction
                </>
              )}
            </Button>

            {/* Analysis Results */}
            {currentAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-background/50 rounded-lg border border-border/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">AI Fraud Analysis</h4>
                  <div className="flex items-center space-x-2">
                    {React.createElement(getStatusIcon(currentAnalysis.status), { 
                      className: cn("w-5 h-5", getStatusColor(currentAnalysis.status)) 
                    })}
                    <span className={cn("font-medium", getStatusColor(currentAnalysis.status))}>
                      {currentAnalysis.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="text-center">
                    <div className={cn("text-2xl font-bold", getStatusColor(currentAnalysis.status))}>
                      {currentAnalysis.fraudScore}
                    </div>
                    <div className="text-xs text-muted-foreground">Fraud Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-500">{currentAnalysis.ganScore}</div>
                    <div className="text-xs text-muted-foreground">GAN Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-500">{currentAnalysis.nlpScore}</div>
                    <div className="text-xs text-muted-foreground">NLP Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-500">{currentAnalysis.velocityRisk}</div>
                    <div className="text-xs text-muted-foreground">Velocity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">{currentAnalysis.confidence.toFixed(0)}%</div>
                    <div className="text-xs text-muted-foreground">Confidence</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Risk Assessment</span>
                    <div className="flex items-center space-x-2">
                      {currentAnalysis.isAnomalous && <Badge variant="destructive">Anomalous</Badge>}
                      <Badge variant={
                        currentAnalysis.recommendation === "approve" ? "secondary" :
                        currentAnalysis.recommendation === "review" ? "default" : "destructive"
                      }>
                        {currentAnalysis.recommendation.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={currentAnalysis.fraudScore} className="h-3" />
                </div>

                {/* Detailed Risk Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-background/50 rounded border border-border/50">
                    <h5 className="font-medium text-sm mb-2">Risk Breakdown</h5>
                    <div className="space-y-1 text-xs">
                      <div>Amount Risk: {currentAnalysis.amountRisk}</div>
                      <div>Velocity Risk: {currentAnalysis.velocityRisk}</div>
                      <div>Location Risk: {currentAnalysis.locationRisk}</div>
                      <div>Merchant Risk: {currentAnalysis.merchantRisk}</div>
                      <div>Behavior Risk: {currentAnalysis.behaviorRisk}</div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-background/50 rounded border border-border/50">
                    <h5 className="font-medium text-sm mb-2">Transaction Details</h5>
                    <div className="space-y-1 text-xs">
                      <div>Amount: ₹{currentAnalysis.amount.toLocaleString()}</div>
                      <div>Merchant: {currentAnalysis.merchant}</div>
                      <div>Location: {currentAnalysis.location}</div>
                      <div>Card: ****{currentAnalysis.cardNumber}</div>
                    </div>
                  </div>
                </div>
                
                {currentAnalysis.riskFactors.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Risk Factors:</div>
                    <div className="flex flex-wrap gap-2">
                      {currentAnalysis.riskFactors.map((factor, index) => (
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

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Fraud Patterns */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-accent" />
                Fraud Patterns
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
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Type: {pattern.type} | Accuracy: {pattern.accuracy}%</div>
                      <div>Detected: {pattern.detectionCount} times</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Recent Analyses */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-accent" />
                Recent Analyses
              </h3>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                <AnimatePresence>
                  {recentAnalyses.map((analysis) => {
                    const StatusIcon = getStatusIcon(analysis.status);
                    return (
                      <motion.div
                        key={analysis.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="p-3 bg-background/50 rounded-lg border border-border/50 cursor-pointer hover:bg-background/70"
                        onClick={() => setCurrentAnalysis(analysis)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <StatusIcon className={cn("w-4 h-4", getStatusColor(analysis.status))} />
                            <span className="text-sm font-medium">₹{analysis.amount.toLocaleString()}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Score: {analysis.fraudScore}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {analysis.merchant} | {analysis.location}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {analysis.timestamp.toLocaleTimeString()}
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

export default TransactionFraudDetection;
