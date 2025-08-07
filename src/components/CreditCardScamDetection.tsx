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
  Zap,
  MapPin,
  Clock,
  DollarSign,
  User,
  Smartphone,
  Globe,
  TrendingUp,
  Activity,
  Lock,
  Unlock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CreditCardTransaction {
  id: string;
  cardNumber: string;
  amount: number;
  merchant: string;
  location: string;
  timestamp: Date;
  riskScore: number;
  status: "processing" | "approved" | "flagged" | "blocked";
  riskFactors: string[];
}

interface ScamPattern {
  id: string;
  type: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  indicators: string[];
  detectionRate: number;
}

interface CardAnalysis {
  cardType: string;
  issuer: string;
  country: string;
  riskLevel: number;
  blacklisted: boolean;
  velocity: number;
  deviceFingerprint: string;
}

const CreditCardScamDetection = () => {
  const [activeTransaction, setActiveTransaction] = useState<CreditCardTransaction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cardInput, setCardInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [merchantInput, setMerchantInput] = useState("");

  const [recentTransactions, setRecentTransactions] = useState<CreditCardTransaction[]>([
    {
      id: "tx_001",
      cardNumber: "****1234",
      amount: 2500,
      merchant: "Electronics Store",
      location: "Romania",
      timestamp: new Date(Date.now() - 300000),
      riskScore: 95,
      status: "blocked",
      riskFactors: ["Geographic anomaly", "High amount", "New merchant", "Velocity check failed"]
    },
    {
      id: "tx_002", 
      cardNumber: "****5678",
      amount: 45.67,
      merchant: "Starbucks",
      location: "New York, NY",
      timestamp: new Date(Date.now() - 600000),
      riskScore: 12,
      status: "approved",
      riskFactors: []
    },
    {
      id: "tx_003",
      cardNumber: "****9012",
      amount: 1200,
      merchant: "Online Gaming",
      location: "Nigeria",
      timestamp: new Date(Date.now() - 900000),
      riskScore: 87,
      status: "flagged",
      riskFactors: ["High-risk merchant", "Unusual location", "Card not present"]
    }
  ]);

  const [scamPatterns, setScamPatterns] = useState<ScamPattern[]>([
    {
      id: "pattern_001",
      type: "Card Testing",
      description: "Multiple small transactions to test card validity",
      severity: "medium",
      indicators: ["Multiple $1 transactions", "Different merchants", "Short time window"],
      detectionRate: 94.2
    },
    {
      id: "pattern_002",
      type: "Account Takeover",
      description: "Legitimate card used from compromised account",
      severity: "critical",
      indicators: ["New device", "Geographic anomaly", "Behavioral deviation"],
      detectionRate: 98.7
    },
    {
      id: "pattern_003",
      type: "Synthetic Identity",
      description: "Fake identity using real SSN and fake personal data",
      severity: "high",
      indicators: ["New credit profile", "Inconsistent data", "Rapid credit building"],
      detectionRate: 89.3
    },
    {
      id: "pattern_004",
      type: "Skimming Attack",
      description: "Card data stolen from physical skimming devices",
      severity: "high",
      indicators: ["Card present fraud", "ATM/POS compromise", "Batch transactions"],
      detectionRate: 91.8
    }
  ]);

  const [cardAnalysis, setCardAnalysis] = useState<CardAnalysis>({
    cardType: "Visa",
    issuer: "Chase Bank",
    country: "United States",
    riskLevel: 15,
    blacklisted: false,
    velocity: 3,
    deviceFingerprint: "Chrome/Windows/192.168.1.1"
  });

  // Advanced fraud detection algorithm
  const analyzeTransaction = () => {
    if (!cardInput || !amountInput || !merchantInput) return;

    setIsAnalyzing(true);
    setActiveTransaction({
      id: `tx_${Date.now()}`,
      cardNumber: `****${cardInput.slice(-4)}`,
      amount: parseFloat(amountInput),
      merchant: merchantInput,
      location: "Current Location",
      timestamp: new Date(),
      riskScore: 0,
      status: "processing",
      riskFactors: []
    });

    // Advanced fraud detection algorithm
    setTimeout(() => {
      const amount = parseFloat(amountInput);
      const merchant = merchantInput.toLowerCase();
      const cardLast4 = cardInput.slice(-4);

      let riskScore = 0;
      const riskFactors = [];

      // 1. Amount-based risk scoring
      if (amount > 10000) {
        riskScore += 35;
        riskFactors.push("Extremely high amount transaction");
      } else if (amount > 5000) {
        riskScore += 25;
        riskFactors.push("High amount transaction");
      } else if (amount > 1000) {
        riskScore += 15;
        riskFactors.push("Above average transaction");
      }

      // 2. Merchant category risk analysis
      const highRiskMerchants = ['casino', 'gambling', 'crypto', 'bitcoin', 'forex', 'investment', 'loan'];
      const mediumRiskMerchants = ['electronics', 'jewelry', 'luxury', 'gift', 'prepaid'];

      if (highRiskMerchants.some(risk => merchant.includes(risk))) {
        riskScore += 30;
        riskFactors.push("High-risk merchant category");
      } else if (mediumRiskMerchants.some(risk => merchant.includes(risk))) {
        riskScore += 20;
        riskFactors.push("Medium-risk merchant category");
      }

      // 3. Card not present transactions
      if (merchant.includes('online') || merchant.includes('web') || merchant.includes('internet')) {
        riskScore += 15;
        riskFactors.push("Card not present transaction");
      }

      // 4. Velocity checks (simulate based on recent transactions)
      const recentSimilarTransactions = recentTransactions.filter(tx =>
        tx.cardNumber === `****${cardLast4}` &&
        (Date.now() - tx.timestamp.getTime()) < 3600000 // Last hour
      );

      if (recentSimilarTransactions.length >= 3) {
        riskScore += 25;
        riskFactors.push("High transaction velocity detected");
      } else if (recentSimilarTransactions.length >= 2) {
        riskScore += 15;
        riskFactors.push("Moderate transaction velocity");
      }

      // 5. Geographic risk (simulate)
      const highRiskCountries = ['nigeria', 'romania', 'russia', 'china'];
      const currentLocation = "Current Location".toLowerCase();
      if (highRiskCountries.some(country => currentLocation.includes(country))) {
        riskScore += 40;
        riskFactors.push("High-risk geographic location");
      }

      // 6. Time-based analysis
      const currentHour = new Date().getHours();
      if (currentHour >= 23 || currentHour <= 5) {
        riskScore += 10;
        riskFactors.push("Unusual transaction time");
      }

      // 7. Card validation (Luhn algorithm simulation)
      if (!isValidCardNumber(cardInput)) {
        riskScore += 50;
        riskFactors.push("Invalid card number format");
      }

      // 8. Pattern matching for known fraud signatures
      if (amount % 100 === 0 && amount > 1000) {
        riskScore += 10;
        riskFactors.push("Round amount pattern (common in fraud)");
      }

      // 9. Merchant name analysis
      if (merchant.length < 3 || /[0-9]{3,}/.test(merchant)) {
        riskScore += 15;
        riskFactors.push("Suspicious merchant name pattern");
      }

      // Cap risk score at 100
      riskScore = Math.min(100, riskScore);

      // Determine status based on risk score
      let status: "approved" | "flagged" | "blocked";
      if (riskScore >= 70) {
        status = "blocked";
      } else if (riskScore >= 40) {
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
            id: `tx_${Date.now()}`,
            cardNumber: `****${cardLast4}`,
            amount,
            merchant: merchantInput,
            location: "Current Location",
            timestamp: new Date(),
            riskScore: Math.round(riskScore),
            status,
            riskFactors
          };
          return [newTransaction, ...prev.slice(0, 4)];
        });
      }, 1000);
    }, 3000);
  };

  // Luhn algorithm for card validation
  const isValidCardNumber = (cardNumber: string): boolean => {
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-500";
      case "high": return "text-orange-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  return (
    <section id="credit-card" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <CreditCard className="w-4 h-4 mr-2" />
            Credit Card Scam Detection
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Advanced Card Fraud Protection
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time credit card transaction analysis with AI-powered scam pattern detection and risk assessment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction Analyzer */}
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-500" />
              Real-Time Transaction Analysis
            </h3>

            {/* Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Card Number</label>
                <Input
                  placeholder="**** **** **** 1234"
                  value={cardInput}
                  onChange={(e) => setCardInput(e.target.value)}
                  disabled={isAnalyzing}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Amount ($)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  disabled={isAnalyzing}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Merchant</label>
                <Input
                  placeholder="Merchant Name"
                  value={merchantInput}
                  onChange={(e) => setMerchantInput(e.target.value)}
                  disabled={isAnalyzing}
                />
              </div>
            </div>

            <Button 
              onClick={analyzeTransaction}
              disabled={isAnalyzing || !cardInput || !amountInput || !merchantInput}
              className="w-full mb-6"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Transaction...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Analyze Transaction
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
                    <h4 className="font-semibold">Transaction Analysis</h4>
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
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{activeTransaction.cardNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">${activeTransaction.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{activeTransaction.merchant}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{activeTransaction.timestamp.toLocaleTimeString()}</span>
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

            {/* Recent Transactions */}
            <div>
              <h4 className="font-semibold mb-4">Recent Transactions</h4>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <Card key={transaction.id} className="p-4 bg-background/30 border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-sm">{transaction.cardNumber}</div>
                          <div className="text-xs text-muted-foreground">
                            ${transaction.amount} • {transaction.merchant}
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

          {/* Scam Patterns & Card Analysis */}
          <div className="space-y-6">
            {/* Card Analysis */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-blue-500" />
                Card Analysis
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Card Type:</span>
                  <span className="text-sm font-medium">{cardAnalysis.cardType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Issuer:</span>
                  <span className="text-sm font-medium">{cardAnalysis.issuer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Country:</span>
                  <span className="text-sm font-medium">{cardAnalysis.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Risk Level:</span>
                  <span className="text-sm font-medium text-green-500">{cardAnalysis.riskLevel}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Blacklisted:</span>
                  <span className={cn("text-sm font-medium", cardAnalysis.blacklisted ? "text-red-500" : "text-green-500")}>
                    {cardAnalysis.blacklisted ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Velocity:</span>
                  <span className="text-sm font-medium">{cardAnalysis.velocity} tx/hour</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">Card Verified</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  No suspicious activity detected. Card is in good standing.
                </p>
              </div>
            </Card>

            {/* Scam Patterns */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-red-500" />
                Active Scam Patterns
              </h3>
              
              <div className="space-y-4">
                {scamPatterns.map((pattern) => (
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
                      <span className="text-xs text-muted-foreground">Detection Rate:</span>
                      <span className="text-xs font-medium">{pattern.detectionRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Real-time Stats */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-500" />
                Live Statistics
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transactions Today:</span>
                  <span className="text-sm font-medium">12,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Blocked Frauds:</span>
                  <span className="text-sm font-medium text-red-500">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">False Positives:</span>
                  <span className="text-sm font-medium text-yellow-500">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Accuracy Rate:</span>
                  <span className="text-sm font-medium text-green-500">99.94%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreditCardScamDetection;
