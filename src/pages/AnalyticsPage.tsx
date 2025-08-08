import React from 'react';
import NexusNavigation from '@/components/NexusNavigation';
import AdvancedAnalyticsDashboard from '@/components/AdvancedAnalyticsDashboard';
import RealTimeAnalyticsDashboard from '@/components/RealTimeAnalyticsDashboard';
import FraudNetworkVisualization from '@/components/FraudNetworkVisualization';
import PerformanceMetrics from '@/components/PerformanceMetrics';

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NexusNavigation />
      <main>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Analytics & Insights</h1>
          <div className="space-y-12">
            <RealTimeAnalyticsDashboard />
            <AdvancedAnalyticsDashboard />
            <FraudNetworkVisualization />
            <PerformanceMetrics />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
