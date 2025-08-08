import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp,
  RefreshCw,
  Database,
  Target,
  Zap,
  Activity,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Users,
  Globe,
  Shield,
  Eye,
  Settings,
  Play,
  Pause,
  ArrowRight,
  Lightbulb,
  Network
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface LearningMetrics {
  totalSamples: number;
  newPatterns: number;
  accuracyImprovement: number;
  falsePositiveReduction: number;
  adaptationRate: number;
  modelUpdates: number;
}

interface FeedbackData {
  id: string;
  type: "analyst_feedback" | "user_appeal" | "system_detection";
  decision: "correct" | "incorrect" | "partial";
  confidence: number;
  timestamp: Date;
  impact: "high" | "medium" | "low";
}

interface AdaptationEvent {
  id: string;
  event: string;
  description: string;
  timestamp: Date;
  impact: number;
  category: "pattern_detection" | "model_update" | "threshold_adjustment" | "feature_engineering";
}

const ContinuousLearningSystem = () => {
  const [isLearning, setIsLearning] = useState(true);
  const [learningMetrics, setLearningMetrics] = useState<LearningMetrics>({
    totalSamples: 0,
    newPatterns: 0,
    accuracyImprovement: 0,
    falsePositiveReduction: 0,
    adaptationRate: 0,
    modelUpdates: 0
  });
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [adaptationEvents, setAdaptationEvents] = useState<AdaptationEvent[]>([]);
  const [learningProgress, setLearningProgress] = useState(0);

  // Generate realistic learning data
  const generateFeedback = (): FeedbackData => {
    const types: FeedbackData['type'][] = ["analyst_feedback", "user_appeal", "system_detection"];
    const decisions: FeedbackData['decision'][] = ["correct", "incorrect", "partial"];
    const impacts: FeedbackData['impact'][] = ["high", "medium", "low"];

    return {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: types[Math.floor(Math.random() * types.length)],
      decision: decisions[Math.floor(Math.random() * decisions.length)],
      confidence: Math.random() * 100,
      timestamp: new Date(),
      impact: impacts[Math.floor(Math.random() * impacts.length)]
    };
  };

  const generateAdaptationEvent = (): AdaptationEvent => {
    const categories: AdaptationEvent['category'][] = [
      "pattern_detection", "model_update", "threshold_adjustment", "feature_engineering"
    ];
    
    const events = {
      pattern_detection: [
        "New fraud pattern identified in mobile transactions",
        "Emerging social engineering technique detected",
        "Novel card-not-present attack vector discovered"
      ],
      model_update: [
        "Neural network weights updated with new data",
        "Ensemble model rebalanced for better precision",
        "Feature importance scores recalculated"
      ],
      threshold_adjustment: [
        "Risk score thresholds optimized for better accuracy",
        "Velocity limits adjusted based on seasonal patterns",
        "Geographic risk factors updated"
      ],
      feature_engineering: [
        "New behavioral features extracted from user data",
        "Enhanced device fingerprinting capabilities added",
        "Temporal pattern analysis improved"
      ]
    };

    const category = categories[Math.floor(Math.random() * categories.length)];
    const eventList = events[category];
    
    return {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      event: eventList[Math.floor(Math.random() * eventList.length)],
      description: "System automatically adapted to improve detection accuracy",
      timestamp: new Date(),
      impact: Math.random() * 10 + 1,
      category
    };
  };

  // Simulate continuous learning
  useEffect(() => {
    if (!isLearning) return;

    const interval = setInterval(() => {
      // Update learning metrics
      setLearningMetrics(prev => ({
        totalSamples: prev.totalSamples + Math.floor(Math.random() * 1000) + 500,
        newPatterns: prev.newPatterns + Math.floor(Math.random() * 3),
        accuracyImprovement: Math.min(5, prev.accuracyImprovement + Math.random() * 0.1),
        falsePositiveReduction: Math.min(15, prev.falsePositiveReduction + Math.random() * 0.2),
        adaptationRate: 85 + Math.random() * 10,
        modelUpdates: prev.modelUpdates + (Math.random() > 0.7 ? 1 : 0)
      }));

      // Generate feedback
      if (Math.random() > 0.6) {
        const newFeedback = generateFeedback();
        setFeedbackData(prev => [newFeedback, ...prev.slice(0, 9)]);
      }

      // Generate adaptation events
      if (Math.random() > 0.8) {
        const newEvent = generateAdaptationEvent();
        setAdaptationEvents(prev => [newEvent, ...prev.slice(0, 4)]);
      }

      // Update learning progress
      setLearningProgress(prev => (prev + Math.random() * 5) % 100);
    }, 3000);

    return () => clearInterval(interval);
  }, [isLearning]);

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case "analyst_feedback": return Users;
      case "user_appeal": return AlertTriangle;
      case "system_detection": return Brain;
      default: return Activity;
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case "correct": return "text-green-500";
      case "incorrect": return "text-red-500";
      case "partial": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "pattern_detection": return Eye;
      case "model_update": return RefreshCw;
      case "threshold_adjustment": return Settings;
      case "feature_engineering": return Lightbulb;
      default: return Activity;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  return (
    <section id="learning" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Brain className="w-4 h-4 mr-2" />
            Continuous Learning System
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Adaptive AI That Never Stops Learning
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI system continuously learns from new data, analyst feedback, and emerging fraud patterns to improve detection accuracy
          </p>
        </div>

        {/* Learning Status */}
        <div className="flex items-center justify-center mb-8">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={cn("w-3 h-3 rounded-full", isLearning ? "bg-green-500 animate-pulse" : "bg-gray-500")} />
                <span className="font-medium">
                  {isLearning ? "Actively Learning" : "Learning Paused"}
                </span>
              </div>
              
              <Button
                size="sm"
                variant={isLearning ? "default" : "outline"}
                onClick={() => setIsLearning(!isLearning)}
              >
                {isLearning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isLearning ? "Pause" : "Resume"}
              </Button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Learning Progress:</span>
                <div className="w-24">
                  <Progress value={learningProgress} className="h-2" />
                </div>
                <span className="text-sm font-medium">{learningProgress.toFixed(0)}%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Learning Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="text-center">
                <Database className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-lg font-bold">{(learningMetrics.totalSamples / 1000).toFixed(1)}K</div>
                <div className="text-xs text-muted-foreground">New Samples</div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="text-center">
                <Eye className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-lg font-bold">{learningMetrics.newPatterns}</div>
                <div className="text-xs text-muted-foreground">New Patterns</div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="text-center">
                <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-lg font-bold">+{learningMetrics.accuracyImprovement.toFixed(2)}%</div>
                <div className="text-xs text-muted-foreground">Accuracy Gain</div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="text-center">
                <Shield className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <div className="text-lg font-bold">-{learningMetrics.falsePositiveReduction.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">False Positives</div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="text-center">
                <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-lg font-bold">{learningMetrics.adaptationRate.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">Adaptation Rate</div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="text-center">
                <RefreshCw className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <div className="text-lg font-bold">{learningMetrics.modelUpdates}</div>
                <div className="text-xs text-muted-foreground">Model Updates</div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feedback Stream */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-accent" />
              Learning Feedback Stream
            </h3>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              <AnimatePresence>
                {feedbackData.map((feedback) => {
                  const Icon = getFeedbackIcon(feedback.type);
                  return (
                    <motion.div
                      key={feedback.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-3 bg-background/50 rounded-lg border border-border/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium capitalize">
                            {feedback.type.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            feedback.impact === "high" ? "destructive" :
                            feedback.impact === "medium" ? "default" : "secondary"
                          }>
                            {feedback.impact}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {feedback.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={cn("text-sm font-medium", getDecisionColor(feedback.decision))}>
                          Decision: {feedback.decision}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Confidence: {feedback.confidence.toFixed(1)}%
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </Card>

          {/* Adaptation Events */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Network className="w-5 h-5 mr-2 text-accent" />
              System Adaptations
            </h3>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              <AnimatePresence>
                {adaptationEvents.map((event) => {
                  const Icon = getCategoryIcon(event.category);
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-3 bg-background/50 rounded-lg border border-border/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-primary" />
                          <Badge variant="outline" className="text-xs">
                            {event.category.replace('_', ' ')}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <p className="text-sm mb-2">{event.event}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{event.description}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-muted-foreground">Impact:</span>
                          <span className="text-xs font-medium text-green-500">
                            +{event.impact.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* Learning Process Overview */}
        <Card className="mt-8 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-accent" />
            Continuous Learning Process
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-blue-500" />
              </div>
              <h4 className="font-semibold mb-2">Data Collection</h4>
              <p className="text-sm text-muted-foreground">
                Continuously ingesting new transaction data, analyst feedback, and user appeals
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-purple-500" />
              </div>
              <h4 className="font-semibold mb-2">Pattern Analysis</h4>
              <p className="text-sm text-muted-foreground">
                AI algorithms identify new fraud patterns and behavioral anomalies
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-green-500" />
              </div>
              <h4 className="font-semibold mb-2">Model Updates</h4>
              <p className="text-sm text-muted-foreground">
                Machine learning models are retrained and optimized with new insights
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-500" />
              </div>
              <h4 className="font-semibold mb-2">Performance Boost</h4>
              <p className="text-sm text-muted-foreground">
                Enhanced accuracy and reduced false positives in fraud detection
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ContinuousLearningSystem;
