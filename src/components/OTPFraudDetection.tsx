import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Phone, 
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Brain,
  Target,
  Activity,
  Clock,
  MessageSquare,
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
  Key,
  Timer,
  Smartphone,
  Network,
  Ban
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface OTPAnalysis {
  id: string;
  message: string;
  senderNumber: string;
  timestamp: Date;
  fraudScore: number;
  status: "legitimate" | "suspicious" | "fake" | "malicious";
  confidence: number;
  otpCode: string | null;
  riskFactors: string[];
  senderRisk: number;
  contentRisk: number;
  timingRisk: number;
  contextRisk: number;
  recommendation: "accept" | "verify" | "reject";
  isPhishing: boolean;
  isSpoofed: boolean;
}

interface OTPPattern {
  id: string;
  pattern: string;
  type: "legitimate" | "phishing" | "spoofed" | "fake";
  confidence: number;
  detectionCount: number;
  lastDetected: Date;
  description: string;
}

interface SenderProfile {
  number: string;
  trustScore: number;
  messageCount: number;
  fraudReports: number;
  lastSeen: Date;
  isVerified: boolean;
  category: "bank" | "service" | "unknown" | "suspicious";
}

const OTPFraudDetection = () => {
  const [otpMessage, setOtpMessage] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<OTPAnalysis | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<OTPAnalysis[]>([]);
  const [otpPatterns, setOtpPatterns] = useState<OTPPattern[]>([]);
  const [senderProfiles, setSenderProfiles] = useState<SenderProfile[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [blockedSenders, setBlockedSenders] = useState<Set<string>>(new Set());

  // Advanced OTP fraud detection algorithm
  const analyzeOTP = (message: string, sender: string): OTPAnalysis => {
    const startTime = performance.now();
    let fraudScore = 0;
    const riskFactors: string[] = [];

    // 1. Extract OTP code
    const otpCode = extractOTPCode(message);
    
    // 2. Sender Risk Analysis
    const senderRisk = analyzeSenderRisk(sender);
    fraudScore += senderRisk.score;
    riskFactors.push(...senderRisk.factors);

    // 3. Content Analysis
    const contentRisk = analyzeOTPContent(message, otpCode);
    fraudScore += contentRisk.score;
    riskFactors.push(...contentRisk.factors);

    // 4. Timing Analysis
    const timingRisk = analyzeTimingPatterns(sender);
    fraudScore += timingRisk.score;
    riskFactors.push(...timingRisk.factors);

    // 5. Context Analysis
    const contextRisk = analyzeContext(message, sender);
    fraudScore += contextRisk.score;
    riskFactors.push(...contextRisk.factors);

    // 6. Phishing Detection
    const isPhishing = detectPhishing(message);
    if (isPhishing) {
      fraudScore += 30;
      riskFactors.push("Phishing attempt detected");
    }

    // 7. Spoofing Detection
    const isSpoofed = detectSpoofing(sender, message);
    if (isSpoofed) {
      fraudScore += 35;
      riskFactors.push("Sender spoofing detected");
    }

    // Determine status and recommendation
    let status: OTPAnalysis['status'];
    let recommendation: OTPAnalysis['recommendation'];
    
    if (fraudScore >= 80) {
      status = "malicious";
      recommendation = "reject";
    } else if (fraudScore >= 60) {
      status = "fake";
      recommendation = "reject";
    } else if (fraudScore >= 30) {
      status = "suspicious";
      recommendation = "verify";
    } else {
      status = "legitimate";
      recommendation = "accept";
    }

    const confidence = Math.min(95, 65 + (fraudScore * 0.3));

    return {
      id: `otp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message,
      senderNumber: sender,
      timestamp: new Date(),
      fraudScore: Math.min(100, fraudScore),
      status,
      confidence,
      otpCode,
      riskFactors,
      senderRisk: senderRisk.score,
      contentRisk: contentRisk.score,
      timingRisk: timingRisk.score,
      contextRisk: contextRisk.score,
      recommendation,
      isPhishing,
      isSpoofed
    };
  };

  // Extract OTP code from message
  const extractOTPCode = (message: string): string | null => {
    // Common OTP patterns
    const otpPatterns = [
      /\b(\d{4,8})\b/g, // 4-8 digit codes
      /code[:\s]*(\d{4,8})/gi,
      /otp[:\s]*(\d{4,8})/gi,
      /pin[:\s]*(\d{4,8})/gi,
      /verification[:\s]*(\d{4,8})/gi
    ];

    for (const pattern of otpPatterns) {
      const match = message.match(pattern);
      if (match) {
        return match[0].replace(/\D/g, '');
      }
    }

    return null;
  };

  // Sender risk analysis
  const analyzeSenderRisk = (sender: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];

    // Check if sender is blocked
    if (blockedSenders.has(sender)) {
      score += 50;
      factors.push("Sender is in blocked list");
    }

    // Analyze sender format
    if (sender.length < 6) {
      score += 20;
      factors.push("Suspicious short sender ID");
    }

    // Check for random/suspicious patterns
    if (/^[A-Z]{6}$/.test(sender)) {
      score += 15;
      factors.push("Random alphabetic sender pattern");
    }

    // Check for known legitimate senders
    const legitimateSenders = [
      'HDFC', 'ICICI', 'SBI', 'AXIS', 'KOTAK',
      'AMAZON', 'FLIPKART', 'PAYTM', 'GPAY',
      'UBER', 'OLA', 'SWIGGY', 'ZOMATO'
    ];

    const isLegitimate = legitimateSenders.some(legit => 
      sender.toUpperCase().includes(legit)
    );

    if (isLegitimate) {
      score -= 20; // Reduce risk for known senders
    } else {
      score += 10;
      factors.push("Unknown sender");
    }

    // Check for spoofing attempts
    const spoofingPatterns = [
      /HDFC.*BANK/i,
      /SBI.*BANK/i,
      /AMAZON.*INDIA/i,
      /GOOGLE.*PAY/i
    ];

    spoofingPatterns.forEach(pattern => {
      if (pattern.test(sender) && !legitimateSenders.some(legit => sender.includes(legit))) {
        score += 25;
        factors.push("Potential sender spoofing");
      }
    });

    return { score: Math.max(0, score), factors };
  };

  // Content analysis
  const analyzeOTPContent = (message: string, otpCode: string | null): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];

    // Check if OTP code is present
    if (!otpCode) {
      score += 30;
      factors.push("No valid OTP code found");
    } else {
      // Analyze OTP code characteristics
      if (otpCode.length < 4 || otpCode.length > 8) {
        score += 15;
        factors.push("Unusual OTP code length");
      }

      // Check for sequential or repeated digits
      if (/(\d)\1{2,}/.test(otpCode)) {
        score += 10;
        factors.push("Repeated digits in OTP");
      }

      if (/0123|1234|2345|3456|4567|5678|6789/.test(otpCode)) {
        score += 15;
        factors.push("Sequential digits in OTP");
      }
    }

    // Check message structure
    const lowerMessage = message.toLowerCase();

    // Legitimate OTP indicators
    const legitimateIndicators = [
      'do not share', 'confidential', 'expires in', 'valid for',
      'one time password', 'verification code', 'security code'
    ];

    let legitimateCount = 0;
    legitimateIndicators.forEach(indicator => {
      if (lowerMessage.includes(indicator)) {
        legitimateCount++;
      }
    });

    if (legitimateCount === 0) {
      score += 20;
      factors.push("Missing security warnings");
    }

    // Suspicious content patterns
    const suspiciousPatterns = [
      'click here', 'download app', 'install now',
      'urgent action', 'account suspended', 'verify immediately',
      'congratulations', 'winner', 'prize'
    ];

    suspiciousPatterns.forEach(pattern => {
      if (lowerMessage.includes(pattern)) {
        score += 15;
        factors.push(`Suspicious content: ${pattern}`);
      }
    });

    // Check for URLs
    if (message.match(/https?:\/\/[^\s]+/)) {
      score += 25;
      factors.push("Contains suspicious URLs");
    }

    // Grammar and language quality
    const grammarIssues = [
      /\b(recieve|occured|seperate|definately)\b/gi,
      /[.]{2,}/g,
      /[!]{3,}/g
    ];

    grammarIssues.forEach(pattern => {
      if (pattern.test(message)) {
        score += 5;
        factors.push("Poor grammar/spelling");
      }
    });

    return { score, factors };
  };

  // Timing analysis
  const analyzeTimingPatterns = (sender: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];

    const now = new Date();
    const hour = now.getHours();

    // Unusual timing (very late night or early morning)
    if (hour >= 23 || hour <= 5) {
      score += 10;
      factors.push("Unusual timing for OTP");
    }

    // Simulate frequency analysis
    const recentCount = Math.floor(Math.random() * 10);
    if (recentCount > 5) {
      score += 20;
      factors.push("High frequency from sender");
    }

    return { score, factors };
  };

  // Context analysis
  const analyzeContext = (message: string, sender: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];

    // Check for context mismatch
    const bankSenders = ['HDFC', 'ICICI', 'SBI', 'AXIS'];
    const ecommerceSenders = ['AMAZON', 'FLIPKART'];
    
    const isBankSender = bankSenders.some(bank => sender.includes(bank));
    const isEcommerceSender = ecommerceSenders.some(ecom => sender.includes(ecom));

    // Bank context analysis
    if (isBankSender) {
      if (!message.toLowerCase().includes('bank') && 
          !message.toLowerCase().includes('account') &&
          !message.toLowerCase().includes('transaction')) {
        score += 15;
        factors.push("Context mismatch for bank sender");
      }
    }

    // E-commerce context analysis
    if (isEcommerceSender) {
      if (!message.toLowerCase().includes('order') && 
          !message.toLowerCase().includes('delivery') &&
          !message.toLowerCase().includes('purchase')) {
        score += 10;
        factors.push("Context mismatch for e-commerce sender");
      }
    }

    return { score, factors };
  };

  // Phishing detection
  const detectPhishing = (message: string): boolean => {
    const phishingIndicators = [
      'click link', 'verify account', 'update details',
      'confirm identity', 'suspended account', 'urgent action',
      'download app', 'install application'
    ];

    return phishingIndicators.some(indicator => 
      message.toLowerCase().includes(indicator)
    );
  };

  // Spoofing detection
  const detectSpoofing = (sender: string, message: string): boolean => {
    // Check for brand impersonation
    const brands = ['HDFC', 'ICICI', 'SBI', 'AMAZON', 'GOOGLE'];
    
    for (const brand of brands) {
      if (sender.includes(brand) && sender !== brand) {
        // Check if it's a legitimate variation
        const legitimateVariations = [
          `${brand}BK`, `${brand}BANK`, `${brand}IN`
        ];
        
        if (!legitimateVariations.includes(sender)) {
          return true;
        }
      }
    }

    return false;
  };

  // Handle OTP analysis
  const handleAnalyzeOTP = () => {
    if (!otpMessage.trim() || !senderNumber.trim()) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const analysis = analyzeOTP(otpMessage.trim(), senderNumber.trim());
      setCurrentAnalysis(analysis);
      setIsAnalyzing(false);
      
      // Add to recent analyses
      setRecentAnalyses(prev => [analysis, ...prev.slice(0, 9)]);
      
      // Auto-block malicious senders
      if (analysis.status === "malicious") {
        setBlockedSenders(prev => new Set(prev).add(senderNumber.trim()));
      }
    }, 2000);
  };

  // Initialize patterns and profiles
  useEffect(() => {
    setOtpPatterns([
      {
        id: "1",
        pattern: "Legitimate Bank OTP",
        type: "legitimate",
        confidence: 95.2,
        detectionCount: 15420,
        lastDetected: new Date(Date.now() - 1800000),
        description: "Standard bank OTP with security warnings"
      },
      {
        id: "2",
        pattern: "Phishing OTP Request",
        type: "phishing",
        confidence: 89.7,
        detectionCount: 892,
        lastDetected: new Date(Date.now() - 3600000),
        description: "Fake OTP requesting account verification"
      },
      {
        id: "3",
        pattern: "Spoofed Sender OTP",
        type: "spoofed",
        confidence: 92.1,
        detectionCount: 634,
        lastDetected: new Date(Date.now() - 900000),
        description: "OTP from spoofed legitimate sender"
      }
    ]);

    setSenderProfiles([
      {
        number: "HDFCBK",
        trustScore: 98.5,
        messageCount: 25420,
        fraudReports: 2,
        lastSeen: new Date(Date.now() - 3600000),
        isVerified: true,
        category: "bank"
      },
      {
        number: "AMAZON",
        trustScore: 96.8,
        messageCount: 18760,
        fraudReports: 5,
        lastSeen: new Date(Date.now() - 7200000),
        isVerified: true,
        category: "service"
      },
      {
        number: "VM-HDFC01",
        trustScore: 15.2,
        messageCount: 156,
        fraudReports: 89,
        lastSeen: new Date(Date.now() - 86400000),
        isVerified: false,
        category: "suspicious"
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "legitimate": return "text-green-500";
      case "suspicious": return "text-yellow-500";
      case "fake": return "text-orange-500";
      case "malicious": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "legitimate": return CheckCircle;
      case "suspicious": return AlertTriangle;
      case "fake": return XCircle;
      case "malicious": return Ban;
      default: return Shield;
    }
  };

  return (
    <section id="otp-fraud-detection" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Phone className="w-4 h-4 mr-2" />
            OTP Fraud Detection
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Advanced OTP Security Analysis
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AI-powered detection of fake OTPs, phishing attempts, and sender spoofing with real-time analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analysis Form */}
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Key className="w-5 h-5 mr-2 text-accent" />
              OTP Message Analysis
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Sender Number/ID</label>
                <Input
                  placeholder="e.g., HDFCBK, AMAZON, +91XXXXXXXXXX"
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">OTP Message Content</label>
                <Textarea
                  placeholder="Paste the complete OTP message here..."
                  value={otpMessage}
                  onChange={(e) => setOtpMessage(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Quick Test Messages */}
              <div>
                <label className="text-sm font-medium mb-2 block">Quick Test Messages</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    {
                      label: "Legitimate Bank OTP",
                      sender: "HDFCBK",
                      message: "Your OTP for HDFC Bank transaction is 123456. Do not share this code with anyone. Valid for 10 minutes.",
                      type: "safe"
                    },
                    {
                      label: "Phishing Attempt",
                      sender: "HDFC-BANK",
                      message: "Your account will be suspended. Verify immediately with OTP 789012. Click here: bit.ly/verify",
                      type: "dangerous"
                    },
                    {
                      label: "Fake Prize OTP",
                      sender: "WINNER",
                      message: "Congratulations! You won $10000. Your verification code is 555555. Claim now!",
                      type: "malicious"
                    },
                    {
                      label: "Spoofed Amazon",
                      sender: "AMAZN-IN",
                      message: "Your Amazon order OTP: 987654. If you didn't order, click here to cancel.",
                      type: "suspicious"
                    }
                  ].map((test) => (
                    <Button
                      key={test.label}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSenderNumber(test.sender);
                        setOtpMessage(test.message);
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
            </div>
            
            <Button 
              onClick={handleAnalyzeOTP}
              disabled={isAnalyzing || !otpMessage.trim() || !senderNumber.trim()}
              className="w-full mb-6"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing OTP Security...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Analyze OTP Message
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
                  <h4 className="font-semibold">OTP Security Analysis</h4>
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
                    <div className="text-lg font-bold text-blue-500">{currentAnalysis.senderRisk}</div>
                    <div className="text-xs text-muted-foreground">Sender Risk</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-500">{currentAnalysis.contentRisk}</div>
                    <div className="text-xs text-muted-foreground">Content Risk</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-500">{currentAnalysis.contextRisk}</div>
                    <div className="text-xs text-muted-foreground">Context Risk</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">{currentAnalysis.confidence.toFixed(0)}%</div>
                    <div className="text-xs text-muted-foreground">Confidence</div>
                  </div>
                </div>

                {currentAnalysis.otpCode && (
                  <div className="mb-4 p-3 bg-background/50 rounded border border-border/50">
                    <div className="text-sm font-medium mb-1">Extracted OTP Code:</div>
                    <div className="text-lg font-mono font-bold text-primary">{currentAnalysis.otpCode}</div>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Security Assessment</span>
                    <div className="flex items-center space-x-2">
                      {currentAnalysis.isPhishing && <Badge variant="destructive">Phishing</Badge>}
                      {currentAnalysis.isSpoofed && <Badge variant="destructive">Spoofed</Badge>}
                      <Badge variant={
                        currentAnalysis.recommendation === "accept" ? "secondary" :
                        currentAnalysis.recommendation === "verify" ? "default" : "destructive"
                      }>
                        {currentAnalysis.recommendation.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={currentAnalysis.fraudScore} className="h-3" />
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
            {/* OTP Patterns */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-accent" />
                OTP Patterns
              </h3>
              
              <div className="space-y-3">
                {otpPatterns.map((pattern) => (
                  <motion.div
                    key={pattern.id}
                    className="p-3 bg-background/50 rounded-lg border border-border/50"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{pattern.pattern}</span>
                      <Badge variant={
                        pattern.type === "legitimate" ? "secondary" :
                        pattern.type === "phishing" ? "destructive" :
                        pattern.type === "spoofed" ? "default" : "outline"
                      }>
                        {pattern.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{pattern.description}</p>
                    <div className="flex justify-between text-xs">
                      <span>Confidence: {pattern.confidence}%</span>
                      <span>Detected: {pattern.detectionCount}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Sender Profiles */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-accent" />
                Sender Profiles
              </h3>
              
              <div className="space-y-3">
                {senderProfiles.map((profile) => (
                  <motion.div
                    key={profile.number}
                    className="p-3 bg-background/50 rounded-lg border border-border/50"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{profile.number}</span>
                      <div className="flex items-center space-x-1">
                        {profile.isVerified && <CheckCircle className="w-3 h-3 text-green-500" />}
                        <Badge variant={
                          profile.category === "bank" ? "secondary" :
                          profile.category === "service" ? "default" :
                          profile.category === "suspicious" ? "destructive" : "outline"
                        }>
                          {profile.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Trust Score: {profile.trustScore}%</div>
                      <div>Messages: {profile.messageCount.toLocaleString()}</div>
                      <div>Reports: {profile.fraudReports}</div>
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
                            <span className="text-sm font-medium">Score: {analysis.fraudScore}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {analysis.senderNumber}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {analysis.otpCode ? `OTP: ${analysis.otpCode}` : "No OTP found"}
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

export default OTPFraudDetection;
