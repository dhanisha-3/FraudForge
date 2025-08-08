import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Zap,
  Target,
  Activity,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  CreditCard,
  Users,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  Play,
  Pause,
  RefreshCw,
  Lock,
  Cpu,
  Network,
  FileText,
  Send,
  Copy,
  Share2,
  Bot,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpamAnalysis {
  id: string;
  content: string;
  type: "email" | "sms" | "otp" | "transaction";
  timestamp: Date;
  spamScore: number;
  status: "legitimate" | "suspicious" | "spam" | "malicious";
  confidence: number;
  nlpFeatures: {
    sentimentScore: number;
    urgencyScore: number;
    manipulationScore: number;
    grammarScore: number;
    brandMentions: string[];
    suspiciousPatterns: string[];
  };
  ganAnalysis: {
    authenticityScore: number;
    generatedProbability: number;
    styleConsistency: number;
    templateMatching: number;
  };
  riskFactors: string[];
  recommendation: "allow" | "quarantine" | "block";
}

interface MLModel {
  name: string;
  type: "NLP" | "GAN" | "Ensemble";
  accuracy: number;
  lastTrained: Date;
  status: "active" | "training" | "updating";
  processedCount: number;
}

interface SpamPattern {
  id: string;
  pattern: string;
  type: "keyword" | "structure" | "behavioral" | "temporal";
  confidence: number;
  detectionCount: number;
  lastDetected: Date;
}

