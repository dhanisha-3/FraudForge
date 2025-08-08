import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  AlertTriangle,
  Shield,
  Video,
  Youtube,
  Download,
  FileText,
} from 'lucide-react';

interface VideoAnalysis {
  timestamp: string;
  confidence: number;
  type: 'suspicious' | 'normal' | 'fraudulent';
  details: string[];
}

export function VideoFraudDetection() {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [currentAnalysis, setCurrentAnalysis] = React.useState<VideoAnalysis[]>([]);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = React.useState<string>('');

  const fraudVideos = [
    {
      title: "Common ATM Fraud Techniques",
      url: "https://www.youtube.com/watch?v=example1",
      thumbnail: "/fraud-thumbnails/atm-fraud.jpg"
    },
    {
      title: "Online Banking Safety Tips",
      url: "https://www.youtube.com/watch?v=example2",
      thumbnail: "/fraud-thumbnails/online-banking.jpg"
    },
    {
      title: "Credit Card Skimming Prevention",
      url: "https://www.youtube.com/watch?v=example3",
      thumbnail: "/fraud-thumbnails/card-skimming.jpg"
    }
  ];

  const startAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate real-time analysis
    const interval = setInterval(() => {
      setCurrentAnalysis(prev => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          confidence: Math.random() * 100,
          type: Math.random() > 0.7 ? 'suspicious' : 'normal',
          details: ['Analyzing movement patterns', 'Checking for known fraud indicators']
        }
      ]);
    }, 2000);

    setTimeout(() => {
      clearInterval(interval);
      setIsAnalyzing(false);
    }, 10000);
  };

  const generateReport = () => {
    // Implementation for PDF report generation using jsPDF
    console.log('Generating PDF report...');
  };

  const getStatusBadge = (type: VideoAnalysis['type']) => {
    const styles = {
      normal: 'bg-green-500/10 text-green-500',
      suspicious: 'bg-yellow-500/10 text-yellow-500',
      fraudulent: 'bg-red-500/10 text-red-500'
    };

    return <Badge className={styles[type]} variant="outline">{type.toUpperCase()}</Badge>;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Educational Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {fraudVideos.map((video, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden border bg-card"
              >
                <div className="aspect-video bg-muted relative">
                  <Youtube className="absolute inset-0 m-auto h-8 w-8 text-muted-foreground" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium">{video.title}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setVideoUrl(video.url)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Watch
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Real-time Video Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="aspect-video rounded-lg border bg-muted relative">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                controls
                src={videoUrl}
              />
              {!videoUrl && (
                <Video className="absolute inset-0 m-auto h-12 w-12 text-muted-foreground" />
              )}
            </div>

            <div className="flex justify-between">
              <Button
                onClick={startAnalysis}
                disabled={isAnalyzing || !videoUrl}
              >
                {isAnalyzing ? (
                  <>
                    <Shield className="mr-2 h-4 w-4 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Analysis
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={generateReport}
                disabled={currentAnalysis.length === 0}
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>

            {currentAnalysis.length > 0 && (
              <div className="space-y-2">
                {currentAnalysis.map((analysis, index) => (
                  <div
                    key={index}
                    className="p-2 rounded-lg border bg-card flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="text-sm">
                        {new Date(analysis.timestamp).toLocaleTimeString()}
                      </div>
                      <Progress value={analysis.confidence} className="w-32" />
                    </div>
                    <div className="space-y-1 text-right">
                      {getStatusBadge(analysis.type)}
                      <div className="text-xs text-muted-foreground">
                        {analysis.confidence.toFixed(1)}% confidence
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prevention Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Safety Tips</AlertTitle>
            <AlertDescription>
              Watch these educational videos to learn about common fraud scenarios
              and how to protect yourself.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h4 className="font-medium">Before Fraud</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Learn to identify suspicious behavior</li>
              <li>• Keep software and devices updated</li>
              <li>• Use strong authentication methods</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">During Incident</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Stop all transactions immediately</li>
              <li>• Contact your bank</li>
              <li>• Document everything</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">After Fraud</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• File official complaints</li>
              <li>• Monitor accounts closely</li>
              <li>• Update security measures</li>
            </ul>
          </div>

          <Button className="w-full" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Complete Guide
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
