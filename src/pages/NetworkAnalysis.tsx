import React from 'react';
import { FraudNetworkVisualization } from '@/components/FraudNetworkVisualization';

export default function NetworkAnalysis() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Fraud Network Analysis</h2>
        <p className="text-muted-foreground">
          Advanced visualization and analysis of fraud patterns and connections
        </p>
      </div>
      <FraudNetworkVisualization />
    </div>
  );
}
