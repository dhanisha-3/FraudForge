import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Shield,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Activity,
  Users,
  DollarSign,
  Eye,
  Brain,
  Zap,
  Target,
  Clock,
  Globe
} from 'lucide-react';

// Import ALL original components
import NexusHero from "@/components/NexusHero";
import ExecutiveSummaryDashboard from "@/components/ExecutiveSummaryDashboard";
import RealTimeTransactionMonitor from "@/components/RealTimeTransactionMonitor";
import AdvancedInteractiveDashboard from "@/components/AdvancedInteractiveDashboard";
import RealTimeAnalyticsDashboard from "@/components/RealTimeAnalyticsDashboard";
import AdvancedAnalyticsDashboard from "@/components/AdvancedAnalyticsDashboard";
import MLModelShowcase from "@/components/MLModelShowcase";
import ContinuousLearningSystem from "@/components/ContinuousLearningSystem";
import MultiChannelSupport from "@/components/MultiChannelSupport";
import AdvancedUPIFraudDetection from "@/components/AdvancedUPIFraudDetection";
import AdvancedCreditCardDetection from "@/components/AdvancedCreditCardDetection";
import AdvancedPhishingDetection from "@/components/AdvancedPhishingDetection";
import GeospatialFraudDetection from "@/components/GeospatialFraudDetection";
import URLFraudDetection from "@/components/URLFraudDetection";
import AISpamDetection from "@/components/AISpamDetection";
import OTPFraudDetection from "@/components/OTPFraudDetection";
import TransactionFraudDetection from "@/components/TransactionFraudDetection";
import FraudEducationCenter from "@/components/FraudEducationCenter";
import AdvancedGNNFraudDetection from "@/components/AdvancedGNNFraudDetection";
import ThreatIntelligenceFusion from "@/components/ThreatIntelligenceFusion";
import AdvancedComputerVision from "@/components/AdvancedComputerVision";
import RealComputerVision from "@/components/RealComputerVision";
import DeepfakeDetectionLab from "@/components/DeepfakeDetectionLab";
import QRCodeSecurityAnalyzer from "@/components/QRCodeSecurityAnalyzer";
import DefenseMatrix from "@/components/DefenseMatrix";
import LiveDemo from "@/components/LiveDemo";
import UnifiedAccountProtection from "@/components/UnifiedAccountProtection";
import DigitalIDManagement from "@/components/DigitalIDManagement";
import TransactionMonitoring from "@/components/TransactionMonitoring";
import DecentralizedIdentityKYC from "@/components/DecentralizedIdentityKYC";
import BehavioralBiometrics from "@/components/BehavioralBiometrics";
import VoiceVerification from "@/components/VoiceVerification";
import FraudNetworkVisualization from "@/components/FraudNetworkVisualization";
import CreditCardScamDetection from "@/components/CreditCardScamDetection";
import UPIFraudDetection from "@/components/UPIFraudDetection";
import SafeZonePortal from "@/components/SafeZonePortal";
import AIExplanationEngine from "@/components/AIExplanationEngine";
import AlgorithmShowcase from "@/components/AlgorithmShowcase";
import InteractiveDashboard from "@/components/InteractiveDashboard";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import TechStack from "@/components/TechStack";
// Removed non-existent components

const Dashboard = () => {
  const [realTimeData, setRealTimeData] = useState({
    transactionsProcessed: 15847,
    threatsBlocked: 1247,
    accuracy: 98.7,
    systemUptime: 99.9,
    activeUsers: 2341,
    totalSavings: 2847392
  });

  const [fraudTrends, setFraudTrends] = useState([
    { time: '00:00', legitimate: 450, fraudulent: 12, blocked: 8 },
    { time: '04:00', legitimate: 320, fraudulent: 8, blocked: 6 },
    { time: '08:00', legitimate: 890, fraudulent: 23, blocked: 18 },
    { time: '12:00', legitimate: 1240, fraudulent: 34, blocked: 28 },
    { time: '16:00', legitimate: 1580, fraudulent: 45, blocked: 38 },
    { time: '20:00', legitimate: 1120, fraudulent: 28, blocked: 22 },
  ]);

  const threatTypes = [
    { name: 'Phishing', value: 35, color: '#ef4444' },
    { name: 'Identity Theft', value: 28, color: '#f97316' },
    { name: 'Card Fraud', value: 22, color: '#eab308' },
    { name: 'Account Takeover', value: 15, color: '#3b82f6' }
  ];

  const modelPerformance = [
    { model: 'Deep Learning', accuracy: 98.7, speed: 45, threats: 847 },
    { model: 'Random Forest', accuracy: 96.2, speed: 78, threats: 623 },
    { model: 'Neural Network', accuracy: 97.8, speed: 52, threats: 734 },
    { model: 'SVM', accuracy: 94.5, speed: 89, threats: 456 }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        transactionsProcessed: prev.transactionsProcessed + Math.floor(Math.random() * 10),
        threatsBlocked: prev.threatsBlocked + Math.floor(Math.random() * 3),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, change, icon: Icon, trend, color = "primary" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className={`h-4 w-4 text-${color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            {trend === 'up' ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
              {change}
            </span>
            <span>from last hour</span>
          </div>
        </CardContent>
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${color} to-${color}/50`} />
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <NexusHero />

      {/* Executive Summary */}
      <ExecutiveSummaryDashboard />

      {/* Real-time Monitoring */}
      <RealTimeTransactionMonitor />

      {/* Interactive Dashboards */}
      <AdvancedInteractiveDashboard />
      <InteractiveDashboard />

      {/* Analytics Dashboards */}
      <RealTimeAnalyticsDashboard />
      <AdvancedAnalyticsDashboard />

      {/* Performance Metrics */}
      <PerformanceMetrics />

      {/* AI & ML Models */}
      <MLModelShowcase />
      <ContinuousLearningSystem />
      <AdvancedGNNFraudDetection />
      <ThreatIntelligenceFusion />
      <AIExplanationEngine />
      <AlgorithmShowcase />

      {/* Multi-Channel Fraud Detection */}
      <MultiChannelSupport />
      <AdvancedUPIFraudDetection />
      <AdvancedCreditCardDetection />
      <AdvancedPhishingDetection />
      <URLFraudDetection />
      <AISpamDetection />
      <OTPFraudDetection />
      <TransactionFraudDetection />
      <CreditCardScamDetection />
      <UPIFraudDetection />

      {/* Computer Vision & Biometrics */}
      <AdvancedComputerVision />
      <RealComputerVision />
      <DeepfakeDetectionLab />
      <QRCodeSecurityAnalyzer />
      <BehavioralBiometrics />
      <VoiceVerification />
      <BiometricBehavioralAnalysis />

      {/* Geospatial & Location Intelligence */}
      <GeospatialFraudDetection />

      {/* Account Protection & Identity */}
      <UnifiedAccountProtection />
      <DigitalIDManagement />
      <DecentralizedIdentityKYC />

      {/* Transaction Monitoring */}
      <TransactionMonitoring />

      {/* Defense & Security */}
      <DefenseMatrix />
      {/* Removed non-existent component */}
      <FraudNetworkVisualization />

      {/* Education & Demo */}
      <FraudEducationCenter />
      <LiveDemo />
      <SafeZonePortal />

      {/* Technology Stack */}
      <TechStack />
    </div>
  );
};

export default Dashboard;
