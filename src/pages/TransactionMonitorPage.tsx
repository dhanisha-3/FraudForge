import React from 'react';
import RealTimeTransactionMonitor from '@/components/RealTimeTransactionMonitor';
import NexusNavigation from '@/components/NexusNavigation';

const TransactionMonitorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NexusNavigation />
      <main>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Real-Time Transaction Monitoring</h1>
          <RealTimeTransactionMonitor />
        </div>
      </main>
    </div>
  );
};

export default TransactionMonitorPage;
