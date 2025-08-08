import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Camera, 
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
  QrCode,
  UserCheck,
  AlertCircle,
  Radar,
  Layers,
  Sparkles,
  Video,
  Play,
  Pause,
  RotateCcw,
  Settings,
  MapPin,
  Navigation
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { cameraService, FaceDetectionResult } from "@/services/CameraService";
import { qrCodeService, QRCodeData, QRSecurityAnalysis } from "@/services/QRCodeService";
import { locationService, LocationData, LocationRiskAssessment } from "@/services/LocationService";

interface DetectionStats {
  totalDetections: number;
  faceDetections: number;
  qrDetections: number;
  averageRiskScore: number;
  processingSpeed: number;
  accuracy: number;
  livenessScore: number;
  spoofingAttempts: number;
}

const RealComputerVision = () => {
  const [isActive, setIsActive] = useState(false);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [faceDetections, setFaceDetections] = useState<FaceDetectionResult[]>([]);
  const [qrDetections, setQRDetections] = useState<{ data: QRCodeData; analysis: QRSecurityAnalysis }[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationRisk, setLocationRisk] = useState<LocationRiskAssessment | null>(null);
  const [stats, setStats] = useState<DetectionStats>({
    totalDetections: 0,
    faceDetections: 0,
    qrDetections: 0,
    averageRiskScore: 0,
    processingSpeed: 0,
    accuracy: 0,
    livenessScore: 0,
    spoofingAttempts: 0
  });
  const [selectedDetection, setSelectedDetection] = useState<FaceDetectionResult | null>(null);
  const [viewMode, setViewMode] = useState<'live' | 'analysis' | 'history'>('live');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize services and request permissions
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Request location permission
        await locationService.getCurrentLocation();
        setPermissionsGranted(true);
        
        // Set up location tracking
        locationService.onLocationUpdate((location) => {
          setCurrentLocation(location);
        });
        
        locationService.onRiskUpdate((risk) => {
          setLocationRisk(risk);
        });
        
        // Start location tracking
        locationService.startLocationTracking();
      } catch (error) {
        console.error('Failed to initialize services:', error);
        setError('Failed to access location services');
      }
    };

    initializeServices();

    return () => {
      locationService.stopLocationTracking();
    };
  }, []);

  // Start camera and detection
  const startDetection = useCallback(async () => {
    try {
      setError(null);
      setIsProcessing(true);

      // Start camera
      const video = await cameraService.startCamera({
        width: 640,
        height: 480,
        facingMode: 'user',
        frameRate: 30
      });

      if (videoRef.current) {
        videoRef.current.srcObject = video.srcObject;
        setIsCameraStarted(true);
      }

      // Set up face detection callbacks
      cameraService.onDetection((detections) => {
        setFaceDetections(detections);
        updateStats(detections, []);
        
        // Draw detection overlays
        drawDetectionOverlays(detections);
      });

      // Set up QR code detection
      qrCodeService.onQRDetection((qrData, analysis) => {
        const newQRDetection = { data: qrData, analysis };
        setQRDetections(prev => [...prev.slice(-9), newQRDetection]);
        updateStats([], [newQRDetection]);
      });

      // Start continuous detection
      cameraService.startContinuousDetection(100);
      
      // Start QR scanning
      const scanQR = async () => {
        if (videoRef.current && isActive) {
          await qrCodeService.scanFromVideo(videoRef.current);
          setTimeout(scanQR, 500); // Scan every 500ms
        }
      };
      scanQR();

      setIsActive(true);
      setIsProcessing(false);
    } catch (error) {
      console.error('Failed to start detection:', error);
      setError(error instanceof Error ? error.message : 'Failed to start camera');
      setIsProcessing(false);
    }
  }, [isActive]);

  // Stop detection
  const stopDetection = useCallback(() => {
    cameraService.stopCamera();
    cameraService.stopContinuousDetection();
    setIsActive(false);
    setIsCameraStarted(false);
    setFaceDetections([]);
    setQRDetections([]);
  }, []);

  // Update statistics
  const updateStats = useCallback((faces: FaceDetectionResult[], qrs: { data: QRCodeData; analysis: QRSecurityAnalysis }[]) => {
    setStats(prev => {
      const newFaceCount = prev.faceDetections + faces.length;
      const newQRCount = prev.qrDetections + qrs.length;
      const totalDetections = newFaceCount + newQRCount;
      
      // Calculate average risk score
      const faceRisks = faces.map(f => f.riskScore);
      const qrRisks = qrs.map(q => q.analysis.riskScore);
      const allRisks = [...faceRisks, ...qrRisks];
      const averageRiskScore = allRisks.length > 0 ? 
        allRisks.reduce((sum, risk) => sum + risk, 0) / allRisks.length : 0;

      // Calculate liveness score
      const livenessScores = faces.map(f => f.livenessScore);
      const livenessScore = livenessScores.length > 0 ?
        livenessScores.reduce((sum, score) => sum + score, 0) / livenessScores.length : 0;

      // Count spoofing attempts
      const spoofingAttempts = prev.spoofingAttempts + faces.filter(f => !f.isReal).length;

      return {
        totalDetections,
        faceDetections: newFaceCount,
        qrDetections: newQRCount,
        averageRiskScore,
        processingSpeed: 30, // Simulated FPS
        accuracy: 96.1, // Simulated accuracy
        livenessScore,
        spoofingAttempts
      };
    });
  }, []);

  // Draw detection overlays on canvas
  const drawDetectionOverlays = useCallback((detections: FaceDetectionResult[]) => {
    if (!overlayCanvasRef.current || !videoRef.current) return;

    const canvas = overlayCanvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw face detection boxes
    detections.forEach((detection, index) => {
      const box = detection.detection.box;
      const riskScore = detection.riskScore;
      
      // Choose color based on risk level
      let color = '#22c55e'; // Green for low risk
      if (riskScore > 70) color = '#ef4444'; // Red for high risk
      else if (riskScore > 40) color = '#f59e0b'; // Yellow for medium risk

      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      // Draw risk score label
      ctx.fillStyle = color;
      ctx.font = '14px Arial';
      ctx.fillText(
        `Risk: ${riskScore.toFixed(1)}% | Live: ${detection.livenessScore.toFixed(1)}%`,
        box.x,
        box.y - 10
      );

      // Draw landmarks if available
      if (detection.landmarks) {
        ctx.fillStyle = '#3b82f6';
        // Simplified landmark drawing - just mark key points
        const landmarks = detection.landmarks;
        if (landmarks.getLeftEye && landmarks.getRightEye) {
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();
          
          leftEye.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
            ctx.fill();
          });
          
          rightEye.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
            ctx.fill();
          });
        }
      }
    });
  }, []);

  // Get risk level badge variant
  const getRiskBadgeVariant = (riskScore: number) => {
    if (riskScore < 30) return "secondary";
    if (riskScore < 60) return "default";
    return "destructive";
  };

  // Get risk level text
  const getRiskLevelText = (riskScore: number) => {
    if (riskScore < 30) return "Low Risk";
    if (riskScore < 60) return "Medium Risk";
    return "High Risk";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-3"
          >
            <div className="p-3 bg-primary/10 rounded-full">
              <Eye className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Real Computer Vision Security
            </h1>
          </motion.div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Live camera-based face detection, QR code security analysis, and location-aware fraud prevention
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Control Panel */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Settings className="w-5 h-5 mr-2 text-accent" />
              Detection Controls
            </h3>
            <div className="flex items-center space-x-2">
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
              {currentLocation && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>Location: {currentLocation.accuracy.toFixed(0)}m accuracy</span>
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={isActive ? stopDetection : startDetection}
              disabled={isProcessing}
              className="flex items-center space-x-2"
            >
              {isProcessing ? (
                <Activity className="w-4 h-4 animate-spin" />
              ) : isActive ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isProcessing ? "Starting..." : isActive ? "Stop Detection" : "Start Detection"}</span>
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('live')}
                className={cn(viewMode === 'live' && "bg-primary/10")}
              >
                <Video className="w-4 h-4 mr-1" />
                Live
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('analysis')}
                className={cn(viewMode === 'analysis' && "bg-primary/10")}
              >
                <Brain className="w-4 h-4 mr-1" />
                Analysis
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('history')}
                className={cn(viewMode === 'history' && "bg-primary/10")}
              >
                <Clock className="w-4 h-4 mr-1" />
                History
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Video Feed */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-accent" />
                  Live Camera Feed
                </h3>
                <div className="flex items-center space-x-2">
                  <Badge variant={isCameraStarted ? "default" : "secondary"}>
                    {isCameraStarted ? "Camera Active" : "Camera Inactive"}
                  </Badge>
                  <Badge variant="outline">
                    {stats.processingSpeed} FPS
                  </Badge>
                </div>
              </div>

              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                {isCameraStarted ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <canvas
                      ref={overlayCanvasRef}
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Click "Start Detection" to begin camera feed</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Statistics Panel */}
          <div className="space-y-6">
            {/* Real-time Stats */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-accent" />
                Detection Statistics
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Detections</span>
                  <Badge variant="outline">{stats.totalDetections}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Face Detections</span>
                  <Badge variant="secondary">{stats.faceDetections}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">QR Codes</span>
                  <Badge variant="secondary">{stats.qrDetections}</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Risk</span>
                    <Badge variant={getRiskBadgeVariant(stats.averageRiskScore)}>
                      {stats.averageRiskScore.toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress value={stats.averageRiskScore} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Liveness Score</span>
                    <Badge variant="secondary">{stats.livenessScore.toFixed(1)}%</Badge>
                  </div>
                  <Progress value={stats.livenessScore} className="h-2" />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Spoofing Attempts</span>
                  <Badge variant={stats.spoofingAttempts > 0 ? "destructive" : "secondary"}>
                    {stats.spoofingAttempts}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Location Risk */}
            {currentLocation && locationRisk && (
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Navigation className="w-5 h-5 mr-2 text-accent" />
                  Location Security
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Risk Level</span>
                    <Badge variant={getRiskBadgeVariant(locationRisk.riskScore)}>
                      {locationRisk.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Risk Score</span>
                      <span className="text-sm font-medium">{locationRisk.riskScore.toFixed(1)}%</span>
                    </div>
                    <Progress value={locationRisk.riskScore} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Known Location</span>
                    <Badge variant={locationRisk.isKnownLocation ? "secondary" : "default"}>
                      {locationRisk.isKnownLocation ? "Yes" : "No"}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Time of Day</span>
                    <Badge variant="outline">{locationRisk.timeOfDay}</Badge>
                  </div>
                  
                  {locationRisk.factors.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Risk Factors:</span>
                      <div className="space-y-1">
                        {locationRisk.factors.slice(0, 3).map((factor, index) => (
                          <div key={index} className="text-xs bg-background/50 p-2 rounded">
                            {factor}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealComputerVision;
