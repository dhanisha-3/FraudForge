import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Camera,
  Eye,
  QrCode,
  MapPin,
  Play,
  Pause,
  RotateCcw,
  Shield,
  AlertTriangle,
  CheckCircle,
  Brain,
  Target,
  Activity,
  Users,
  Scan,
  Navigation
} from 'lucide-react';
import { cameraService, FaceDetectionResult } from '@/services/CameraService';
import { qrCodeService, QRCodeData, QRSecurityAnalysis } from '@/services/QRCodeService';
import { locationService, LocationData, LocationRiskAssessment } from '@/services/LocationService';

// Import ALL computer vision components
import AdvancedComputerVision from "@/components/AdvancedComputerVision";
import RealComputerVision from "@/components/RealComputerVision";
import DeepfakeDetectionLab from "@/components/DeepfakeDetectionLab";
import QRCodeSecurityAnalyzer from "@/components/QRCodeSecurityAnalyzer";
import BehavioralBiometrics from "@/components/BehavioralBiometrics";
import VoiceVerification from "@/components/VoiceVerification";
// Removed non-existent component
import GeospatialFraudDetection from "@/components/GeospatialFraudDetection";
import DigitalIDManagement from "@/components/DigitalIDManagement";
import DecentralizedIdentityKYC from "@/components/DecentralizedIdentityKYC";
import UnifiedAccountProtection from "@/components/UnifiedAccountProtection";

const ComputerVision = () => {
  const [activeTab, setActiveTab] = useState('face-detection');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Face Detection State
  const [faceDetections, setFaceDetections] = useState<FaceDetectionResult[]>([]);
  const [faceStats, setFaceStats] = useState({
    totalDetections: 0,
    averageRiskScore: 0,
    livenessScore: 0,
    spoofingAttempts: 0
  });

  // QR Code State
  const [qrDetections, setQRDetections] = useState<{ data: QRCodeData; analysis: QRSecurityAnalysis }[]>([]);
  const [qrStats, setQRStats] = useState({
    totalScanned: 0,
    threatsBlocked: 0,
    averageRiskScore: 0
  });

  // Location State
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationRisk, setLocationRisk] = useState<LocationRiskAssessment | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Initialize location service
        await locationService.getCurrentLocation();
        
        locationService.onLocationUpdate((location) => {
          setCurrentLocation(location);
        });
        
        locationService.onRiskUpdate((risk) => {
          setLocationRisk(risk);
        });
        
        locationService.startLocationTracking();
      } catch (error) {
        console.error('Failed to initialize location services:', error);
      }
    };

    initializeServices();

    return () => {
      locationService.stopLocationTracking();
      cameraService.stopCamera();
    };
  }, []);

  // Start camera and detection
  const startDetection = useCallback(async () => {
    try {
      setError(null);
      setIsProcessing(true);

      const video = await cameraService.startCamera({
        width: 640,
        height: 480,
        facingMode: 'user',
        frameRate: 30
      });

      if (videoRef.current) {
        videoRef.current.srcObject = video.srcObject;
      }

      // Face detection callbacks
      cameraService.onDetection((detections) => {
        setFaceDetections(detections);
        updateFaceStats(detections);
      });

      // QR code detection
      qrCodeService.onQRDetection((qrData, analysis) => {
        const newDetection = { data: qrData, analysis };
        setQRDetections(prev => [...prev.slice(-9), newDetection]);
        updateQRStats(newDetection);
      });

      cameraService.startContinuousDetection(100);
      
      // Start QR scanning
      const scanQR = async () => {
        if (videoRef.current && isProcessing) {
          await qrCodeService.scanFromVideo(videoRef.current);
          setTimeout(scanQR, 500);
        }
      };
      scanQR();

      setIsProcessing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to start camera');
      setIsProcessing(false);
    }
  }, [isProcessing]);

  const stopDetection = useCallback(() => {
    cameraService.stopCamera();
    cameraService.stopContinuousDetection();
    setIsProcessing(false);
    setFaceDetections([]);
    setQRDetections([]);
  }, []);

  const updateFaceStats = useCallback((detections: FaceDetectionResult[]) => {
    setFaceStats(prev => {
      const totalDetections = prev.totalDetections + detections.length;
      const riskScores = detections.map(d => d.riskScore);
      const livenessScores = detections.map(d => d.livenessScore);
      const spoofingAttempts = prev.spoofingAttempts + detections.filter(d => !d.isReal).length;

      return {
        totalDetections,
        averageRiskScore: riskScores.length > 0 ? riskScores.reduce((a, b) => a + b, 0) / riskScores.length : 0,
        livenessScore: livenessScores.length > 0 ? livenessScores.reduce((a, b) => a + b, 0) / livenessScores.length : 0,
        spoofingAttempts
      };
    });
  }, []);

  const updateQRStats = useCallback((detection: { data: QRCodeData; analysis: QRSecurityAnalysis }) => {
    setQRStats(prev => ({
      totalScanned: prev.totalScanned + 1,
      threatsBlocked: prev.threatsBlocked + (detection.analysis.riskLevel === 'high' || detection.analysis.riskLevel === 'critical' ? 1 : 0),
      averageRiskScore: (prev.averageRiskScore * prev.totalScanned + detection.analysis.riskScore) / (prev.totalScanned + 1)
    }));
  }, []);

  const getRiskBadgeVariant = (riskScore: number) => {
    if (riskScore < 30) return "secondary";
    if (riskScore < 60) return "default";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-4">
          Computer Vision Security
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          AI-powered visual fraud detection and advanced biometric security systems
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Face Detection</h3>
            <p className="text-muted-foreground">Real-time facial recognition with liveness detection</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Deepfake Detection</h3>
            <p className="text-muted-foreground">Advanced AI to detect synthetic media and deepfakes</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">QR Code Security</h3>
            <p className="text-muted-foreground">Comprehensive QR code analysis and threat detection</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComputerVision;
