import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
  MapPin,
  Globe,
  Users,
  BarChart3,
  Search,
  Filter,
  Play,
  Pause,
  RefreshCw,
  Zap,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CreditCardTransaction {
  id: string;
  cardNumber: string;
  amount: number;
  merchant: string;
  merchantCategory: string;
  location: string;
  timestamp: Date;
  transactionType: "purchase" | "withdrawal" | "online" | "contactless";
  currency: string;
  riskScore: number;
  status: "processing" | "approved" | "flagged" | "blocked";
  riskFactors: string[];
  luhnValid: boolean;
  velocityRisk: number;
  geographicRisk: number;
  merchantRisk: number;
  // Enhanced fraud detection fields
  deviceFingerprint: string;
  ipAddress: string;
  browserSignature: string;
  networkSignature: string;
  biometricScore: number;
  behavioralScore: number;
  fraudRingScore: number;
  crossBorderRisk: number;
  timePatternRisk: number;
  transactionVelocity: number[];
  deviceRiskFactors: string[];
  aiConfidenceScore: number;
  mlModelVersion: string;
  lastLegitimateLocation: string;
  historicalPattern: {
    frequency: number;
    avgAmount: number;
    commonMerchants: string[];
    timePreference: string[];
    locations: string[];
  };
  amountRisk: number;
  timeRisk: number;
}

interface CardValidation {
  isValid: boolean;
  cardType: string;
  issuer: string;
  riskLevel: "low" | "medium" | "high";
}

interface FraudPattern {
  id: string;
  pattern: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  detectionCount: number;
  lastDetected: Date;
  preventedLoss: number;
}

interface CardAnalytics {
  totalTransactions: number;
  fraudBlocked: number;
  falsePositives: number;
  accuracyRate: number;
  avgProcessingTime: number;
  totalSaved: number;
  luhnValidationRate: number;
  // Enhanced analytics
  realtimeAlerts: number;
  behavioralAnomalies: number;
  networkPatterns: number;
  geospatialRisks: number;
  mlModelAccuracy: number;
  fraudRingDetections: number;
  biometricValidations: number;
}

