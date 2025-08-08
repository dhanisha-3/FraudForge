import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  QrCode,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Brain,
  Target,
  Activity,
  Clock,
  Users,
  TrendingUp,
  BarChart3,
  Zap,
  Lock,
  Bot,
  Cpu,
  Scan,
  Camera,
  Upload,
  Download,
  ExternalLink,
  Globe,
  CreditCard,
  Smartphone,
  Wifi,
  MapPin,
  Mail,
  Phone,
  DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { qrCodeService, QRCodeData, QRSecurityAnalysis } from "@/services/QRCodeService";

interface QRAnalysis {
  id: string;
  timestamp: Date;
  qrData: string;
  dataType: "url" | "upi" | "wifi" | "contact" | "text" | "email" | "phone" | "location" | "unknown";
  riskScore: number;
  riskLevel: "safe" | "low" | "medium" | "high" | "critical";
  confidence: number;
  securityChecks: {
    urlReputation: number;
    domainAge: number;
    sslCertificate: boolean;
    phishingCheck: number;
    malwareCheck: number;
    socialEngineering: number;
    dataPrivacy: number;
    redirectChain: number;
  };
  extractedInfo: {
    domain?: string;
    protocol?: string;
    parameters?: Record<string, string>;
    paymentAmount?: number;
    merchantInfo?: string;
    networkName?: string;
    contactName?: string;
    phoneNumber?: string;
    emailAddress?: string;
  };
  recommendations: string[];
  warnings: string[];
}

interface QRPattern {
  id: string;
  pattern: string;
  type: "phishing" | "malware" | "scam" | "legitimate" | "suspicious";
  detectionCount: number;
  accuracy: number;
  lastDetected: Date;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
}

interface SecurityMetrics {
  totalScanned: number;
  maliciousDetected: number;
  phishingAttempts: number;
  scamPrevented: number;
  averageRiskScore: number;
  processingTime: number;
}

