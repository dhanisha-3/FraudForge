import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Network, 
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
  GitBranch,
  Share2,
  UserCheck,
  AlertCircle,
  Radar,
  Layers,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FraudNode {
  id: string;
  type: "user" | "merchant" | "device" | "location" | "account";
  label: string;
  riskScore: number;
  connections: string[];
  attributes: {
    transactionCount: number;
    totalAmount: number;
    avgAmount: number;
    timespan: string;
    suspiciousActivity: string[];
  };
  position: { x: number; y: number };
  status: "clean" | "suspicious" | "flagged" | "confirmed_fraud";
}

interface FraudRing {
  id: string;
  name: string;
  nodes: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
  confidence: number;
  detectedAt: Date;
  pattern: string;
  estimatedLoss: number;
  status: "monitoring" | "investigating" | "confirmed" | "resolved";
}

interface GNNAnalysis {
  id: string;
  timestamp: Date;
  nodesAnalyzed: number;
  ringsDetected: number;
  newConnections: number;
  riskScore: number;
  processingTime: number;
  confidence: number;
}

interface BiometricSignal {
  id: string;
  userId: string;
  timestamp: Date;
  signals: {
    typingCadence: number;
    swipeVelocity: number;
    deviceTilt: number;
    gripPattern: number;
    authMethod: "face_id" | "pin" | "fingerprint" | "pattern";
  };
  riskScore: number;
  deviation: number;
  status: "normal" | "anomalous" | "suspicious";
}

