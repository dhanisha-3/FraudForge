import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  AlertTriangle,
  Users,
  Globe,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

// Import ALL analytics components
import RealTimeAnalyticsDashboard from "@/components/RealTimeAnalyticsDashboard";
import AdvancedAnalyticsDashboard from "@/components/AdvancedAnalyticsDashboard";
import AdvancedInteractiveDashboard from "@/components/AdvancedInteractiveDashboard";
import InteractiveDashboard from "@/components/InteractiveDashboard";
import ExecutiveSummaryDashboard from "@/components/ExecutiveSummaryDashboard";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import FraudNetworkVisualization from "@/components/FraudNetworkVisualization";
import GeospatialFraudDetection from "@/components/GeospatialFraudDetection";
import DefenseMatrix from "@/components/DefenseMatrix";
// Removed non-existent component
import SafeZonePortal from "@/components/SafeZonePortal";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const fraudTrends = [
    { date: '2024-01-08', legitimate: 12450, fraudulent: 234, blocked: 189, amount: 2847392 },
    { date: '2024-01-09', legitimate: 13200, fraudulent: 198, blocked: 156, amount: 3124567 },
    { date: '2024-01-10', legitimate: 11800, fraudulent: 267, blocked: 223, amount: 2956781 },
    { date: '2024-01-11', legitimate: 14100, fraudulent: 189, blocked: 145, amount: 3456789 },
    { date: '2024-01-12', legitimate: 13600, fraudulent: 245, blocked: 201, amount: 3234567 },
    { date: '2024-01-13', legitimate: 12900, fraudulent: 212, blocked: 178, amount: 3089456 },
    { date: '2024-01-14', legitimate: 15200, fraudulent: 298, blocked: 267, amount: 3678901 }
  ];

  const threatTypes = [
    { name: 'Phishing', value: 35, color: '#ef4444', amount: 1250000 },
    { name: 'Identity Theft', value: 28, color: '#f97316', amount: 980000 },
    { name: 'Card Fraud', value: 22, color: '#eab308', amount: 750000 },
    { name: 'Account Takeover', value: 15, color: '#3b82f6', amount: 560000 }
  ];

  const geographicData = [
    { region: 'North America', threats: 45, blocked: 38, savings: 1250000 },
    { region: 'Europe', threats: 32, blocked: 28, savings: 890000 },
    { region: 'Asia Pacific', threats: 28, blocked: 24, savings: 720000 },
    { region: 'Latin America', threats: 18, blocked: 15, savings: 450000 },
    { region: 'Africa', threats: 12, blocked: 10, savings: 280000 }
  ];

  const hourlyActivity = [
    { hour: '00', transactions: 1200, fraud: 15, blocked: 12 },
    { hour: '04', transactions: 800, fraud: 8, blocked: 6 },
    { hour: '08', transactions: 3200, fraud: 28, blocked: 22 },
    { hour: '12', transactions: 4500, fraud: 42, blocked: 35 },
    { hour: '16', transactions: 5200, fraud: 38, blocked: 31 },
    { hour: '20', transactions: 3800, fraud: 25, blocked: 20 }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-4">
          Fraud Analytics
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Comprehensive fraud detection analytics and business intelligence insights
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
            <p className="text-muted-foreground">Live fraud detection metrics and performance monitoring</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Predictive Insights</h3>
            <p className="text-muted-foreground">Advanced forecasting and trend analysis for fraud prevention</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Business Intelligence</h3>
            <p className="text-muted-foreground">Executive dashboards with actionable fraud intelligence</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
