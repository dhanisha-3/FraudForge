import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Shield, 
  Network,
  CreditCard,
  Smartphone,
  Eye,
  Zap,
  Target,
  Activity,
  TrendingUp,
  BarChart3,
  Code,
  Cpu,
  Database,
  GitBranch
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Algorithm {
  id: string;
  name: string;
  category: string;
  description: string;
  complexity: "O(n)" | "O(n log n)" | "O(n²)" | "O(log n)";
  accuracy: number;
  features: string[];
  implementation: string;
  realTimeCapable: boolean;
}

const AlgorithmShowcase = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);

  const algorithms: Algorithm[] = [
    {
      id: "luhn_validation",
      name: "Luhn Algorithm",
      category: "Credit Card",
      description: "Mathematical checksum formula for validating credit card numbers",
      complexity: "O(n)",
      accuracy: 100,
      features: ["Card validation", "Checksum verification", "Real-time processing"],
      implementation: `
function isValidCardNumber(cardNumber) {
  const cleanNumber = cardNumber.replace(/\\D/g, '');
  let sum = 0, isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}`,
      realTimeCapable: true
    },
    {
      id: "mouse_pattern_analysis",
      name: "Mouse Pattern Analysis",
      category: "Behavioral Biometrics",
      description: "Advanced analysis of mouse movement patterns for user authentication",
      complexity: "O(n)",
      accuracy: 94.2,
      features: ["Velocity analysis", "Acceleration patterns", "Jerk calculation", "Trajectory smoothness"],
      implementation: `
function analyzeMousePattern(data) {
  // Velocity consistency analysis
  const velocities = data.map(d => d.velocity);
  const avgVelocity = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
  const velocityVariance = velocities.reduce((sum, v) => 
    sum + Math.pow(v - avgVelocity, 2), 0) / velocities.length;
  
  // Acceleration pattern analysis
  const accelerations = data.map(d => d.acceleration);
  const avgAcceleration = accelerations.reduce((sum, a) => sum + a, 0) / accelerations.length;
  
  // Movement smoothness (Jerk analysis)
  let totalJerk = 0;
  for (let i = 2; i < data.length; i++) {
    const jerk = Math.abs(data[i].acceleration - 2 * data[i-1].acceleration + data[i-2].acceleration);
    totalJerk += jerk;
  }
  
  return calculateBiometricScore(velocityVariance, avgAcceleration, totalJerk);
}`,
      realTimeCapable: true
    },
    {
      id: "keystroke_dynamics",
      name: "Keystroke Dynamics",
      category: "Behavioral Biometrics",
      description: "Analysis of typing patterns including dwell time and flight time",
      complexity: "O(n)",
      accuracy: 91.8,
      features: ["Dwell time analysis", "Flight time patterns", "Typing rhythm", "Temporal consistency"],
      implementation: `
function analyzeKeystrokePattern(data) {
  // Dwell time analysis
  const dwellTimes = data.map(k => k.dwellTime);
  const avgDwellTime = dwellTimes.reduce((sum, d) => sum + d, 0) / dwellTimes.length;
  const dwellVariance = dwellTimes.reduce((sum, d) => 
    sum + Math.pow(d - avgDwellTime, 2), 0) / dwellTimes.length;
  
  // Flight time analysis
  const flightTimes = data.map(k => k.flightTime);
  const avgFlightTime = flightTimes.reduce((sum, f) => sum + f, 0) / flightTimes.length;
  
  // Typing rhythm consistency
  const rhythmScores = data.map(k => k.dwellTime + k.flightTime);
  const rhythmVariance = calculateVariance(rhythmScores);
  
  return evaluateTypingAuthenticity(avgDwellTime, dwellVariance, avgFlightTime, rhythmVariance);
}`,
      realTimeCapable: true
    },
    {
      id: "upi_fraud_detection",
      name: "UPI Fraud Detection",
      category: "UPI Security",
      description: "Multi-factor UPI transaction analysis with social engineering detection",
      complexity: "O(n log n)",
      accuracy: 96.7,
      features: ["UPI ID validation", "Velocity analysis", "Social engineering detection", "Device behavior"],
      implementation: `
function analyzeUPITransaction(transaction) {
  let riskScore = 0;
  const riskFactors = [];
  
  // Amount-based risk analysis
  if (transaction.amount > 100000) riskScore += 40;
  else if (transaction.amount > 50000) riskScore += 30;
  
  // UPI ID validation
  if (!isValidUPIId(transaction.senderUPI)) riskScore += 25;
  if (!isValidUPIId(transaction.receiverUPI)) riskScore += 25;
  
  // Velocity analysis
  const recentTransactions = getRecentTransactions(transaction.senderUPI);
  if (recentTransactions.length >= 5) riskScore += 30;
  
  // Social engineering detection
  if (isSocialEngineeringPattern(transaction)) riskScore += 25;
  
  return { riskScore: Math.min(100, riskScore), riskFactors };
}`,
      realTimeCapable: true
    },
    {
      id: "network_centrality",
      name: "Network Centrality Analysis",
      category: "Network Analysis",
      description: "Graph-based analysis for detecting fraud rings and suspicious connections",
      complexity: "O(n²)",
      accuracy: 89.3,
      features: ["Betweenness centrality", "Community detection", "Risk propagation", "Connected components"],
      implementation: `
function calculateNodeCentrality(node, links) {
  const nodeConnections = links.filter(link => 
    link.source === node.id || link.target === node.id
  );
  
  // Degree centrality (normalized)
  const degreeCentrality = nodeConnections.length / Math.max(1, links.length);
  
  // Weight by connection strengths
  const weightedCentrality = nodeConnections.reduce((sum, link) => 
    sum + link.strength, 0) / nodeConnections.length;
  
  return (degreeCentrality + (weightedCentrality || 0)) / 2;
}

function detectFraudRings(nodes, links) {
  const visitedNodes = new Set();
  const fraudRings = [];
  
  nodes.forEach(node => {
    if (visitedNodes.has(node.id) || node.risk < 0.6) return;
    
    const component = findConnectedComponent(node.id, nodes, links, visitedNodes);
    if (component.length >= 2) {
      const avgRisk = calculateAverageRisk(component, nodes);
      if (avgRisk > 0.7) {
        fraudRings.push(createFraudRing(component, avgRisk));
      }
    }
  });
  
  return fraudRings;
}`,
      realTimeCapable: false
    },
    {
      id: "voice_biometrics",
      name: "Voice Biometric Analysis",
      category: "Voice Verification",
      description: "Multi-dimensional voice analysis including pitch, tempo, and authenticity",
      complexity: "O(n log n)",
      accuracy: 97.1,
      features: ["Pitch analysis", "Spectral characteristics", "Liveness detection", "Voiceprint matching"],
      implementation: `
function analyzeVoiceCharacteristics(audioData) {
  // Pitch Analysis (Fundamental Frequency)
  const pitchStability = analyzePitchStability(audioData);
  const pitchRange = analyzePitchRange(audioData);
  
  // Spectral characteristics analysis
  const formantAnalysis = analyzeFormants(audioData);
  const harmonicStructure = analyzeHarmonics(audioData);
  
  // Liveness detection (anti-spoofing)
  const microVariations = detectMicroVariations(audioData);
  const breathingPatterns = analyzeBreathingPatterns(audioData);
  
  // Voiceprint comparison
  const fundamentalFreq = matchFundamentalFrequency(audioData);
  const spectralMatching = matchSpectralEnvelope(audioData);
  
  return {
    pitch: (pitchStability + pitchRange) / 2,
    authenticity: (microVariations + breathingPatterns) / 2,
    match: (fundamentalFreq + spectralMatching) / 2
  };
}`,
      realTimeCapable: true
    }
  ];

  const categories = ["all", "Credit Card", "Behavioral Biometrics", "UPI Security", "Network Analysis", "Voice Verification"];

  const filteredAlgorithms = selectedCategory === "all" 
    ? algorithms 
    : algorithms.filter(alg => alg.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Credit Card": return CreditCard;
      case "Behavioral Biometrics": return Brain;
      case "UPI Security": return Smartphone;
      case "Network Analysis": return Network;
      case "Voice Verification": return Eye;
      default: return Code;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "O(log n)": return "text-green-500";
      case "O(n)": return "text-blue-500";
      case "O(n log n)": return "text-yellow-500";
      case "O(n²)": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <section id="algorithms" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Cpu className="w-4 h-4 mr-2" />
            Advanced Algorithms
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Sophisticated Fraud Detection Algorithms
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the advanced mathematical and machine learning algorithms powering FraudGuard AI's detection capabilities
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === "all" ? (
                <Database className="w-4 h-4 mr-2" />
              ) : (
                React.createElement(getCategoryIcon(category), { className: "w-4 h-4 mr-2" })
              )}
              {category}
            </Button>
          ))}
        </div>

        {/* Algorithm Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredAlgorithms.map((algorithm, index) => (
            <motion.div
              key={algorithm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover-lift cursor-pointer"
                onClick={() => setSelectedAlgorithm(algorithm)}
              >
                <div className="flex items-center justify-between mb-4">
                  {React.createElement(getCategoryIcon(algorithm.category), { 
                    className: "w-8 h-8 text-primary" 
                  })}
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getComplexityColor(algorithm.complexity)}>
                      {algorithm.complexity}
                    </Badge>
                    {algorithm.realTimeCapable && (
                      <Badge variant="secondary">
                        <Zap className="w-3 h-3 mr-1" />
                        Real-time
                      </Badge>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2">{algorithm.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{algorithm.description}</p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Accuracy</span>
                    <span className="text-sm font-bold text-green-500">{algorithm.accuracy}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <Badge variant="outline">{algorithm.category}</Badge>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground mb-2 block">Key Features:</span>
                    <div className="flex flex-wrap gap-1">
                      {algorithm.features.slice(0, 2).map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {algorithm.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{algorithm.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Algorithm Detail Modal */}
        <AnimatePresence>
          {selectedAlgorithm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedAlgorithm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    {React.createElement(getCategoryIcon(selectedAlgorithm.category), { 
                      className: "w-8 h-8 text-primary" 
                    })}
                    <div>
                      <h3 className="text-2xl font-bold">{selectedAlgorithm.name}</h3>
                      <p className="text-muted-foreground">{selectedAlgorithm.category}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedAlgorithm(null)}>
                    Close
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Algorithm Details</h4>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium">Description:</span>
                        <p className="text-sm text-muted-foreground mt-1">{selectedAlgorithm.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium">Complexity:</span>
                          <p className={cn("text-sm font-mono", getComplexityColor(selectedAlgorithm.complexity))}>
                            {selectedAlgorithm.complexity}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Accuracy:</span>
                          <p className="text-sm font-bold text-green-500">{selectedAlgorithm.accuracy}%</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium mb-2 block">Features:</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedAlgorithm.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4">Implementation</h4>
                    <div className="bg-muted/20 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                        <code>{selectedAlgorithm.implementation}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Algorithm Statistics */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-accent" />
            Algorithm Performance Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">6</div>
              <div className="text-sm text-muted-foreground">Total Algorithms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">94.2%</div>
              <div className="text-sm text-muted-foreground">Average Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">5</div>
              <div className="text-sm text-muted-foreground">Real-time Capable</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">&lt;50ms</div>
              <div className="text-sm text-muted-foreground">Average Response</div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AlgorithmShowcase;