const AdvancedGNNFraudDetection = () => {
  const [fraudNodes, setFraudNodes] = useState<FraudNode[]>([]);
  const [fraudRings, setFraudRings] = useState<FraudRing[]>([]);
  const [gnnAnalyses, setGnnAnalyses] = useState<GNNAnalysis[]>([]);
  const [biometricSignals, setBiometricSignals] = useState<BiometricSignal[]>([]);
  const [selectedNode, setSelectedNode] = useState<FraudNode | null>(null);
  const [selectedRing, setSelectedRing] = useState<FraudRing | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewMode, setViewMode] = useState<"network" | "rings" | "biometrics">("network");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate realistic fraud network data
  const generateFraudNetwork = (): FraudNode[] => {
    const nodes: FraudNode[] = [];
    const nodeTypes = ["user", "merchant", "device", "location", "account"] as const;
    
    for (let i = 0; i < 50; i++) {
      const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
      const riskScore = Math.random() * 100;
      
      let status: FraudNode['status'];
      if (riskScore > 80) status = "confirmed_fraud";
      else if (riskScore > 60) status = "flagged";
      else if (riskScore > 30) status = "suspicious";
      else status = "clean";

      nodes.push({
        id: `node_${i}`,
        type,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1}`,
        riskScore: Math.round(riskScore),
        connections: [],
        attributes: {
          transactionCount: Math.floor(Math.random() * 1000) + 10,
          totalAmount: Math.floor(Math.random() * 1000000) + 1000,
          avgAmount: Math.floor(Math.random() * 10000) + 100,
          timespan: `${Math.floor(Math.random() * 30) + 1} days`,
          suspiciousActivity: []
        },
        position: {
          x: Math.random() * 800,
          y: Math.random() * 600
        },
        status
      });
    }

    // Generate connections
    nodes.forEach(node => {
      const connectionCount = Math.floor(Math.random() * 8) + 1;
      for (let i = 0; i < connectionCount; i++) {
        const targetNode = nodes[Math.floor(Math.random() * nodes.length)];
        if (targetNode.id !== node.id && !node.connections.includes(targetNode.id)) {
          node.connections.push(targetNode.id);
        }
      }
    });

    return nodes;
  };

  // Detect fraud rings using GNN simulation
  const detectFraudRings = (nodes: FraudNode[]): FraudRing[] => {
    const rings: FraudRing[] = [];
    const visited = new Set<string>();

    nodes.forEach(node => {
      if (!visited.has(node.id) && node.riskScore > 50) {
        const ring = exploreRing(node, nodes, visited, rings.length + 1);
        if (ring.nodes.length >= 3) {
          rings.push(ring);
        }
      }
    });

    return rings;
  };

  // Explore connected nodes to form fraud rings
  const exploreRing = (startNode: FraudNode, allNodes: FraudNode[], visited: Set<string>, ringIndex: number = 1): FraudRing => {
    const ringNodes: string[] = [];
    const queue = [startNode.id];
    let totalRisk = 0;

    while (queue.length > 0 && ringNodes.length < 10) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;

      visited.add(currentId);
      ringNodes.push(currentId);

      const currentNode = allNodes.find(n => n.id === currentId);
      if (currentNode) {
        totalRisk += currentNode.riskScore;
        
        currentNode.connections.forEach(connId => {
          const connNode = allNodes.find(n => n.id === connId);
          if (connNode && !visited.has(connId) && connNode.riskScore > 40) {
            queue.push(connId);
          }
        });
      }
    }

    const avgRisk = totalRisk / ringNodes.length;
    let riskLevel: FraudRing['riskLevel'];
    if (avgRisk > 80) riskLevel = "critical";
    else if (avgRisk > 60) riskLevel = "high";
    else if (avgRisk > 40) riskLevel = "medium";
    else riskLevel = "low";

    return {
      id: `ring_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `Fraud Ring ${ringIndex}`,
      nodes: ringNodes,
      riskLevel,
      confidence: Math.min(95, 60 + (avgRisk * 0.4)),
      detectedAt: new Date(),
      pattern: "Coordinated Transaction Pattern",
      estimatedLoss: Math.floor(Math.random() * 500000) + 50000,
      status: "investigating"
    };
  };

  // Generate biometric signals
  const generateBiometricSignals = (): BiometricSignal[] => {
    const signals: BiometricSignal[] = [];
    
    for (let i = 0; i < 20; i++) {
      const typingCadence = 150 + Math.random() * 100; // ms between keystrokes
      const swipeVelocity = 200 + Math.random() * 300; // pixels/second
      const deviceTilt = Math.random() * 45; // degrees
      const gripPattern = Math.random() * 100; // pressure pattern score
      
      // Calculate deviation from user's baseline
      const baselineTyping = 180;
      const baselineSwipe = 250;
      const baselineTilt = 15;
      const baselineGrip = 75;
      
      const deviation = Math.sqrt(
        Math.pow((typingCadence - baselineTyping) / baselineTyping, 2) +
        Math.pow((swipeVelocity - baselineSwipe) / baselineSwipe, 2) +
        Math.pow((deviceTilt - baselineTilt) / baselineTilt, 2) +
        Math.pow((gripPattern - baselineGrip) / baselineGrip, 2)
      ) * 100;

      let status: BiometricSignal['status'];
      if (deviation > 50) status = "suspicious";
      else if (deviation > 25) status = "anomalous";
      else status = "normal";

      signals.push({
        id: `bio_${i}`,
        userId: `user_${Math.floor(Math.random() * 10) + 1}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000),
        signals: {
          typingCadence,
          swipeVelocity,
          deviceTilt,
          gripPattern,
          authMethod: ["face_id", "pin", "fingerprint", "pattern"][Math.floor(Math.random() * 4)] as any
        },
        riskScore: Math.round(deviation),
        deviation: Math.round(deviation),
        status
      });
    }

    return signals.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  // Run GNN analysis
  const runGNNAnalysis = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const nodes = generateFraudNetwork();
      const rings = detectFraudRings(nodes);
      const biometrics = generateBiometricSignals();
      
      setFraudNodes(nodes);
      setFraudRings(rings);
      setBiometricSignals(biometrics);
      
      const analysis: GNNAnalysis = {
        id: `analysis_${Date.now()}`,
        timestamp: new Date(),
        nodesAnalyzed: nodes.length,
        ringsDetected: rings.length,
        newConnections: Math.floor(Math.random() * 20) + 5,
        riskScore: Math.round(rings.reduce((sum, ring) => sum + (ring.riskLevel === "critical" ? 25 : ring.riskLevel === "high" ? 15 : ring.riskLevel === "medium" ? 10 : 5), 0)),
        processingTime: Math.random() * 2 + 0.5,
        confidence: Math.random() * 20 + 80
      };
      
      setGnnAnalyses(prev => [analysis, ...prev.slice(0, 9)]);
      setIsAnalyzing(false);
    }, 3000);
  };

  // Draw network visualization
  const drawNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    fraudNodes.forEach(node => {
      node.connections.forEach(connId => {
        const connNode = fraudNodes.find(n => n.id === connId);
        if (connNode) {
          ctx.beginPath();
          ctx.moveTo(node.position.x, node.position.y);
          ctx.lineTo(connNode.position.x, connNode.position.y);
          ctx.strokeStyle = node.riskScore > 60 || connNode.riskScore > 60 ? '#ef4444' : '#6b7280';
          ctx.lineWidth = node.riskScore > 60 || connNode.riskScore > 60 ? 2 : 1;
          ctx.stroke();
        }
      });
    });

    // Draw nodes
    fraudNodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.position.x, node.position.y, 8, 0, 2 * Math.PI);
      
      switch (node.status) {
        case "confirmed_fraud":
          ctx.fillStyle = '#dc2626';
          break;
        case "flagged":
          ctx.fillStyle = '#ea580c';
          break;
        case "suspicious":
          ctx.fillStyle = '#d97706';
          break;
        default:
          ctx.fillStyle = '#16a34a';
      }
      
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  };

  // Initialize data
  useEffect(() => {
    runGNNAnalysis();
  }, []);

  // Draw network when data changes
  useEffect(() => {
    if (viewMode === "network") {
      drawNetwork();
    }
  }, [fraudNodes, viewMode]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "clean": case "normal": return "text-green-500";
      case "suspicious": case "anomalous": return "text-yellow-500";
      case "flagged": return "text-orange-500";
      case "confirmed_fraud": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-500";
      case "medium": return "text-yellow-500";
      case "high": return "text-orange-500";
      case "critical": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <section id="advanced-gnn-detection" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Network className="w-4 h-4 mr-2" />
            Advanced GNN Fraud Detection
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Graph Neural Networks & Behavioral Biometrics
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced fraud ring detection using Graph Neural Networks with real-time behavioral biometrics analysis
          </p>
        </div>

        {/* Analysis Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <Network className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold">{fraudNodes.length}</span>
              </div>
              <div className="text-sm text-muted-foreground">Nodes Analyzed</div>
              <Progress value={(fraudNodes.filter(n => n.status !== "clean").length / fraudNodes.length) * 100} className="h-2 mt-2" />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-red-500" />
                <span className="text-2xl font-bold">{fraudRings.length}</span>
              </div>
              <div className="text-sm text-muted-foreground">Fraud Rings</div>
              <Progress value={(fraudRings.filter(r => r.riskLevel === "critical" || r.riskLevel === "high").length / Math.max(fraudRings.length, 1)) * 100} className="h-2 mt-2" />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <Radar className="w-5 h-5 text-purple-500" />
                <span className="text-2xl font-bold">{biometricSignals.filter(s => s.status === "suspicious").length}</span>
              </div>
              <div className="text-sm text-muted-foreground">Biometric Alerts</div>
              <Progress value={(biometricSignals.filter(s => s.status === "suspicious").length / Math.max(biometricSignals.length, 1)) * 100} className="h-2 mt-2" />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <Brain className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold">{gnnAnalyses.length > 0 ? gnnAnalyses[0].confidence.toFixed(0) : 0}%</span>
              </div>
              <div className="text-sm text-muted-foreground">AI Confidence</div>
              <Progress value={gnnAnalyses.length > 0 ? gnnAnalyses[0].confidence : 0} className="h-2 mt-2" />
            </Card>
          </motion.div>
        </div>

        {/* Control Panel */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant={isAnalyzing ? "default" : "outline"}
              onClick={runGNNAnalysis}
              disabled={isAnalyzing}
              className="flex items-center space-x-2"
            >
              {isAnalyzing ? <Brain className="w-4 h-4 animate-pulse" /> : <Zap className="w-4 h-4" />}
              <span>{isAnalyzing ? "Analyzing..." : "Run GNN Analysis"}</span>
            </Button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">View:</span>
              <select 
                className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
              >
                <option value="network">Network Graph</option>
                <option value="rings">Fraud Rings</option>
                <option value="biometrics">Biometrics</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-2">
              <Activity className="w-3 h-3" />
              <span>Real-time Processing</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visualization */}
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Layers className="w-5 h-5 mr-2 text-accent" />
              {viewMode === "network" ? "Fraud Network Graph" :
               viewMode === "rings" ? "Detected Fraud Rings" : "Behavioral Biometrics"}
            </h3>
            
            {viewMode === "network" && (
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="border border-border/50 rounded-lg bg-background/50 w-full"
                  style={{ maxHeight: '400px' }}
                />
                <div className="absolute top-4 right-4 bg-background/90 p-3 rounded-lg border border-border/50">
                  <div className="text-xs space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Clean</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Suspicious</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span>Flagged</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Confirmed Fraud</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {viewMode === "rings" && (
              <div className="space-y-4">
                {fraudRings.map((ring) => (
                  <motion.div
                    key={ring.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-background/50 rounded-lg border border-border/50 cursor-pointer hover:bg-background/70"
                    onClick={() => setSelectedRing(ring)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{ring.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          ring.riskLevel === "critical" ? "destructive" :
                          ring.riskLevel === "high" ? "default" :
                          ring.riskLevel === "medium" ? "secondary" : "outline"
                        }>
                          {ring.riskLevel.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {ring.confidence.toFixed(0)}% confidence
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Nodes:</span>
                        <div className="font-medium">{ring.nodes.length}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pattern:</span>
                        <div className="font-medium">{ring.pattern}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Est. Loss:</span>
                        <div className="font-medium text-red-500">₹{ring.estimatedLoss.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <div className="font-medium">{ring.status}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {viewMode === "biometrics" && (
              <div className="space-y-4">
                {biometricSignals.slice(0, 10).map((signal) => (
                  <motion.div
                    key={signal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-background/50 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <UserCheck className="w-4 h-4" />
                        <span className="font-medium">{signal.userId}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          signal.status === "suspicious" ? "destructive" :
                          signal.status === "anomalous" ? "default" : "secondary"
                        }>
                          {signal.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {signal.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Typing:</span>
                        <div className="font-medium">{signal.signals.typingCadence.toFixed(0)}ms</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Swipe:</span>
                        <div className="font-medium">{signal.signals.swipeVelocity.toFixed(0)}px/s</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tilt:</span>
                        <div className="font-medium">{signal.signals.deviceTilt.toFixed(1)}°</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Auth:</span>
                        <div className="font-medium">{signal.signals.authMethod.replace('_', ' ')}</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Deviation from baseline</span>
                        <span className={cn("font-medium", getStatusColor(signal.status))}>
                          {signal.deviation.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={signal.deviation} className="h-2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Recent Analyses */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-accent" />
                GNN Analyses
              </h3>
              
              <div className="space-y-3">
                {gnnAnalyses.map((analysis) => (
                  <motion.div
                    key={analysis.id}
                    className="p-3 bg-background/50 rounded-lg border border-border/50"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Analysis #{analysis.id.slice(-4)}</span>
                      <Badge variant="outline" className="text-xs">
                        {analysis.processingTime.toFixed(1)}s
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Nodes: {analysis.nodesAnalyzed} | Rings: {analysis.ringsDetected}</div>
                      <div>Risk Score: {analysis.riskScore} | Confidence: {analysis.confidence.toFixed(0)}%</div>
                      <div>{analysis.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* High-Risk Nodes */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-accent" />
                High-Risk Nodes
              </h3>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {fraudNodes
                  .filter(node => node.riskScore > 60)
                  .sort((a, b) => b.riskScore - a.riskScore)
                  .slice(0, 8)
                  .map((node) => (
                    <motion.div
                      key={node.id}
                      className="p-3 bg-background/50 rounded-lg border border-border/50 cursor-pointer hover:bg-background/70"
                      onClick={() => setSelectedNode(node)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{node.label}</span>
                        <Badge variant={
                          node.status === "confirmed_fraud" ? "destructive" :
                          node.status === "flagged" ? "default" :
                          node.status === "suspicious" ? "secondary" : "outline"
                        }>
                          {node.riskScore}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Type: {node.type} | Connections: {node.connections.length}
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

export default AdvancedGNNFraudDetection;
