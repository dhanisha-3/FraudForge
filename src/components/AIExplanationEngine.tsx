import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Eye, 
  Target, 
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  Search,
  Filter,
  Download,
  Share
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExplanationFactor {
  id: string;
  name: string;
  impact: number;
  confidence: number;
  category: "behavioral" | "contextual" | "transactional" | "network";
  description: string;
  evidence: string[];
}

interface DecisionPath {
  step: number;
  description: string;
  confidence: number;
  factors: string[];
  outcome: "continue" | "flag" | "block";
}

interface ModelInsight {
  model: string;
  accuracy: number;
  contribution: number;
  features: string[];
  reasoning: string;
}

const AIExplanationEngine = () => {
  const [selectedTransaction, setSelectedTransaction] = useState("tx_001");
  const [explanationDepth, setExplanationDepth] = useState("detailed");
  const [activeView, setActiveView] = useState("factors");
  
  const [explanationFactors, setExplanationFactors] = useState<ExplanationFactor[]>([
    {
      id: "1",
      name: "Behavioral Deviation",
      impact: 85,
      confidence: 94,
      category: "behavioral",
      description: "Significant deviation from user's typical behavioral patterns",
      evidence: [
        "Mouse movement velocity 340% above baseline",
        "Keystroke rhythm completely different from profile",
        "Touch pressure patterns inconsistent with device history"
      ]
    },
    {
      id: "2", 
      name: "Geographic Anomaly",
      impact: 72,
      confidence: 89,
      category: "contextual",
      description: "Transaction location inconsistent with user patterns",
      evidence: [
        "Location: Bucharest, Romania (3,847 miles from last transaction)",
        "No travel patterns to Eastern Europe in user history",
        "Transaction occurred 2 hours after NYC transaction"
      ]
    },
    {
      id: "3",
      name: "Transaction Velocity",
      impact: 68,
      confidence: 91,
      category: "transactional", 
      description: "Unusual transaction frequency and amounts",
      evidence: [
        "15 transactions in 30 minutes (baseline: 2-3 per day)",
        "Average amount $15,000 (baseline: $45)",
        "All transactions to high-risk merchant categories"
      ]
    },
    {
      id: "4",
      name: "Network Correlation",
      impact: 79,
      confidence: 87,
      category: "network",
      description: "Connection to known fraud network",
      evidence: [
        "Device fingerprint matches 3 other flagged accounts",
        "IP address linked to 12 previous fraud cases",
        "Browser characteristics consistent with automation tools"
      ]
    }
  ]);

  const [decisionPath, setDecisionPath] = useState<DecisionPath[]>([
    {
      step: 1,
      description: "Initial transaction screening",
      confidence: 95,
      factors: ["amount", "merchant", "location"],
      outcome: "continue"
    },
    {
      step: 2,
      description: "Behavioral biometric analysis",
      confidence: 89,
      factors: ["mouse_patterns", "keystroke_dynamics"],
      outcome: "flag"
    },
    {
      step: 3,
      description: "Contextual intelligence evaluation",
      confidence: 92,
      factors: ["geographic_anomaly", "time_patterns"],
      outcome: "flag"
    },
    {
      step: 4,
      description: "Network analysis and correlation",
      confidence: 87,
      factors: ["device_fingerprint", "ip_reputation", "fraud_network"],
      outcome: "block"
    }
  ]);

  const [modelInsights, setModelInsights] = useState<ModelInsight[]>([
    {
      model: "Behavioral Biometrics Neural Network",
      accuracy: 99.2,
      contribution: 35,
      features: ["mouse_velocity", "keystroke_rhythm", "touch_pressure"],
      reasoning: "Detected impossible-to-replicate behavioral patterns indicating account compromise"
    },
    {
      model: "Graph Neural Network",
      accuracy: 97.8,
      contribution: 28,
      features: ["device_connections", "ip_relationships", "merchant_patterns"],
      reasoning: "Identified connection to known fraud ring with 87% confidence"
    },
    {
      model: "Temporal Anomaly Detector",
      accuracy: 96.5,
      contribution: 22,
      features: ["transaction_timing", "velocity_patterns", "geographic_sequence"],
      reasoning: "Flagged impossible travel time and suspicious transaction velocity"
    },
    {
      model: "Ensemble Meta-Learner",
      accuracy: 99.7,
      contribution: 15,
      features: ["model_consensus", "confidence_weighting", "adaptive_thresholds"],
      reasoning: "Combined all model outputs with 99.7% confidence in fraud classification"
    }
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "behavioral": return "text-purple-500";
      case "contextual": return "text-blue-500";
      case "transactional": return "text-green-500";
      case "network": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "behavioral": return Brain;
      case "contextual": return Eye;
      case "transactional": return Activity;
      case "network": return Shield;
      default: return Info;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "continue": return "text-green-500";
      case "flag": return "text-yellow-500";
      case "block": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case "continue": return CheckCircle;
      case "flag": return AlertTriangle;
      case "block": return Shield;
      default: return Info;
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Brain className="w-4 h-4 mr-2" />
            AI Explanation Engine
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Explainable AI Decisions
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete transparency into AI decision-making with detailed explanations, confidence scores, and regulatory compliance
          </p>
        </div>

        {/* Control Panel */}
        <Card className="p-6 mb-8 bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="text-lg font-semibold">Transaction Analysis</h3>
                <p className="text-sm text-muted-foreground">ID: {selectedTransaction} • Status: BLOCKED</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button size="sm" variant="outline">
                <Share className="w-4 h-4 mr-2" />
                Share Analysis
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex space-x-1 bg-muted/20 rounded-lg p-1">
            {[
              { id: "factors", label: "Risk Factors", icon: Target },
              { id: "decision", label: "Decision Path", icon: TrendingUp },
              { id: "models", label: "Model Insights", icon: Brain },
              { id: "evidence", label: "Evidence", icon: Search }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeView === tab.id ? "default" : "ghost"}
                onClick={() => setActiveView(tab.id)}
                className="flex-1"
                size="sm"
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Content Views */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === "factors" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Risk Factor Analysis</h3>
                  {explanationFactors.map((factor, index) => (
                    <motion.div
                      key={factor.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover-lift">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {React.createElement(getCategoryIcon(factor.category), { 
                              className: cn("w-5 h-5", getCategoryColor(factor.category)) 
                            })}
                            <div>
                              <h4 className="font-semibold">{factor.name}</h4>
                              <p className="text-sm text-muted-foreground capitalize">{factor.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-red-500">{factor.impact}%</div>
                            <div className="text-xs text-muted-foreground">Impact</div>
                          </div>
                        </div>
                        
                        <p className="text-sm mb-4">{factor.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Impact Score</span>
                            <span>{factor.impact}%</span>
                          </div>
                          <Progress value={factor.impact} className="h-2" />
                          
                          <div className="flex justify-between text-sm">
                            <span>Confidence</span>
                            <span>{factor.confidence}%</span>
                          </div>
                          <Progress value={factor.confidence} className="h-2" />
                        </div>

                        <div className="space-y-1">
                          <h5 className="text-sm font-medium">Evidence:</h5>
                          {factor.evidence.map((evidence, idx) => (
                            <div key={idx} className="text-xs text-muted-foreground flex items-start space-x-2">
                              <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <span>{evidence}</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Overall Risk Assessment</h3>
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-red-500 mb-2">94.7%</div>
                      <div className="text-lg font-semibold">Fraud Probability</div>
                      <Badge variant="destructive" className="mt-2">CRITICAL RISK</Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Behavioral Signals</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Contextual Anomalies</span>
                          <span>72%</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Network Intelligence</span>
                          <span>79%</span>
                        </div>
                        <Progress value={79} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Transaction Patterns</span>
                          <span>68%</span>
                        </div>
                        <Progress value={68} className="h-2" />
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="w-4 h-4 text-red-500" />
                        <span className="font-medium text-red-500">Recommendation</span>
                      </div>
                      <p className="text-sm">
                        <strong>BLOCK TRANSACTION</strong> - Multiple high-confidence fraud indicators detected. 
                        Behavioral biometrics show impossible-to-replicate patterns, indicating account compromise. 
                        Immediate user verification required.
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeView === "decision" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">AI Decision Path</h3>
                <div className="space-y-4">
                  {decisionPath.map((step, index) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="font-bold text-primary">{step.step}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{step.description}</h4>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">
                                  {step.confidence}% confidence
                                </span>
                                {React.createElement(getOutcomeIcon(step.outcome), { 
                                  className: cn("w-4 h-4", getOutcomeColor(step.outcome)) 
                                })}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">Factors analyzed:</span>
                              {step.factors.map((factor, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {factor.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeView === "models" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Model Contributions</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {modelInsights.map((model, index) => (
                    <motion.div
                      key={model.model}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover-lift">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold">{model.model}</h4>
                          <Badge variant="outline">{model.contribution}% contribution</Badge>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Accuracy</span>
                            <span>{model.accuracy}%</span>
                          </div>
                          <Progress value={model.accuracy} className="h-2" />
                        </div>

                        <p className="text-sm mb-4">{model.reasoning}</p>

                        <div>
                          <h5 className="text-sm font-medium mb-2">Key Features:</h5>
                          <div className="flex flex-wrap gap-1">
                            {model.features.map((feature, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {feature.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Regulatory Compliance */}
        <Card className="mt-8 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
            Regulatory Compliance & Transparency
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-3 text-green-500" />
              <h4 className="font-medium mb-2">GDPR Article 22</h4>
              <p className="text-sm text-muted-foreground">
                Right to explanation for automated decision-making fully satisfied with detailed AI reasoning.
              </p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 mx-auto mb-3 text-blue-500" />
              <h4 className="font-medium mb-2">PCI DSS Compliance</h4>
              <p className="text-sm text-muted-foreground">
                All fraud detection processes meet PCI DSS requirements for cardholder data protection.
              </p>
            </div>
            <div className="text-center">
              <Eye className="w-8 h-8 mx-auto mb-3 text-purple-500" />
              <h4 className="font-medium mb-2">Audit Trail</h4>
              <p className="text-sm text-muted-foreground">
                Complete decision audit trail with immutable logging for regulatory review and compliance.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AIExplanationEngine;
