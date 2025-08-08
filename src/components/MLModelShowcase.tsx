import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Cpu,
  Zap,
  Target,
  TrendingUp,
  Activity,
  BarChart3,
  Eye,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Code,
  Database,
  Network,
  Shield,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MLModel {
  id: string;
  name: string;
  type: "ensemble" | "neural" | "tree" | "svm" | "clustering";
  status: "active" | "training" | "testing" | "inactive";
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  latency: number;
  throughput: number;
  description: string;
  features: string[];
  lastTrained: Date;
  trainingData: number;
  version: string;
}

interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
  valLoss: number;
  valAccuracy: number;
}

const MLModelShowcase = () => {
  const [models, setModels] = useState<MLModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingMetrics, setTrainingMetrics] = useState<TrainingMetrics[]>([]);

  // Initialize ML models
  useEffect(() => {
    const initialModels: MLModel[] = [
      {
        id: "ensemble_primary",
        name: "Ensemble Fraud Classifier",
        type: "ensemble",
        status: "active",
        accuracy: 99.7,
        precision: 98.9,
        recall: 97.8,
        f1Score: 98.3,
        latency: 45,
        throughput: 10000,
        description: "Primary production model combining multiple algorithms for optimal fraud detection",
        features: ["Transaction amount", "Merchant category", "Geographic location", "Time patterns", "User behavior"],
        lastTrained: new Date(Date.now() - 86400000 * 2),
        trainingData: 2500000,
        version: "v2.1.3"
      },
      {
        id: "neural_network",
        name: "Deep Neural Network",
        type: "neural",
        status: "active",
        accuracy: 98.9,
        precision: 97.5,
        recall: 96.8,
        f1Score: 97.1,
        latency: 52,
        throughput: 8500,
        description: "Deep learning model for complex pattern recognition in transaction data",
        features: ["Behavioral biometrics", "Device fingerprinting", "Network analysis", "Temporal patterns"],
        lastTrained: new Date(Date.now() - 86400000 * 1),
        trainingData: 1800000,
        version: "v1.8.2"
      },
      {
        id: "gradient_boosting",
        name: "Gradient Boosting Trees",
        type: "tree",
        status: "active",
        accuracy: 98.2,
        precision: 97.1,
        recall: 96.5,
        f1Score: 96.8,
        latency: 38,
        throughput: 12000,
        description: "Fast and interpretable tree-based model for real-time decisions",
        features: ["Transaction features", "Historical patterns", "Risk indicators", "Merchant data"],
        lastTrained: new Date(Date.now() - 86400000 * 3),
        trainingData: 3200000,
        version: "v3.2.1"
      },
      {
        id: "anomaly_detector",
        name: "Anomaly Detection Engine",
        type: "clustering",
        status: "training",
        accuracy: 96.8,
        precision: 94.2,
        recall: 98.1,
        f1Score: 96.1,
        latency: 28,
        throughput: 15000,
        description: "Unsupervised learning model for detecting novel fraud patterns",
        features: ["Outlier detection", "Clustering analysis", "Statistical anomalies", "Behavioral deviations"],
        lastTrained: new Date(Date.now() - 86400000 * 0.5),
        trainingData: 5000000,
        version: "v1.5.0"
      },
      {
        id: "svm_classifier",
        name: "Support Vector Machine",
        type: "svm",
        status: "testing",
        accuracy: 97.3,
        precision: 96.8,
        recall: 95.9,
        f1Score: 96.3,
        latency: 41,
        throughput: 9500,
        description: "High-precision model for edge cases and complex decision boundaries",
        features: ["Feature engineering", "Kernel methods", "High-dimensional analysis", "Margin optimization"],
        lastTrained: new Date(Date.now() - 86400000 * 4),
        trainingData: 1500000,
        version: "v2.0.1"
      }
    ];

    setModels(initialModels);
    setSelectedModel(initialModels[0]);
  }, []);

  // Simulate model training
  const startTraining = (modelId: string) => {
    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingMetrics([]);

    // Update model status
    setModels(prev => prev.map(model => 
      model.id === modelId ? { ...model, status: "training" as const } : model
    ));

    // Simulate training progress
    const trainingInterval = setInterval(() => {
      setTrainingProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        
        // Generate training metrics
        if (newProgress % 10 < 5) {
          const epoch = Math.floor(newProgress / 10) + 1;
          const loss = 0.5 - (newProgress / 100) * 0.4 + Math.random() * 0.1;
          const accuracy = 0.8 + (newProgress / 100) * 0.19 + Math.random() * 0.01;
          
          setTrainingMetrics(prev => [...prev, {
            epoch,
            loss,
            accuracy,
            valLoss: loss + Math.random() * 0.05,
            valAccuracy: accuracy - Math.random() * 0.02
          }]);
        }

        if (newProgress >= 100) {
          clearInterval(trainingInterval);
          setIsTraining(false);
          
          // Update model with improved metrics
          setModels(prev => prev.map(model => 
            model.id === modelId ? { 
              ...model, 
              status: "active" as const,
              accuracy: Math.min(99.9, model.accuracy + Math.random() * 0.5),
              lastTrained: new Date()
            } : model
          ));
          
          return 100;
        }
        
        return newProgress;
      });
    }, 200);
  };

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case "ensemble": return Brain;
      case "neural": return Network;
      case "tree": return BarChart3;
      case "svm": return Target;
      case "clustering": return Activity;
      default: return Cpu;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-500";
      case "training": return "text-blue-500";
      case "testing": return "text-yellow-500";
      case "inactive": return "text-gray-500";
      default: return "text-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "training": return "secondary";
      case "testing": return "outline";
      case "inactive": return "outline";
      default: return "outline";
    }
  };

  return (
    <section id="ml-models" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Brain className="w-4 h-4 mr-2" />
            Machine Learning Models
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI-Powered Fraud Detection Models
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced machine learning models working together to detect fraud with unprecedented accuracy and speed
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Model List */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4">Active Models</h3>
              <div className="space-y-3">
                {models.map((model) => {
                  const Icon = getModelTypeIcon(model.type);
                  return (
                    <motion.div
                      key={model.id}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-all duration-200",
                        selectedModel?.id === model.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border/50 hover:border-border bg-background/50"
                      )}
                      onClick={() => setSelectedModel(model)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-5 h-5 text-primary" />
                          <span className="font-medium text-sm">{model.name}</span>
                        </div>
                        <Badge variant={getStatusBadge(model.status) as any}>
                          {model.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Accuracy:</span>
                          <span className="font-medium text-green-500">{model.accuracy}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Latency:</span>
                          <span className="font-medium">{model.latency}ms</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Version:</span>
                          <span className="font-medium">{model.version}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Model Details */}
          <div className="lg:col-span-2">
            {selectedModel && (
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    {React.createElement(getModelTypeIcon(selectedModel.type), { 
                      className: "w-8 h-8 text-primary" 
                    })}
                    <div>
                      <h3 className="text-xl font-bold">{selectedModel.name}</h3>
                      <p className="text-muted-foreground capitalize">{selectedModel.type} Model</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusBadge(selectedModel.status) as any}>
                      {selectedModel.status}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => startTraining(selectedModel.id)}
                      disabled={isTraining || selectedModel.status === "training"}
                    >
                      {isTraining ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Training...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Retrain
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">{selectedModel.description}</p>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">{selectedModel.accuracy}%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">{selectedModel.precision}%</div>
                    <div className="text-xs text-muted-foreground">Precision</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-500">{selectedModel.recall}%</div>
                    <div className="text-xs text-muted-foreground">Recall</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-500">{selectedModel.f1Score}%</div>
                    <div className="text-xs text-muted-foreground">F1 Score</div>
                  </div>
                </div>

                {/* Training Progress */}
                {isTraining && selectedModel.status === "training" && (
                  <div className="mb-6 p-4 bg-background/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Training Progress</span>
                      <span className="text-sm text-muted-foreground">{trainingProgress.toFixed(1)}%</span>
                    </div>
                    <Progress value={trainingProgress} className="h-2 mb-4" />
                    
                    {trainingMetrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Current Loss: </span>
                          <span className="font-medium">{trainingMetrics[trainingMetrics.length - 1]?.loss.toFixed(4)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Current Accuracy: </span>
                          <span className="font-medium">{(trainingMetrics[trainingMetrics.length - 1]?.accuracy * 100).toFixed(2)}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Model Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Model Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Version:</span>
                        <span className="font-medium">{selectedModel.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Latency:</span>
                        <span className="font-medium">{selectedModel.latency}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Throughput:</span>
                        <span className="font-medium">{selectedModel.throughput.toLocaleString()}/sec</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Training Data:</span>
                        <span className="font-medium">{(selectedModel.trainingData / 1000000).toFixed(1)}M samples</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Trained:</span>
                        <span className="font-medium">{selectedModel.lastTrained.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Key Features</h4>
                    <div className="space-y-2">
                      {selectedModel.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-6">
                  <Button variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Code className="w-4 h-4 mr-2" />
                    Export Model
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Model Comparison */}
        <Card className="mt-8 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-accent" />
            Model Performance Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2">Model</th>
                  <th className="text-center py-2">Status</th>
                  <th className="text-center py-2">Accuracy</th>
                  <th className="text-center py-2">Precision</th>
                  <th className="text-center py-2">Recall</th>
                  <th className="text-center py-2">F1 Score</th>
                  <th className="text-center py-2">Latency</th>
                  <th className="text-center py-2">Throughput</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => {
                  const Icon = getModelTypeIcon(model.type);
                  return (
                    <tr key={model.id} className="border-b border-border/20 hover:bg-background/50">
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-primary" />
                          <span className="font-medium">{model.name}</span>
                        </div>
                      </td>
                      <td className="text-center py-3">
                        <Badge variant={getStatusBadge(model.status) as any} className="text-xs">
                          {model.status}
                        </Badge>
                      </td>
                      <td className="text-center py-3">
                        <span className="font-medium text-green-500">{model.accuracy}%</span>
                      </td>
                      <td className="text-center py-3">
                        <span className="font-medium">{model.precision}%</span>
                      </td>
                      <td className="text-center py-3">
                        <span className="font-medium">{model.recall}%</span>
                      </td>
                      <td className="text-center py-3">
                        <span className="font-medium">{model.f1Score}%</span>
                      </td>
                      <td className="text-center py-3">
                        <span className="font-medium">{model.latency}ms</span>
                      </td>
                      <td className="text-center py-3">
                        <span className="font-medium">{(model.throughput / 1000).toFixed(1)}K/s</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default MLModelShowcase;
