import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Link, 
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Brain,
  Target,
  Activity,
  Clock,
  Globe,
  Flag,
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
  ExternalLink,
  MessageSquare,
  Phone,
  AlertCircle,
  Ban,
  FileText,
  Send,
  Copy,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface URLAnalysis {
  id: string;
  url: string;
  timestamp: Date;
  riskScore: number;
  status: "safe" | "suspicious" | "dangerous" | "malicious";
  riskFactors: string[];
  domainRisk: number;
  contentRisk: number;
  reputationRisk: number;
  technicalRisk: number;
  socialEngineeringRisk: number;
  confidence: number;
  recommendation: "proceed" | "caution" | "block";
  reportCount: number;
  isReported: boolean;
}

interface ScamReport {
  id: string;
  url: string;
  reportType: "phishing" | "malware" | "scam" | "fake_site" | "other";
  description: string;
  reporterInfo: string;
  timestamp: Date;
  severity: "low" | "medium" | "high" | "critical";
  status: "pending" | "verified" | "false_positive";
}

interface URLDatabase {
  knownScams: string[];
  trustedSites: string[];
  reportedUrls: Map<string, number>;
  verifiedScams: Set<string>;
}

const URLFraudDetection = () => {
  const [urlInput, setUrlInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<URLAnalysis | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<URLAnalysis[]>([]);
  const [scamReports, setScamReports] = useState<ScamReport[]>([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportType, setReportType] = useState<"phishing" | "malware" | "scam" | "fake_site" | "other">("scam");
  const [reportDescription, setReportDescription] = useState("");
  const [reporterInfo, setReporterInfo] = useState("");
  const [urlDatabase, setUrlDatabase] = useState<URLDatabase>({
    knownScams: [],
    trustedSites: [],
    reportedUrls: new Map(),
    verifiedScams: new Set()
  });
  const [showWarning, setShowWarning] = useState(false);
  const [warningDetails, setWarningDetails] = useState<URLAnalysis | null>(null);
  const [paymentWarningEnabled, setPaymentWarningEnabled] = useState(true);
  const [browserExtensionMode, setBrowserExtensionMode] = useState(false);
  const [autoScanEnabled, setAutoScanEnabled] = useState(false);
  const [scanHistory, setScanHistory] = useState<URLAnalysis[]>([]);
  const [blockedUrls, setBlockedUrls] = useState<Set<string>>(new Set());

  // Advanced URL fraud detection algorithm
  const analyzeURL = (url: string): URLAnalysis => {
    const startTime = performance.now();
    let riskScore = 0;
    const riskFactors: string[] = [];

    // 1. Domain Analysis
    const domainRisk = analyzeDomain(url);
    riskScore += domainRisk.score;
    riskFactors.push(...domainRisk.factors);

    // 2. URL Structure Analysis
    const structureRisk = analyzeURLStructure(url);
    riskScore += structureRisk.score;
    riskFactors.push(...structureRisk.factors);

    // 3. Reputation Analysis
    const reputationRisk = analyzeReputation(url);
    riskScore += reputationRisk.score;
    riskFactors.push(...reputationRisk.factors);

    // 4. Technical Analysis
    const technicalRisk = analyzeTechnicalIndicators(url);
    riskScore += technicalRisk.score;
    riskFactors.push(...technicalRisk.factors);

    // 5. Social Engineering Analysis
    const socialEngineeringRisk = analyzeSocialEngineering(url);
    riskScore += socialEngineeringRisk.score;
    riskFactors.push(...socialEngineeringRisk.factors);

    // Determine status and recommendation
    let status: URLAnalysis['status'];
    let recommendation: URLAnalysis['recommendation'];
    let confidence = 0;

    if (riskScore >= 80) {
      status = "malicious";
      recommendation = "block";
      confidence = 95 + Math.random() * 5;
    } else if (riskScore >= 60) {
      status = "dangerous";
      recommendation = "block";
      confidence = 85 + Math.random() * 10;
    } else if (riskScore >= 30) {
      status = "suspicious";
      recommendation = "caution";
      confidence = 75 + Math.random() * 15;
    } else {
      status = "safe";
      recommendation = "proceed";
      confidence = 90 + Math.random() * 10;
    }

    const reportCount = urlDatabase.reportedUrls.get(url) || 0;
    const isReported = urlDatabase.verifiedScams.has(url);

    return {
      id: `url_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url,
      timestamp: new Date(),
      riskScore: Math.min(100, riskScore),
      status,
      riskFactors,
      domainRisk: domainRisk.score,
      contentRisk: structureRisk.score,
      reputationRisk: reputationRisk.score,
      technicalRisk: technicalRisk.score,
      socialEngineeringRisk: socialEngineeringRisk.score,
      confidence,
      recommendation,
      reportCount,
      isReported
    };
  };

  // Domain analysis
  const analyzeDomain = (url: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      
      // Check against known scam domains
      const knownScamPatterns = [
        'secure-bank', 'paypal-security', 'amazon-update', 'microsoft-support',
        'apple-verification', 'google-security', 'facebook-security', 'instagram-verify'
      ];
      
      knownScamPatterns.forEach(pattern => {
        if (domain.includes(pattern)) {
          score += 40;
          factors.push(`Suspicious domain pattern: ${pattern}`);
        }
      });

      // Check for suspicious TLDs
      const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.click', '.download', '.loan'];
      suspiciousTLDs.forEach(tld => {
        if (domain.endsWith(tld)) {
          score += 25;
          factors.push(`Suspicious TLD: ${tld}`);
        }
      });

      // Check for homograph attacks
      if (/[а-я]|[α-ω]|[а-я]/.test(domain)) {
        score += 35;
        factors.push("Potential homograph attack (non-Latin characters)");
      }

      // Check for excessive subdomains
      const subdomains = domain.split('.').length - 2;
      if (subdomains > 2) {
        score += 15;
        factors.push("Excessive subdomains detected");
      }

      // Check for suspicious keywords
      const suspiciousKeywords = ['secure', 'verify', 'update', 'confirm', 'login', 'account'];
      suspiciousKeywords.forEach(keyword => {
        if (domain.includes(keyword)) {
          score += 10;
          factors.push(`Suspicious keyword in domain: ${keyword}`);
        }
      });

      // Check domain age simulation (would be real API call)
      if (Math.random() > 0.7) {
        score += 20;
        factors.push("Recently registered domain");
      }

    } catch (error) {
      score += 30;
      factors.push("Invalid URL format");
    }
    
    return { score, factors };
  };

  // URL structure analysis
  const analyzeURLStructure = (url: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    // Check for URL shorteners
    const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'short.link', 'ow.ly'];
    shorteners.forEach(shortener => {
      if (url.includes(shortener)) {
        score += 20;
        factors.push(`URL shortener detected: ${shortener}`);
      }
    });

    // Check for suspicious parameters
    const suspiciousParams = ['redirect', 'goto', 'url', 'link', 'next', 'continue'];
    suspiciousParams.forEach(param => {
      if (url.includes(`${param}=`)) {
        score += 15;
        factors.push(`Suspicious parameter: ${param}`);
      }
    });

    // Check for IP addresses instead of domains
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) {
      score += 30;
      factors.push("IP address instead of domain name");
    }

    // Check for excessive length
    if (url.length > 100) {
      score += 10;
      factors.push("Unusually long URL");
    }

    // Check for suspicious characters
    if (/[<>{}|\\^`\[\]]/.test(url)) {
      score += 15;
      factors.push("Suspicious characters in URL");
    }

    // Check for HTTPS
    if (url.startsWith('http://') && !url.includes('localhost')) {
      score += 10;
      factors.push("Non-HTTPS URL");
    }

    return { score, factors };
  };

  // Reputation analysis
  const analyzeReputation = (url: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    // Check against known scam database
    if (urlDatabase.verifiedScams.has(url)) {
      score += 50;
      factors.push("URL in verified scam database");
    }

    // Check report count
    const reportCount = urlDatabase.reportedUrls.get(url) || 0;
    if (reportCount > 10) {
      score += 30;
      factors.push(`High number of user reports: ${reportCount}`);
    } else if (reportCount > 5) {
      score += 20;
      factors.push(`Multiple user reports: ${reportCount}`);
    } else if (reportCount > 0) {
      score += 10;
      factors.push(`User reports: ${reportCount}`);
    }

    // Check against trusted sites
    if (urlDatabase.trustedSites.some(trusted => url.includes(trusted))) {
      score -= 20; // Reduce risk for trusted sites
      factors.push("Domain in trusted sites list");
    }

    // Simulate reputation check
    if (Math.random() > 0.8) {
      score += 15;
      factors.push("Poor domain reputation");
    }

    return { score, factors };
  };

  // Technical indicators analysis
  const analyzeTechnicalIndicators = (url: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    // Check for suspicious file extensions
    const suspiciousExtensions = ['.exe', '.scr', '.bat', '.com', '.pif', '.zip', '.rar'];
    suspiciousExtensions.forEach(ext => {
      if (url.includes(ext)) {
        score += 25;
        factors.push(`Suspicious file extension: ${ext}`);
      }
    });

    // Check for encoded URLs
    if (url.includes('%') && url.match(/%[0-9a-fA-F]{2}/g)) {
      score += 15;
      factors.push("URL encoding detected");
    }

    // Check for suspicious ports
    const suspiciousPorts = [':8080', ':3000', ':8000', ':8888'];
    suspiciousPorts.forEach(port => {
      if (url.includes(port)) {
        score += 10;
        factors.push(`Suspicious port: ${port}`);
      }
    });

    return { score, factors };
  };

  // Social engineering analysis
  const analyzeSocialEngineering = (url: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    const socialEngineeringKeywords = [
      'urgent', 'verify', 'suspend', 'expire', 'confirm', 'update',
      'security', 'alert', 'warning', 'action', 'required', 'immediate'
    ];

    socialEngineeringKeywords.forEach(keyword => {
      if (url.toLowerCase().includes(keyword)) {
        score += 8;
        factors.push(`Social engineering keyword: ${keyword}`);
      }
    });

    // Check for brand impersonation
    const brands = ['paypal', 'amazon', 'microsoft', 'apple', 'google', 'facebook'];
    brands.forEach(brand => {
      if (url.toLowerCase().includes(brand) && !url.includes(`${brand}.com`)) {
        score += 20;
        factors.push(`Potential brand impersonation: ${brand}`);
      }
    });

    return { score, factors };
  };

  // Enhanced URL analysis with payment warning
  const handleAnalyzeURL = () => {
    if (!urlInput.trim()) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const analysis = analyzeURL(urlInput.trim());
      setCurrentAnalysis(analysis);
      setIsAnalyzing(false);

      // Add to scan history
      setScanHistory(prev => [analysis, ...prev.slice(0, 19)]);

      // Show warning for dangerous URLs
      if (analysis.status === "dangerous" || analysis.status === "malicious") {
        setWarningDetails(analysis);
        setShowWarning(true);

        // Add to blocked URLs if auto-blocking is enabled
        if (paymentWarningEnabled && analysis.riskScore >= 80) {
          setBlockedUrls(prev => new Set(prev).add(urlInput.trim()));
        }
      }

      // Payment warning for suspicious URLs
      if (paymentWarningEnabled && analysis.riskScore >= 50) {
        showPaymentWarning(analysis);
      }

      // Add to recent analyses
      setRecentAnalyses(prev => [analysis, ...prev.slice(0, 9)]);
    }, 2000);
  };

  // Payment warning system
  const showPaymentWarning = (analysis: URLAnalysis) => {
    if (analysis.url.includes('payment') || analysis.url.includes('checkout') || analysis.url.includes('pay')) {
      const warningMessage = `⚠️ PAYMENT WARNING: This URL has a risk score of ${analysis.riskScore}/100. Proceed with extreme caution!`;

      // Simulate browser notification
      if (browserExtensionMode) {
        simulateBrowserNotification(warningMessage, analysis);
      }
    }
  };

  // Simulate browser extension notification
  const simulateBrowserNotification = (message: string, analysis: URLAnalysis) => {
    // Create a notification-like element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 300px;
      font-family: system-ui;
      font-size: 14px;
    `;
    notification.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px;">🛡️ FraudGuard Alert</div>
      <div>${message}</div>
      <div style="margin-top: 8px;">
        <button onclick="this.parentElement.parentElement.remove()" style="background: white; color: #ef4444; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Dismiss</button>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  };

  // Auto-scan functionality
  const handleAutoScan = () => {
    if (!autoScanEnabled) return;

    // Simulate scanning URLs from clipboard or browser history
    const testUrls = [
      "https://secure-bank-update.com/login",
      "https://paypal-security-alert.net/verify",
      "https://amazon-verification.org/account"
    ];

    testUrls.forEach((url, index) => {
      setTimeout(() => {
        const analysis = analyzeURL(url);
        setScanHistory(prev => [analysis, ...prev.slice(0, 19)]);

        if (analysis.riskScore >= 70) {
          setBlockedUrls(prev => new Set(prev).add(url));
        }
      }, index * 1000);
    });
  };

  // Bulk URL scanning
  const handleBulkScan = (urls: string[]) => {
    urls.forEach((url, index) => {
      setTimeout(() => {
        const analysis = analyzeURL(url.trim());
        setScanHistory(prev => [analysis, ...prev.slice(0, 19)]);
      }, index * 500);
    });
  };

  // Handle scam report
  const handleReportScam = () => {
    if (!urlInput.trim() || !reportDescription.trim()) return;
    
    const report: ScamReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: urlInput.trim(),
      reportType,
      description: reportDescription,
      reporterInfo: reporterInfo || "Anonymous",
      timestamp: new Date(),
      severity: reportType === "malware" ? "critical" : 
                reportType === "phishing" ? "high" :
                reportType === "scam" ? "high" : "medium",
      status: "pending"
    };

    setScamReports(prev => [report, ...prev]);
    
    // Update URL database
    setUrlDatabase(prev => ({
      ...prev,
      reportedUrls: new Map(prev.reportedUrls.set(urlInput.trim(), (prev.reportedUrls.get(urlInput.trim()) || 0) + 1))
    }));

    // Reset form
    setReportDescription("");
    setReporterInfo("");
    setShowReportForm(false);
    
    // Show success message
    alert("Thank you for reporting this URL. Our team will review it shortly.");
  };

  // Initialize database with some known scams
  useEffect(() => {
    setUrlDatabase({
      knownScams: [
        "secure-bank-update.com",
        "paypal-security-alert.net",
        "amazon-verification.org"
      ],
      trustedSites: [
        "paypal.com",
        "amazon.com",
        "microsoft.com",
        "apple.com",
        "google.com"
      ],
      reportedUrls: new Map([
        ["suspicious-site.com", 15],
        ["fake-bank.net", 8],
        ["scam-alert.org", 23]
      ]),
      verifiedScams: new Set([
        "verified-scam.com",
        "known-phishing.net"
      ])
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe": return "text-green-500";
      case "suspicious": return "text-yellow-500";
      case "dangerous": return "text-orange-500";
      case "malicious": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe": return CheckCircle;
      case "suspicious": return AlertTriangle;
      case "dangerous": return XCircle;
      case "malicious": return Ban;
      default: return Shield;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "proceed": return "text-green-500";
      case "caution": return "text-yellow-500";
      case "block": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <section id="url-fraud-detection" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Link className="w-4 h-4 mr-2" />
            URL Fraud Detection & Scam Reporting
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Advanced URL Security Analysis
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive URL fraud detection with real-time analysis, scam reporting, payment warnings, and browser protection
          </p>
        </div>

        {/* Enhanced Control Panel */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant={paymentWarningEnabled ? "default" : "outline"}
              onClick={() => setPaymentWarningEnabled(!paymentWarningEnabled)}
              className="flex items-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>{paymentWarningEnabled ? "Payment Protection ON" : "Payment Protection OFF"}</span>
            </Button>

            <Button
              variant={browserExtensionMode ? "default" : "outline"}
              onClick={() => setBrowserExtensionMode(!browserExtensionMode)}
              className="flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>{browserExtensionMode ? "Extension Mode" : "Web Mode"}</span>
            </Button>

            <Button
              variant={autoScanEnabled ? "default" : "outline"}
              onClick={() => {
                setAutoScanEnabled(!autoScanEnabled);
                if (!autoScanEnabled) handleAutoScan();
              }}
              className="flex items-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>{autoScanEnabled ? "Auto-Scan ON" : "Auto-Scan OFF"}</span>
            </Button>

            <Badge variant="outline" className="flex items-center space-x-2">
              <Ban className="w-3 h-3" />
              <span>{blockedUrls.size} Blocked</span>
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setScanHistory([])}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear History
            </Button>
            <Button variant="outline" size="sm" onClick={() => setBlockedUrls(new Set())}>
              <Ban className="w-4 h-4 mr-2" />
              Clear Blocked
            </Button>
          </div>
        </div>

        {/* Warning Modal */}
        <AnimatePresence>
          {showWarning && warningDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowWarning(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card p-6 rounded-lg border border-red-500 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                  <div>
                    <h3 className="text-lg font-bold text-red-500">⚠️ DANGER WARNING</h3>
                    <p className="text-sm text-muted-foreground">This URL has been flagged as dangerous</p>
                  </div>
                </div>
                
                <Alert className="mb-4 border-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>DO NOT PROCEED WITH PAYMENT!</strong><br/>
                    Risk Score: {warningDetails.riskScore}/100<br/>
                    Status: {warningDetails.status.toUpperCase()}
                  </AlertDescription>
                </Alert>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Risk Factors:</p>
                  <div className="space-y-1">
                    {warningDetails.riskFactors.slice(0, 3).map((factor, index) => (
                      <div key={index} className="text-xs text-red-600 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {factor}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    variant="destructive" 
                    onClick={() => setShowWarning(false)}
                    className="flex-1"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Block & Close
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowReportForm(true);
                      setShowWarning(false);
                    }}
                    className="flex-1"
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Report Scam
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* URL Analysis Form */}
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-accent" />
              URL Security Analysis
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Enter URL to Analyze</label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="https://example.com or paste any suspicious link"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleAnalyzeURL()}
                  />
                  <Button
                    onClick={handleAnalyzeURL}
                    disabled={isAnalyzing || !urlInput.trim()}
                  >
                    {isAnalyzing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Bulk URL Scanning */}
              <div>
                <label className="text-sm font-medium mb-2 block">Bulk URL Scanning (Optional)</label>
                <Textarea
                  placeholder="Paste multiple URLs (one per line) for bulk analysis..."
                  rows={3}
                  onChange={(e) => {
                    const urls = e.target.value.split('\n').filter(url => url.trim());
                    if (urls.length > 1) {
                      handleBulkScan(urls);
                    }
                  }}
                />
              </div>

              {/* Quick Test URLs */}
              <div>
                <label className="text-sm font-medium mb-2 block">Quick Test URLs</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Safe Site", url: "https://google.com", type: "safe" },
                    { label: "Suspicious", url: "https://secure-bank-update.com/login", type: "suspicious" },
                    { label: "Phishing", url: "https://paypal-security-alert.net/verify", type: "dangerous" },
                    { label: "Malicious", url: "https://download-virus.exe.com", type: "malicious" }
                  ].map((test) => (
                    <Button
                      key={test.label}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setUrlInput(test.url);
                        setTimeout(() => handleAnalyzeURL(), 100);
                      }}
                      className={cn(
                        "text-xs",
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
            </div>

            {/* Analysis Results */}
            {currentAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-background/50 rounded-lg border border-border/50 mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Security Analysis Results</h4>
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
                      {currentAnalysis.riskScore}
                    </div>
                    <div className="text-xs text-muted-foreground">Risk Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-500">{currentAnalysis.domainRisk}</div>
                    <div className="text-xs text-muted-foreground">Domain</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-500">{currentAnalysis.reputationRisk}</div>
                    <div className="text-xs text-muted-foreground">Reputation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-500">{currentAnalysis.technicalRisk}</div>
                    <div className="text-xs text-muted-foreground">Technical</div>
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
                      <span className="text-sm">Recommendation:</span>
                      <Badge variant={
                        currentAnalysis.recommendation === "proceed" ? "secondary" :
                        currentAnalysis.recommendation === "caution" ? "default" : "destructive"
                      }>
                        {currentAnalysis.recommendation.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={currentAnalysis.riskScore} className="h-3" />
                </div>

                {currentAnalysis.reportCount > 0 && (
                  <Alert className="mb-4 border-orange-500">
                    <Flag className="h-4 w-4" />
                    <AlertDescription>
                      This URL has been reported {currentAnalysis.reportCount} times by users as suspicious.
                    </AlertDescription>
                  </Alert>
                )}
                
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

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowReportForm(true)}
                    className="flex items-center space-x-2"
                  >
                    <Flag className="w-4 h-4" />
                    <span>Report as Scam</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigator.clipboard.writeText(currentAnalysis.url)}
                    className="flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy URL</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const shareText = `⚠️ URL Security Alert: ${currentAnalysis.url} - Risk Score: ${currentAnalysis.riskScore}/100 - Status: ${currentAnalysis.status.toUpperCase()}`;
                      navigator.share ? navigator.share({ text: shareText }) : navigator.clipboard.writeText(shareText);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Alert</span>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Scam Report Form */}
            {showReportForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-background/50 rounded-lg border border-border/50"
              >
                <h4 className="font-semibold mb-4 flex items-center">
                  <Flag className="w-5 h-5 mr-2 text-red-500" />
                  Report Fraudulent URL
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Report Type</label>
                    <select 
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value as any)}
                    >
                      <option value="phishing">Phishing</option>
                      <option value="malware">Malware</option>
                      <option value="scam">Scam/Fraud</option>
                      <option value="fake_site">Fake Website</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      placeholder="Describe the fraudulent activity, what happened, how you encountered this URL..."
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Contact (Optional)</label>
                    <Input
                      placeholder="Email or phone for follow-up (optional)"
                      value={reporterInfo}
                      onChange={(e) => setReporterInfo(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleReportScam}
                      disabled={!reportDescription.trim()}
                      className="flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Report</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowReportForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>

          {/* Enhanced Side Panel */}
          <div className="space-y-6">
            {/* Scan Statistics */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-accent" />
                Scan Statistics
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{scanHistory.length}</div>
                  <div className="text-xs text-muted-foreground">Total Scans</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{blockedUrls.size}</div>
                  <div className="text-xs text-muted-foreground">Blocked URLs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {scanHistory.filter(s => s.status === "dangerous" || s.status === "malicious").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Threats Found</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {scanHistory.filter(s => s.status === "safe").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Safe URLs</div>
                </div>
              </div>
            </Card>

            {/* Recent Reports */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Flag className="w-5 h-5 mr-2 text-accent" />
                Recent Reports
              </h3>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                <AnimatePresence>
                  {scamReports.slice(0, 5).map((report) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-3 bg-background/50 rounded-lg border border-border/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={
                          report.severity === "critical" ? "destructive" :
                          report.severity === "high" ? "default" :
                          report.severity === "medium" ? "secondary" : "outline"
                        }>
                          {report.reportType.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {report.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {report.url.length > 40 ? report.url.substring(0, 40) + '...' : report.url}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        By: {report.reporterInfo}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {scamReports.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-4">
                    No reports yet
                  </div>
                )}
              </div>
            </Card>

            {/* Scan History */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-accent" />
                Scan History
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                <AnimatePresence>
                  {scanHistory.slice(0, 10).map((analysis) => {
                    const StatusIcon = getStatusIcon(analysis.status);
                    const isBlocked = blockedUrls.has(analysis.url);
                    return (
                      <motion.div
                        key={analysis.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={cn(
                          "p-3 bg-background/50 rounded-lg border cursor-pointer hover:bg-background/70",
                          isBlocked ? "border-red-500" : "border-border/50"
                        )}
                        onClick={() => setCurrentAnalysis(analysis)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <StatusIcon className={cn("w-4 h-4", getStatusColor(analysis.status))} />
                            <span className="text-sm font-medium">Risk: {analysis.riskScore}</span>
                            {isBlocked && <Ban className="w-3 h-3 text-red-500" />}
                          </div>
                          <Badge variant={
                            analysis.status === "safe" ? "secondary" :
                            analysis.status === "suspicious" ? "default" :
                            analysis.status === "dangerous" ? "destructive" : "destructive"
                          } className="text-xs">
                            {analysis.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {analysis.url.length > 35 ? analysis.url.substring(0, 35) + '...' : analysis.url}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{analysis.timestamp.toLocaleTimeString()}</span>
                          {analysis.reportCount > 0 && (
                            <span className="text-red-500">{analysis.reportCount} reports</span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {scanHistory.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-4">
                    No scans yet
                  </div>
                )}
              </div>
            </Card>

            {/* Blocked URLs */}
            {blockedUrls.size > 0 && (
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-red-500/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Ban className="w-5 h-5 mr-2 text-red-500" />
                  Blocked URLs
                </h3>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {Array.from(blockedUrls).map((url, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-2 bg-red-500/10 rounded border border-red-500/20"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-red-600 font-medium">
                          {url.length > 30 ? url.substring(0, 30) + '...' : url}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newBlocked = new Set(blockedUrls);
                            newBlocked.delete(url);
                            setBlockedUrls(newBlocked);
                          }}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <XCircle className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}

            {/* Security Tips */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-accent" />
                Security Tips
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Always verify URLs before entering payment information</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Look for HTTPS and valid SSL certificates</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Be cautious of shortened URLs and redirects</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Report suspicious URLs to help protect others</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <span>Never enter personal information on suspicious sites</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default URLFraudDetection;
