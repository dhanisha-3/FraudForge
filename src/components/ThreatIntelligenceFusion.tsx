import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Radar, 
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
  TrendingUp,
  BarChart3,
  Zap,
  Lock,
  Bot,
  Cpu,
  Search,
  Filter,
  AlertCircle,
  Layers,
  Sparkles,
  Network,
  Database,
  MessageSquare,
  Users,
  Calendar,
  MapPin,
  FileText,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThreatIntel {
  id: string;
  source: "dark_web" | "hacker_forum" | "credential_dump" | "malware_analysis" | "social_media";
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  confidence: number;
  timestamp: Date;
  tags: string[];
  affectedEntities: string[];
  predictedImpact: string;
  actionRequired: boolean;
  status: "new" | "investigating" | "confirmed" | "mitigated";
}

interface PredictiveAlert {
  id: string;
  type: "credential_breach" | "phishing_campaign" | "malware_distribution" | "fraud_ring" | "data_leak";
  title: string;
  description: string;
  probability: number;
  timeframe: string;
  affectedUsers: number;
  estimatedLoss: number;
  preventionActions: string[];
  timestamp: Date;
  status: "predicted" | "confirmed" | "prevented";
}

interface DarkWebMonitor {
  id: string;
  keyword: string;
  category: "financial" | "credentials" | "malware" | "fraud" | "general";
  mentions: number;
  sentiment: "positive" | "neutral" | "negative";
  trend: "increasing" | "stable" | "decreasing";
  lastUpdate: Date;
  riskScore: number;
}

interface ThreatFeed {
  id: string;
  name: string;
  type: "commercial" | "open_source" | "government" | "community";
  status: "active" | "inactive" | "error";
  lastSync: Date;
  recordsProcessed: number;
  accuracy: number;
}

