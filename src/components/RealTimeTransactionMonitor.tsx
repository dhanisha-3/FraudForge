import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
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
  CreditCard,
  Smartphone,
  Globe,
  TrendingUp,
  Shield,
  Search,
  Filter,
  Play,
  Pause,
  BarChart3,
  PieChart,
  Mic
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import jsPDF from "jspdf";
interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  location: string;
  timestamp: Date;
  channel: "card-present" | "online" | "mobile" | "upi";
  cardNumber: string;
  riskScore: number;
  status: "processing" | "approved" | "flagged" | "blocked";
  riskFactors: string[];
  processingTime: number;
  userId: string;
  deviceId: string;
  ipAddress: string;
}

interface FraudAlert {
  id: string;
  type: "high-risk" | "anomaly" | "velocity" | "network";
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: Date;
  transactionId?: string;
}

interface SystemMetrics {
  transactionsPerSecond: number;
  averageProcessingTime: number;
  fraudDetectionRate: number;
  falsePositiveRate: number;
  systemUptime: number;
  activeAlerts: number;
}

const RealTimeTransactionMonitor = () => {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    transactionsPerSecond: 0,
    averageProcessingTime: 0,
    fraudDetectionRate: 0,
    falsePositiveRate: 0,
    systemUptime: 99.97,
    activeAlerts: 0
  });
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const transactionStreamRef = useRef<HTMLDivElement>(null);

  // Advanced fraud detection algorithm
  const analyzeTransaction = (transaction: Omit<Transaction, 'riskScore' | 'status' | 'riskFactors' | 'processingTime'>): {
    riskScore: number;
    status: Transaction['status'];
    riskFactors: string[];
    processingTime: number;
  } => {
    const startTime = performance.now();
    let riskScore = 0;
    const riskFactors: string[] = [];

    // 1. Amount-based analysis
    if (transaction.amount > 10000) {
      riskScore += 25;
      riskFactors.push("High amount transaction");
    } else if (transaction.amount > 5000) {
      riskScore += 15;
      riskFactors.push("Above average amount");
    }

    // 2. Channel-specific risk
    switch (transaction.channel) {
      case "online":
        riskScore += 10;
        if (transaction.amount > 1000) {
          riskScore += 5;
          riskFactors.push("High-value online transaction");
        }
        break;
      case "mobile":
        if (transaction.amount > 2000) {
          riskScore += 8;
          riskFactors.push("High-value mobile transaction");
        }
        break;
    }

    // 3. Geographic risk analysis
    const highRiskLocations = ["Nigeria", "Romania", "Russia", "Unknown"];
    if (highRiskLocations.some(loc => transaction.location.includes(loc))) {
      riskScore += 30;
      riskFactors.push("High-risk geographic location");
    }

    // 4. Time-based analysis
    const hour = transaction.timestamp.getHours();
    if (hour >= 23 || hour <= 5) {
      riskScore += 12;
      riskFactors.push("Unusual transaction time");
    }

    // 5. Merchant risk analysis
    const highRiskMerchants = ["Casino", "Crypto", "Gambling", "Unknown Merchant"];
    if (highRiskMerchants.some(merchant => transaction.merchant.includes(merchant))) {
      riskScore += 20;
      riskFactors.push("High-risk merchant category");
    }

    // 6. Velocity check (simulate)
    const recentTransactions = transactions.filter(t =>
      t.userId === transaction.userId &&
      (Date.now() - t.timestamp.getTime()) < 3600000 // Last hour
    );

    if (recentTransactions.length >= 5) {
      riskScore += 25;
      riskFactors.push("High transaction velocity");
    } else if (recentTransactions.length >= 3) {
      riskScore += 15;
      riskFactors.push("Moderate transaction velocity");
    }

    // 7. Device consistency check
    const userDevices = transactions.filter(t => t.userId === transaction.userId);
    const knownDevices = [...new Set(userDevices.map(t => t.deviceId))];
    if (!knownDevices.includes(transaction.deviceId) && knownDevices.length > 0) {
      riskScore += 18;
      riskFactors.push("New device detected");
    }

    // 8. Round amount pattern (common in fraud)
    if (transaction.amount % 100 === 0 && transaction.amount >= 1000) {
      riskScore += 8;
      riskFactors.push("Round amount pattern");
    }

    // Determine status based on risk score
    let status: Transaction['status'];
    if (riskScore >= 70) {
      status = "blocked";
    } else if (riskScore >= 40) {
      status = "flagged";
    } else {
      status = "approved";
    }

    const processingTime = performance.now() - startTime;

    return {
      riskScore: Math.min(100, riskScore),
      status,
      riskFactors,
      processingTime
    };
  };

  // Generate realistic transaction data
  const generateTransaction = (): Transaction => {
    const merchants = [
      "Amazon", "Walmart", "Starbucks", "McDonald's", "Target", "Best Buy",
      "Casino Royal", "Crypto Exchange", "Unknown Merchant", "Gas Station",
      "Grocery Store", "Restaurant", "Online Shop", "ATM Withdrawal"
    ];

    const locations = [
      "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX",
      "London, UK", "Toronto, CA", "Nigeria", "Romania", "Unknown"
    ];

    const channels: Transaction['channel'][] = ["card-present", "online", "mobile", "upi"];
    const userIds = ["user_001", "user_002", "user_003", "user_004", "user_005"];
    const deviceIds = ["device_A", "device_B", "device_C", "device_D", "device_E"];

    const baseTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.floor(Math.random() * 15000) + 10,
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      timestamp: new Date(),
      channel: channels[Math.floor(Math.random() * channels.length)],
      cardNumber: `****${Math.floor(Math.random() * 9000) + 1000}`,
      userId: userIds[Math.floor(Math.random() * userIds.length)],
      deviceId: deviceIds[Math.floor(Math.random() * deviceIds.length)],
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    };

    const analysis = analyzeTransaction(baseTransaction);

    return {
      ...baseTransaction,
      ...analysis
    };
  };

  // Generate fraud alerts
  const generateFraudAlert = (transaction?: Transaction): FraudAlert => {
    const alertTypes: FraudAlert['type'][] = ["high-risk", "anomaly", "velocity", "network"];
    const severities: FraudAlert['severity'][] = ["low", "medium", "high", "critical"];

    const messages = [
      "Suspicious transaction pattern detected",
      "High-risk merchant transaction flagged",
      "Unusual geographic activity",
      "Velocity threshold exceeded",
      "Device fingerprint mismatch",
      "Network anomaly detected",
      "Potential fraud ring activity"
    ];

    return {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      timestamp: new Date(),
      transactionId: transaction?.id
    };
  };

  // Real-time transaction simulation
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Generate 1-3 transactions per interval
      const transactionCount = Math.floor(Math.random() * 3) + 1;
      const newTransactions: Transaction[] = [];

      for (let i = 0; i < transactionCount; i++) {
        const transaction = generateTransaction();
        newTransactions.push(transaction);

        // Generate alert for high-risk transactions
        if (transaction.riskScore > 60 && Math.random() > 0.7) {
          const alert = generateFraudAlert(transaction);
          setFraudAlerts(prev => [alert, ...prev.slice(0, 19)]);
        }
      }

      setTransactions(prev => [...newTransactions, ...prev.slice(0, 99)]);

      // Update system metrics
      setSystemMetrics(prev => ({
        transactionsPerSecond: transactionCount / 2,
        averageProcessingTime: newTransactions.reduce((sum, t) => sum + t.processingTime, 0) / newTransactions.length,
        fraudDetectionRate: (newTransactions.filter(t => t.status === "blocked" || t.status === "flagged").length / newTransactions.length) * 100,
        falsePositiveRate: Math.random() * 3 + 1,
        systemUptime: prev.systemUptime,
        activeAlerts: fraudAlerts.length
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring, transactions, fraudAlerts]);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;
    const matchesSearch = searchTerm === "" ||
      transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.cardNumber.includes(searchTerm) ||
      transaction.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

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

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "card-present": return CreditCard;
      case "online": return Globe;
      case "mobile": return Smartphone;
      case "upi": return Zap;
      default: return Activity;
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
    <section id="monitor" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Activity className="w-4 h-4 mr-2" />
            Real-Time Transaction Monitor
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Live Fraud Detection Engine
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Monitor financial transactions in real-time with AI-powered fraud detection and instant risk assessment
          </p>
        </div>

        {/* System Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">TPS</p>
                <p className="text-lg font-bold">{systemMetrics.transactionsPerSecond.toFixed(1)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Avg Time</p>
                <p className="text-lg font-bold">{systemMetrics.averageProcessingTime.toFixed(0)}ms</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-xs text-muted-foreground">Detection</p>
                <p className="text-lg font-bold">{systemMetrics.fraudDetectionRate.toFixed(1)}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-xs text-muted-foreground">False +</p>
                <p className="text-lg font-bold">{systemMetrics.falsePositiveRate.toFixed(1)}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground">Uptime</p>
                <p className="text-lg font-bold">{systemMetrics.systemUptime.toFixed(2)}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Alerts</p>
                <p className="text-lg font-bold">{fraudAlerts.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Transaction Stream */}
          <Card className="lg:col-span-3 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Live Transaction Stream</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48"
                  />
                  <Search className="w-4 h-4 text-muted-foreground" />
                </div>

                <select
                  className="px-3 py-1 border border-border rounded-md bg-background text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="flagged">Flagged</option>
                  <option value="blocked">Blocked</option>
                </select>

                <Button
                  size="sm"
                  variant={isMonitoring ? "default" : "outline"}
                  onClick={() => setIsMonitoring(!isMonitoring)}
                >
                  {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isMonitoring ? "Pause" : "Resume"}
                </Button>

					<Button size="sm" variant="outline" onClick={() => exportPdf()}>
					  Report PDF
					</Button>

              </div>
            </div>

            <div ref={transactionStreamRef} className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {filteredTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "p-4 bg-background/50 rounded-lg border cursor-pointer transition-all duration-200",
                      selectedTransaction?.id === transaction.id ? "border-primary bg-primary/5" : "border-border/50 hover:border-border"
                    )}
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {React.createElement(getChannelIcon(transaction.channel), {
                          className: "w-5 h-5 text-muted-foreground"
                        })}
                        <div>
                          <div className="font-medium text-sm">{transaction.merchant}</div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.cardNumber} • {transaction.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-bold">${transaction.amount.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.timestamp.toLocaleTimeString()}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <div className="text-sm font-medium">Risk: {transaction.riskScore}</div>
                            <div className="text-xs text-muted-foreground">
                              {transaction.processingTime.toFixed(1)}ms
                            </div>
                          </div>
                          {React.createElement(getStatusIcon(transaction.status), {
                            className: cn("w-5 h-5", getStatusColor(transaction.status))
                          })}
                        </div>
                      </div>
                    </div>

                    {transaction.riskFactors.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {transaction.riskFactors.slice(0, 3).map((factor, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                        {transaction.riskFactors.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{transaction.riskFactors.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>

          {/* Fraud Alerts Panel */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Fraud Alerts
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {fraudAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-3 bg-background/50 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={
                        alert.severity === "critical" ? "destructive" :
                        alert.severity === "high" ? "default" :
                        alert.severity === "medium" ? "secondary" : "outline"
                      }>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                    <div className="text-xs text-muted-foreground mt-1 capitalize">
                      Type: {alert.type.replace('-', ' ')}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* Transaction Detail Modal */}
        <AnimatePresence>
          {selectedTransaction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedTransaction(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Transaction Analysis</h3>
                  <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
                    Close
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Transaction Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium">${selectedTransaction.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Merchant:</span>
                        <span className="font-medium">{selectedTransaction.merchant}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{selectedTransaction.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Channel:</span>
                        <Badge variant="outline">{selectedTransaction.channel}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Card:</span>
                        <span className="font-medium">{selectedTransaction.cardNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">{selectedTransaction.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Risk Analysis</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-muted-foreground">Risk Score:</span>
                          <span className={cn("font-bold", getStatusColor(selectedTransaction.status))}>
                            {selectedTransaction.riskScore}/100
                          </span>
                        </div>
                        <Progress value={selectedTransaction.riskScore} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-muted-foreground">Status:</span>
                          <div className="flex items-center space-x-2">
                            {React.createElement(getStatusIcon(selectedTransaction.status), {
                              className: cn("w-4 h-4", getStatusColor(selectedTransaction.status))
                            })}
                            <span className={cn("font-medium", getStatusColor(selectedTransaction.status))}>
                              {selectedTransaction.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-muted-foreground">Processing Time:</span>
                          <span className="font-medium">{selectedTransaction.processingTime.toFixed(2)}ms</span>
                        </div>
                      </div>

                      {selectedTransaction.riskFactors.length > 0 && (
                        <div>
                          <span className="text-muted-foreground mb-2 block">Risk Factors:</span>
                          <div className="space-y-1">
                            {selectedTransaction.riskFactors.map((factor, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs mr-1 mb-1">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <Button variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Investigate
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>

					<Button variant="outline" className="flex-1" onClick={() => window.location.assign('/computer-vision')}>
					  <Eye className="w-4 h-4 mr-2" />
					  Verify Face
					</Button>
					<Button variant="outline" className="flex-1" onClick={() => window.location.assign('/computer-vision')}>
					  <Mic className="w-4 h-4 mr-2" />
					  Verify Voice
					</Button>
					<Button variant="outline" className="flex-1" onClick={() => exportPdf()}>
					  FIR PDF
					</Button>

                  <Button variant="destructive" className="flex-1">
                    <XCircle className="w-4 h-4 mr-2" />
                    Block
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

const exportPdf = () => {
  const doc = new jsPDF();
  const now = new Date().toLocaleString();
  doc.setFontSize(16);
  doc.text("FraudGuard AI - Real-time Transaction Report", 14, 18);
  doc.setFontSize(10);
  doc.text(`Generated: ${now}`, 14, 26);

  // Summary metrics (grabbed from DOM-less state would be ideal; keep generic here)
  doc.text("Summary", 14, 36);
  doc.setFontSize(9);
  doc.text("- Live monitoring active", 14, 44);
  doc.text("- AI risk scoring with anomaly detection", 14, 50);
  doc.text("- Actions: Investigate / Approve / Block", 14, 56);

  // Hint for full integration with tables/graphs later
  doc.setFontSize(10);
  doc.text("Details and charts available in the Analyst Dashboard.", 14, 70);
  doc.save(`fraudguard_report_${Date.now()}.pdf`);
};

        </AnimatePresence>
      </div>
    </section>
  );
};

export default RealTimeTransactionMonitor;