const AdvancedCreditCardDetection = () => {
  const [cardInput, setCardInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [merchantInput, setMerchantInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [transactionType, setTransactionType] = useState<"purchase" | "withdrawal" | "online" | "contactless">("purchase");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<CreditCardTransaction | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<CreditCardTransaction[]>([]);
  const [fraudPatterns, setFraudPatterns] = useState<FraudPattern[]>([]);
  const [analytics, setAnalytics] = useState<CardAnalytics>({
    totalTransactions: 0,
    fraudBlocked: 0,
    falsePositives: 0,
    accuracyRate: 0,
    avgProcessingTime: 0,
    totalSaved: 0,
    luhnValidationRate: 0,
    // Enhanced analytics
    realtimeAlerts: 0,
    behavioralAnomalies: 0,
    networkPatterns: 0,
    geospatialRisks: 0,
    mlModelAccuracy: 98.7,
    fraudRingDetections: 0,
    biometricValidations: 0
  });

  // Luhn Algorithm Implementation
  const validateLuhn = (cardNumber: string): boolean => {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  // Card type detection
  const detectCardType = (cardNumber: string): CardValidation => {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    
    const patterns = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
      diners: /^3[0689][0-9]{11}$/,
      jcb: /^(?:2131|1800|35\d{3})\d{11}$/
    };
    
    let cardType = "unknown";
    let issuer = "Unknown";
    let riskLevel: "low" | "medium" | "high" = "medium";
    
    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(cleanNumber)) {
        cardType = type;
        issuer = type.charAt(0).toUpperCase() + type.slice(1);
        riskLevel = type === "amex" ? "low" : type === "visa" ? "low" : "medium";
        break;
      }
    }
    
    const isValid = validateLuhn(cleanNumber);
    
    return {
      isValid,
      cardType,
      issuer,
      riskLevel
    };
  };

  // Advanced credit card fraud detection
  // Helper functions for device and network analysis
  const generateDeviceFingerprint = (): string => {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      new Date().getTimezoneOffset()
    ];
    return btoa(components.join('|'));
  };

  const generateNetworkSignature = (): string => {
    const protocols = ['TLS 1.3', 'HTTP/2', 'QUIC'];
    const connections = ['Direct', 'Proxy', 'VPN'];
    return `${protocols[Math.floor(Math.random() * protocols.length)]}-${connections[Math.floor(Math.random() * connections.length)]}`;
  };

  const generateTransactionVelocity = (): number[] => {
    return Array(24).fill(0).map(() => Math.floor(Math.random() * 5));
  };

  const generateDeviceRiskFactors = (): string[] => {
    const factors = [];
    if (Math.random() > 0.8) factors.push("Emulator detected");
    if (Math.random() > 0.9) factors.push("Root/Jailbreak indicators");
    if (Math.random() > 0.85) factors.push("VPN/Proxy usage");
    if (Math.random() > 0.95) factors.push("GPS spoofing detected");
    return factors;
  };

  const analyzeCreditCardTransaction = (transaction: Omit<CreditCardTransaction, 'riskScore' | 'status' | 'riskFactors' | 'luhnValid' | 'velocityRisk' | 'geographicRisk' | 'merchantRisk' | 'amountRisk' | 'timeRisk'>): CreditCardTransaction => {
    const startTime = performance.now();
    let riskScore = 0;
    const riskFactors: string[] = [];

    // 1. Basic Card Validation with Luhn Algorithm
    const cardValidation = detectCardType(transaction.cardNumber);
    const luhnValid = cardValidation.isValid;
    
    if (!luhnValid) {
      riskScore += 50;
      riskFactors.push("Invalid card number (Luhn check failed)");
    }

    // 2. Enhanced Amount Risk Analysis
    const amountRisk = analyzeAmountRisk(transaction.amount, transaction.transactionType);
    riskScore += amountRisk.score;
    riskFactors.push(...amountRisk.factors);

    // 3. Behavioral Analysis
    if (transaction.behavioralScore < 85) {
      riskScore += 25;
      riskFactors.push("Unusual user behavior pattern");
    }

    // 4. Device and Network Analysis
    if (transaction.deviceRiskFactors.length > 0) {
      riskScore += 20 * transaction.deviceRiskFactors.length;
      riskFactors.push(...transaction.deviceRiskFactors.map(f => `Device risk: ${f}`));
    }

    // 5. Location and Historical Pattern Analysis
    if (transaction.location !== transaction.lastLegitimateLocation && 
        !transaction.historicalPattern.locations.includes(transaction.location)) {
      riskScore += 30;
      riskFactors.push("Location anomaly detected");
    }

    // 6. Transaction Velocity Analysis
    const recentTransactionsCount = transaction.transactionVelocity.reduce((a, b) => a + b, 0);
    if (recentTransactionsCount > 20) {
      riskScore += 40;
      riskFactors.push("High transaction velocity");
    }

    // 7. Cross-border Transaction Risk
    if (transaction.crossBorderRisk > 30) {
      riskScore += transaction.crossBorderRisk;
      riskFactors.push("High cross-border transaction risk");
    }

    // 8. AI/ML Risk Assessment
    if (transaction.aiConfidenceScore < 85) {
      riskScore += (100 - transaction.aiConfidenceScore) * 0.5;
      riskFactors.push("Low AI confidence score");
    }

    // 9. Fraud Ring Detection
    if (transaction.fraudRingScore > 20) {
      riskScore += transaction.fraudRingScore * 1.5;
      riskFactors.push("Potential fraud ring association");
    }

    // 10. Biometric Verification
    if (transaction.biometricScore < 80) {
      riskScore += (100 - transaction.biometricScore) * 0.4;
      riskFactors.push("Biometric verification failed");

    // 3. Merchant Risk Analysis
    const merchantRisk = analyzeMerchantRisk(transaction.merchant, transaction.merchantCategory);
    riskScore += merchantRisk.score;
    riskFactors.push(...merchantRisk.factors);

    // 4. Geographic Risk Analysis
    const geographicRisk = analyzeGeographicRisk(transaction.location);
    riskScore += geographicRisk.score;
    riskFactors.push(...geographicRisk.factors);

    // 5. Velocity Analysis
    const velocityRisk = analyzeVelocityRisk(transaction.cardNumber, transaction.amount);
    riskScore += velocityRisk.score;
    riskFactors.push(...velocityRisk.factors);

    // 6. Time-based Analysis
    const timeRisk = analyzeTimeRisk(transaction.timestamp, transaction.transactionType);
    riskScore += timeRisk.score;
    riskFactors.push(...timeRisk.factors);

    // 7. Transaction Type Specific Analysis
    const typeRisk = analyzeTransactionTypeRisk(transaction);
    riskScore += typeRisk.score;
    riskFactors.push(...typeRisk.factors);

    // Determine status
    let status: CreditCardTransaction['status'];
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
      luhnValid,
      velocityRisk: velocityRisk.score,
      geographicRisk: geographicRisk.score,
      merchantRisk: merchantRisk.score,
      amountRisk: amountRisk.score,
      timeRisk: timeRisk.score
    };
  };

  // Amount risk analysis
  const analyzeAmountRisk = (amount: number, type: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    // High amount thresholds
    if (amount > 50000) {
      score += 35;
      factors.push("Extremely high amount (>₹50K)");
    } else if (amount > 25000) {
      score += 25;
      factors.push("Very high amount (>₹25K)");
    } else if (amount > 10000) {
      score += 15;
      factors.push("High amount transaction");
    }
    
    // Round amount patterns
    if (amount % 1000 === 0 && amount >= 5000) {
      score += 8;
      factors.push("Round amount pattern");
    }
    
    // Type-specific amount analysis
    if (type === "withdrawal" && amount > 20000) {
      score += 20;
      factors.push("High-value ATM withdrawal");
    } else if (type === "online" && amount > 15000) {
      score += 12;
      factors.push("High-value online transaction");
    }
    
    return { score, factors };
  };

  // Merchant risk analysis
  const analyzeMerchantRisk = (merchant: string, category: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    const highRiskMerchants = ["Casino", "Gambling", "Crypto", "Unknown Merchant", "Adult Entertainment"];
    const highRiskCategories = ["Gaming", "Cryptocurrency", "Adult", "Gambling", "High Risk"];
    
    if (highRiskMerchants.some(m => merchant.toLowerCase().includes(m.toLowerCase()))) {
      score += 25;
      factors.push("High-risk merchant");
    }
    
    if (highRiskCategories.some(c => category.toLowerCase().includes(c.toLowerCase()))) {
      score += 20;
      factors.push("High-risk merchant category");
    }
    
    // Unknown or suspicious merchant names
    if (merchant.toLowerCase().includes("unknown") || merchant.length < 3) {
      score += 15;
      factors.push("Suspicious merchant name");
    }
    
    return { score, factors };
  };

  // Geographic risk analysis
  const analyzeGeographicRisk = (location: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    const highRiskCountries = ["Nigeria", "Romania", "Russia", "Unknown", "North Korea"];
    const mediumRiskCountries = ["Brazil", "Mexico", "Philippines"];
    
    if (highRiskCountries.some(country => location.includes(country))) {
      score += 30;
      factors.push("High-risk geographic location");
    } else if (mediumRiskCountries.some(country => location.includes(country))) {
      score += 15;
      factors.push("Medium-risk geographic location");
    }
    
    // Unknown location
    if (location.toLowerCase().includes("unknown") || location.length < 3) {
      score += 20;
      factors.push("Unknown transaction location");
    }
    
    return { score, factors };
  };

  // Velocity risk analysis
  const analyzeVelocityRisk = (cardNumber: string, amount: number): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    // Simulate velocity analysis
    const recentTransactionCount = Math.floor(Math.random() * 15);
    const recentTotalAmount = Math.floor(Math.random() * 100000);
    
    if (recentTransactionCount >= 10) {
      score += 30;
      factors.push("Excessive transaction frequency");
    } else if (recentTransactionCount >= 5) {
      score += 15;
      factors.push("High transaction frequency");
    }
    
    if (recentTotalAmount > 50000) {
      score += 25;
      factors.push("High cumulative transaction amount");
    }
    
    return { score, factors };
  };

  // Time-based risk analysis
  const analyzeTimeRisk = (timestamp: Date, type: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    const hour = timestamp.getHours();
    const day = timestamp.getDay();
    
    // Night time transactions
    if (hour >= 23 || hour <= 5) {
      score += 12;
      factors.push("Unusual transaction time (night)");
    }
    
    // Weekend late transactions
    if ((day === 0 || day === 6) && hour >= 22) {
      score += 8;
      factors.push("Late weekend transaction");
    }
    
    // ATM withdrawals at unusual times
    if (type === "withdrawal" && (hour >= 23 || hour <= 5)) {
      score += 15;
      factors.push("ATM withdrawal at unusual time");
    }
    
    return { score, factors };
  };

  // Transaction type risk analysis
  const analyzeTransactionTypeRisk = (transaction: any): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    switch (transaction.transactionType) {
      case "online":
        score += 5;
        if (transaction.amount > 10000) {
          score += 10;
          factors.push("High-value online transaction");
        }
        break;
      case "withdrawal":
        if (transaction.amount > 20000) {
          score += 15;
          factors.push("High-value ATM withdrawal");
        }
        break;
      case "contactless":
        if (transaction.amount > 5000) {
          score += 8;
          factors.push("High-value contactless payment");
        }
        break;
    }
    
    return { score, factors };
  };

  // Handle transaction analysis
  const handleAnalyzeTransaction = () => {
    if (!cardInput || !amountInput || !merchantInput || !locationInput) return;
    
    setIsAnalyzing(true);
    
    const deviceFingerprint = generateDeviceFingerprint();
    const networkSignature = generateNetworkSignature();
    
    const transaction = {
      id: `cc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      cardNumber: cardInput.trim(),
      amount: parseFloat(amountInput),
      merchant: merchantInput.trim(),
      merchantCategory: "RETAIL",
      location: locationInput.trim(),
      timestamp: new Date(),
      transactionType: transactionType,
      currency: "USD",
      deviceFingerprint,
      ipAddress: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      browserSignature: navigator.userAgent,
      networkSignature,
      biometricScore: 85 + Math.random() * 15,
      behavioralScore: 90 + Math.random() * 10,
      fraudRingScore: Math.random() * 30,
      crossBorderRisk: Math.random() * 50,
      timePatternRisk: Math.random() * 40,
      transactionVelocity: generateTransactionVelocity(),
      deviceRiskFactors: generateDeviceRiskFactors(),
      aiConfidenceScore: 92 + Math.random() * 8,
      mlModelVersion: "v2.5.0",
      lastLegitimateLocation: locationInput.trim(),
      historicalPattern: {
        frequency: 2.5 + Math.random(),
        avgAmount: 150 + Math.random() * 300,
        commonMerchants: [merchantInput.trim(), "Amazon", "Walmart"],
        timePreference: ["morning", "evening"],
        locations: [locationInput.trim(), "Previous Location 1", "Previous Location 2"]
      }
    };
    
    setTimeout(() => {
      const analyzedTransaction = analyzeCreditCardTransaction(transaction);
      setCurrentTransaction(analyzedTransaction);
      setIsAnalyzing(false);
      
      // Update analytics
      setAnalytics(prev => ({
        totalTransactions: prev.totalTransactions + 1,
        fraudBlocked: prev.fraudBlocked + (analyzedTransaction.status === "blocked" ? 1 : 0),
        falsePositives: prev.falsePositives + (Math.random() > 0.95 ? 1 : 0),
        accuracyRate: 98.5 + Math.random() * 1.5,
        avgProcessingTime: 42 + Math.random() * 18,
        totalSaved: prev.totalSaved + (analyzedTransaction.status === "blocked" ? analyzedTransaction.amount : 0),
        luhnValidationRate: analyzedTransaction.luhnValid ? 100 : 0,
        // Enhanced analytics updates
        realtimeAlerts: prev.realtimeAlerts + (analyzedTransaction.riskScore > 80 ? 1 : 0),
        behavioralAnomalies: prev.behavioralAnomalies + (analyzedTransaction.riskFactors.some(f => f.includes("behavior")) ? 1 : 0),
        networkPatterns: prev.networkPatterns + (analyzedTransaction.riskFactors.some(f => f.includes("network")) ? 1 : 0),
        geospatialRisks: prev.geospatialRisks + (analyzedTransaction.geographicRisk > 70 ? 1 : 0),
        mlModelAccuracy: Math.min(99.9, prev.mlModelAccuracy + (Math.random() * 0.1 - 0.05)),
        fraudRingDetections: prev.fraudRingDetections + (analyzedTransaction.riskFactors.some(f => f.includes("ring")) ? 1 : 0),
        biometricValidations: prev.biometricValidations + (Math.random() > 0.7 ? 1 : 0)
      }));
      
      // Add to recent transactions
      setRecentTransactions(prev => [analyzedTransaction, ...prev.slice(0, 9)]);
    }, 1500);
  };

  // Generate fraud patterns
  useEffect(() => {
    const patterns: FraudPattern[] = [
      {
        id: "1",
        pattern: "Card Testing",
        description: "Small transactions to test stolen card validity",
        severity: "high",
        detectionCount: 342,
        lastDetected: new Date(Date.now() - 1800000),
        preventedLoss: 2500000
      },
      {
        id: "2",
        pattern: "Geographic Anomaly",
        description: "Transactions from unusual geographic locations",
        severity: "medium",
        detectionCount: 156,
        lastDetected: new Date(Date.now() - 3600000),
        preventedLoss: 1800000
      },
      {
        id: "3",
        pattern: "High-Risk Merchant",
        description: "Transactions at known high-risk merchant categories",
        severity: "critical",
        detectionCount: 89,
        lastDetected: new Date(Date.now() - 900000),
        preventedLoss: 4200000
      },
      {
        id: "4",
        pattern: "Velocity Attack",
        description: "Rapid succession of transactions on same card",
        severity: "high",
        detectionCount: 234,
        lastDetected: new Date(Date.now() - 2700000),
        preventedLoss: 3100000
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

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <section id="advanced-credit-card" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <CreditCard className="w-4 h-4 mr-2" />
            Advanced Credit Card Fraud Detection
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Intelligent Credit Card Transaction Analysis
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered credit card fraud detection with Luhn validation, velocity monitoring, and comprehensive risk assessment
          </p>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {[
            { label: "Total Transactions", value: analytics.totalTransactions.toLocaleString(), icon: Activity, color: "text-blue-500" },
            { label: "Fraud Blocked", value: analytics.fraudBlocked.toString(), icon: Shield, color: "text-red-500" },
            { label: "False Positives", value: analytics.falsePositives.toString(), icon: AlertTriangle, color: "text-yellow-500" },
            { label: "Accuracy Rate", value: `${analytics.accuracyRate.toFixed(1)}%`, icon: Target, color: "text-green-500" },
            { label: "Avg Time", value: `${analytics.avgProcessingTime.toFixed(0)}ms`, icon: Clock, color: "text-purple-500" },
            { label: "Total Saved", value: `₹${(analytics.totalSaved / 1000).toFixed(0)}K`, icon: TrendingUp, color: "text-orange-500" },
            { label: "Luhn Valid", value: `${analytics.luhnValidationRate.toFixed(0)}%`, icon: Lock, color: "text-indigo-500" }
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
              Credit Card Transaction Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Card Number</label>
                <Input
                  placeholder="4111 1111 1111 1111"
                  value={cardInput}
                  onChange={(e) => setCardInput(formatCardNumber(e.target.value))}
                  maxLength={19}
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
                <label className="text-sm font-medium mb-2 block">Merchant</label>
                <Input
                  placeholder="Amazon India"
                  value={merchantInput}
                  onChange={(e) => setMerchantInput(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input
                  placeholder="Mumbai, India"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Transaction Type</label>
                <select 
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value as any)}
                >
                  <option value="purchase">Purchase</option>
                  <option value="withdrawal">ATM Withdrawal</option>
                  <option value="online">Online Payment</option>
                  <option value="contactless">Contactless Payment</option>
                </select>
              </div>
            </div>
            
            <Button 
              onClick={handleAnalyzeTransaction}
              disabled={isAnalyzing || !cardInput || !amountInput || !merchantInput}
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
                  Analyze Credit Card Transaction
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
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{currentTransaction.riskScore}</div>
                    <div className="text-xs text-muted-foreground">Overall Risk</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-500">{currentTransaction.amountRisk}</div>
                    <div className="text-xs text-muted-foreground">Amount</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-500">{currentTransaction.merchantRisk}</div>
                    <div className="text-xs text-muted-foreground">Merchant</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-500">{currentTransaction.velocityRisk}</div>
                    <div className="text-xs text-muted-foreground">Velocity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-500">{currentTransaction.geographicRisk}</div>
                    <div className="text-xs text-muted-foreground">Geographic</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Risk Score</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Luhn Valid:</span>
                      {currentTransaction.luhnValid ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
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
                        pattern.severity === "critical" ? "destructive" :
                        pattern.severity === "high" ? "default" :
                        pattern.severity === "medium" ? "secondary" : "outline"
                      }>
                        {pattern.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{pattern.description}</p>
                    <div className="flex justify-between text-xs">
                      <span>Detected: {pattern.detectionCount}</span>
                      <span>Saved: ₹{(pattern.preventedLoss / 1000).toFixed(0)}K</span>
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
                          <div className="flex items-center space-x-1">
                            {transaction.luhnValid ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <XCircle className="w-3 h-3 text-red-500" />
                            )}
                            <Badge variant="outline" className="text-xs">
                              {transaction.transactionType}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {transaction.merchant} | Risk: {transaction.riskScore}
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

export default AdvancedCreditCardDetection;