const ThreatIntelligenceFusion = () => {
  const [threatIntel, setThreatIntel] = useState<ThreatIntel[]>([]);
  const [predictiveAlerts, setPredictiveAlerts] = useState<PredictiveAlert[]>([]);
  const [darkWebMonitors, setDarkWebMonitors] = useState<DarkWebMonitor[]>([]);
  const [threatFeeds, setThreatFeeds] = useState<ThreatFeed[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<ThreatIntel | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<PredictiveAlert | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [viewMode, setViewMode] = useState<"threats" | "predictions" | "monitoring" | "feeds">("threats");

  // Generate realistic threat intelligence data
  const generateThreatIntel = (): ThreatIntel[] => {
    const threats: ThreatIntel[] = [
      {
        id: "threat_1",
        source: "dark_web",
        title: "New Banking Trojan 'SilentStealer' Detected",
        description: "Advanced banking trojan targeting Indian financial institutions with sophisticated evasion techniques.",
        severity: "critical",
        confidence: 95,
        timestamp: new Date(Date.now() - 3600000),
        tags: ["banking", "trojan", "malware", "india"],
        affectedEntities: ["HDFC Bank", "ICICI Bank", "SBI"],
        predictedImpact: "Potential credential theft affecting 50,000+ users",
        actionRequired: true,
        status: "new"
      },
      {
        id: "threat_2",
        source: "hacker_forum",
        title: "UPI Fraud Kit Being Sold",
        description: "Cybercriminals selling sophisticated UPI fraud toolkit with fake payment confirmations.",
        severity: "high",
        confidence: 88,
        timestamp: new Date(Date.now() - 7200000),
        tags: ["upi", "fraud", "toolkit", "payment"],
        affectedEntities: ["PhonePe", "Google Pay", "Paytm"],
        predictedImpact: "Increased UPI fraud attempts expected",
        actionRequired: true,
        status: "investigating"
      },
      {
        id: "threat_3",
        source: "credential_dump",
        title: "Major E-commerce Platform Breach",
        description: "Credentials from popular e-commerce platform found in underground markets.",
        severity: "high",
        confidence: 92,
        timestamp: new Date(Date.now() - 10800000),
        tags: ["credentials", "ecommerce", "breach", "data"],
        affectedEntities: ["Amazon", "Flipkart"],
        predictedImpact: "Account takeover attempts likely to increase",
        actionRequired: true,
        status: "confirmed"
      },
      {
        id: "threat_4",
        source: "malware_analysis",
        title: "Mobile Banking App Impersonation",
        description: "Fake mobile banking applications mimicking legitimate apps detected in underground channels.",
        severity: "medium",
        confidence: 85,
        timestamp: new Date(Date.now() - 14400000),
        tags: ["mobile", "banking", "impersonation", "app"],
        affectedEntities: ["Multiple Banks"],
        predictedImpact: "Users may download malicious banking apps",
        actionRequired: false,
        status: "mitigated"
      }
    ];

    return threats;
  };

  // Generate predictive alerts
  const generatePredictiveAlerts = (): PredictiveAlert[] => {
    const alerts: PredictiveAlert[] = [
      {
        id: "alert_1",
        type: "phishing_campaign",
        title: "Large-Scale Phishing Campaign Predicted",
        description: "AI models predict coordinated phishing campaign targeting banking customers within 48 hours.",
        probability: 87,
        timeframe: "24-48 hours",
        affectedUsers: 25000,
        estimatedLoss: 5000000,
        preventionActions: [
          "Increase email security monitoring",
          "Send customer awareness notifications",
          "Enhance SMS filtering",
          "Monitor suspicious domains"
        ],
        timestamp: new Date(),
        status: "predicted"
      },
      {
        id: "alert_2",
        type: "credential_breach",
        title: "Credential Stuffing Attack Imminent",
        description: "Analysis of dark web chatter suggests large-scale credential stuffing attack being planned.",
        probability: 92,
        timeframe: "12-24 hours",
        affectedUsers: 15000,
        estimatedLoss: 2500000,
        preventionActions: [
          "Enable additional authentication",
          "Monitor login patterns",
          "Implement rate limiting",
          "Alert high-value accounts"
        ],
        timestamp: new Date(Date.now() - 1800000),
        status: "predicted"
      },
      {
        id: "alert_3",
        type: "fraud_ring",
        title: "New Fraud Ring Formation Detected",
        description: "GNN analysis indicates formation of new fraud ring with coordinated account activities.",
        probability: 78,
        timeframe: "3-5 days",
        affectedUsers: 8000,
        estimatedLoss: 1200000,
        preventionActions: [
          "Monitor flagged accounts",
          "Enhance transaction monitoring",
          "Review account relationships",
          "Implement additional verification"
        ],
        timestamp: new Date(Date.now() - 3600000),
        status: "confirmed"
      }
    ];

    return alerts;
  };

  // Generate dark web monitoring data
  const generateDarkWebMonitors = (): DarkWebMonitor[] => {
    const monitors: DarkWebMonitor[] = [
      {
        id: "monitor_1",
        keyword: "HDFC Bank credentials",
        category: "credentials",
        mentions: 47,
        sentiment: "negative",
        trend: "increasing",
        lastUpdate: new Date(),
        riskScore: 85
      },
      {
        id: "monitor_2",
        keyword: "UPI fraud toolkit",
        category: "fraud",
        mentions: 23,
        sentiment: "neutral",
        trend: "stable",
        lastUpdate: new Date(Date.now() - 1800000),
        riskScore: 72
      },
      {
        id: "monitor_3",
        keyword: "Indian banking malware",
        category: "malware",
        mentions: 15,
        sentiment: "negative",
        trend: "decreasing",
        lastUpdate: new Date(Date.now() - 3600000),
        riskScore: 68
      },
      {
        id: "monitor_4",
        keyword: "Credit card dumps India",
        category: "financial",
        mentions: 31,
        sentiment: "negative",
        trend: "increasing",
        lastUpdate: new Date(Date.now() - 900000),
        riskScore: 79
      }
    ];

    return monitors;
  };

  // Generate threat feed data
  const generateThreatFeeds = (): ThreatFeed[] => {
    const feeds: ThreatFeed[] = [
      {
        id: "feed_1",
        name: "SpyCloud Breach Database",
        type: "commercial",
        status: "active",
        lastSync: new Date(Date.now() - 300000),
        recordsProcessed: 1247893,
        accuracy: 96.5
      },
      {
        id: "feed_2",
        name: "Recorded Future Intelligence",
        type: "commercial",
        status: "active",
        lastSync: new Date(Date.now() - 600000),
        recordsProcessed: 892456,
        accuracy: 94.2
      },
      {
        id: "feed_3",
        name: "MISP Threat Sharing",
        type: "community",
        status: "active",
        lastSync: new Date(Date.now() - 900000),
        recordsProcessed: 456789,
        accuracy: 87.8
      },
      {
        id: "feed_4",
        name: "CERT-In Advisories",
        type: "government",
        status: "active",
        lastSync: new Date(Date.now() - 1200000),
        recordsProcessed: 234567,
        accuracy: 98.1
      }
    ];

    return feeds;
  };

  // Run threat intelligence scan
  const runThreatScan = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      setThreatIntel(generateThreatIntel());
      setPredictiveAlerts(generatePredictiveAlerts());
      setDarkWebMonitors(generateDarkWebMonitors());
      setThreatFeeds(generateThreatFeeds());
      setIsScanning(false);
    }, 3000);
  };

  // Initialize data
  useEffect(() => {
    runThreatScan();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "text-green-500";
      case "medium": return "text-yellow-500";
      case "high": return "text-orange-500";
      case "critical": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": case "predicted": return "text-blue-500";
      case "investigating": return "text-yellow-500";
      case "confirmed": return "text-orange-500";
      case "mitigated": case "prevented": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing": return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "decreasing": return <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <section id="threat-intelligence" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Radar className="w-4 h-4 mr-2" />
            Threat Intelligence Fusion
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Predictive Threat Intelligence & Dark Web Monitoring
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced threat intelligence fusion with dark web monitoring and predictive analytics for proactive fraud prevention
          </p>
        </div>

        {/* Intelligence Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-2xl font-bold">{threatIntel.filter(t => t.severity === "critical" || t.severity === "high").length}</span>
              </div>
              <div className="text-sm text-muted-foreground">High Priority Threats</div>
              <Progress value={(threatIntel.filter(t => t.severity === "critical" || t.severity === "high").length / Math.max(threatIntel.length, 1)) * 100} className="h-2 mt-2" />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <Brain className="w-5 h-5 text-purple-500" />
                <span className="text-2xl font-bold">{predictiveAlerts.length}</span>
              </div>
              <div className="text-sm text-muted-foreground">Predictive Alerts</div>
              <Progress value={(predictiveAlerts.filter(a => a.probability > 80).length / Math.max(predictiveAlerts.length, 1)) * 100} className="h-2 mt-2" />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <Search className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold">{darkWebMonitors.reduce((sum, m) => sum + m.mentions, 0)}</span>
              </div>
              <div className="text-sm text-muted-foreground">Dark Web Mentions</div>
              <Progress value={(darkWebMonitors.filter(m => m.trend === "increasing").length / Math.max(darkWebMonitors.length, 1)) * 100} className="h-2 mt-2" />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <Database className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold">{threatFeeds.filter(f => f.status === "active").length}</span>
              </div>
              <div className="text-sm text-muted-foreground">Active Feeds</div>
              <Progress value={(threatFeeds.filter(f => f.status === "active").length / Math.max(threatFeeds.length, 1)) * 100} className="h-2 mt-2" />
            </Card>
          </motion.div>
        </div>

        {/* Control Panel */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant={isScanning ? "default" : "outline"}
              onClick={runThreatScan}
              disabled={isScanning}
              className="flex items-center space-x-2"
            >
              {isScanning ? <Radar className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              <span>{isScanning ? "Scanning..." : "Run Intelligence Scan"}</span>
            </Button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">View:</span>
              <select 
                className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
              >
                <option value="threats">Threat Intelligence</option>
                <option value="predictions">Predictive Alerts</option>
                <option value="monitoring">Dark Web Monitoring</option>
                <option value="feeds">Threat Feeds</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-2">
              <Activity className="w-3 h-3" />
              <span>Real-time Intelligence</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Layers className="w-5 h-5 mr-2 text-accent" />
              {viewMode === "threats" ? "Threat Intelligence" :
               viewMode === "predictions" ? "Predictive Alerts" :
               viewMode === "monitoring" ? "Dark Web Monitoring" : "Threat Feeds"}
            </h3>
            
            {viewMode === "threats" && (
              <div className="space-y-4">
                {threatIntel.map((threat) => (
                  <motion.div
                    key={threat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-background/50 rounded-lg border border-border/50 cursor-pointer hover:bg-background/70"
                    onClick={() => setSelectedThreat(threat)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{threat.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          threat.severity === "critical" ? "destructive" :
                          threat.severity === "high" ? "default" :
                          threat.severity === "medium" ? "secondary" : "outline"
                        }>
                          {threat.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {threat.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{threat.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span>Source: {threat.source.replace('_', ' ')}</span>
                        <span>Entities: {threat.affectedEntities.length}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          threat.status === "new" ? "default" :
                          threat.status === "investigating" ? "secondary" :
                          threat.status === "confirmed" ? "destructive" : "outline"
                        }>
                          {threat.status}
                        </Badge>
                        <span className="text-muted-foreground">{threat.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {viewMode === "predictions" && (
              <div className="space-y-4">
                {predictiveAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-background/50 rounded-lg border border-border/50 cursor-pointer hover:bg-background/70"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{alert.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="default">
                          {alert.probability}% probability
                        </Badge>
                        <Badge variant="outline">
                          {alert.timeframe}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Affected Users:</span>
                        <div className="font-medium">{alert.affectedUsers.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Est. Loss:</span>
                        <div className="font-medium text-red-500">₹{alert.estimatedLoss.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Actions:</span>
                        <div className="font-medium">{alert.preventionActions.length} recommended</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {viewMode === "monitoring" && (
              <div className="space-y-4">
                {darkWebMonitors.map((monitor) => (
                  <motion.div
                    key={monitor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-background/50 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{monitor.keyword}</h4>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(monitor.trend)}
                        <Badge variant={
                          monitor.riskScore > 80 ? "destructive" :
                          monitor.riskScore > 60 ? "default" :
                          monitor.riskScore > 40 ? "secondary" : "outline"
                        }>
                          Risk: {monitor.riskScore}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Mentions:</span>
                        <div className="font-medium">{monitor.mentions}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Category:</span>
                        <div className="font-medium">{monitor.category}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sentiment:</span>
                        <div className={cn("font-medium", 
                          monitor.sentiment === "negative" ? "text-red-500" :
                          monitor.sentiment === "positive" ? "text-green-500" : "text-gray-500"
                        )}>
                          {monitor.sentiment}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Updated:</span>
                        <div className="font-medium">{monitor.lastUpdate.toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {viewMode === "feeds" && (
              <div className="space-y-4">
                {threatFeeds.map((feed) => (
                  <motion.div
                    key={feed.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-background/50 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{feed.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={feed.status === "active" ? "default" : "destructive"}>
                          {feed.status}
                        </Badge>
                        <Badge variant="outline">
                          {feed.accuracy}% accuracy
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <div className="font-medium">{feed.type.replace('_', ' ')}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Records:</span>
                        <div className="font-medium">{feed.recordsProcessed.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Sync:</span>
                        <div className="font-medium">{feed.lastSync.toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Critical Alerts */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-accent" />
                Critical Alerts
              </h3>
              
              <div className="space-y-3">
                {threatIntel
                  .filter(threat => threat.severity === "critical")
                  .map((threat) => (
                    <motion.div
                      key={threat.id}
                      className="p-3 bg-background/50 rounded-lg border border-red-500/50"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{threat.title}</span>
                        <Badge variant="destructive">CRITICAL</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {threat.affectedEntities.join(", ")}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </Card>

            {/* Trending Keywords */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-accent" />
                Trending Keywords
              </h3>
              
              <div className="space-y-3">
                {darkWebMonitors
                  .filter(monitor => monitor.trend === "increasing")
                  .sort((a, b) => b.mentions - a.mentions)
                  .map((monitor) => (
                    <motion.div
                      key={monitor.id}
                      className="p-3 bg-background/50 rounded-lg border border-border/50"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{monitor.keyword}</span>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 text-red-500" />
                          <span className="text-xs">{monitor.mentions}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Risk Score: {monitor.riskScore}
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

export default ThreatIntelligenceFusion;