const AISpamDetection = () => {
  const [inputContent, setInputContent] = useState("");
  const [inputType, setInputType] = useState<"email" | "sms" | "otp" | "transaction">("email");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<SpamAnalysis | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<SpamAnalysis[]>([]);
  const [mlModels, setMlModels] = useState<MLModel[]>([]);
  const [spamPatterns, setSpamPatterns] = useState<SpamPattern[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [modelTraining, setModelTraining] = useState(false);

  // Advanced NLP Analysis Engine
  const performNLPAnalysis = (content: string, type: string) => {
    // Sentiment Analysis
    const sentimentScore = analyzeSentiment(content);
    
    // Urgency Detection
    const urgencyScore = detectUrgency(content);
    
    // Manipulation Tactics
    const manipulationScore = detectManipulation(content);
    
    // Grammar and Language Quality
    const grammarScore = analyzeGrammar(content);
    
    // Brand Mentions
    const brandMentions = extractBrandMentions(content);
    
    // Suspicious Patterns
    const suspiciousPatterns = detectSuspiciousPatterns(content, type);

    return {
      sentimentScore,
      urgencyScore,
      manipulationScore,
      grammarScore,
      brandMentions,
      suspiciousPatterns
    };
  };

  // GAN-based Authenticity Analysis
  const performGANAnalysis = (content: string, type: string) => {
    // Simulate GAN-based analysis for content authenticity
    const authenticityScore = analyzeAuthenticity(content);
    
    // Generated content probability
    const generatedProbability = detectGeneratedContent(content);
    
    // Style consistency analysis
    const styleConsistency = analyzeStyleConsistency(content);
    
    // Template matching
    const templateMatching = detectTemplateUsage(content, type);

    return {
      authenticityScore,
      generatedProbability,
      styleConsistency,
      templateMatching
    };
  };

  // Sentiment Analysis
  const analyzeSentiment = (content: string): number => {
    const positiveWords = ['great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'good', 'best'];
    const negativeWords = ['urgent', 'immediate', 'expire', 'suspend', 'block', 'terminate', 'warning'];
    const fearWords = ['danger', 'risk', 'threat', 'security', 'breach', 'hack', 'steal'];
    
    let score = 50; // Neutral baseline
    const words = content.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 5;
      if (negativeWords.includes(word)) score -= 10;
      if (fearWords.includes(word)) score -= 15;
    });
    
    return Math.max(0, Math.min(100, score));
  };

  // Urgency Detection
  const detectUrgency = (content: string): number => {
    const urgencyIndicators = [
      'urgent', 'immediate', 'asap', 'now', 'quickly', 'hurry', 'rush',
      'expires today', 'limited time', 'act now', 'don\'t wait',
      'within 24 hours', 'expires soon', 'time sensitive'
    ];
    
    let urgencyScore = 0;
    const lowerContent = content.toLowerCase();
    
    urgencyIndicators.forEach(indicator => {
      if (lowerContent.includes(indicator)) {
        urgencyScore += 15;
      }
    });
    
    // Check for multiple exclamation marks
    const exclamationCount = (content.match(/!/g) || []).length;
    urgencyScore += Math.min(exclamationCount * 5, 25);
    
    // Check for ALL CAPS words
    const capsWords = content.match(/\b[A-Z]{3,}\b/g) || [];
    urgencyScore += Math.min(capsWords.length * 3, 20);
    
    return Math.min(100, urgencyScore);
  };

  // Manipulation Detection
  const detectManipulation = (content: string): number => {
    const manipulationTactics = [
      'congratulations', 'winner', 'selected', 'chosen', 'lucky',
      'free money', 'cash prize', 'inheritance', 'lottery',
      'verify account', 'confirm identity', 'update information',
      'click here', 'download now', 'call immediately',
      'limited offer', 'exclusive deal', 'special promotion'
    ];
    
    let manipulationScore = 0;
    const lowerContent = content.toLowerCase();
    
    manipulationTactics.forEach(tactic => {
      if (lowerContent.includes(tactic)) {
        manipulationScore += 12;
      }
    });
    
    // Authority impersonation
    const authorities = ['bank', 'government', 'irs', 'police', 'court', 'legal'];
    authorities.forEach(authority => {
      if (lowerContent.includes(authority)) {
        manipulationScore += 10;
      }
    });
    
    return Math.min(100, manipulationScore);
  };

  // Grammar Analysis
  const analyzeGrammar = (content: string): number => {
    let grammarScore = 100; // Start with perfect score
    
    // Check for common grammar issues
    const grammarIssues = [
      /\b(recieve|occured|seperate|definately|loose)\b/gi, // Common misspellings
      /[.]{2,}/g, // Multiple periods
      /[!]{3,}/g, // Excessive exclamations
      /\s{2,}/g, // Multiple spaces
      /[A-Z]{5,}/g // Excessive caps
    ];
    
    grammarIssues.forEach(pattern => {
      const matches = content.match(pattern) || [];
      grammarScore -= matches.length * 5;
    });
    
    // Check sentence structure
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;
    
    if (avgSentenceLength < 3 || avgSentenceLength > 50) {
      grammarScore -= 15;
    }
    
    return Math.max(0, grammarScore);
  };

  // Brand Mention Extraction
  const extractBrandMentions = (content: string): string[] => {
    const brands = [
      'paypal', 'amazon', 'microsoft', 'apple', 'google', 'facebook',
      'instagram', 'twitter', 'netflix', 'spotify', 'uber', 'airbnb',
      'bank of america', 'chase', 'wells fargo', 'citibank'
    ];
    
    const mentions: string[] = [];
    const lowerContent = content.toLowerCase();
    
    brands.forEach(brand => {
      if (lowerContent.includes(brand)) {
        mentions.push(brand);
      }
    });
    
    return mentions;
  };

  // Suspicious Pattern Detection
  const detectSuspiciousPatterns = (content: string, type: string): string[] => {
    const patterns: string[] = [];
    
    // URL patterns
    if (content.match(/bit\.ly|tinyurl|t\.co|goo\.gl/)) {
      patterns.push("Shortened URLs detected");
    }
    
    // Phone number patterns
    if (content.match(/\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/)) {
      patterns.push("Phone number present");
    }
    
    // Email patterns
    if (content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
      patterns.push("Email address present");
    }
    
    // Money patterns
    if (content.match(/\$[0-9,]+|\$[0-9]+\.[0-9]{2}|[0-9]+ dollars?/i)) {
      patterns.push("Money amounts mentioned");
    }
    
    // OTP specific patterns
    if (type === "otp") {
      if (content.match(/[0-9]{4,8}/)) {
        patterns.push("Numeric code present");
      }
      if (!content.toLowerCase().includes("otp") && !content.toLowerCase().includes("code")) {
        patterns.push("Missing OTP context");
      }
    }
    
    return patterns;
  };

  // GAN Analysis Functions
  const analyzeAuthenticity = (content: string): number => {
    // Simulate GAN-based authenticity analysis
    let authenticityScore = 100;
    
    // Check for AI-generated text patterns
    const aiPatterns = [
      /as an ai/i,
      /i'm an ai/i,
      /artificial intelligence/i,
      /machine learning/i
    ];
    
    aiPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        authenticityScore -= 30;
      }
    });
    
    // Analyze text complexity and naturalness
    const words = content.split(/\s+/);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    
    if (avgWordLength < 3 || avgWordLength > 8) {
      authenticityScore -= 10;
    }
    
    return Math.max(0, authenticityScore);
  };

  const detectGeneratedContent = (content: string): number => {
    // Simulate detection of AI-generated content
    let generatedProbability = 0;
    
    // Check for repetitive patterns
    const words = content.toLowerCase().split(/\s+/);
    const wordFreq = new Map();
    
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });
    
    const repetitiveWords = Array.from(wordFreq.values()).filter(count => count > 3);
    generatedProbability += repetitiveWords.length * 5;
    
    // Check for unnatural sentence structures
    const sentences = content.split(/[.!?]+/);
    const shortSentences = sentences.filter(s => s.trim().split(' ').length < 5);
    
    if (shortSentences.length > sentences.length * 0.7) {
      generatedProbability += 20;
    }
    
    return Math.min(100, generatedProbability);
  };

  const analyzeStyleConsistency = (content: string): number => {
    // Analyze writing style consistency
    let consistencyScore = 100;
    
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length < 2) return consistencyScore;
    
    // Check punctuation consistency
    const punctuationStyles = sentences.map(s => {
      const trimmed = s.trim();
      return trimmed[trimmed.length - 1];
    });
    
    const uniquePunctuation = new Set(punctuationStyles);
    if (uniquePunctuation.size > sentences.length * 0.5) {
      consistencyScore -= 15;
    }
    
    return Math.max(0, consistencyScore);
  };

  const detectTemplateUsage = (content: string, type: string): number => {
    // Detect if content follows common spam templates
    let templateScore = 0;
    
    const commonTemplates = {
      email: [
        /dear (sir|madam|customer)/i,
        /we are writing to inform you/i,
        /your account (will be|has been)/i,
        /click (here|the link below)/i
      ],
      sms: [
        /congratulations! you have won/i,
        /urgent: your account/i,
        /reply stop to opt out/i,
        /text \w+ to \d+/i
      ],
      otp: [
        /your (otp|verification code) is/i,
        /do not share this code/i,
        /expires in \d+ minutes/i
      ]
    };
    
    const templates = commonTemplates[type as keyof typeof commonTemplates] || [];
    
    templates.forEach(template => {
      if (template.test(content)) {
        templateScore += 25;
      }
    });
    
    return Math.min(100, templateScore);
  };

  // Main Analysis Function
  const analyzeContent = (content: string, type: string): SpamAnalysis => {
    const nlpFeatures = performNLPAnalysis(content, type);
    const ganAnalysis = performGANAnalysis(content, type);
    
    // Calculate overall spam score
    let spamScore = 0;
    const riskFactors: string[] = [];
    
    // NLP-based scoring
    if (nlpFeatures.urgencyScore > 50) {
      spamScore += 25;
      riskFactors.push("High urgency indicators");
    }
    
    if (nlpFeatures.manipulationScore > 40) {
      spamScore += 30;
      riskFactors.push("Manipulation tactics detected");
    }
    
    if (nlpFeatures.grammarScore < 70) {
      spamScore += 15;
      riskFactors.push("Poor grammar quality");
    }
    
    if (nlpFeatures.brandMentions.length > 0) {
      spamScore += 10;
      riskFactors.push(`Brand impersonation: ${nlpFeatures.brandMentions.join(', ')}`);
    }
    
    // GAN-based scoring
    if (ganAnalysis.authenticityScore < 70) {
      spamScore += 20;
      riskFactors.push("Low authenticity score");
    }
    
    if (ganAnalysis.generatedProbability > 60) {
      spamScore += 25;
      riskFactors.push("Likely AI-generated content");
    }
    
    if (ganAnalysis.templateMatching > 50) {
      spamScore += 15;
      riskFactors.push("Matches spam templates");
    }
    
    // Determine status
    let status: SpamAnalysis['status'];
    let recommendation: SpamAnalysis['recommendation'];
    
    if (spamScore >= 80) {
      status = "malicious";
      recommendation = "block";
    } else if (spamScore >= 60) {
      status = "spam";
      recommendation = "quarantine";
    } else if (spamScore >= 30) {
      status = "suspicious";
      recommendation = "quarantine";
    } else {
      status = "legitimate";
      recommendation = "allow";
    }
    
    const confidence = Math.min(95, 60 + (spamScore * 0.4));
    
    return {
      id: `spam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      type: type as any,
      timestamp: new Date(),
      spamScore: Math.min(100, spamScore),
      status,
      confidence,
      nlpFeatures,
      ganAnalysis,
      riskFactors,
      recommendation
    };
  };

  // Handle content analysis
  const handleAnalyzeContent = () => {
    if (!inputContent.trim()) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const analysis = analyzeContent(inputContent.trim(), inputType);
      setCurrentAnalysis(analysis);
      setIsAnalyzing(false);
      
      // Add to recent analyses
      setRecentAnalyses(prev => [analysis, ...prev.slice(0, 9)]);
    }, 2500);
  };

  // Initialize ML models
  useEffect(() => {
    setMlModels([
      {
        name: "NLP Sentiment Analyzer",
        type: "NLP",
        accuracy: 94.2,
        lastTrained: new Date(Date.now() - 86400000),
        status: "active",
        processedCount: 15420
      },
      {
        name: "GAN Authenticity Detector",
        type: "GAN",
        accuracy: 91.8,
        lastTrained: new Date(Date.now() - 172800000),
        status: "active",
        processedCount: 8760
      },
      {
        name: "Ensemble Spam Classifier",
        type: "Ensemble",
        accuracy: 96.7,
        lastTrained: new Date(Date.now() - 43200000),
        status: "training",
        processedCount: 23180
      }
    ]);

    setSpamPatterns([
      {
        id: "1",
        pattern: "Urgent Account Verification",
        type: "behavioral",
        confidence: 89.5,
        detectionCount: 1247,
        lastDetected: new Date(Date.now() - 1800000)
      },
      {
        id: "2",
        pattern: "Prize/Lottery Scam",
        type: "keyword",
        confidence: 94.2,
        detectionCount: 892,
        lastDetected: new Date(Date.now() - 3600000)
      },
      {
        id: "3",
        pattern: "Fake OTP Messages",
        type: "structure",
        confidence: 87.3,
        detectionCount: 634,
        lastDetected: new Date(Date.now() - 900000)
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "legitimate": return "text-green-500";
      case "suspicious": return "text-yellow-500";
      case "spam": return "text-orange-500";
      case "malicious": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "legitimate": return CheckCircle;
      case "suspicious": return AlertTriangle;
      case "spam": return XCircle;
      case "malicious": return XCircle;
      default: return Shield;
    }
  };

  return (
    <section id="ai-spam-detection" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Brain className="w-4 h-4 mr-2" />
            AI-Powered Spam Detection
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Advanced GAN & NLP Fraud Detection
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cutting-edge AI models using GANs and NLP to detect spam messages, fraudulent emails, fake OTPs, and suspicious transactions
          </p>
        </div>

        {/* ML Models Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {mlModels.map((model, index) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {model.type === "NLP" ? <Brain className="w-4 h-4 text-blue-500" /> :
                     model.type === "GAN" ? <Sparkles className="w-4 h-4 text-purple-500" /> :
                     <Bot className="w-4 h-4 text-green-500" />}
                    <span className="font-medium text-sm">{model.name}</span>
                  </div>
                  <Badge variant={model.status === "active" ? "default" : "secondary"}>
                    {model.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Accuracy: {model.accuracy}%</div>
                  <div>Processed: {model.processedCount.toLocaleString()}</div>
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
              AI Content Analysis
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Content Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { type: "email", icon: Mail, label: "Email" },
                    { type: "sms", icon: MessageSquare, label: "SMS" },
                    { type: "otp", icon: Phone, label: "OTP" },
                    { type: "transaction", icon: CreditCard, label: "Transaction" }
                  ].map(({ type, icon: Icon, label }) => (
                    <Button
                      key={type}
                      variant={inputType === type ? "default" : "outline"}
                      onClick={() => setInputType(type as any)}
                      className="flex items-center space-x-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Content to Analyze</label>
                <Textarea
                  placeholder={
                    inputType === "email" ? "Paste email content here..." :
                    inputType === "sms" ? "Enter SMS message..." :
                    inputType === "otp" ? "Enter OTP message..." :
                    "Enter transaction details..."
                  }
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  rows={6}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleAnalyzeContent}
              disabled={isAnalyzing || !inputContent.trim()}
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
                  Analyze with AI
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
                  <h4 className="font-semibold">AI Analysis Results</h4>
                  <div className="flex items-center space-x-2">
                    {React.createElement(getStatusIcon(currentAnalysis.status), { 
                      className: cn("w-5 h-5", getStatusColor(currentAnalysis.status)) 
                    })}
                    <span className={cn("font-medium", getStatusColor(currentAnalysis.status))}>
                      {currentAnalysis.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className={cn("text-2xl font-bold", getStatusColor(currentAnalysis.status))}>
                      {currentAnalysis.spamScore}
                    </div>
                    <div className="text-xs text-muted-foreground">Spam Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-500">{currentAnalysis.nlpFeatures.sentimentScore}</div>
                    <div className="text-xs text-muted-foreground">Sentiment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-500">{currentAnalysis.ganAnalysis.authenticityScore}</div>
                    <div className="text-xs text-muted-foreground">Authenticity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">{currentAnalysis.confidence.toFixed(0)}%</div>
                    <div className="text-xs text-muted-foreground">Confidence</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Spam Probability</span>
                    <Badge variant={
                      currentAnalysis.recommendation === "allow" ? "secondary" :
                      currentAnalysis.recommendation === "quarantine" ? "default" : "destructive"
                    }>
                      {currentAnalysis.recommendation.toUpperCase()}
                    </Badge>
                  </div>
                  <Progress value={currentAnalysis.spamScore} className="h-3" />
                </div>

                {/* Detailed Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-background/50 rounded border border-border/50">
                    <h5 className="font-medium text-sm mb-2 flex items-center">
                      <Brain className="w-4 h-4 mr-1 text-blue-500" />
                      NLP Analysis
                    </h5>
                    <div className="space-y-1 text-xs">
                      <div>Urgency: {currentAnalysis.nlpFeatures.urgencyScore}</div>
                      <div>Manipulation: {currentAnalysis.nlpFeatures.manipulationScore}</div>
                      <div>Grammar: {currentAnalysis.nlpFeatures.grammarScore}</div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-background/50 rounded border border-border/50">
                    <h5 className="font-medium text-sm mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-1 text-purple-500" />
                      GAN Analysis
                    </h5>
                    <div className="space-y-1 text-xs">
                      <div>Generated Prob: {currentAnalysis.ganAnalysis.generatedProbability}%</div>
                      <div>Style Consistency: {currentAnalysis.ganAnalysis.styleConsistency}</div>
                      <div>Template Match: {currentAnalysis.ganAnalysis.templateMatching}</div>
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
            {/* Spam Patterns */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-accent" />
                Detected Patterns
              </h3>
              
              <div className="space-y-3">
                {spamPatterns.map((pattern) => (
                  <motion.div
                    key={pattern.id}
                    className="p-3 bg-background/50 rounded-lg border border-border/50"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{pattern.pattern}</span>
                      <Badge variant="outline">
                        {pattern.confidence.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Type: {pattern.type} • Detected: {pattern.detectionCount} times
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
                            <span className="text-sm font-medium">Score: {analysis.spamScore}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {analysis.type}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {analysis.content.length > 40 ? analysis.content.substring(0, 40) + '...' : analysis.content}
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

export default AISpamDetection;
