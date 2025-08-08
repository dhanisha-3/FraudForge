import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  Activity,
  Shield,
  Eye,
  Cpu,
  BarChart3,
  Play,
  Pause,
  RefreshCw,
  Settings,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// Import ALL AI and ML components
import MLModelShowcase from "@/components/MLModelShowcase";
import ContinuousLearningSystem from "@/components/ContinuousLearningSystem";
import AdvancedGNNFraudDetection from "@/components/AdvancedGNNFraudDetection";
import ThreatIntelligenceFusion from "@/components/ThreatIntelligenceFusion";
import AIExplanationEngine from "@/components/AIExplanationEngine";
import AlgorithmShowcase from "@/components/AlgorithmShowcase";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import TechStack from "@/components/TechStack";
import LiveDemo from "@/components/LiveDemo";
import FraudEducationCenter from "@/components/FraudEducationCenter";

interface AIModel {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  speed: number;
  status: 'active' | 'training' | 'inactive';
  threatsDetected: number;
  lastUpdated: string;
  description: string;
  version: string;
}

const AIModels = () => {
  const [models, setModels] = useState<AIModel[]>([
    {
      id: 'dl-fraud-v2',
      name: 'Deep Learning Fraud Detector',
      type: 'Neural Network',
      accuracy: 98.7,
      speed: 45,
      status: 'active',
      threatsDetected: 1247,
      lastUpdated: '2024-01-15T10:30:00Z',
      description: 'Advanced deep learning model for real-time fraud detection',
      version: 'v2.1.3'
    },
    {
      id: 'rf-classifier',
      name: 'Random Forest Classifier',
      type: 'Ensemble',
      accuracy: 96.2,
      speed: 78,
      status: 'active',
      threatsDetected: 892,
      lastUpdated: '2024-01-14T15:45:00Z',
      description: 'Ensemble model for pattern recognition and anomaly detection',
      version: 'v1.8.2'
    },
    {
      id: 'lstm-sequence',
      name: 'LSTM Sequence Analyzer',
      type: 'Recurrent Neural Network',
      accuracy: 97.8,
      speed: 52,
      status: 'training',
      threatsDetected: 734,
      lastUpdated: '2024-01-15T08:20:00Z',
      description: 'Sequential pattern analysis for transaction behavior',
      version: 'v3.0.1'
    },
    {
      id: 'svm-binary',
      name: 'SVM Binary Classifier',
      type: 'Support Vector Machine',
      accuracy: 94.5,
      speed: 89,
      status: 'active',
      threatsDetected: 456,
      lastUpdated: '2024-01-13T12:15:00Z',
      description: 'Binary classification for legitimate vs fraudulent transactions',
      version: 'v1.5.7'
    }
  ]);

  const [performanceData, setPerformanceData] = useState([
    { time: '00:00', accuracy: 98.2, speed: 45, threats: 12 },
    { time: '04:00', accuracy: 98.5, speed: 43, threats: 8 },
    { time: '08:00', accuracy: 98.7, speed: 45, threats: 23 },
    { time: '12:00', accuracy: 98.3, speed: 47, threats: 34 },
    { time: '16:00', accuracy: 98.9, speed: 44, threats: 28 },
    { time: '20:00', accuracy: 98.6, speed: 46, threats: 19 }
  ]);

  const [modelComparison, setModelComparison] = useState([
    { model: 'Deep Learning', accuracy: 98.7, precision: 97.2, recall: 98.9, f1Score: 98.0, speed: 45 },
    { model: 'Random Forest', accuracy: 96.2, precision: 95.8, recall: 96.6, f1Score: 96.2, speed: 78 },
    { model: 'LSTM', accuracy: 97.8, precision: 97.1, recall: 98.2, f1Score: 97.6, speed: 52 },
    { model: 'SVM', accuracy: 94.5, precision: 94.1, recall: 94.9, f1Score: 94.5, speed: 89 }
  ]);

  const getStatusBadge = (status: AIModel['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="text-green-600 bg-green-100">Active</Badge>;
      case 'training':
        return <Badge variant="default" className="text-blue-600 bg-blue-100">Training</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-gray-600">Inactive</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const toggleModelStatus = (modelId: string) => {
    setModels(prev => prev.map(model =>
      model.id === modelId
        ? { ...model, status: model.status === 'active' ? 'inactive' : 'active' }
        : model
    ));
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-4">
          AI Models Dashboard
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Advanced machine learning models for comprehensive fraud detection and prevention
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Deep Learning Models</h3>
            <p className="text-muted-foreground">Neural networks with 98.7% accuracy for fraud detection</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Continuous Learning</h3>
            <p className="text-muted-foreground">Self-improving AI systems that adapt to new threats</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Real-time Inference</h3>
            <p className="text-muted-foreground">Lightning-fast fraud detection in under 50ms</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIModels;
