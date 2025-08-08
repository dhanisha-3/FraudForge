import React from 'react';
import DigitalIDManagement from '@/components/DigitalIDManagement';
import NexusNavigation from '@/components/NexusNavigation';

const DigitalIDPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NexusNavigation />
      <main>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Digital Identity Management</h1>
          <DigitalIDManagement />
        </div>
      </main>
    </div>
  );
};

export default DigitalIDPage;
