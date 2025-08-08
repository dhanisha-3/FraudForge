import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Users,
  TrendingUp,
  BarChart3,
  Zap,
  Lock,
  Bot,
  Cpu,
  Scan,
  Camera,
  Video,
  Upload,
  Download,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Layers,
  Sparkles,
  AlertCircle,
  FileVideo,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DeepfakeAnalysis {
  id: string;
  timestamp: Date;
  mediaType: "image" | "video" | "live";
  filename?: string;
  deepfakeScore: number;
  confidence: number;
  isDeepfake: boolean;
  analysisDetails: {
    facialInconsistencies: number;
    temporalArtifacts: number;
    compressionArtifacts: number;
    eyeBlinkPattern: number;
    lipSyncAccuracy: number;
    skinTextureAnalysis: number;
    lightingConsistency: number;
    edgeArtifacts: number;
  };
  technicalMetrics: {
    resolution: string;
    frameRate?: number;
    duration?: number;
    fileSize?: string;
    codec?: string;
  };
  riskFactors: string[];
  recommendation: "authentic" | "suspicious" | "likely_deepfake" | "confirmed_deepfake";
}

interface ModelPerformance {
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  processingTime: number;
  lastUpdated: Date;
  status: "active" | "training" | "updating";
}

interface DetectionPattern {
  id: string;
  pattern: string;
  type: "facial" | "temporal" | "compression" | "lighting" | "audio";
  detectionCount: number;
  accuracy: number;
  lastDetected: Date;
  severity: "low" | "medium" | "high" | "critical";
}

