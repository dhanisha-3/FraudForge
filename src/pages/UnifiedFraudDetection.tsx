import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaceDetection } from '@/components/FaceDetection';
import { UPIVerification } from '@/components/UPIVerification';
import { FraudHeatmap } from '@/components/FraudHeatmap';
import { VideoFraudDetection } from '@/components/VideoFraudDetection';
import { RealTimeMonitoring } from '@/components/RealTimeMonitoring';
import { BehavioralAnalysis } from '@/components/BehavioralAnalysis';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield,
  AlertTriangle,
  FileText,
  Download,
  PieChart,
} from 'lucide-react';

export default function UnifiedFraudDetection() {
  const [activeReport, setActiveReport] = React.useState<string | null>(null);

  const generateUnifiedReport = () => {
    // Implementation for comprehensive PDF report using jsPDF
    console.log('Generating unified PDF report...');
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Unified Fraud Detection</h1>
        <Button onClick={generateUnifiedReport}>
          <FileText className="mr-2 h-4 w-4" />
          Generate Unified Report
        </Button>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-4 flex items-center space-x-4">
          <Shield className="h-8 w-8 text-blue-500" />
          <div>
            <div className="text-2xl font-bold">98.5%</div>
            <div className="text-sm text-muted-foreground">Detection Accuracy</div>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center space-x-4">
          <AlertTriangle className="h-8 w-8 text-yellow-500" />
          <div>
            <div className="text-2xl font-bold">127</div>
            <div className="text-sm text-muted-foreground">Active Alerts</div>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center space-x-4">
          <PieChart className="h-8 w-8 text-green-500" />
          <div>
            <div className="text-2xl font-bold">94.2%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center space-x-4">
          <Download className="h-8 w-8 text-purple-500" />
          <div>
            <div className="text-2xl font-bold">1.2K</div>
            <div className="text-sm text-muted-foreground">Reports Generated</div>
          </div>
        </Card>
      </div>
      
      <Tabs defaultValue="face-detection" className="space-y-6">
        <TabsList className="grid w-full max-w-4xl grid-cols-6">
          <TabsTrigger value="face-detection">Face Detection</TabsTrigger>
          <TabsTrigger value="upi-verification">UPI Verification</TabsTrigger>
          <TabsTrigger value="fraud-heatmap">Fraud Heatmap</TabsTrigger>
          <TabsTrigger value="video-detection">Video Analysis</TabsTrigger>
          <TabsTrigger value="real-time">Real-time Monitor</TabsTrigger>
          <TabsTrigger value="behavioral">Behavioral Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="face-detection">
          <FaceDetection />
        </TabsContent>

        <TabsContent value="upi-verification">
          <UPIVerification />
        </TabsContent>

        <TabsContent value="fraud-heatmap">
          <FraudHeatmap />
        </TabsContent>

        <TabsContent value="video-detection">
          <VideoFraudDetection />
        </TabsContent>

        <TabsContent value="real-time">
          <RealTimeMonitoring />
        </TabsContent>

        <TabsContent value="behavioral">
          <BehavioralAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
}