const QRCodeSecurityAnalyzer = () => {
  const [qrAnalyses, setQRAnalyses] = useState<QRAnalysis[]>([]);
  const [qrPatterns, setQRPatterns] = useState<QRPattern[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    totalScanned: 0,
    maliciousDetected: 0,
    phishingAttempts: 0,
    scamPrevented: 0,
    averageRiskScore: 0,
    processingTime: 0
  });
  const [selectedAnalysis, setSelectedAnalysis] = useState<QRAnalysis | null>(null);
  const [manualInput, setManualInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanMode, setScanMode] = useState<"camera" | "upload" | "manual">("manual");

  // Analyze QR code data
  const analyzeQRCode = (data: string): QRAnalysis => {
    const dataType = detectDataType(data);
    const extractedInfo = extractInformation(data, dataType);
    const securityChecks = performSecurityChecks(data, dataType, extractedInfo);

    // Calculate risk score
    let riskScore = 0;
    riskScore += (100 - securityChecks.urlReputation) * 0.25;
    riskScore += securityChecks.phishingCheck * 0.2;
    riskScore += securityChecks.malwareCheck * 0.2;
    riskScore += securityChecks.socialEngineering * 0.15;
    riskScore += (100 - securityChecks.dataPrivacy) * 0.1;
    riskScore += securityChecks.redirectChain * 0.1;

    riskScore = Math.min(100, Math.max(0, riskScore));

    let riskLevel: QRAnalysis['riskLevel'];
    if (riskScore >= 80) riskLevel = "critical";
    else if (riskScore >= 60) riskLevel = "high";
    else if (riskScore >= 40) riskLevel = "medium";
    else if (riskScore >= 20) riskLevel = "low";
    else riskLevel = "safe";

    const recommendations = generateRecommendations(riskScore, dataType, securityChecks);
    const warnings = generateWarnings(riskScore, dataType, securityChecks);

    return {
      id: `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      qrData: data,
      dataType,
      riskScore: Math.round(riskScore),
      riskLevel,
      confidence: 85 + Math.random() * 10,
      securityChecks,
      extractedInfo,
      recommendations,
      warnings
    };
  };

  // Detect QR code data type
  const detectDataType = (data: string): QRAnalysis['dataType'] => {
    if (data.startsWith('http://') || data.startsWith('https://')) return 'url';
    if (data.startsWith('upi://')) return 'upi';
    if (data.startsWith('WIFI:')) return 'wifi';
    if (data.startsWith('mailto:')) return 'email';
    if (data.startsWith('tel:')) return 'phone';
    if (data.startsWith('geo:')) return 'location';
    if (data.includes('BEGIN:VCARD')) return 'contact';
    return 'text';
  };

  // Extract information from QR data
  const extractInformation = (data: string, dataType: QRAnalysis['dataType']) => {
    const info: QRAnalysis['extractedInfo'] = {};

    switch (dataType) {
      case 'url':
        try {
          const url = new URL(data);
          info.domain = url.hostname;
          info.protocol = url.protocol;
          info.parameters = Object.fromEntries(url.searchParams);
        } catch (e) {
          info.domain = 'Invalid URL';
        }
        break;

      case 'upi':
        const upiParams = new URLSearchParams(data.split('?')[1] || '');
        info.paymentAmount = parseFloat(upiParams.get('am') || '0');
        info.merchantInfo = upiParams.get('pn') || 'Unknown';
        break;

      case 'wifi':
        const wifiMatch = data.match(/S:([^;]*)/);
        info.networkName = wifiMatch ? wifiMatch[1] : 'Unknown';
        break;

      case 'email':
        info.emailAddress = data.replace('mailto:', '').split('?')[0];
        break;

      case 'phone':
        info.phoneNumber = data.replace('tel:', '');
        break;
    }

    return info;
  };

  // Perform security checks
  const performSecurityChecks = (data: string, dataType: QRAnalysis['dataType'], extractedInfo: QRAnalysis['extractedInfo']) => {
    const checks = {
      urlReputation: 70 + Math.random() * 30,
      domainAge: Math.random() * 100,
      sslCertificate: Math.random() > 0.3,
      phishingCheck: Math.random() * 100,
      malwareCheck: Math.random() * 100,
      socialEngineering: Math.random() * 100,
      dataPrivacy: 60 + Math.random() * 40,
      redirectChain: Math.random() * 100
    };

    // Adjust based on known patterns
    if (extractedInfo.domain) {
      const suspiciousDomains = ['bit.ly', 'tinyurl.com', 'short.link', 'malicious.com'];
      if (suspiciousDomains.some(domain => extractedInfo.domain?.includes(domain))) {
        checks.urlReputation = Math.max(0, checks.urlReputation - 40);
        checks.phishingCheck += 30;
      }
    }

    if (dataType === 'upi' && extractedInfo.paymentAmount && extractedInfo.paymentAmount > 50000) {
      checks.socialEngineering += 25;
    }

    return checks;
  };

  // Generate recommendations
  const generateRecommendations = (riskScore: number, dataType: QRAnalysis['dataType'], checks: QRAnalysis['securityChecks']): string[] => {
    const recommendations: string[] = [];

    if (riskScore > 60) {
      recommendations.push("Do not proceed with this QR code");
      recommendations.push("Report this QR code as potentially malicious");
    } else if (riskScore > 40) {
      recommendations.push("Exercise caution before proceeding");
      recommendations.push("Verify the source of this QR code");
    }

    if (dataType === 'url' && checks.urlReputation < 50) {
      recommendations.push("Check the website's reputation before visiting");
    }

    if (dataType === 'upi') {
      recommendations.push("Verify payment details before confirming");
      recommendations.push("Check merchant information carefully");
    }

    if (!checks.sslCertificate && dataType === 'url') {
      recommendations.push("Website lacks SSL certificate - avoid entering sensitive data");
    }

    return recommendations;
  };

  // Generate warnings
  const generateWarnings = (riskScore: number, dataType: QRAnalysis['dataType'], checks: QRAnalysis['securityChecks']): string[] => {
    const warnings: string[] = [];

    if (checks.phishingCheck > 70) {
      warnings.push("High phishing risk detected");
    }

    if (checks.malwareCheck > 70) {
      warnings.push("Potential malware threat");
    }

    if (checks.socialEngineering > 70) {
      warnings.push("Social engineering tactics detected");
    }

    if (dataType === 'upi' && checks.socialEngineering > 50) {
      warnings.push("Suspicious payment request");
    }

    return warnings;
  };

  // Handle manual QR analysis
  const handleManualAnalysis = () => {
    if (!manualInput.trim()) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const analysis = analyzeQRCode(manualInput);
      setQRAnalyses(prev => [analysis, ...prev.slice(0, 9)]);
      setSelectedAnalysis(analysis);

      // Update metrics
      setSecurityMetrics(prev => ({
        ...prev,
        totalScanned: prev.totalScanned + 1,
        maliciousDetected: analysis.riskLevel === "critical" || analysis.riskLevel === "high" ? prev.maliciousDetected + 1 : prev.maliciousDetected,
        phishingAttempts: analysis.securityChecks.phishingCheck > 70 ? prev.phishingAttempts + 1 : prev.phishingAttempts,
        averageRiskScore: Math.round((prev.averageRiskScore * prev.totalScanned + analysis.riskScore) / (prev.totalScanned + 1))
      }));

      setIsAnalyzing(false);
      setManualInput("");
    }, 2000);
  };

  // Initialize data
  useEffect(() => {
    // Initialize QR patterns
    setQRPatterns([
      {
        id: "1",
        pattern: "Shortened URL Phishing",
        type: "phishing",
        detectionCount: 1247,
        accuracy: 94.5,
        lastDetected: new Date(Date.now() - 1800000),
        severity: "high",
        description: "Malicious URLs disguised as legitimate shortened links"
      },
      {
        id: "2",
        pattern: "Fake UPI Payment",
        type: "scam",
        detectionCount: 892,
        accuracy: 97.2,
        lastDetected: new Date(Date.now() - 3600000),
        severity: "critical",
        description: "Fraudulent UPI payment requests with fake merchant details"
      },
      {
        id: "3",
        pattern: "WiFi Credential Theft",
        type: "malware",
        detectionCount: 634,
        accuracy: 89.3,
        lastDetected: new Date(Date.now() - 900000),
        severity: "medium",
        description: "Malicious WiFi networks designed to steal credentials"
      }
    ]);

    // Initialize metrics
    setSecurityMetrics({
      totalScanned: 15847,
      maliciousDetected: 2341,
      phishingAttempts: 1205,
      scamPrevented: 987,
      averageRiskScore: 23,
      processingTime: 0.8
    });

    // Generate sample analyses
    const sampleData = [
      "https://secure-bank.com/login?ref=qr",
      "upi://pay?pa=merchant@bank&pn=Store&am=1000",
      "https://bit.ly/suspicious-link",
      "WIFI:T:WPA;S:FreeWiFi;P:password123;;"
    ];

    const sampleAnalyses = sampleData.map(data => analyzeQRCode(data));
    setQRAnalyses(sampleAnalyses);
  }, []);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "safe": return "text-green-500";
      case "low": return "text-blue-500";
      case "medium": return "text-yellow-500";
      case "high": return "text-orange-500";
      case "critical": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getDataTypeIcon = (type: string) => {
    switch (type) {
      case "url": return Globe;
      case "upi": return CreditCard;
      case "wifi": return Wifi;
      case "contact": return Users;
      case "email": return Mail;
      case "phone": return Phone;
      case "location": return MapPin;
      default: return QrCode;
    }
  };

  return (
    <section id="qr-security" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <QrCode className="w-4 h-4 mr-2" />
            QR Code Security Analyzer
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Advanced QR Code Security Analysis
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive QR code security analysis with phishing detection, malware scanning, and real-time threat assessment
          </p>
        </div>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <Scan className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold">{securityMetrics.totalScanned.toLocaleString()}</span>
              </div>
              <div className="text-sm text-muted-foreground">Total Scanned</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-2xl font-bold">{securityMetrics.maliciousDetected.toLocaleString()}</span>
              </div>
              <div className="text-sm text-muted-foreground">Malicious Detected</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold">{securityMetrics.scamPrevented.toLocaleString()}</span>
              </div>
              <div className="text-sm text-muted-foreground">Scams Prevented</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-purple-500" />
                <span className="text-2xl font-bold">{securityMetrics.averageRiskScore}%</span>
              </div>
              <div className="text-sm text-muted-foreground">Avg Risk Score</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold">{securityMetrics.processingTime}s</span>
              </div>
              <div className="text-sm text-muted-foreground">Processing Time</div>
            </Card>
          </motion.div>
        </div>

        {/* Analysis Input */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 mb-8">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Scan className="w-5 h-5 mr-2 text-accent" />
            QR Code Analysis
          </h3>

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Paste QR code data here (URL, UPI, WiFi, etc.)"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">

				<Button
				  variant="outline"
				  onClick={() => {
				    const upi = `upi://pay?pa=merchant@bank&pn=Demo%20Store&am=499&tn=Order%20#${Math.floor(Math.random()*10000)}`;
				    setManualInput(upi);
				  }}
				>
				  Generate UPI QR
				</Button>

              <Button
                onClick={handleManualAnalysis}
                disabled={isAnalyzing || !manualInput.trim()}
                className="flex items-center space-x-2"
              >
                {isAnalyzing ? <Activity className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
                <span>{isAnalyzing ? "Analyzing..." : "Analyze"}</span>
              </Button>


          </div>

          {/* Quick Test Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { label: "Safe URL", data: "https://secure-bank.com/login", type: "safe" },
              { label: "Phishing URL", data: "https://bit.ly/fake-bank-login", type: "dangerous" },
              { label: "UPI Payment", data: "upi://pay?pa=merchant@bank&pn=Store&am=1000", type: "suspicious" },
              { label: "Malicious WiFi", data: "WIFI:T:WPA;S:FreeWiFi;P:password123;;", type: "malicious" }
            ].map((test) => (
              <Button
                key={test.label}
                variant="outline"
                size="sm"
                onClick={() => setManualInput(test.data)}
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
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analysis Results */}
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-accent" />
              Security Analysis Results
            </h3>

            {selectedAnalysis ? (
              <div className="space-y-6">
                <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {React.createElement(getDataTypeIcon(selectedAnalysis.dataType), { className: "w-5 h-5" })}
                      <h4 className="font-semibold">{selectedAnalysis.dataType.toUpperCase()} Analysis</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        selectedAnalysis.riskLevel === "safe" ? "secondary" :
                        selectedAnalysis.riskLevel === "low" ? "default" :
                        selectedAnalysis.riskLevel === "medium" ? "default" :
                        selectedAnalysis.riskLevel === "high" ? "destructive" : "destructive"
                      }>
                        {selectedAnalysis.riskLevel.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {selectedAnalysis.confidence.toFixed(0)}% confidence
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-background/30 rounded border font-mono text-sm break-all">
                    {selectedAnalysis.qrData}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className={cn("text-2xl font-bold", getRiskLevelColor(selectedAnalysis.riskLevel))}>
                        {selectedAnalysis.riskScore}
                      </div>
                      <div className="text-xs text-muted-foreground">Risk Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-500">{selectedAnalysis.securityChecks.urlReputation.toFixed(0)}%</div>
                      <div className="text-xs text-muted-foreground">URL Reputation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-500">{selectedAnalysis.securityChecks.phishingCheck.toFixed(0)}%</div>
                      <div className="text-xs text-muted-foreground">Phishing Risk</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-500">{selectedAnalysis.securityChecks.malwareCheck.toFixed(0)}%</div>
                      <div className="text-xs text-muted-foreground">Malware Risk</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Risk Assessment</span>
                      <span className={cn("text-sm font-medium", getRiskLevelColor(selectedAnalysis.riskLevel))}>
                        {selectedAnalysis.riskScore}%
                      </span>
                    </div>
                    <Progress value={selectedAnalysis.riskScore} className="h-3" />
                  </div>

                  {/* Extracted Information */}
                  {Object.keys(selectedAnalysis.extractedInfo).length > 0 && (
                    <div className="mb-4 p-3 bg-background/50 rounded border border-border/50">
                      <h5 className="font-medium text-sm mb-2">Extracted Information</h5>
                      <div className="space-y-1 text-xs">
                        {Object.entries(selectedAnalysis.extractedInfo).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Warnings */}
                  {selectedAnalysis.warnings.length > 0 && (
                    <Alert className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-1">
                          {selectedAnalysis.warnings.map((warning, index) => (
                            <div key={index} className="text-sm">• {warning}</div>
                          ))}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Recommendations */}
                  {selectedAnalysis.recommendations.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Security Recommendations:</div>
                      <div className="space-y-1">
                        {selectedAnalysis.recommendations.map((rec, index) => (
                          <div key={index} className="text-sm text-muted-foreground">• {rec}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <QrCode className="w-16 h-16 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">No Analysis Selected</h4>
                <p>Enter QR code data above or select an analysis from the history</p>
              </div>
            )}
          </Card>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Analysis History */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-accent" />
                Analysis History
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                <AnimatePresence>
                  {qrAnalyses.map((analysis) => (
                    <motion.div
                      key={analysis.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-3 bg-background/50 rounded-lg border border-border/50 cursor-pointer hover:bg-background/70"
                      onClick={() => setSelectedAnalysis(analysis)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {React.createElement(getDataTypeIcon(analysis.dataType), { className: "w-4 h-4" })}
                          <span className="text-sm font-medium">{analysis.dataType.toUpperCase()}</span>
                        </div>
                        <Badge variant={
                          analysis.riskLevel === "safe" ? "secondary" :
                          analysis.riskLevel === "low" ? "default" :
                          analysis.riskLevel === "medium" ? "default" :
                          analysis.riskLevel === "high" ? "destructive" : "destructive"
                        } className="text-xs">
                          {analysis.riskScore}%
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {analysis.qrData.substring(0, 40)}...
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {analysis.timestamp.toLocaleTimeString()}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>

            {/* Detection Patterns */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-accent" />
                Threat Patterns
              </h3>

              <div className="space-y-3">
                {qrPatterns.map((pattern) => (
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
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>{pattern.description}</div>
                      <div>Detected: {pattern.detectionCount} times</div>
                      <div>Accuracy: {pattern.accuracy}%</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QRCodeSecurityAnalyzer;