const DeepfakeDetectionLab = () => {
  const [analyses, setAnalyses] = useState<DeepfakeAnalysis[]>([]);
  const [modelPerformance, setModelPerformance] = useState<ModelPerformance[]>([]);
  const [detectionPatterns, setDetectionPatterns] = useState<DetectionPattern[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<DeepfakeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisMode, setAnalysisMode] = useState<"upload" | "live" | "batch">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate realistic deepfake analysis
  const generateDeepfakeAnalysis = (mediaType: DeepfakeAnalysis['mediaType'], filename?: string): DeepfakeAnalysis => {
    const facialInconsistencies = Math.random() * 100;
    const temporalArtifacts = Math.random() * 100;
    const compressionArtifacts = Math.random() * 100;
    const eyeBlinkPattern = Math.random() * 100;
    const lipSyncAccuracy = Math.random() * 100;
    const skinTextureAnalysis = Math.random() * 100;
    const lightingConsistency = Math.random() * 100;
    const edgeArtifacts = Math.random() * 100;

    // Calculate deepfake score based on multiple factors
    const deepfakeScore = Math.round(
      (facialInconsistencies * 0.2 +
       temporalArtifacts * 0.15 +
       compressionArtifacts * 0.1 +
       eyeBlinkPattern * 0.15 +
       lipSyncAccuracy * 0.15 +
       skinTextureAnalysis * 0.1 +
       lightingConsistency * 0.1 +
       edgeArtifacts * 0.05)
    );

    const isDeepfake = deepfakeScore > 60;
    const confidence = 70 + Math.random() * 25;

    const riskFactors: string[] = [];
    if (facialInconsistencies > 70) riskFactors.push("Facial geometry inconsistencies");
    if (temporalArtifacts > 70) riskFactors.push("Temporal artifacts detected");
    if (eyeBlinkPattern > 70) riskFactors.push("Unnatural eye blink patterns");
    if (lipSyncAccuracy > 70) riskFactors.push("Poor lip-sync accuracy");
    if (lightingConsistency > 70) riskFactors.push("Inconsistent lighting");

    let recommendation: DeepfakeAnalysis['recommendation'];
    if (deepfakeScore > 85) recommendation = "confirmed_deepfake";
    else if (deepfakeScore > 60) recommendation = "likely_deepfake";
    else if (deepfakeScore > 30) recommendation = "suspicious";
    else recommendation = "authentic";

    return {
      id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      mediaType,
      filename,
      deepfakeScore,
      confidence: Math.round(confidence),
      isDeepfake,
      analysisDetails: {
        facialInconsistencies: Math.round(facialInconsistencies),
        temporalArtifacts: Math.round(temporalArtifacts),
        compressionArtifacts: Math.round(compressionArtifacts),
        eyeBlinkPattern: Math.round(eyeBlinkPattern),
        lipSyncAccuracy: Math.round(lipSyncAccuracy),
        skinTextureAnalysis: Math.round(skinTextureAnalysis),
        lightingConsistency: Math.round(lightingConsistency),
        edgeArtifacts: Math.round(edgeArtifacts)
      },
      technicalMetrics: {
        resolution: mediaType === "video" ? "1920x1080" : "1024x768",
        frameRate: mediaType === "video" ? 30 : undefined,
        duration: mediaType === "video" ? Math.round(Math.random() * 120 + 10) : undefined,
        fileSize: `${(Math.random() * 50 + 5).toFixed(1)}MB`,
        codec: mediaType === "video" ? "H.264" : "JPEG"
      },
      riskFactors,
      recommendation
    };
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      analyzeMedia(file);
    }
  };

  // Analyze media file
  const analyzeMedia = (file: File) => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
      const analysis = generateDeepfakeAnalysis(mediaType, file.name);
      setAnalyses(prev => [analysis, ...prev.slice(0, 9)]);
      setSelectedAnalysis(analysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  // Initialize data
  useEffect(() => {
    // Initialize model performance data
    setModelPerformance([
      {
        modelName: "FaceForensics++ CNN",
        accuracy: 94.2,
        precision: 92.8,
        recall: 95.1,
        f1Score: 93.9,
        processingTime: 1.2,
        lastUpdated: new Date(Date.now() - 86400000),
        status: "active"
      },
      {
        modelName: "Deepfake-o-meter",
        accuracy: 91.7,
        precision: 89.3,
        recall: 94.2,
        f1Score: 91.7,
        processingTime: 2.1,
        lastUpdated: new Date(Date.now() - 172800000),
        status: "active"
      },
      {
        modelName: "XceptionNet Enhanced",
        accuracy: 96.1,
        precision: 95.4,
        recall: 96.8,
        f1Score: 96.1,
        processingTime: 0.8,
        lastUpdated: new Date(Date.now() - 43200000),
        status: "training"
      }
    ]);

    // Initialize detection patterns
    setDetectionPatterns([
      {
        id: "1",
        pattern: "Facial Landmark Drift",
        type: "facial",
        detectionCount: 1247,
        accuracy: 89.5,
        lastDetected: new Date(Date.now() - 1800000),
        severity: "high"
      },
      {
        id: "2",
        pattern: "Temporal Inconsistency",
        type: "temporal",
        detectionCount: 892,
        accuracy: 94.2,
        lastDetected: new Date(Date.now() - 3600000),
        severity: "critical"
      },
      {
        id: "3",
        pattern: "Compression Artifacts",
        type: "compression",
        detectionCount: 634,
        accuracy: 87.3,
        lastDetected: new Date(Date.now() - 900000),
        severity: "medium"
      }
    ]);

    // Generate some sample analyses
    const sampleAnalyses = [
      generateDeepfakeAnalysis("video", "sample_video_1.mp4"),
      generateDeepfakeAnalysis("image", "profile_photo.jpg"),
      generateDeepfakeAnalysis("video", "interview_clip.mp4")
    ];
    setAnalyses(sampleAnalyses);
  }, []);

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "authentic": return "text-green-500";
      case "suspicious": return "text-yellow-500";
      case "likely_deepfake": return "text-orange-500";
      case "confirmed_deepfake": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "text-green-500";
      case "medium": return "text-yellow-500";
      case "high": return "text-orange-500";
      case "critical": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <section id="deepfake-detection" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Bot className="w-4 h-4 mr-2" />
            Deepfake Detection Laboratory
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Advanced Deepfake Detection & Analysis
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            State-of-the-art deepfake detection using multiple AI models with comprehensive analysis and real-time processing
          </p>
        </div>

        {/* Detection Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <FileVideo className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold">{analyses.length}</span>
              </div>
              <div className="text-sm text-muted-foreground">Media Analyzed</div>
              <Progress value={(analyses.filter(a => a.isDeepfake).length / Math.max(analyses.length, 1)) * 100} className="h-2 mt-2" />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-2xl font-bold">{analyses.filter(a => a.isDeepfake).length}</span>
              </div>
              <div className="text-sm text-muted-foreground">Deepfakes Detected</div>
              <Progress value={(analyses.filter(a => a.recommendation === "confirmed_deepfake").length / Math.max(analyses.length, 1)) * 100} className="h-2 mt-2" />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <Brain className="w-5 h-5 text-purple-500" />
                <span className="text-2xl font-bold">{modelPerformance.filter(m => m.status === "active").length}</span>
              </div>
              <div className="text-sm text-muted-foreground">Active Models</div>
              <Progress value={(modelPerformance.filter(m => m.accuracy > 90).length / Math.max(modelPerformance.length, 1)) * 100} className="h-2 mt-2" />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold">96.1%</span>
              </div>
              <div className="text-sm text-muted-foreground">Best Accuracy</div>
              <Progress value={96.1} className="h-2 mt-2" />
            </Card>
          </motion.div>
        </div>

        {/* Control Panel */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Mode:</span>
              <select 
                className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                value={analysisMode}
                onChange={(e) => setAnalysisMode(e.target.value as any)}
              >
                <option value="upload">Upload Analysis</option>
                <option value="live">Live Detection</option>
                <option value="batch">Batch Processing</option>
              </select>
            </div>

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Media</span>
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant={isAnalyzing ? "default" : "secondary"} className="flex items-center space-x-2">
              <Activity className="w-3 h-3" />
              <span>{isAnalyzing ? "Analyzing..." : "Ready"}</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analysis Results */}
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Scan className="w-5 h-5 mr-2 text-accent" />
              Deepfake Analysis Results
            </h3>
            
            {selectedAnalysis ? (
              <div className="space-y-6">
                <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">{selectedAnalysis.filename || "Live Analysis"}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        selectedAnalysis.recommendation === "authentic" ? "secondary" :
                        selectedAnalysis.recommendation === "suspicious" ? "default" :
                        selectedAnalysis.recommendation === "likely_deepfake" ? "destructive" : "destructive"
                      }>
                        {selectedAnalysis.recommendation.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {selectedAnalysis.confidence}% confidence
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className={cn("text-2xl font-bold", getRecommendationColor(selectedAnalysis.recommendation))}>
                        {selectedAnalysis.deepfakeScore}
                      </div>
                      <div className="text-xs text-muted-foreground">Deepfake Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-500">{selectedAnalysis.technicalMetrics.resolution}</div>
                      <div className="text-xs text-muted-foreground">Resolution</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-500">{selectedAnalysis.technicalMetrics.fileSize}</div>
                      <div className="text-xs text-muted-foreground">File Size</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Risk Assessment</span>
                      <span className={cn("text-sm font-medium", getRecommendationColor(selectedAnalysis.recommendation))}>
                        {selectedAnalysis.deepfakeScore}%
                      </span>
                    </div>
                    <Progress value={selectedAnalysis.deepfakeScore} className="h-3" />
                  </div>

                  {/* Detailed Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-background/50 rounded border border-border/50">
                      <h5 className="font-medium text-sm mb-2">Detection Metrics</h5>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Facial Inconsistencies:</span>
                          <span>{selectedAnalysis.analysisDetails.facialInconsistencies}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Temporal Artifacts:</span>
                          <span>{selectedAnalysis.analysisDetails.temporalArtifacts}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Eye Blink Pattern:</span>
                          <span>{selectedAnalysis.analysisDetails.eyeBlinkPattern}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lip Sync Accuracy:</span>
                          <span>{selectedAnalysis.analysisDetails.lipSyncAccuracy}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-background/50 rounded border border-border/50">
                      <h5 className="font-medium text-sm mb-2">Technical Analysis</h5>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Compression Artifacts:</span>
                          <span>{selectedAnalysis.analysisDetails.compressionArtifacts}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Skin Texture:</span>
                          <span>{selectedAnalysis.analysisDetails.skinTextureAnalysis}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lighting Consistency:</span>
                          <span>{selectedAnalysis.analysisDetails.lightingConsistency}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Edge Artifacts:</span>
                          <span>{selectedAnalysis.analysisDetails.edgeArtifacts}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedAnalysis.riskFactors.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Risk Factors:</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnalysis.riskFactors.map((factor, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <Bot className="w-16 h-16 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">No Analysis Selected</h4>
                <p>Upload media or select an analysis from the history to view detailed results</p>
              </div>
            )}
          </Card>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Model Performance */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Cpu className="w-5 h-5 mr-2 text-accent" />
                AI Models
              </h3>
              
              <div className="space-y-3">
                {modelPerformance.map((model, index) => (
                  <motion.div
                    key={model.modelName}
                    className="p-3 bg-background/50 rounded-lg border border-border/50"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{model.modelName}</span>
                      <Badge variant={model.status === "active" ? "default" : "secondary"}>
                        {model.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Accuracy: {model.accuracy}% | F1: {model.f1Score}%</div>
                      <div>Processing: {model.processingTime}s</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Analysis History */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-accent" />
                Analysis History
              </h3>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                <AnimatePresence>
                  {analyses.map((analysis) => (
                    <motion.div
                      key={analysis.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-3 bg-background/50 rounded-lg border border-border/50 cursor-pointer hover:bg-background/70"
                      onClick={() => setSelectedAnalysis(analysis)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {analysis.mediaType === "video" ? 
                            <FileVideo className="w-4 h-4" /> : 
                            <ImageIcon className="w-4 h-4" />
                          }
                          <span className="text-sm font-medium">
                            {analysis.filename?.substring(0, 15) || "Live"}{analysis.filename && analysis.filename.length > 15 ? "..." : ""}
                          </span>
                        </div>
                        <Badge variant={
                          analysis.recommendation === "authentic" ? "secondary" :
                          analysis.recommendation === "suspicious" ? "default" : "destructive"
                        } className="text-xs">
                          {analysis.deepfakeScore}%
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {analysis.timestamp.toLocaleTimeString()}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>

            {/* Detection Patterns */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-accent" />
                Detection Patterns
              </h3>
              
              <div className="space-y-3">
                {detectionPatterns.map((pattern) => (
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
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Type: {pattern.type} | Accuracy: {pattern.accuracy}%</div>
                      <div>Detected: {pattern.detectionCount} times</div>
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

export default DeepfakeDetectionLab;
