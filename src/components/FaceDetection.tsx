import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Camera,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Fingerprint,
  Loader2,
  ScanLine,
} from 'lucide-react';

interface FaceAnalysis {
  matchScore: number;
  liveness: number;
  features: {
    name: string;
    confidence: number;
  }[];
  threats: string[];
  status: 'verified' | 'suspicious' | 'rejected';
}

export function FaceDetection() {
  const [isCapturing, setIsCapturing] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysis, setAnalysis] = React.useState<FaceAnalysis | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCapturing(false);
    }
  };

  const captureAndAnalyze = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        // Stop camera after capture
        stopCamera();
        analyzeFace();
      }
    }
  };

  const analyzeFace = () => {
    setIsAnalyzing(true);

    // Simulate analysis
    setTimeout(() => {
      const mockAnalysis: FaceAnalysis = {
        matchScore: 95.7,
        liveness: 98.2,
        features: [
          { name: 'Face Match', confidence: 95.7 },
          { name: 'Liveness Detection', confidence: 98.2 },
          { name: 'Anti-Spoofing', confidence: 97.5 },
          { name: 'Expression Analysis', confidence: 94.8 },
        ],
        threats: [
          'No deepfake detected',
          'No presentation attack detected',
          'Genuine presence confirmed',
        ],
        status: 'verified',
      };

      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getStatusColor = (status: FaceAnalysis['status']) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'suspicious':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
    }
  };

  const getStatusIcon = (status: FaceAnalysis['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'suspicious':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Face Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative aspect-video w-full border rounded-lg overflow-hidden bg-muted">
              {isCapturing ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-cover"
                />
              )}
              {!isCapturing && !canvasRef.current?.toDataURL() && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <User className="h-20 w-20 text-muted-foreground/50" />
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              {!isCapturing ? (
                <Button onClick={startCamera}>
                  <Camera className="mr-2 h-4 w-4" />
                  Start Camera
                </Button>
              ) : (
                <Button onClick={captureAndAnalyze}>
                  <ScanLine className="mr-2 h-4 w-4" />
                  Capture & Verify
                </Button>
              )}
            </div>

            {isAnalyzing && (
              <div className="text-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <div className="text-sm text-muted-foreground">
                  Analyzing face...
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          {analysis ? (
            <Tabs defaultValue="verification">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="verification">Verification</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="verification" className="space-y-4">
                <div className="pt-4 text-center space-y-2">
                  <Badge
                    variant="outline"
                    className={getStatusColor(analysis.status)}
                  >
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(analysis.status)}
                      <span>{analysis.status.toUpperCase()}</span>
                    </div>
                  </Badge>
                  <div className="text-3xl font-bold">
                    {analysis.matchScore.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Match Confidence
                  </div>
                </div>

                <div className="space-y-4">
                  {analysis.features.map((feature) => (
                    <div key={feature.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{feature.name}</span>
                        <span>{feature.confidence.toFixed(1)}%</span>
                      </div>
                      <Progress value={feature.confidence} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="security" className="pt-4 space-y-4">
                {analysis.threats.map((threat, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    {threat}
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Capture and verify your face to see the analysis results
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
