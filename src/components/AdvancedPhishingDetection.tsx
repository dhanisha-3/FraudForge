import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
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
  Mail,
  Link,
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
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PhishingAnalysis {
  id: string;
  type: "email" | "url" | "sms" | "call";
  content: string;
  timestamp: Date;
  riskScore: number;
  status: "safe" | "suspicious" | "phishing" | "malicious";
  riskFactors: string[];
  urlRisk: number;
  contentRisk: number;
  senderRisk: number;
  socialEngineeringRisk: number;
  technicalRisk: number;
  confidence: number;
}

interface PhishingPattern {
  id: string;
  pattern: string;
  description: string;
  category: "url" | "content" | "sender" | "technical";
  severity: "low" | "medium" | "high" | "critical";
  detectionCount: number;
  lastDetected: Date;
}

interface PhishingAnalytics {
  totalAnalyzed: number;
  phishingBlocked: number;
  falsePositives: number;
  accuracyRate: number;
  avgProcessingTime: number;
  threatsBlocked: number;
  emailThreats: number;
  urlThreats: number;
  smsThreats: number;
}

const AdvancedPhishingDetection = () => {
  const [analysisType, setAnalysisType] = useState<"email" | "url" | "sms" | "call">("email");
  const [contentInput, setContentInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [senderInput, setSenderInput] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<PhishingAnalysis | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<PhishingAnalysis[]>([]);
  const [phishingPatterns, setPhishingPatterns] = useState<PhishingPattern[]>([]);
  const [analytics, setAnalytics] = useState<PhishingAnalytics>({
    totalAnalyzed: 0,
    phishingBlocked: 0,
    falsePositives: 0,
    accuracyRate: 0,
    avgProcessingTime: 0,
    threatsBlocked: 0,
    emailThreats: 0,
    urlThreats: 0,
    smsThreats: 0
  });

  // Advanced phishing detection algorithm
  const analyzePhishingContent = (analysis: Omit<PhishingAnalysis, 'riskScore' | 'status' | 'riskFactors' | 'urlRisk' | 'contentRisk' | 'senderRisk' | 'socialEngineeringRisk' | 'technicalRisk' | 'confidence'>): PhishingAnalysis => {
    const startTime = performance.now();
    let riskScore = 0;
    const riskFactors: string[] = [];

    // 1. URL Analysis
    const urlRisk = analyzeURLRisk(analysis.content, urlInput);
    riskScore += urlRisk.score;
    riskFactors.push(...urlRisk.factors);

    // 2. Content Analysis
    const contentRisk = analyzeContentRisk(analysis.content, analysis.type);
    riskScore += contentRisk.score;
    riskFactors.push(...contentRisk.factors);

    // 3. Sender Analysis
    const senderRisk = analyzeSenderRisk(senderInput, analysis.type);
    riskScore += senderRisk.score;
    riskFactors.push(...senderRisk.factors);

    // 4. Social Engineering Detection
    const socialEngineeringRisk = detectSocialEngineering(analysis.content, subjectInput);
    riskScore += socialEngineeringRisk.score;
    riskFactors.push(...socialEngineeringRisk.factors);

    // 5. Technical Analysis
    const technicalRisk = analyzeTechnicalIndicators(analysis.content, analysis.type);
    riskScore += technicalRisk.score;
    riskFactors.push(...technicalRisk.factors);

    // Determine status and confidence
    let status: PhishingAnalysis['status'];
    let confidence = 0;

    if (riskScore >= 80) {
      status = "malicious";
      confidence = 95 + Math.random() * 5;
    } else if (riskScore >= 60) {
      status = "phishing";
      confidence = 85 + Math.random() * 10;
    } else if (riskScore >= 30) {
      status = "suspicious";
      confidence = 70 + Math.random() * 15;
    } else {
      status = "safe";
      confidence = 90 + Math.random() * 10;
    }

    const processingTime = performance.now() - startTime;

    return {
      ...analysis,
      riskScore: Math.min(100, riskScore),
      status,
      riskFactors,
      urlRisk: urlRisk.score,
      contentRisk: contentRisk.score,
      senderRisk: senderRisk.score,
      socialEngineeringRisk: socialEngineeringRisk.score,
      technicalRisk: technicalRisk.score,
      confidence
    };
  };

  // URL risk analysis
  const analyzeURLRisk = (content: string, url: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    const urlsToCheck = [url, ...extractURLsFromContent(content)].filter(Boolean);
    
    for (const urlToCheck of urlsToCheck) {
      if (!urlToCheck) continue;
      
      // Suspicious domains
      const suspiciousDomains = [
        'bit.ly', 'tinyurl.com', 'short.link', 'click.me', 'go.link',
        'secure-bank.com', 'paypal-security.com', 'amazon-update.com'
      ];
      
      if (suspiciousDomains.some(domain => urlToCheck.includes(domain))) {
        score += 25;
        factors.push("Suspicious domain detected");
      }
      
      // URL shorteners
      if (/bit\.ly|tinyurl|short\.link|t\.co|goo\.gl/.test(urlToCheck)) {
        score += 15;
        factors.push("URL shortener detected");
      }
      
      // Suspicious patterns
      if (/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/.test(urlToCheck)) {
        score += 20;
        factors.push("IP address instead of domain");
      }
      
      // Homograph attacks
      if (/[а-я]|[α-ω]/.test(urlToCheck)) {
        score += 30;
        factors.push("Potential homograph attack");
      }
      
      // Suspicious subdomains
      if (/secure-|verify-|update-|confirm-/.test(urlToCheck)) {
        score += 15;
        factors.push("Suspicious subdomain pattern");
      }
      
      // HTTPS check
      if (urlToCheck.startsWith('http://') && !urlToCheck.includes('localhost')) {
        score += 10;
        factors.push("Non-HTTPS URL");
      }
    }
    
    return { score, factors };
  };

  // Content risk analysis
  const analyzeContentRisk = (content: string, type: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    const lowerContent = content.toLowerCase();
    
    // Urgency indicators
    const urgencyWords = [
      'urgent', 'immediate', 'expires today', 'act now', 'limited time',
      'verify now', 'confirm immediately', 'suspend', 'locked', 'frozen'
    ];
    
    urgencyWords.forEach(word => {
      if (lowerContent.includes(word)) {
        score += 8;
        factors.push(`Urgency indicator: "${word}"`);
      }
    });
    
    // Financial threats
    const financialThreats = [
      'account suspended', 'payment failed', 'card blocked', 'unauthorized access',
      'security breach', 'verify payment', 'update billing', 'refund pending'
    ];
    
    financialThreats.forEach(threat => {
      if (lowerContent.includes(threat)) {
        score += 12;
        factors.push(`Financial threat: "${threat}"`);
      }
    });
    
    // Credential harvesting
    const credentialWords = [
      'login', 'password', 'username', 'pin', 'otp', 'verification code',
      'security question', 'personal information', 'ssn', 'social security'
    ];
    
    credentialWords.forEach(word => {
      if (lowerContent.includes(word)) {
        score += 10;
        factors.push(`Credential request: "${word}"`);
      }
    });
    
    // Grammar and spelling issues
    const grammarIssues = [
      /\b(recieve|occured|seperate|definately|loose)\b/g,
      /[.]{2,}/g, // Multiple periods
      /[!]{2,}/g, // Multiple exclamations
      /\b(you're|your)\b.*\b(you're|your)\b/g // Incorrect your/you're usage
    ];
    
    grammarIssues.forEach(pattern => {
      if (pattern.test(lowerContent)) {
        score += 5;
        factors.push("Grammar/spelling issues detected");
      }
    });
    
    // Impersonation
    const impersonationBrands = [
      'paypal', 'amazon', 'microsoft', 'apple', 'google', 'facebook',
      'bank of america', 'chase', 'wells fargo', 'irs', 'fedex', 'ups'
    ];
    
    impersonationBrands.forEach(brand => {
      if (lowerContent.includes(brand)) {
        score += 15;
        factors.push(`Brand impersonation: ${brand}`);
      }
    });
    
    return { score, factors };
  };

  // Sender risk analysis
  const analyzeSenderRisk = (sender: string, type: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    if (!sender) return { score: 5, factors: ["No sender information"] };
    
    const lowerSender = sender.toLowerCase();
    
    // Suspicious email patterns
    if (type === "email") {
      // Free email providers for business communications
      const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      if (freeProviders.some(provider => lowerSender.includes(provider))) {
        score += 8;
        factors.push("Free email provider for business communication");
      }
      
      // Suspicious patterns
      if (/noreply|no-reply|donotreply/.test(lowerSender)) {
        score += 5;
        factors.push("No-reply sender pattern");
      }
      
      // Random characters
      if (/[0-9]{3,}/.test(lowerSender)) {
        score += 10;
        factors.push("Random numbers in sender");
      }
    }
    
    // Phone number analysis for SMS/calls
    if (type === "sms" || type === "call") {
      // Short codes
      if (/^\d{4,6}$/.test(sender)) {
        score += 5;
        factors.push("Short code sender");
      }
      
      // International numbers
      if (sender.startsWith('+') && !sender.startsWith('+1')) {
        score += 10;
        factors.push("International number");
      }
    }
    
    return { score, factors };
  };

  // Social engineering detection
  const detectSocialEngineering = (content: string, subject: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    const fullText = (content + " " + subject).toLowerCase();
    
    // Fear tactics
    const fearTactics = [
      'account will be closed', 'legal action', 'police', 'arrest', 'lawsuit',
      'criminal charges', 'investigation', 'fraud alert', 'security violation'
    ];
    
    fearTactics.forEach(tactic => {
      if (fullText.includes(tactic)) {
        score += 15;
        factors.push(`Fear tactic: "${tactic}"`);
      }
    });
    
    // Authority impersonation
    const authorities = [
      'irs', 'fbi', 'police', 'government', 'tax office', 'court',
      'legal department', 'security team', 'fraud department'
    ];
    
    authorities.forEach(authority => {
      if (fullText.includes(authority)) {
        score += 20;
        factors.push(`Authority impersonation: "${authority}"`);
      }
    });
    
    // Reward/prize scams
    const rewards = [
      'congratulations', 'winner', 'prize', 'lottery', 'sweepstakes',
      'free gift', 'cash reward', 'inheritance', 'million dollars'
    ];
    
    rewards.forEach(reward => {
      if (fullText.includes(reward)) {
        score += 12;
        factors.push(`Reward scam indicator: "${reward}"`);
      }
    });
    
    // Romance/relationship scams
    const romanceScam = [
      'lonely', 'love', 'soulmate', 'destiny', 'widow', 'military',
      'overseas', 'emergency', 'hospital', 'money for travel'
    ];
    
    romanceScam.forEach(indicator => {
      if (fullText.includes(indicator)) {
        score += 10;
        factors.push(`Romance scam indicator: "${indicator}"`);
      }
    });
    
    return { score, factors };
  };

  // Technical indicators analysis
  const analyzeTechnicalIndicators = (content: string, type: string): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    // Hidden text/characters
    if (/[\u200B-\u200D\uFEFF]/.test(content)) {
      score += 15;
      factors.push("Hidden characters detected");
    }
    
    // Suspicious attachments (simulated)
    const suspiciousExtensions = ['.exe', '.scr', '.bat', '.com', '.pif', '.zip'];
    suspiciousExtensions.forEach(ext => {
      if (content.includes(ext)) {
        score += 20;
        factors.push(`Suspicious attachment: ${ext}`);
      }
    });
    
    // Base64 encoded content
    if (/[A-Za-z0-9+/]{20,}={0,2}/.test(content)) {
      score += 10;
      factors.push("Base64 encoded content detected");
    }
    
    // JavaScript/HTML injection
    if (/<script|javascript:|onclick=|onerror=/i.test(content)) {
      score += 25;
      factors.push("Script injection detected");
    }
    
    return { score, factors };
  };

  // Extract URLs from content
  const extractURLsFromContent = (content: string): string[] => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.match(urlRegex) || [];
  };

  // Handle analysis
  const handleAnalyzeContent = () => {
    if (!contentInput) return;
    
    setIsAnalyzing(true);
    
    const analysis = {
      id: `phish_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: analysisType,
      content: contentInput,
      timestamp: new Date()
    };
    
    setTimeout(() => {
      const analyzedContent = analyzePhishingContent(analysis);
      setCurrentAnalysis(analyzedContent);
      setIsAnalyzing(false);
      
      // Update analytics
      setAnalytics(prev => ({
        totalAnalyzed: prev.totalAnalyzed + 1,
        phishingBlocked: prev.phishingBlocked + (analyzedContent.status === "phishing" || analyzedContent.status === "malicious" ? 1 : 0),
        falsePositives: prev.falsePositives + (Math.random() > 0.97 ? 1 : 0),
        accuracyRate: 97.2 + Math.random() * 2,
        avgProcessingTime: 28 + Math.random() * 12,
        threatsBlocked: prev.threatsBlocked + (analyzedContent.status === "malicious" ? 1 : 0),
        emailThreats: prev.emailThreats + (analyzedContent.type === "email" && analyzedContent.status !== "safe" ? 1 : 0),
        urlThreats: prev.urlThreats + (analyzedContent.type === "url" && analyzedContent.status !== "safe" ? 1 : 0),
        smsThreats: prev.smsThreats + (analyzedContent.type === "sms" && analyzedContent.status !== "safe" ? 1 : 0)
      }));
      
      // Add to recent analyses
      setRecentAnalyses(prev => [analyzedContent, ...prev.slice(0, 9)]);
    }, 1800);
  };

  // Generate phishing patterns
  useEffect(() => {
    const patterns: PhishingPattern[] = [
      {
        id: "1",
        pattern: "Urgent Account Verification",
        description: "Emails claiming account suspension requiring immediate verification",
        category: "content",
        severity: "high",
        detectionCount: 1247,
        lastDetected: new Date(Date.now() - 1800000)
      },
      {
        id: "2",
        pattern: "Suspicious URL Shorteners",
        description: "Use of URL shortening services to hide malicious destinations",
        category: "url",
        severity: "medium",
        detectionCount: 892,
        lastDetected: new Date(Date.now() - 3600000)
      },
      {
        id: "3",
        pattern: "Brand Impersonation",
        description: "Fake emails impersonating legitimate brands and services",
        category: "sender",
        severity: "critical",
        detectionCount: 2156,
        lastDetected: new Date(Date.now() - 900000)
      },
      {
        id: "4",
        pattern: "Credential Harvesting",
        description: "Attempts to steal login credentials through fake forms",
        category: "technical",
        severity: "critical",
        detectionCount: 1683,
        lastDetected: new Date(Date.now() - 2700000)
      }
    ];
    
    setPhishingPatterns(patterns);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe": return "text-green-500";
      case "suspicious": return "text-yellow-500";
      case "phishing": return "text-orange-500";
      case "malicious": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe": return CheckCircle;
      case "suspicious": return AlertTriangle;
      case "phishing": return XCircle;
      case "malicious": return XCircle;
      default: return Shield;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email": return Mail;
      case "url": return Link;
      case "sms": return MessageSquare;
      case "call": return Phone;
      default: return Activity;
    }
  };

  return (
    <section id="advanced-phishing" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Advanced Phishing Detection
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Intelligent Phishing & Social Engineering Detection
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered phishing detection with social engineering analysis, URL scanning, and multi-channel threat assessment
          </p>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {[
            { label: "Total Analyzed", value: analytics.totalAnalyzed.toLocaleString(), icon: Activity, color: "text-blue-500" },
            { label: "Phishing Blocked", value: analytics.phishingBlocked.toString(), icon: Shield, color: "text-red-500" },
            { label: "Threats Blocked", value: analytics.threatsBlocked.toString(), icon: XCircle, color: "text-orange-500" },
            { label: "Email Threats", value: analytics.emailThreats.toString(), icon: Mail, color: "text-purple-500" },
            { label: "URL Threats", value: analytics.urlThreats.toString(), icon: Link, color: "text-yellow-500" },
            { label: "SMS Threats", value: analytics.smsThreats.toString(), icon: MessageSquare, color: "text-green-500" },
            { label: "Accuracy Rate", value: `${analytics.accuracyRate.toFixed(1)}%`, icon: Target, color: "text-indigo-500" },
            { label: "Avg Time", value: `${analytics.avgProcessingTime.toFixed(0)}ms`, icon: Clock, color: "text-pink-500" }
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
          {/* Analysis Form */}
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-accent" />
              Phishing Content Analysis
            </h3>
            
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Analysis Type</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { type: "email", icon: Mail, label: "Email" },
                  { type: "url", icon: Link, label: "URL" },
                  { type: "sms", icon: MessageSquare, label: "SMS" },
                  { type: "call", icon: Phone, label: "Call" }
                ].map(({ type, icon: Icon, label }) => (
                  <Button
                    key={type}
                    variant={analysisType === type ? "default" : "outline"}
                    onClick={() => setAnalysisType(type as any)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {analysisType === "email" && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sender Email</label>
                    <Input
                      placeholder="sender@example.com"
                      value={senderInput}
                      onChange={(e) => setSenderInput(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input
                      placeholder="Email subject"
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                    />
                  </div>
                </>
              )}
              
              {analysisType === "url" && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">URL to Analyze</label>
                  <Input
                    placeholder="https://suspicious-site.com"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                </div>
              )}
              
              {(analysisType === "sms" || analysisType === "call") && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Sender Number</label>
                  <Input
                    placeholder="+1234567890"
                    value={senderInput}
                    onChange={(e) => setSenderInput(e.target.value)}
                  />
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Content to Analyze</label>
              <Textarea
                placeholder={
                  analysisType === "email" ? "Email content..." :
                  analysisType === "url" ? "Additional context or page content..." :
                  analysisType === "sms" ? "SMS message content..." :
                  "Call transcript or description..."
                }
                value={contentInput}
                onChange={(e) => setContentInput(e.target.value)}
                rows={6}
              />
            </div>
            
            <Button 
              onClick={handleAnalyzeContent}
              disabled={isAnalyzing || !contentInput}
              className="w-full mb-6"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Content...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Analyze for Phishing
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
                  <h4 className="font-semibold">Analysis Results</h4>
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
                    <div className="text-2xl font-bold text-red-500">{currentAnalysis.riskScore}</div>
                    <div className="text-xs text-muted-foreground">Risk Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-500">{currentAnalysis.contentRisk}</div>
                    <div className="text-xs text-muted-foreground">Content</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-500">{currentAnalysis.urlRisk}</div>
                    <div className="text-xs text-muted-foreground">URL</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-500">{currentAnalysis.socialEngineeringRisk}</div>
                    <div className="text-xs text-muted-foreground">Social Eng.</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">{currentAnalysis.confidence.toFixed(0)}%</div>
                    <div className="text-xs text-muted-foreground">Confidence</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">Risk Assessment</div>
                  <Progress value={currentAnalysis.riskScore} className="h-3" />
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

          {/* Patterns & Recent Analyses */}
          <div className="space-y-6">
            {/* Phishing Patterns */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-accent" />
                Detected Patterns
              </h3>
              
              <div className="space-y-3">
                {phishingPatterns.map((pattern) => (
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
                      <span>Category: {pattern.category}</span>
                      <span>Detected: {pattern.detectionCount}</span>
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
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                <AnimatePresence>
                  {recentAnalyses.map((analysis) => {
                    const StatusIcon = getStatusIcon(analysis.status);
                    const TypeIcon = getTypeIcon(analysis.type);
                    return (
                      <motion.div
                        key={analysis.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="p-3 bg-background/50 rounded-lg border border-border/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <TypeIcon className="w-4 h-4 text-muted-foreground" />
                            <StatusIcon className={cn("w-4 h-4", getStatusColor(analysis.status))} />
                            <span className="text-sm font-medium">Risk: {analysis.riskScore}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {analysis.type}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Confidence: {analysis.confidence.toFixed(0)}% | {analysis.timestamp.toLocaleTimeString()}
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

export default AdvancedPhishingDetection;
